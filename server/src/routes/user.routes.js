import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import verifyJwtToken from '../middleware/auth.middleware.js';
import { upload } from '../middleware/multer.middleware.js';

const router = Router();

router.use(verifyJwtToken);

router.get('/me', userController.getMe);
router.patch('/me', userController.updateMe);
router.patch('/me/avatar', upload.single('avatar'), userController.updateAvatar);
router.delete('/me', userController.deleteMe);

export default router;
