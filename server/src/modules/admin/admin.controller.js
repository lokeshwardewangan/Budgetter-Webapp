import asyncHandler from '../../shared/lib/asyncHandler.js';
import { ApiResponse } from '../../shared/lib/ApiResponse.js';
import * as adminService from './admin.service.js';

export const listUsers = asyncHandler(async (req, res) => {
  const users = await adminService.listAllUsers();
  res.status(200).json(new ApiResponse(200, users, 'All users retrieved'));
});

export const newsletter = asyncHandler(async (req, res) => {
  const data = await adminService.sendNewsletter(req.body);
  res.status(200).json(new ApiResponse(200, data, 'Newsletter sent successfully'));
});
