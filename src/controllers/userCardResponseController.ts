import { Request, Response } from 'express';
import userCardResponseService from '../services/userCardResponseService';
import { AppDataSource } from '../data-source';
import { User } from '../entity/user';
import { Card } from '../entity/card';
import { Link } from '../entity/link';

class UserCardResponseController {

    // Get all cards with the user's response (or null)
    async getAllCardsWithUserAndLinkResponses(req: Request, res: Response) {
        try {
            const userToken = req.params.userToken;
            const linkId = Number(req.params.linkId);

            const user = await AppDataSource.getRepository(User).findOneBy({ userToken });
            const link = await AppDataSource.getRepository(Link).findOneBy({ id: linkId });

            if (!user || !link) {
                return res.status(404).json({ message: 'User or link not found' });
            }

            const result = await userCardResponseService.getAllCardsWithUserAndLinkResponses(user, link);
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).send('Server error');
        }
    }


    // Get a specific response (by userToken, linkId, and cardId)
    async getResponse(req: Request, res: Response) {
        try {
            const { userToken, linkId, cardId } = req.params;

            const user = await AppDataSource.getRepository(User).findOneBy({ userToken });
            const link = await AppDataSource.getRepository(Link).findOneBy({ id: Number(linkId) });
            const card = await AppDataSource.getRepository(Card).findOneBy({ id: Number(cardId) });

            if (!user || !link || !card) {
                return res.status(404).json({ message: 'User, Link, or Card not found' });
            }

            const responseEntry = await userCardResponseService.getResponse(user, link, card);
            if (!responseEntry) {
                return res.status(404).json({ message: 'Response not found' });
            }

            res.json(responseEntry);
        } catch (error) {
            res.status(500).send('Server error');
        }
    }

    // Create or update a response
    async setResponse(req: Request, res: Response) {
        try {
            const { userToken, linkId, cardId } = req.body;
            const { response } = req.body; // "yes" or "no"

            if (!['yes', 'no'].includes(response)) {
                return res.status(400).json({ message: 'Invalid response value' });
            }

            const user = await AppDataSource.getRepository(User).findOneBy({ userToken });
            const link = await AppDataSource.getRepository(Link).findOneBy({ id: Number(linkId) });
            const card = await AppDataSource.getRepository(Card).findOneBy({ id: Number(cardId) });

            if (!user || !link || !card) {
                return res.status(404).json({ message: 'User, Link, or Card not found' });
            }

            const saved = await userCardResponseService.upsertResponse(user, link, card, response);
            res.status(200).json(saved);
        } catch (error) {
            res.status(500).send('Server error');
        }
    }

    // Get all responses for a link
    async getResponsesForUser(req: Request, res: Response) {
        try {
            const userId = Number(req.params.user);
            const user = await AppDataSource.getRepository(User).findOneBy({ id: userId });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const responses = await userCardResponseService.getResponseForUser(user);
            res.json(responses);
        } catch (error) {
            res.status(500).send('Server error');
        }
    }

    // Get all responses for a link
    async getResponsesForLink(req: Request, res: Response) {
        try {
            const linkId = Number(req.params.linkId);
            const link = await AppDataSource.getRepository(Link).findOneBy({ id: linkId });

            if (!link) {
                return res.status(404).json({ message: 'Link not found' });
            }

            const responses = await userCardResponseService.getResponsesForLink(link);
            res.json(responses);
        } catch (error) {
            res.status(500).send('Server error');
        }
    }

    // (Optional) Delete a response by its ID
    async deleteResponse(req: Request, res: Response) {
        try {
            const success = await userCardResponseService.deleteResponse(Number(req.params.id));
            if (!success) {
                return res.status(404).json({ message: 'Response not found' });
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).send('Server error');
        }
    }
}

export default new UserCardResponseController();
