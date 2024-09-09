import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URI, // You should have a POSTGRES_URI in your .env file
});

const connectDB = async () => {
  try {
    await pool.connect();
    console.log('PostgreSQL connected');
  } catch (error) {
    console.error('PostgreSQL connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
