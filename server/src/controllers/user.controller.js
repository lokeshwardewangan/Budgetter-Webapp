import asyncHandler from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as userService from '../services/user.service.js';

export const getMe = asyncHandler(async (req, res) => {
  const data = await userService.getMe(req.user._id, req.token);
  res.status(200).json(new ApiResponse(200, data, 'User data retrieved'));
});

export const updateMe = asyncHandler(async (req, res) => {
  const user = await userService.updateProfile(req.user._id, req.body);
  res.status(200).json(new ApiResponse(200, user, 'Profile updated successfully'));
});

export const updateAvatar = asyncHandler(async (req, res) => {
  const updated = await userService.updateAvatar(req.user._id, req.file?.path);
  res.status(200).json(new ApiResponse(200, updated, 'Avatar updated successfully'));
});

export const deleteMe = asyncHandler(async (req, res) => {
  await userService.deleteAccount(req.user._id, req.body?.password);
  res.status(200).json(new ApiResponse(200, null, 'Account deleted successfully'));
});
