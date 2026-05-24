import asyncHandler from '../../shared/lib/asyncHandler.js';
import { ApiResponse } from '../../shared/lib/ApiResponse.js';
import * as userService from './user.service.js';

export const getMe = asyncHandler(async (req, res) => {
  const data = await userService.getMe(req.userId, req.token);
  res.status(200).json(new ApiResponse(200, data, 'User data retrieved'));
});

export const updateMe = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.userId, req.body);
  res.status(200).json(new ApiResponse(200, user, 'Profile updated successfully'));
});

export const updateAvatar = asyncHandler(async (req, res) => {
  const updated = await userService.updateAvatar(req.userId, req.file?.path);
  res.status(200).json(new ApiResponse(200, updated, 'Avatar updated successfully'));
});

export const deleteMe = asyncHandler(async (req, res) => {
  await userService.deleteAccount(req.userId, req.body?.password);
  res.status(200).json(new ApiResponse(200, null, 'Account deleted successfully'));
});
