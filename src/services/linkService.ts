import { Repository } from 'typeorm';
import dataSource from '../data-source';
import { Link } from '../entity/link';
import { User } from '../entity/user';
import UserService from './userService';

class LinkService {
    private linkRepository: Repository<Link>;

    constructor() {
        this.linkRepository = dataSource.getRepository(Link);
    }

    /**
     * Always returns users ordered by userToken to enforce consistent link creation.
     */
    private getCanonicalUsers(userA: User, userB: User): [User, User] {
        return userA.userToken < userB.userToken ? [userA, userB] : [userB, userA];
    }

    async requestLink(userToken: string, targetToken: string): Promise<string> {
        if (userToken === targetToken) {
            throw new Error("You cannot link with yourself.");
        }

        const userA = await UserService.getUserByUserToken(userToken);
        const userB = await UserService.getUserByUserToken(targetToken);

        if (!userA || !userB) {
            throw new Error("One or both users not found.");
        }

        const [user1, user2] = this.getCanonicalUsers(userA, userB);

        let link = await this.linkRepository.findOne({
            where: { user1: { userToken: user1.userToken }, user2: { userToken: user2.userToken } },
            relations: ["user1", "user2"]
        });

        if (link) {
            if (link.status === "pending") {
                if (userToken === link.user1.userToken) {
                    return "Waiting for the other user to request the link.";
                }
                link.status = "linked";
                await this.linkRepository.save(link);
                return "Link confirmed.";
            }
            return "Link already exists.";
        }

        // Create a new link request initiated by userToken
        link = this.linkRepository.create({
            user1,
            user2,
            status: "pending",
        });

        await this.linkRepository.save(link);
        return "Link request created.";
    }

    async getLinksByUser(userToken: string): Promise<Link[]> {
        return await this.linkRepository.find({
            where: [
                { user1: { userToken }, status: "linked" },
                { user2: { userToken }, status: "linked" }
            ],
            relations: ["user1", "user2"]
        });
    }

    async deleteLink(userToken: string, targetToken: string): Promise<string> {
        const userA = await UserService.getUserByUserToken(userToken);
        const userB = await UserService.getUserByUserToken(targetToken);

        if (!userA || !userB) {
            throw new Error("One or both users not found.");
        }

        const [user1, user2] = this.getCanonicalUsers(userA, userB);

        const link = await this.linkRepository.findOne({
            where: { user1: { userToken: user1.userToken }, user2: { userToken: user2.userToken } }
        });

        if (!link) {
            throw new Error("No link found between these users.");
        }

        await this.linkRepository.remove(link);
        return "Link deleted successfully.";
    }
}

export default new LinkService();
