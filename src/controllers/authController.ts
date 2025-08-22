import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import authService from '../services/authService';

const SECRET_KEY = process.env.SECRET_KEY || 'default-secret';

class AuthController {
  async register(req: Request, res: Response) {
    try {
      const user = await authService.register(req.body);
      res.status(201).json(user);
    } catch (error: any) {
      console.error('Error registering:', error);
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Server error' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await authService.login(email, password);

      if (!user) return res.status(401).json({ message: 'Invalid credentials' });

      const token = jwt.sign(
        { email: user.email },
        SECRET_KEY,
        {
          subject: user.userToken,
          issuer: "myconnections-api",
          audience: "myconnections-app",
          expiresIn: '1h'
        }
      );

      res.status(200).json({ user: { name: user.name, email: user.email, userToken: user.userToken }, token });
    } catch (error: any) {
      console.error('Error logging in:', error);
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Server error' });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      await authService.forgotPassword(req.body.email);
      res.status(200).json({ message: 'Password reset email sent if account exists' });
    } catch (error: any) {
      console.error('Error resetting password:', error);
      const status = error.status || 500;
      res.status(status).json({ message: error.message || 'Server error' });
    }
  }
}

export default new AuthController();
