import type { Request } from 'express';
import { UAParser } from 'ua-parser-js';
import { StatusCodes } from 'http-status-codes';
import ActiveSessionModel from './session.model.js';
import { ApiError } from '../../shared/lib/ApiError.js';
import { sha256 } from '../../shared/lib/hash.js';
import type { UserDocument } from '../user/user.model.js';

interface ClientInfo {
  ip: string;
  browser: string;
  os: string;
  deviceType: string;
}

export function getClientInfo(req: Request): ClientInfo {
  const fwd = req.headers['x-forwarded-for'];
  const fwdFirst = Array.isArray(fwd) ? fwd[0] : fwd?.split(',').shift()?.trim();
  const ip = fwdFirst || req.ip || req.socket?.remoteAddress || 'Unknown';
  const ua = new UAParser(req.headers['user-agent']).getResult();
  return {
    ip,
    browser: ua.browser.name || 'Unknown',
    os: ua.os.name || 'Unknown',
    deviceType: ua.device.type || 'Desktop',
  };
}

export async function createSession(user: UserDocument, req: Request): Promise<string> {
  const token = await user.generateAccessToken();
  const info = getClientInfo(req);

  await ActiveSessionModel.create({
    user: user._id,
    tokenHash: sha256(token),
    ip: info.ip,
    userAgent: `${info.browser} on ${info.os} (${info.deviceType})`,
  });

  user.lastLogin = user.currentLogin || new Date();
  user.currentLogin = new Date();
  await user.save({ validateBeforeSave: false });

  return token;
}

const RECENT_SESSION_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

export async function listSessions(userId: string) {
  const since = new Date(Date.now() - RECENT_SESSION_WINDOW_MS);
  return ActiveSessionModel.find({ user: userId, lastUsedAt: { $gte: since } })
    .select('-tokenHash')
    .sort({ lastUsedAt: -1 })
    .lean();
}

export async function deleteSession(userId: string, sessionId: string): Promise<void> {
  const result = await ActiveSessionModel.deleteOne({ _id: sessionId, user: userId });
  if (result.deletedCount === 0) throw new ApiError(StatusCodes.NOT_FOUND, 'Session not found');
}

export async function deleteAllOtherSessions(userId: string, currentToken: string): Promise<void> {
  await ActiveSessionModel.deleteMany({
    user: userId,
    tokenHash: { $ne: sha256(currentToken) },
  });
}

export async function deleteByToken(userId: string, token: string): Promise<void> {
  await ActiveSessionModel.deleteOne({ user: userId, tokenHash: sha256(token) });
}
