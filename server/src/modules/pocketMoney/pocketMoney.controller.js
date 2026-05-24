import asyncHandler from '../../shared/lib/asyncHandler.js';
import { ApiResponse } from '../../shared/lib/ApiResponse.js';
import * as pocketMoneyService from './pocketMoney.service.js';

export const create = asyncHandler(async (req, res) => {
  const data = await pocketMoneyService.addEntry(req.userId, req.body);
  res.status(201).json(new ApiResponse(201, data, 'Pocket money added successfully'));
});

export const list = asyncHandler(async (req, res) => {
  const entries = await pocketMoneyService.listEntries(req.userId);
  res.status(200).json(new ApiResponse(200, entries, 'Pocket money history retrieved'));
});
