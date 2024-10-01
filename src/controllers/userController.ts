import { Request, Response } from 'express';
import userService from '../services/userService';

class UserController {

  // Register a new user
  async register(req: Request, res: Response) {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).send('Server error');
    }
  }

  // Get a user by ID
  async getUserById(req: Request, res: Response) {
    try {
      const user = await userService.getUserById(Number(req.params.id));
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).send('Server error');
    }
  }

  // Get all users
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).send('Server error');
    }
  }

  // Update a user by ID
  async updateUser(req: Request, res: Response) {
    try {
      const updatedUser = await userService.updateUser(Number(req.params.id), req.body);
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(updatedUser);
    } catch (error) {
      res.status(500).send('Server error');
    }
  }

  // Delete a user by ID
  async deleteUser(req: Request, res: Response) {
    try {
      const success = await userService.deleteUser(Number(req.params.id));
      if (!success) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(204).send(); // No content
    } catch (error) {
      res.status(500).send('Server error');
    }
  }
}

export default new UserController();
