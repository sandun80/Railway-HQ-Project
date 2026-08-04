import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI || '';

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    message: 'API is running',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

async function startServer() {
  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri);
      console.log('MongoDB connected');
    } catch (error) {
      console.error('MongoDB connection failed:', error.message);
    }
  } else {
    console.log('MONGO_URI not set, starting server without database connection');
  }

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

startServer();
