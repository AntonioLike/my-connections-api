import { Router } from 'express';
import userCardResponseController from '../controllers/userCardResponseController';

const userCardResponseRoutes = Router();

// Get all cards with response or null for this user and link
userCardResponseRoutes.get(
    '/:userToken/:linkId',
    userCardResponseController.getAllCardsWithUserAndLinkResponses
);

// Create or update a response
userCardResponseRoutes.post('/', userCardResponseController.upsertResponse);

export default userCardResponseRoutes;
