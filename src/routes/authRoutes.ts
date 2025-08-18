import { Router } from 'express';
import authController from '../controllers/authController';
import { asyncHandler } from '../utils/asyncHandler';

const authRoutes = Router();

authRoutes.post('/register', asyncHandler(authController.register));
authRoutes.post('/login', asyncHandler(authController.login));
authRoutes.post('/forgot', asyncHandler(authController.forgotPassword));

export default authRoutes;

