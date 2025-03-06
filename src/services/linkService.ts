import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Link } from '../entity/link';
import { User } from '../entity/user';
import UserService from './userService';
import userService from './userService';

class LinkService {
    private linkRepository: Repository<Link>;
    constructor() {
        this.linkRepository = AppDataSource.getRepository(Link);
    }

    // Get the logged-in user's userToken
    async getUserToken(userId: number): Promise<string | null> {
        const user = await userService.getUserById(userId);
        return user ? user.userToken : null;
    }

    // Request a link by userToken
    async requestLink(userToken: string, targetToken: string): Promise<string> {
        if (userToken === targetToken) {
            throw new Error("You cannot link with yourself.");
        }

        const user1 = await this.userService.getUserById(userId);
        const user2 = await this.userRepository.findOneBy({ userToken: targetToken });

        if (!user1 || !user2) {
            throw new Error("One or both users not found.");
        }

        // Check if link already exists
        const existingLink = await this.linkRepository.findOne({
            where: [
                { user1, user2 },
                { user1: user2, user2: user1 }
            ]
        });

        if (existingLink) {
            return "Link already exists.";
        }

        const newLink = this.linkRepository.create({
            user1,
            user2,
            status: 'pending',
        });

        await this.linkRepository.save(newLink);
        return "Link request sent.";
    }

    // Confirm mutual linking
    async confirmLink(userToken: string, targetToken: string): Promise<string> {
        const link = await this.linkRepository.findOne({
            where: [
                { user1: { userToken }, user2: { userToken: targetToken }, status: 'pending' },
                { user1: { userToken: targetToken }, user2: { userToken }, status: 'pending' }
            ]
        });

        if (!link) {
            throw new Error("No pending link request found.");
        }

        link.status = 'linked';
        await this.linkRepository.save(link);
        return "Users successfully linked.";
    }

    // Check pending/confirmed links for a user
    async getLinkStatus(userToken: string): Promise<Link[]> {
        return await this.linkRepository.find({
            where: [
                { user1: { userToken } },
                { user2: { userToken } }
            ],
            relations: ["user1", "user2"]
        });
    }
}

export default new LinkService();
