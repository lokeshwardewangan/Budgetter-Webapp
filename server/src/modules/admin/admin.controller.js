import { StatusCodes } from 'http-status-codes';
import asyncHandler from '../../shared/lib/asyncHandler.js';
import { ApiResponse } from '../../shared/lib/ApiResponse.js';
import * as adminService from './admin.service.js';

export const listUsers = asyncHandler(async (req, res) => {
  const users = await adminService.listAllUsers();
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, users, 'All users retrieved'));
});

export const newsletter = asyncHandler(async (req, res) => {
  const data = await adminService.sendNewsletter(req.body);
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, data, 'Newsletter sent successfully'));
});
