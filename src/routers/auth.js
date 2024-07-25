import { Router } from 'express';
import { forgotPassword, resetPassword, loginUser } from '../controllers/authController.js';

const router = Router();

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/login', loginUser);

export default router;