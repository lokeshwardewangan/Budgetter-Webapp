import { UAParser } from 'ua-parser-js';
import ActiveSessionModel from '../models/activeSession.model.js';
import UserModel from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';

export function getClientInfo(req) {
  const ip =
    req.headers['x-forwarded-for']?.split(',').shift().trim() ||
    req.ip ||
    req.socket?.remoteAddress ||
    'Unknown';
  const ua = new UAParser(req.headers['user-agent']).getResult();
  return {
    ip,
    browser: ua.browser.name || 'Unknown',
    os: ua.os.name || 'Unknown',
    deviceType: ua.device.type || 'Desktop',
  };
}

export async function createSession(user, req) {
  const token = await user.generateAccessToken();
  const info = getClientInfo(req);

  await ActiveSessionModel.create({
    user: user._id,
    token,
    ip: info.ip,
    userAgent: `${info.browser} on ${info.os} (${info.deviceType})`,
  });

  user.lastLogin = user.currentLogin || new Date();
  user.currentLogin = new Date();
  await user.save({ validateBeforeSave: false });

  return token;
}

export async function listSessions(userId) {
  return ActiveSessionModel.find({ user: userId }).select('-token').sort({ lastUsedAt: -1 }).lean();
}

export async function deleteSession(userId, sessionId) {
  const result = await ActiveSessionModel.deleteOne({ _id: sessionId, user: userId });
  if (result.deletedCount === 0) throw new ApiError(404, 'Session not found');
}

export async function deleteAllOtherSessions(userId, currentToken) {
  await ActiveSessionModel.deleteMany({ user: userId, token: { $ne: currentToken } });
}

export async function deleteByToken(userId, token) {
  await ActiveSessionModel.deleteOne({ user: userId, token });
}
