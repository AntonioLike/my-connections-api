import { Repository } from 'typeorm';
import { AppDataSource } from '../data-source';
import { Link } from '../entity/link';
import { User } from '../entity/user';
import UserService from './userService';

class LinkService {
    private linkRepository: Repository<Link>;
    constructor() {
        this.linkRepository = AppDataSource.getRepository(Link);
    }

    // Get the logged-in user's userToken
    async getUserToken(userId: number): Promise<string | null> {
        const user = await UserService.getUserById(userId);
        return user ? user.userToken : null;
    }

    async requestLink(userToken: string, targetToken: string): Promise<string> {
        if (userToken === targetToken) {
            throw new Error("You cannot link with yourself.");
        }

        const user1 = await UserService.getUserByUserToken(userToken);
        const user2 = await UserService.getUserByUserToken(targetToken);

        if (!user1 || !user2) {
            throw new Error("One or both users not found.");
        }

        // Fetch existing link while also joining `user1` and `user2`
        const existingLink = await this.linkRepository.findOne({
            where: [
                { user1: { userToken }, user2: { userToken: targetToken } },
                { user1: { userToken: targetToken }, user2: { userToken } }
            ],
            relations: ["user1", "user2"] // Ensure user data is loaded
        });

        if (existingLink) {
            if (existingLink.status === "pending") {
                // Ensure a **different user** initiated the second request before confirming
                if (existingLink.user1.userToken === userToken) {
                    return "Waiting for the other user to request the link.";
                }

                // Now, since the request is made by the second user, confirm the link
                existingLink.status = "linked";
                await this.linkRepository.save(existingLink);
                return "Link confirmed.";
            }
            return "Link already exists.";
        }

        // Create a new link request initiated by userToken
        const newLink = this.linkRepository.create({
            user1,
            user2,
            status: "pending",
        });

        await this.linkRepository.save(newLink);
        return "Link request created.";
    }

    // Get all confirmed links for a user
    async getLinksByUser(userToken: string): Promise<Link[]> {
        return await this.linkRepository.find({
            where: [
                { user1: { userToken }, status: "linked" },
                { user2: { userToken }, status: "linked" }
            ],
            relations: ["user1", "user2"] // Fetch related user info
        });
    }

    async deleteLink(userToken: string, targetToken: string): Promise<string> {
        const link = await this.linkRepository.findOne({
            where: [
                { user1: { userToken }, user2: { userToken: targetToken } },
                { user1: { userToken: targetToken }, user2: { userToken } }
            ]
        });

        if (!link) {
            throw new Error("No link found between these users.");
        }

        await this.linkRepository.remove(link);
        return "Link deleted successfully.";
    }

}

export default new LinkService();
