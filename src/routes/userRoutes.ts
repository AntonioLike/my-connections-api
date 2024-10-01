import { Router } from 'express';
import userController from '../controllers/userController';

const userRoutes = Router();

// Register a new user
userRoutes.post('/register', userController.register);

// Get a user by ID
userRoutes.get('/:id', userController.getUserById);

// Get all users
userRoutes.get('/list', userController.getAllUsers);

// Update a user by ID
userRoutes.put('/:id', userController.updateUser);

// Delete a user by ID
userRoutes.delete('/user/:id', userController.deleteUser);

export default userRoutes;
