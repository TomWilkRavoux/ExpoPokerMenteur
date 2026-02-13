import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { SocketService } from './services/SocketService';

const app = express();
const server = createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialiser Socket.IO
const socketService = new SocketService(server);

// Démarrer le serveur
const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🎮 Poker Menteur Server running on port ${PORT}`);
  console.log(`📡 Socket.IO ready for connections`);
});
