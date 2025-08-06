import dataSource from '../data-source';
import { Repository } from 'typeorm';
import { UserCardResponse } from '../entity/userCardResponse';
import { User } from '../entity/user';
import { Card } from '../entity/card';
import { Connection } from '../entity/connection';
import { toUserCardResponseDTO } from '../mapper/userCardResponse.mapper';
import { UserCardResponseDTO } from '../dto/userCardResponse.dto';

class UserCardResponseService {
    private responseRepository: Repository<UserCardResponse>;
    private cardRepository: Repository<Card>;

    constructor() {
        this.responseRepository = dataSource.getRepository(UserCardResponse);
        this.cardRepository = dataSource.getRepository(Card);
    }

    /**
     * Get all cards with responses for a given user and connection.
     */
    async getAllCardsWithUserAndLinkResponses(
        user: User,
        connection: Connection
    ): Promise<UserCardResponseDTO[]> {
        const cards = await this.cardRepository.find();

        const responses = await this.responseRepository.find({
            where: {
                user: { userToken: user.userToken },
                connection: { id: connection.id },
            },
            relations: ['card', 'user', 'connection'],
        });

        const responseMap = new Map<number, UserCardResponse>();
        responses.forEach(res => responseMap.set(res.card.id, res));

        return cards.map(card => {
            const existing = responseMap.get(card.id);
            if (existing) {
                return toUserCardResponseDTO(existing);
            } else {
                return {
                    userToken: user.userToken,
                    connectionId: connection.id,
                    cardId: card.id,
                    response: null,
                };
            }
        });
    }

    /**
     * Get a single response for a specific user, connection, and card.
     */
    async getResponse(
        user: User,
        connection: Connection,
        card: Card
    ): Promise<UserCardResponse | null> {
        return await this.responseRepository.findOne({
            where: {
                user: { userToken: user.userToken },
                connection: { id: connection.id },
                card: { id: card.id },
            },
            relations: ['user', 'connection', 'card'],
        });
    }

    /**
     * Create or update a response.
     */
    async upsertResponse(
        user: User,
        connection: Connection,
        card: Card,
        response: 'yes' | 'no'
    ): Promise<UserCardResponse> {
        let existing = await this.getResponse(user, connection, card);
        if (existing) {
            existing.response = response;
            return await this.responseRepository.save(existing);
        }

        const newResponse = this.responseRepository.create({ user, connection, card, response });
        return await this.responseRepository.save(newResponse);
    }
}

export default new UserCardResponseService();
