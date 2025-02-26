import { AppDataSource } from '../data-source';

const connectDB = async () => {
  try {
    await AppDataSource.initialize();
    console.log('PostgreSQL connected with TypeORM');
  } catch (error) {
    console.error('PostgreSQL connection error with TypeORM:', error);
    process.exit(1); // Exit if the database connection fails
  }
};

export default connectDB;
