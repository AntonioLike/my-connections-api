import dataSource from '../data-source';
import { User } from '../entity/user';
import { Repository } from 'typeorm';

class UserService {
  private userRepository: Repository<User> = dataSource.getRepository(User);

  async getUserByUserToken(token: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ userToken: token });
    return user || null;
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async updateUser(userToken: string, updatedData: Partial<User>): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ userToken });
    if (!user) return null;
    Object.assign(user, updatedData);
    return await this.userRepository.save(user);
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return result.affected !== 0;
  }
}

export default new UserService();