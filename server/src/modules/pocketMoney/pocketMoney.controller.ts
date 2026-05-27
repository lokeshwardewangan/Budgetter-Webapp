import { StatusCodes } from 'http-status-codes';
import asyncHandler from '../../shared/lib/asyncHandler.js';
import { ApiResponse } from '../../shared/lib/ApiResponse.js';
import * as pocketMoneyService from './pocketMoney.service.js';

export const create = asyncHandler(async (req, res) => {
  const data = await pocketMoneyService.addEntry(req.userId as string, req.body);
  res
    .status(StatusCodes.CREATED)
    .json(new ApiResponse(StatusCodes.CREATED, data, 'Pocket money added successfully'));
});

export const list = asyncHandler(async (req, res) => {
  const entries = await pocketMoneyService.listEntries(req.userId as string);
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, entries, 'Pocket money history retrieved'));
});
