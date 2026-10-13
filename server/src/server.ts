import app from './app.ts';
import mongoose from 'mongoose';

const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI;

async function start() {
  if (!mongoUri) {
    throw new Error('MONGODB_URI muss gesetzt sein. Starte das Projekt mit docker compose up --build.');
  }

  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
  console.log('MongoDB verbunden.');

  const server = app.listen(port);
  server.on('listening', () => {
    console.log(`Server läuft auf http://localhost:${port}`);
  });
  
  server.on('error', (error) => {
    console.error('HTTP-Server konnte nicht gestartet werden:', error.message);
    process.exit(1);
  });

  const shutdown = () => {
    const timeout = setTimeout(() => process.exit(1), 10000);
    timeout.unref();
    server.close(async () => {
      await mongoose.disconnect();
      process.exit(0);
    });
  };
  process.once('SIGTERM', shutdown);
  process.once('SIGINT', shutdown);
}

start().catch((error) => {
  console.error('Server konnte nicht gestartet werden:', error.message);
  process.exit(1);
});
