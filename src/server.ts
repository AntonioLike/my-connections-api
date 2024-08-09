import app from './app';
import connectDB from './database/connection';

const PORT = process.env.PORT;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
