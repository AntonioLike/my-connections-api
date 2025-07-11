import dataSource from '../data-source';
import { Card } from '../entity/card';
import { Repository } from 'typeorm';

class CardService {
    private cardRepository: Repository<Card>;

    constructor() {
        this.cardRepository = dataSource.getRepository(Card);
    }

    // Get a card by ID
    async getCardById(id: number): Promise<Card | null> {
        const card = await this.cardRepository.findOneBy({ id });
        return card || null;
    }

    // Get all cards
    async getAllCards(): Promise<Card[]> {
        return await this.cardRepository.find();
    }

    // Create a new card
    async createCard(cardData: Partial<Card>): Promise<Card> {
        const newCard = this.cardRepository.create(cardData);
        return await this.cardRepository.save(newCard);
    }

    // Update a card by ID
    async updateCard(id: number, updatedData: Partial<Card>): Promise<Card | null> {
        const card = await this.cardRepository.findOneBy({ id });
        if (!card) {
            return null;
        }
        Object.assign(card, updatedData);
        return await this.cardRepository.save(card);
    }

    // Delete a card by ID
    async deleteCard(id: number): Promise<boolean> {
        const result = await this.cardRepository.delete(id);
        return result.affected !== 0;
    }
}

export default new CardService();
