import dataSource from '../data-source';
import { Repository } from 'typeorm';
import { UserCardResponse } from '../entity/userCardResponse';
import { User } from '../entity/user';
import { Card } from '../entity/card';
import { Link } from '../entity/link';
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
     * Get all cards with responses for a given user and link.
     */
    async getAllCardsWithUserAndLinkResponses(
        user: User,
        link: Link
    ): Promise<UserCardResponseDTO[]> {
        const cards = await this.cardRepository.find();

        const responses = await this.responseRepository.find({
            where: {
                user: { userToken: user.userToken },
                link: { id: link.id },
            },
            relations: ['card'],
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
                    linkId: link.id,
                    cardId: card.id,
                    response: null,
                };
            }
        });
    }

    /**
     * Get a single response for a specific user, link, and card.
     */
    async getResponse(
        user: User,
        link: Link,
        card: Card
    ): Promise<UserCardResponse | null> {
        return await this.responseRepository.findOne({
            where: {
                user: { userToken: user.userToken },
                link: { id: link.id },
                card: { id: card.id },
            },
            relations: ['user', 'link', 'card'],
        });
    }

    /**
     * Create or update a response.
     */
    async upsertResponse(
        user: User,
        link: Link,
        card: Card,
        response: 'yes' | 'no'
    ): Promise<UserCardResponse> {
        let existing = await this.getResponse(user, link, card);
        if (existing) {
            existing.response = response;
            return await this.responseRepository.save(existing);
        }

        const newResponse = this.responseRepository.create({ user, link, card, response });
        return await this.responseRepository.save(newResponse);
    }
}

export default new UserCardResponseService();
