import { Router } from 'express';
import authenticateToken from '../middleware/authentication';
import connectionController from '../controllers/connectionController';

const connectionRoutes = Router();

// Request a connection with another user
connectionRoutes.post('/:userToken/:targetToken', authenticateToken, connectionController.requestConnection);

connectionRoutes.get('/:userToken', authenticateToken, connectionController.getLinksByUserId);

connectionRoutes.delete('/:userToken/:targetToken', authenticateToken, connectionController.deleteLink);


export default connectionRoutes;
