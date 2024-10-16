import express, { Application } from 'express';
import cors from 'cors'; // Import the CORS middleware
import userRoutes from './routes/userRoutes';

const app: Application = express();

// CORS configuration
const corsOptions = {
    origin: ['http://localhost:19006'], // Allow requests from frontend running on localhost:3000
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
    credentials: true, // Allow cookies or authentication headers
};

// Use CORS middleware with options
app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// Routes
app.use('/user', userRoutes);

export default app;
