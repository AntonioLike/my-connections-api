import { Request, Response } from 'express';
import linkService from '../services/linkService';

class LinkController {

    // Get the logged-in user's userToken
    async getUserToken(req: Request, res: Response) {
        try {
            const userId = req.body.id; // Extract from authenticated user
            const userToken = await linkService.getUserToken(userId);
            if (!userToken) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json({ userToken });
        } catch (error) {
            console.error('Error fetching user token:', error);
            res.status(500).send('Server error');
        }
    }

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

    // Confirm a link (both users must enter each other's codes)
    async confirmLink(req: Request, res: Response) {
        try {
            const { userToken, targetToken } = req.body;
            if (!userToken || !targetToken) {
                return res.status(400).json({ message: 'Both userToken and targetToken are required' });
            }

            const result = await linkService.confirmLink(userToken, targetToken);
            res.json({ message: result });
        } catch (error) {
            console.error('Error confirming link:', error);
            res.status(500).send('Server error');
        }
    }

    // Get link status (pending/confirmed)
    async getLinkStatus(req: Request, res: Response) {
        try {
            const { userToken } = req.query;
            if (!userToken) {
                return res.status(400).json({ message: 'userToken is required' });
            }

            const links = await linkService.getLinkStatus(userToken as string);
            res.json({ links });
        } catch (error) {
            console.error('Error fetching link status:', error);
            res.status(500).send('Server error');
        }
    }
}

export default new LinkController();
