import express from 'express';
import mongoose from 'mongoose';
import bikeRoutes from './routes/bikeRoutes.ts';
import rentalRoutes from './routes/rentals/rent.ts';

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({
    status: connected ? 'ok' : 'unavailable',
    database: connected ? 'connected' : 'disconnected',
  });
});

app.use('/api/bikes', bikeRoutes);
app.use('/api/rentals', rentalRoutes);

export default app;
