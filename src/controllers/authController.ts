import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import authService from '../services/authService';

const SECRET_KEY = process.env.SECRET_KEY || 'default-secret';

class AuthController {
  async register(req: Request, res: Response) {
    try {
      const user = await authService.register(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).send('error');
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await authService.login(email, password);

      if (!user) return res.status(401).json({ message: 'Invalid credentials' });

      const token = jwt.sign(
        { userToken: user.userToken, email: user.email },
        SECRET_KEY,
        { expiresIn: '1h' }
      );

      res.status(200).json({ user: { id: user.userToken, email: user.email }, token });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      await authService.forgotPassword(req.body.email);
      res.status(200).json({ message: 'Password reset email sent if account exists' });
    } catch {
      res.status(500).send('Server error');
    }
  }
}

export default new AuthController();
