import { Router } from 'express';
import authenticateToken from '../middleware/authentication';
import connectionController from '../controllers/connectionController';
import { asyncHandler } from '../utils/asyncHandler';

const connectionRoutes = Router();

// Request a connection with another user
connectionRoutes.post('/link', authenticateToken, asyncHandler(connectionController.requestConnection))

connectionRoutes.get('/', authenticateToken, asyncHandler(connectionController.getUserConnections));

connectionRoutes.delete('/:userToken/:targetToken', authenticateToken, asyncHandler(connectionController.deleteLink));


export default connectionRoutes;
