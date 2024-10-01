import express, { Application } from 'express';
import userRoutes from './routes/userRoutes';

const app: Application = express();

// Middleware
app.use(express.json());

// Routes
app.use('/user', userRoutes);

export default app;
