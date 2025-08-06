import { Router } from 'express';
import userCardResponseController from '../controllers/userCardResponseController';
import authenticateToken from '../middleware/authentication';

const userCardResponseRoutes = Router();

// Get all cards with response or null for this user and connection
userCardResponseRoutes.get(
    '/:userToken/:connectionId', authenticateToken,
    userCardResponseController.getAllCardsWithUserAndLinkResponses
);

// Create or update a response
userCardResponseRoutes.post('/', authenticateToken, userCardResponseController.upsertResponse);

export default userCardResponseRoutes;
