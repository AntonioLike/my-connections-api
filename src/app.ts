import express, { Application } from 'express';
import cors from 'cors'; // Import the CORS middleware
import userRoutes from './routes/userRoutes';
import dotenv from 'dotenv';
import connectionRoutes from './routes/connectionRoutes';
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

// Errors
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err.status) {
        res.status(err.status).json({ error: err.message });
    } else {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Static
app.use('/cards', express.static(path.join(__dirname, '..', 'resources/cards')));

// Routes
app.use('/user', userRoutes);
app.use('/connection', connectionRoutes);
app.use('/card', cardRoutes);
app.use('/user-card-response', userCardResponseRoutes);
app.use('/auth', authRoutes);

export default app;
