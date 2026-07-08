import { StatusCodes } from 'http-status-codes';
import asyncHandler from '../../shared/lib/asyncHandler.js';
import { ApiResponse } from '../../shared/lib/ApiResponse.js';
import * as contactService from './contact.service.js';

export const create = asyncHandler(async (req, res) => {
  await contactService.createContact(req.body);
  res
    .status(StatusCodes.CREATED)
    .json(new ApiResponse(StatusCodes.CREATED, null, 'Message sent successfully'));
});
