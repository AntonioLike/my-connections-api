import { Request, Response } from 'express';
import userCardResponseService from '../services/userCardResponseService';
import datasource from '../data-source';
import { User } from '../entity/user';
import { Card } from '../entity/card';
import { Connection } from '../entity/connection';

class UserCardResponseController {

    // Get all cards with the user's response (or null)
    async getAllCardsWithUserAndLinkResponses(req: Request, res: Response) {
        try {
            const userToken = req.params.userToken;
            const connectionId = Number(req.params.connectionId);

            const user = await datasource.getRepository(User).findOneBy({ userToken });
            const connection = await datasource.getRepository(Connection).findOneBy({ id: connectionId });

            if (!user || !connection) {
                return res.status(404).json({ message: 'User or connection not found' });
            }

            const result = await userCardResponseService.getAllCardsWithUserAndLinkResponses(user, connection);
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).send('Server error');
        }
    }

    // Create or update a response
    async upsertResponse(req: Request, res: Response) {
        try {
            const { userToken, connectionId, cardId, response } = req.body;

            if (!['yes', 'no'].includes(response)) {
                return res.status(400).json({ message: 'Invalid response value' });
            }

            const user = await datasource.getRepository(User).findOneBy({ userToken });
            const connection = await datasource.getRepository(Connection).findOneBy({ id: Number(connectionId) });
            const card = await datasource.getRepository(Card).findOneBy({ id: Number(cardId) });

            if (!user || !connection || !card) {
                return res.status(404).json({ message: 'User, Link, or Card not found' });
            }

            const saved = await userCardResponseService.upsertResponse(user, connection, card, response);
            res.status(200).json(saved);
        } catch (error) {
            res.status(500).send('Server error');
        }
    }
}

export default new UserCardResponseController();
