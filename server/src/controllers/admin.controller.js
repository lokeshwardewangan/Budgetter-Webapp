import asyncHandler from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as adminService from '../services/admin.service.js';

export const listUsers = asyncHandler(async (req, res) => {
  const users = await adminService.listAllUsers();
  res.status(200).json(new ApiResponse(200, users, 'All users retrieved'));
});

export const newsletter = asyncHandler(async (req, res) => {
  const data = await adminService.sendNewsletter(req.body);
  res.status(200).json(new ApiResponse(200, data, 'Newsletter sent successfully'));
});
