import { Request, Response } from 'express';
import userService from '../services/userService';

class UserController {
  async getUserById(req: Request, res: Response) {
    try {
      const user = await userService.getUserByUserToken(req.params.userToken);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (error: any) {
      console.error(`Error getting user by id ${req.params.userToken}:`, error);
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Server error' });
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error: any) {
      console.error('Error getting all users:', error);
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Server error' });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const updatedUser = await userService.updateUser(req.params.userToken, req.body);
      if (!updatedUser) return res.status(404).json({ message: 'User not found' });
      res.json(updatedUser);
    } catch (error: any) {
      console.error(`Error updating user ${req.params.userToken}:`, error);
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Server error' });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const success = await userService.deleteUser(Number(req.params.id));
      if (!success) return res.status(404).json({ message: 'User not found' });
      res.status(204).send();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Server error' });
    }
  }
}

export default new UserController();