import asyncHandler from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as reportService from '../services/report.service.js';

export const monthly = asyncHandler(async (req, res) => {
  const month = req.query.month || req.body?.month;
  const year = req.query.year || req.body?.year;
  const data = await reportService.monthlyReport(req.user._id, { month, year });
  res.status(200).json(new ApiResponse(200, data, 'Monthly report calculated'));
});
