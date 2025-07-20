import { Request, Response } from 'express';
import userCardResponseService from '../services/userCardResponseService';
import datasource from '../data-source';
import { User } from '../entity/user';
import { Card } from '../entity/card';
import { Link } from '../entity/link';

class UserCardResponseController {

    // Get all cards with the user's response (or null)
    async getAllCardsWithUserAndLinkResponses(req: Request, res: Response) {
        try {
            const userToken = req.params.userToken;
            const linkId = Number(req.params.linkId);

            const user = await datasource.getRepository(User).findOneBy({ userToken });
            const link = await datasource.getRepository(Link).findOneBy({ id: linkId });

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

    // Create or update a response
    async upsertResponse(req: Request, res: Response) {
        try {
            const { userToken, linkId, cardId, response } = req.body;

            if (!['yes', 'no'].includes(response)) {
                return res.status(400).json({ message: 'Invalid response value' });
            }

            const user = await datasource.getRepository(User).findOneBy({ userToken });
            const link = await datasource.getRepository(Link).findOneBy({ id: Number(linkId) });
            const card = await datasource.getRepository(Card).findOneBy({ id: Number(cardId) });

            if (!user || !link || !card) {
                return res.status(404).json({ message: 'User, Link, or Card not found' });
            }

            const saved = await userCardResponseService.upsertResponse(user, link, card, response);
            res.status(200).json(saved);
        } catch (error) {
            res.status(500).send('Server error');
        }
    }
}

export default new UserCardResponseController();
