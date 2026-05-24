import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import verifyJwtToken from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { authLimiter } from '../middleware/rateLimit.middleware.js';
import {
  registerSchema,
  loginSchema,
  googleLoginSchema,
  tokenQuerySchema,
  passwordResetRequestSchema,
  passwordResetSchema,
} from '../validators/auth.validator.js';

const router = Router();

// authLimiter throttles failures only — fat-fingered logins are fine.
router.post('/register', authLimiter, validate(registerSchema), authController.register);
router.post('/login', authLimiter, validate(loginSchema), authController.login);
router.post('/google', authLimiter, validate(googleLoginSchema), authController.googleLogin);
router.get(
  '/account-verification',
  validate(tokenQuerySchema, 'query'),
  authController.verifyAccount,
);
router.post(
  '/password-reset/request',
  authLimiter,
  validate(passwordResetRequestSchema),
  authController.requestPasswordReset,
);
router.get(
  '/password-reset/validate',
  validate(tokenQuerySchema, 'query'),
  authController.validatePasswordResetToken,
);
router.post(
  '/password-reset',
  authLimiter,
  validate(passwordResetSchema),
  authController.resetPassword,
);

// Protected
router.post('/logout', verifyJwtToken, authController.logout);
router.get('/me/verified', verifyJwtToken, authController.checkVerified);

export default router;
