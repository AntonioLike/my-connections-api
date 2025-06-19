import { AppDataSource } from '../data-source';
import { Repository } from 'typeorm';
import { UserCardResponse } from '../entity/userCardResponse';
import { User } from '../entity/user';
import { Card } from '../entity/card';
import { Link } from '../entity/link';

class UserCardResponseService {
    private responseRepository: Repository<UserCardResponse>;

    constructor() {
        this.responseRepository = AppDataSource.getRepository(UserCardResponse);
    }

    async getAllCardsWithUserAndLinkResponses(user: User, link: Link): Promise<
        {
            card: Card
            response: 'yes' | 'no' | null
        }[]
    > {
        const cardRepo = AppDataSource.getRepository(Card);

        const cardsWithResponses = await cardRepo
            .createQueryBuilder("card")
            .leftJoinAndSelect(
                UserCardResponse,
                "response",
                "response.card_id = card.id AND response.user_token = :userToken AND response.link_id = :linkId",
                { userToken: user.userToken, linkId: link.id }
            )
            .select([
                "card.id AS id",
                "card.title AS title",
                "card.imagePath AS imagePath",
                "response.response AS response",
            ])
            .getRawMany();

        return cardsWithResponses.map((row) => ({
            card: {
                id: row.id,
                title: row.title,
                imagePath: row.imagePath,
            },
            response: row.response ?? null,
        }));
    }


    // Get a specific user's response to all links and cards
    async getResponseForUser(user: User): Promise<UserCardResponse | null> {
        return await this.responseRepository.findOne({
            where: {
                user,
            },
            relations: ['link', 'card'],
        });
    }

    // Get all responses
    async getAllResponses(): Promise<UserCardResponse[]> {
        return await this.responseRepository.find({
            relations: ['user', 'link', 'card'],
        });
    }

    // Get a specific user's response to a card in a link
    async getResponse(user: User, link: Link, card: Card): Promise<UserCardResponse | null> {
        return await this.responseRepository.findOne({
            where: {
                user,
                link,
                card,
            },
            relations: ['user', 'link', 'card'],
        });
    }

    // Create or update a user's response
    async upsertResponse(user: User, link: Link, card: Card, response: 'yes' | 'no'): Promise<UserCardResponse> {
        let existing = await this.getResponse(user, link, card);
        if (existing) {
            existing.response = response;
            return await this.responseRepository.save(existing);
        }

        const newResponse = this.responseRepository.create({ user, link, card, response });
        return await this.responseRepository.save(newResponse);
    }

    // Get all responses for a link
    async getResponsesForLink(link: Link): Promise<UserCardResponse[]> {
        return await this.responseRepository.find({
            where: { link },
            relations: ['user', 'card'],
        });
    }

    // Delete a response
    async deleteResponse(id: number): Promise<boolean> {
        const result = await this.responseRepository.delete(id);
        return result.affected !== 0;
    }
}

export default new UserCardResponseService();
