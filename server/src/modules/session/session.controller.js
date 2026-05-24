import asyncHandler from '../../shared/lib/asyncHandler.js';
import { ApiResponse } from '../../shared/lib/ApiResponse.js';
import * as sessionService from './session.service.js';

export const list = asyncHandler(async (req, res) => {
  const sessions = await sessionService.listSessions(req.user._id);
  res.status(200).json(new ApiResponse(200, sessions, 'Active sessions retrieved'));
});

export const remove = asyncHandler(async (req, res) => {
  await sessionService.deleteSession(req.user._id, req.params.sessionId);
  res.status(200).json(new ApiResponse(200, null, 'Session deleted successfully'));
});

export const removeOthers = asyncHandler(async (req, res) => {
  await sessionService.deleteAllOtherSessions(req.user._id, req.token);
  res.status(200).json(new ApiResponse(200, null, 'All other sessions deleted'));
});
