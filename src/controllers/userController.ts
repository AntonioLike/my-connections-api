import { Request, Response } from 'express';
import userService from '../services/userService';

class UserController {
  async getUserById(req: Request, res: Response) {
    try {
      const user = await userService.getUserByUserToken(req.params.userToken);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (error) {
      res.status(500).send('Server error');
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).send('Server error');
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const updatedUser = await userService.updateUser(req.params.userToken, req.body);
      if (!updatedUser) return res.status(404).json({ message: 'User not found' });
      res.json(updatedUser);
    } catch (error) {
      res.status(500).send('Server error');
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const success = await userService.deleteUser(Number(req.params.id));
      if (!success) return res.status(404).json({ message: 'User not found' });
      res.status(204).send();
    } catch (error) {
      res.status(500).send('Server error');
    }
  }
}

export default new UserController();