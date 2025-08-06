import { Repository } from 'typeorm';
import dataSource from '../data-source';
import { Connection } from '../entity/connection';
import { User } from '../entity/user';
import UserService from './userService';

class ConnectionService {
    private connectionRepository: Repository<Connection>;

    constructor() {
        this.connectionRepository = dataSource.getRepository(Connection);
    }

    /**
     * Always returns users ordered by userToken to enforce consistent connection creation.
     */
    private getCanonicalUsers(userA: User, userB: User): [User, User] {
        return userA.userToken < userB.userToken ? [userA, userB] : [userB, userA];
    }

    async requestConnection(userToken: string, targetToken: string): Promise<string> {
        if (userToken === targetToken) {
            throw new Error("You cannot connect with yourself.");
        }

        const userA = await UserService.getUserByUserToken(userToken);
        const userB = await UserService.getUserByUserToken(targetToken);

        if (!userA || !userB) {
            throw new Error("One or both users not found.");
        }

        const [user1, user2] = this.getCanonicalUsers(userA, userB);

        let connection = await this.connectionRepository.findOne({
            where: { user1: { userToken: user1.userToken }, user2: { userToken: user2.userToken } },
            relations: ["user1", "user2"]
        });

        if (connection) {
            if (connection.status === "pending") {
                if (userToken === connection.user1.userToken) {
                    return "Waiting for the other user to request the connection.";
                }
                connection.status = "connected";
                await this.connectionRepository.save(connection);
                return "Link confirmed.";
            }
            return "Link already exists.";
        }

        // Create a new connection request initiated by userToken
        connection = this.connectionRepository.create({
            user1,
            user2,
            status: "pending",
        });

        await this.connectionRepository.save(connection);
        return "Link request created.";
    }

    async getConnectionsByUser(userToken: string): Promise<Connection[]> {
        return await this.connectionRepository.find({
            where: [
                { user1: { userToken }, status: "connected" },
                { user2: { userToken }, status: "connected" }
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

        const connection = await this.connectionRepository.findOne({
            where: { user1: { userToken: user1.userToken }, user2: { userToken: user2.userToken } }
        });

        if (!connection) {
            throw new Error("No connection found between these users.");
        }

        await this.connectionRepository.remove(connection);
        return "Link deleted successfully.";
    }
}

export default new ConnectionService();
