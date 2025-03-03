import { AppDataSource } from '../data-source';
import { User } from "../entity/user";
import { Repository } from 'typeorm';
import crypto from 'crypto';

class UserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  private async generateUniqueUserToken(userId: number): Promise<string> {
    const sequentialPart = userId.toString(36).padStart(5, '0').toUpperCase();
    const randomPart = crypto.randomBytes(2).toString('hex').toUpperCase().substring(0, 2);
    const token = `${randomPart}${sequentialPart}`;
    return token;
  }

  async createUser(userData: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(userData);
    const tempToken = 'ZZZZZZZZZZ';
    newUser.userToken = tempToken;
    let savedUser = await this.userRepository.save(newUser);

    savedUser.userToken = await this.generateUniqueUserToken(savedUser.id);

    savedUser = await this.userRepository.save(savedUser);
    return savedUser;
  }

  // Get a user by ID
  async getUserById(id: number): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id });
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

  // Update a user by ID
  async updateUser(id: number, updatedData: Partial<User>): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id });
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
