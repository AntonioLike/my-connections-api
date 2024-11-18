import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import userService from '../services/userService';

class UserController {

  SECRET_KEY = process.env.SECRET_KEY || 'default-secret-key';

  // Register a new user
  async register(req: Request, res: Response) {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).send('Server error');
    }
  }

  // Login a user
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await userService.validateUserPassword(email, password);

      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        this.SECRET_KEY,
        { expiresIn: '1h' } // Token expiration time
      );

      res.json({
        message: 'Login successful',
        user: { id: user.id, email: user.email },
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).send('Server error');
    }
  }

  async reset(req: Request, res: Response) {
    try {
      const { email } = req.body;
      await userService.resetUserPassword(email);

      // In a real app, you would generate a token (e.g., JWT) here
      res.json({ message: 'Reset successful, check your email' });
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
