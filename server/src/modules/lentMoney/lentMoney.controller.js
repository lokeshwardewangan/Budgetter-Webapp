import { StatusCodes } from 'http-status-codes';
import asyncHandler from '../../shared/lib/asyncHandler.js';
import { ApiResponse } from '../../shared/lib/ApiResponse.js';
import * as lentMoneyService from './lentMoney.service.js';

export const create = asyncHandler(async (req, res) => {
  const data = await lentMoneyService.addEntry(req.userId, req.body);
  res
    .status(StatusCodes.CREATED)
    .json(new ApiResponse(StatusCodes.CREATED, data, 'Lent money recorded successfully'));
});

export const list = asyncHandler(async (req, res) => {
  const entries = await lentMoneyService.listEntries(req.userId);
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, entries, 'Lent money history retrieved'));
});

export const receive = asyncHandler(async (req, res) => {
  const data = await lentMoneyService.markReceived(req.userId, req.params.id);
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, data, 'Lent money marked as received'));
});
