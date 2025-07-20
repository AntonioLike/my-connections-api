import dataSource from '../data-source';
import { User } from "../entity/user";
import { Repository } from 'typeorm';
import crypto from 'crypto';

class UserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = dataSource.getRepository(User);
  }

  private async generateUniqueUserToken(): Promise<string> {
    const timePart = Date.now().toString(36).toUpperCase(); // base36 timestamp
    const randomPart = crypto.randomBytes(2).toString('hex').toUpperCase().substring(0, 2);
    const token = `${randomPart}${timePart}`;
    return token;
  }

  async createUser(userData: Partial<User>): Promise<User> {

    const userToken = await this.generateUniqueUserToken();

    userData.userToken = userToken;

    let newUser = this.userRepository.create(userData);

    newUser = await this.userRepository.save(newUser);

    return newUser;
  }

  // Get a user by ID
  async getUserByUserToken(token: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ userToken: token });
    return user || null;
  }

  // Get a user by email
  async getUserByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ email });
    return user || null;
  }

  // Validate user credentials (for login)
  async validateUserPassword(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (user && user.password === password) {  // For production, use a password hashing mechanism
      return user;
    }
    return null;
  }

  resetUserPassword(email: any) {
    //send email
  }

  // Get all users
  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.find();
  }

  // Update a user by Token
  async updateUser(userToken: string, updatedData: Partial<User>): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ userToken });
    if (!user) {
      return null;
    }
    Object.assign(user, updatedData);
    return await this.userRepository.save(user);
  }

  // Delete a user by ID
  async deleteUser(id: number): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    return result.affected !== 0;
  }
}

export default new UserService();
