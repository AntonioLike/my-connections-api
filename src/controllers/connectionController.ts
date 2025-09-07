import { Request, Response } from 'express';
import connectionService from '../services/connectionService';
import { toUserConnectionDTOs } from '../mapper/connection.mapper';

class ConnectionController {

    // Request a connection with another user
    async requestConnection(req: Request, res: Response) {
        try {
            const userToken = req.user?.userToken;
            const targetToken = req.query.targetToken as string;
            if (!userToken || !targetToken) {
                return res.status(400).json({ message: 'Both userToken and targetToken are required' });
            }
            const result = await connectionService.requestConnection(userToken, targetToken);
            res.status(result.status || 200);
            res.json(result);
        } catch (error: any) {
            console.error('Error requesting connection:', error);
            const status = error.status || 500;
            res.status(status).json({ message: error.message || 'Server error' });
        }
    }

    // Get all confirmed connections for the logged-in user
    async getUserConnections(req: Request, res: Response) {
        try {
            const userPayload = req.user;

            if (!userPayload || typeof userPayload !== "object" || !("userToken" in userPayload)) {
                return res.status(401).json({ message: "Invalid user session" });
            }

            const userToken = userPayload.userToken;

            const confirmedConnections = await connectionService.getConnectionsByUser(userToken);

            const confirmedConnectionsDTOs = toUserConnectionDTOs(confirmedConnections, userPayload);
            res.json(confirmedConnectionsDTOs);
        } catch (error: any) {
            console.error("Error fetching confirmed connections:", error);
            const status = error.status || 500;
            res.status(status).json({ message: error.message || "Server error" });
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
        } catch (error: any) {
            console.error('Error deleting connection:', error);
            const status = error.status || 500;
            res.status(status).json({ message: error.message || 'Server error' });
        }
    }
}

export default new ConnectionController();