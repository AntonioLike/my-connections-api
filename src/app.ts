import express, { Application } from 'express';
import cors from 'cors'; // Import the CORS middleware
import userRoutes from './routes/userRoutes';
import dotenv from 'dotenv';
import linkRoutes from './routes/linkRoutes';
import cardRoutes from './routes/cardRoutes';
import authRoutes from './routes/authRoutes';
import path from 'path';
import userCardResponseRoutes from './routes/userCardResponseRoutes';

dotenv.config();

const app: Application = express();

// CORS configuration
const corsOptions = {
    origin: ['http://localhost:19006', 'http://localhost:8081'], // Allow requests from frontend running on localhost:3000
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
    credentials: true, // Allow cookies or authentication headers
};

// Use CORS middleware with options
app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// Static
app.use('/cards', express.static(path.join(__dirname, '..', 'resources/cards')));

// Routes
app.use('/user', userRoutes);
app.use('/link', linkRoutes);
app.use('/card', cardRoutes);
app.use('/user-card-response', userCardResponseRoutes);
app.use('/auth', authRoutes);

export default app;
