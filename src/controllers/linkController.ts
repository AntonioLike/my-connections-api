import { Request, Response } from 'express';
import linkService from '../services/linkService';

class LinkController {

    // Request a link with another user
    async requestLink(req: Request, res: Response) {
        try {
            const { userToken, targetToken } = req.body;
            if (!userToken || !targetToken) {
                return res.status(400).json({ message: 'Both userToken and targetToken are required' });
            }

            const result = await linkService.requestLink(userToken, targetToken);
            res.json({ message: result });
        } catch (error) {
            console.error('Error requesting link:', error);
            res.status(500).send('Server error');
        }
    }

    // Get all confirmed links for the logged-in user
    async getLinksByUserId(req: Request, res: Response) {
        try {
            const userToken = req.params.id; // Extract userToken from authenticated request
            if (!userToken) {
                return res.status(400).json({ message: 'User token is required' });
            }

            const confirmedLinks = await linkService.getLinksByUser(userToken);
            res.json({ links: confirmedLinks });
        } catch (error) {
            console.error('Error fetching confirmed links:', error);
            res.status(500).send('Server error');
        }
    }

    async deleteLink(req: Request, res: Response) {
        try {
            const { userToken, targetToken } = req.params;

            if (!userToken || !targetToken) {
                return res.status(400).json({ message: 'Both userToken and targetToken are required' });
            }

            const message = await linkService.deleteLink(userToken, targetToken);
            res.json({ message });
        } catch (error) {
            console.error('Error deleting link:', error);
            res.status(500).json({ error: error });
        }
    }
}

export default new LinkController();
