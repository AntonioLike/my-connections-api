import { Request, Response } from 'express';
import connectionService from '../services/connectionService';
import { AuthenticatedRequest } from "../middleware/authentication"

class ConnectionController {

    // Request a connection with another user
    async requestConnection(req: Request, res: Response) {
        try {
            const userToken = req.params.userToken;
            const targetToken = req.params.targetToken;
            if (!userToken || !targetToken) {
                return res.status(400).json({ message: 'Both userToken and targetToken are required' });
            }

            const result = await connectionService.requestConnection(userToken, targetToken);
            res.json({ message: result });
        } catch (error) {
            console.error('Error requesting connection:', error);
            res.status(500).send('Server error');
        }
    }

    // Get all confirmed connections for the logged-in user
    async getUserConnections(req: AuthenticatedRequest, res: Response) {
        try {
            const userPayload = req.user;

            if (!userPayload || typeof userPayload !== "object" || !("userToken" in userPayload)) {
                return res.status(401).json({ message: "Invalid user session" });
            }

            const userToken = userPayload.userToken;

            const confirmedConnections = await connectionService.getConnectionsByUser(userToken);
            res.json({ connections: confirmedConnections });
        } catch (error) {
            console.error("Error fetching confirmed connections:", error);
            res.status(500).send("Server error");
        }
    }

    async deleteLink(req: Request, res: Response) {
        try {
            const { userToken, targetToken } = req.params;

            if (!userToken || !targetToken) {
                return res.status(400).json({ message: 'Both userToken and targetToken are required' });
            }

            const message = await connectionService.deleteLink(userToken, targetToken);
            res.json({ message });
        } catch (error) {
            console.error('Error deleting connection:', error);
            res.status(500).json({ error: error });
        }
    }
}

export default new ConnectionController();
