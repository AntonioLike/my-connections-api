import dataSource from '../data-source';
import { User } from '../entity/user';
import { Repository } from 'typeorm';
import crypto from 'crypto';

class AuthService {
  private userRepository: Repository<User> = dataSource.getRepository(User);

  private async generateUserToken(): Promise<string> {
    const time = Date.now().toString(36).toUpperCase();
    const random = crypto.randomBytes(2).toString("hex").toUpperCase().slice(0, 2);
    return `${random}${time}`;
  }

  async register({ name, email, password }: Partial<User>): Promise<User> {
    const userToken = await this.generateUserToken();
    const user = this.userRepository.create({ name, email, password, userToken });
    return this.userRepository.save(user);
  }

  async login(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ email });
    return user?.password === password ? user : null;
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      // TODO: Send reset email
      console.log(`Reset link would be sent to ${email}`);
    }
  }
}

export default new AuthService();