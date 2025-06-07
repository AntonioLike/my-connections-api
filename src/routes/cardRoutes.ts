import { Router } from 'express';
import cardController from '../controllers/cardController';

const cardRoutes = Router();

cardRoutes.get('/', cardController.getAllCards);
cardRoutes.get('/:id', cardController.getCardById);

// Optional admin/dev routes:
cardRoutes.post('/', cardController.createCard);
cardRoutes.put('/:id', cardController.updateCard);
cardRoutes.delete('/:id', cardController.deleteCard);

export default cardRoutes;
