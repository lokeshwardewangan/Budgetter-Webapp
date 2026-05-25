import { StatusCodes } from 'http-status-codes';
import asyncHandler from '../../shared/lib/asyncHandler.js';
import { ApiResponse } from '../../shared/lib/ApiResponse.js';
import * as authService from './auth.service.js';
import * as sessionService from '../session/session.service.js';
import * as userService from '../user/user.service.js';

export const register = asyncHandler(async (req, res) => {
  const { user, token } = await authService.registerLocal(req.body, req);
  res
    .status(StatusCodes.CREATED)
    .json(new ApiResponse(StatusCodes.CREATED, { user, token }, 'User registered successfully'));
});

export const login = asyncHandler(async (req, res) => {
  const { user, token } = await authService.loginLocal(req.body, req);
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, { user, token }, 'Login successful'));
});

export const googleLogin = asyncHandler(async (req, res) => {
  const { user, token, isNewUser } = await authService.loginWithGoogle(req.body?.token, req);
  res
    .status(isNewUser ? StatusCodes.CREATED : StatusCodes.OK)
    .json(
      new ApiResponse(
        isNewUser ? StatusCodes.CREATED : StatusCodes.OK,
        { user, token, isNewUser },
        'Login successful',
      ),
    );
});

export const logout = asyncHandler(async (req, res) => {
  await sessionService.deleteByToken(req.userId as string, req.token as string);
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, null, 'Successfully logged out'));
});

export const checkVerified = asyncHandler(async (req, res) => {
  const verified = await userService.isVerified(req.userId as string);
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, verified, 'Verified status retrieved'));
});

export const verifyAccount = asyncHandler(async (req, res) => {
  const { alreadyVerified } = await authService.verifyAccountToken(req.query.token as string);
  const frontendURL = process.env.FRONTEND_URL;
  res.redirect(
    `${frontendURL}/${alreadyVerified ? 'account-already-verified' : 'account-verified'}`,
  );
});

export const requestPasswordReset = asyncHandler(async (req, res) => {
  await authService.requestPasswordReset(req.body?.email);
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, null, 'Reset link sent successfully'));
});

export const validatePasswordResetToken = asyncHandler(async (req, res) => {
  const userId = await authService.validatePasswordResetToken(req.query.token as string);
  res.redirect(`${process.env.FRONTEND_URL}/reset-password/${userId}`);
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { userId, newPassword } = req.body;
  await authService.resetPassword(userId, newPassword);
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, null, 'Password updated successfully'));
});
