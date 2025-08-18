import { Router } from 'express';
import cardController from '../controllers/cardController';
import authenticateToken from '../middleware/authentication';
import { asyncHandler } from '../utils/asyncHandler';

const cardRoutes = Router();

cardRoutes.get('/', authenticateToken, asyncHandler(cardController.getAllCards));
cardRoutes.get('/:id', authenticateToken, asyncHandler(cardController.getCardById));

// Optional admin/dev routes:
cardRoutes.post('/', authenticateToken, cardController.createCard);
cardRoutes.put('/:id', authenticateToken, cardController.updateCard);
cardRoutes.delete('/:id', authenticateToken, cardController.deleteCard);

export default cardRoutes;
