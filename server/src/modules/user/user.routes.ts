import { Router } from 'express';
import * as userController from './user.controller.js';
import verifyJwtToken from '../../shared/middleware/auth.middleware.js';
import { upload } from '../../shared/middleware/multer.middleware.js';
import { validate } from '../../shared/middleware/validate.middleware.js';
import { updateProfileSchema, deleteAccountSchema } from './user.validator.js';

const router = Router();

router.use(verifyJwtToken);

router.get('/me', userController.getMe);
router.patch('/me', validate(updateProfileSchema), userController.updateMe);
router.patch('/me/avatar', upload.single('avatar'), userController.updateAvatar);
router.delete('/me', validate(deleteAccountSchema), userController.deleteMe);

export default router;
