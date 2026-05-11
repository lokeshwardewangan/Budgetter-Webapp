import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import verifyJwtToken from '../middleware/auth.middleware.js';

const router = Router();

// Public
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/google', authController.googleLogin);
router.get('/account-verification', authController.verifyAccount); // ?token=
router.post('/password-reset/request', authController.requestPasswordReset);
router.get('/password-reset/validate', authController.validatePasswordResetToken); // ?token=
router.post('/password-reset', authController.resetPassword);

// Protected
router.post('/logout', verifyJwtToken, authController.logout);
router.get('/me/verified', verifyJwtToken, authController.checkVerified);

export default router;
