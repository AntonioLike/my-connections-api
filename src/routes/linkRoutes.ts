import { Router } from 'express';
import authenticateToken from '../middleware/authentication';
import linkController from '../controllers/linkController';

const linkRoutes = Router();

// Request a link with another user
linkRoutes.post('/request', authenticateToken, linkController.requestLink);

linkRoutes.get('/:userToken', authenticateToken, linkController.getLinksByUserId);

linkRoutes.delete('/:userToken/:targetToken', authenticateToken, linkController.deleteLink);


export default linkRoutes;
