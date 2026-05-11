import asyncHandler from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as pocketMoneyService from '../services/pocketMoney.service.js';

export const create = asyncHandler(async (req, res) => {
  const data = await pocketMoneyService.addEntry(req.user._id, req.body);
  res.status(201).json(new ApiResponse(201, data, 'Pocket money added successfully'));
});

export const list = asyncHandler(async (req, res) => {
  const entries = await pocketMoneyService.listEntries(req.user._id);
  res.status(200).json(new ApiResponse(200, entries, 'Pocket money history retrieved'));
});
