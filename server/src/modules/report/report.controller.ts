import { StatusCodes } from 'http-status-codes';
import asyncHandler from '../../shared/lib/asyncHandler.js';
import { ApiResponse } from '../../shared/lib/ApiResponse.js';
import * as reportService from './report.service.js';

export const monthly = asyncHandler(async (req, res) => {
  const month = (req.query.month || req.body?.month) as string;
  const year = (req.query.year || req.body?.year) as string;
  const data = await reportService.monthlyReport(req.userId as string, { month, year });
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, data, 'Monthly report calculated'));
});
