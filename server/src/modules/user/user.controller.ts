import { StatusCodes } from 'http-status-codes';
import asyncHandler from '../../shared/lib/asyncHandler.js';
import { ApiResponse } from '../../shared/lib/ApiResponse.js';
import * as userService from './user.service.js';

export const getMe = asyncHandler(async (req, res) => {
  const data = await userService.getMe(req.userId as string, req.token as string);
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, data, 'User data retrieved'));
});

export const updateMe = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.userId as string, req.body);
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, user, 'Profile updated successfully'));
});

export const updateAvatar = asyncHandler(async (req, res) => {
  const updated = await userService.updateAvatar(req.userId as string, req.file?.buffer);
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, updated, 'Avatar updated successfully'));
});

export const deleteMe = asyncHandler(async (req, res) => {
  await userService.deleteAccount(req.userId as string, req.body?.password);
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, null, 'Account deleted successfully'));
});
