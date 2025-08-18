import { Router } from 'express';
import userController from '../controllers/userController';
import authenticateToken from '../middleware/authentication';
import { asyncHandler } from '../utils/asyncHandler';

const userRoutes = Router();

userRoutes.get('/:userToken', authenticateToken, asyncHandler(userController.getUserById));
userRoutes.get('/', asyncHandler(userController.getAllUsers));
userRoutes.put('/:userToken', authenticateToken, asyncHandler(userController.updateUser));
userRoutes.delete('/:id', authenticateToken, asyncHandler(userController.deleteUser));

export default userRoutes;