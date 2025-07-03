import { AppDataSource } from '../data-source';
import { Repository } from 'typeorm';
import { UserCardResponse } from '../entity/userCardResponse';
import { User } from '../entity/user';
import { Card } from '../entity/card';
import { Link } from '../entity/link';
import { toUserCardResponseDTO } from '../mapper/userCardResponse.mapper';
import { UserCardResponseDTO } from '../dto/userCardResponse.dto';

class UserCardResponseService {
    private responseRepository: Repository<UserCardResponse>;

    constructor() {
        this.responseRepository = AppDataSource.getRepository(UserCardResponse);
    }

    async getAllCardsWithUserAndLinkResponses(
        user: User,
        link: Link
    ): Promise<UserCardResponseDTO[]> {
        const cardRepo = AppDataSource.getRepository(Card);
        const cards = await cardRepo.find();

        const responses = await this.responseRepository.find({
            where: {
                user: { userToken: user.userToken },
                link: { id: link.id },
            },
            relations: ['card'],
        });

        const responseMap = new Map<number, UserCardResponse>();
        for (const res of responses) {
            responseMap.set(res.card.id, res);
        }

        return cards.map((card) => {
            const existing = responseMap.get(card.id);
            if (existing) {
                return toUserCardResponseDTO(existing);
            } else {
                return {
                    userId: user.id,
                    linkId: link.id,
                    cardId: card.id,
                    response: null,
                };
            }
        });
    }

    async getResponse(
        user: User,
        link: Link,
        card: Card
    ): Promise<UserCardResponse | null> {
        return await this.responseRepository.findOne({
            where: { user, link, card },
            relations: ['user', 'link', 'card'],
        });
    }

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
