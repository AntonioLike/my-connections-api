import { Router } from 'express';
import userController from '../controllers/userController';
import authenticateToken from '../middleware/authentication';

const userRoutes = Router();

userRoutes.get('/:userToken', authenticateToken, userController.getUserById);
userRoutes.get('/', userController.getAllUsers);
userRoutes.put('/:userToken', authenticateToken, userController.updateUser);
userRoutes.delete('/:id', authenticateToken, userController.deleteUser);

export default userRoutes;