import { AppDataSource } from '../data-source';
import { User } from "../entity/user";
import { Repository } from 'typeorm';

class UserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  // Create a new user
  async createUser(userData: Partial<User>): Promise<User> {
    const newUser = this.userRepository.create(userData);
    return await this.userRepository.save(newUser);
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
