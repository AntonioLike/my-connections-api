import { Router } from 'express';
import authenticateToken from '../middleware/authentication';
import linkController from '../controllers/linkController';

const linkRoutes = Router();

// Request a link with another user
linkRoutes.post('/request', authenticateToken, linkController.requestLink);

// Confirm a link (both users must enter each other’s codes)
linkRoutes.post('/confirm', authenticateToken, linkController.confirmLink);

// Get link status (pending/confirmed)
linkRoutes.get('/status', authenticateToken, linkController.getLinkStatus);

export default linkRoutes;
