import express, { Application } from 'express';
import exampleRouter from './routers/exampleRouter';

const app: Application = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api', exampleRouter);

export default app;
