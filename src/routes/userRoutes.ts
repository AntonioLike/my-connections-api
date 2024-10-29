import { Router } from 'express';
import userController from '../controllers/userController';

const userRoutes = Router();

// Register a new user
userRoutes.post('/', userController.register);

// Login route
userRoutes.post('/login', userController.login);

userRoutes.post('/reset', userController.reset);

// Get a user by ID
userRoutes.get('/:id', userController.getUserById);

// Get all users
userRoutes.get('/', userController.getAllUsers);

// Update a user by ID
userRoutes.put('/:id', userController.updateUser);

// Delete a user by ID
userRoutes.delete('/:id', userController.deleteUser);

export default userRoutes;
