import { Router } from 'express';
import userCardResponseController from '../controllers/userCardResponseController';

const userCardResponseRoutes = Router();

// Get all cards with response or null for this user and link
userCardResponseRoutes.get(
    '/all-cards/:userToken/:linkId',
    userCardResponseController.getAllCardsWithUserAndLinkResponses
);

// Get a specific response by userToken, linkId, and cardId
userCardResponseRoutes.get('/:userToken/:linkId/:cardId', userCardResponseController.getResponse);

// Create or update a response
userCardResponseRoutes.post('/', userCardResponseController.setResponse);

// Get all responses for a specific user
userCardResponseRoutes.get('/user/:user', userCardResponseController.getResponsesForUser);

// Get all responses for a specific link
userCardResponseRoutes.get('/link/:linkId', userCardResponseController.getResponsesForLink);

// (Optional) Delete a response by ID
userCardResponseRoutes.delete('/:id', userCardResponseController.deleteResponse);

export default userCardResponseRoutes;
