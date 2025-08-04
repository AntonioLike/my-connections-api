import { Router } from 'express';
import cardController from '../controllers/cardController';
import authenticateToken from '../middleware/authentication';

const cardRoutes = Router();

cardRoutes.get('/', authenticateToken, cardController.getAllCards);
cardRoutes.get('/:id', authenticateToken, cardController.getCardById);

// Optional admin/dev routes:
cardRoutes.post('/', authenticateToken, cardController.createCard);
cardRoutes.put('/:id', authenticateToken, cardController.updateCard);
cardRoutes.delete('/:id', authenticateToken, cardController.deleteCard);

export default cardRoutes;
