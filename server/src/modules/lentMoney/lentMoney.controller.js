import asyncHandler from '../../shared/lib/asyncHandler.js';
import { ApiResponse } from '../../shared/lib/ApiResponse.js';
import * as lentMoneyService from './lentMoney.service.js';

export const create = asyncHandler(async (req, res) => {
  const data = await lentMoneyService.addEntry(req.userId, req.body);
  res.status(201).json(new ApiResponse(201, data, 'Lent money recorded successfully'));
});

export const list = asyncHandler(async (req, res) => {
  const entries = await lentMoneyService.listEntries(req.userId);
  res.status(200).json(new ApiResponse(200, entries, 'Lent money history retrieved'));
});

export const receive = asyncHandler(async (req, res) => {
  const data = await lentMoneyService.markReceived(req.userId, req.params.id);
  res.status(200).json(new ApiResponse(200, data, 'Lent money marked as received'));
});
