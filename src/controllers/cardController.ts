import { Request, Response } from 'express';
import cardService from '../services/cardService';

class CardController {
    // Get a card by ID
    async getCardById(req: Request, res: Response) {
        try {
            const card = await cardService.getCardById(Number(req.params.id));
            if (!card) {
                return res.status(404).json({ message: 'Card not found' });
            }
            res.json(card);
        } catch (error: any) {
            console.error('Error getting card by Id:', error);
            const status = error.status || 500;
            res.status(status).json({ message: error.message || 'Server error' });
        }
    }

    // Get all cards
    async getAllCards(_req: Request, res: Response) {
        try {
            const cards = await cardService.getAllCards();
            res.json(cards);
        } catch (error: any) {
            console.error('Error getting all cards:', error);
            const status = error.status || 500;
            res.status(status).json({ message: error.message || 'Server error' });
        }
    }

    // (Optional) Create a card — only if needed for admin/dev
    async createCard(req: Request, res: Response) {
        try {
            const newCard = await cardService.createCard(req.body);
            res.status(201).json(newCard);
        } catch (error: any) {
            console.error('Error creating a card:', error);
            const status = error.status || 500;
            res.status(status).json({ message: error.message || 'Server error' });
        }
    }

    // (Optional) Update a card — only if needed for admin/dev
    async updateCard(req: Request, res: Response) {
        try {
            const updatedCard = await cardService.updateCard(Number(req.params.id), req.body);
            if (!updatedCard) {
                return res.status(404).json({ message: 'Card not found' });
            }
            res.json(updatedCard);
        } catch (error: any) {
            console.error('Error updating a card:', error);
            const status = error.status || 500;
            res.status(status).json({ message: error.message || 'Server error' });
        }
    }

    // (Optional) Delete a card — only if needed for admin/dev
    async deleteCard(req: Request, res: Response) {
        try {
            const success = await cardService.deleteCard(Number(req.params.id));
            if (!success) {
                return res.status(404).json({ message: 'Card not found' });
            }
            res.status(204).send(); // No content
        } catch (error: any) {
            console.error('Error deleting a card:', error);
            const status = error.status || 500;
            res.status(status).json({ message: error.message || 'Server error' });
        }
    }
}

export default new CardController();
