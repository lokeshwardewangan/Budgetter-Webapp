import { StatusCodes } from 'http-status-codes';
import asyncHandler from '../../shared/lib/asyncHandler.js';
import { ApiResponse } from '../../shared/lib/ApiResponse.js';
import * as sessionService from './session.service.js';

export const list = asyncHandler(async (req, res) => {
  const sessions = await sessionService.listSessions(req.userId as string);
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, sessions, 'Active sessions retrieved'));
});

export const remove = asyncHandler(async (req, res) => {
  await sessionService.deleteSession(req.userId as string, req.params.sessionId as string);
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, null, 'Session deleted successfully'));
});

export const removeOthers = asyncHandler(async (req, res) => {
  await sessionService.deleteAllOtherSessions(req.userId as string, req.token as string);
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, null, 'All other sessions deleted'));
});
