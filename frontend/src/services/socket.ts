import { io, Socket } from 'socket.io-client';
import type { GameStateData, Combination } from '../shared/types';

const SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL || 'http://localhost:3001';

export class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  connect(): void {
    if (this.socket?.connected) return;

    this.socket = io(SERVER_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.emit('CONNECTED', null);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      this.emit('DISCONNECTED', null);
    });

    // Game events
    this.socket.on('GAME_CREATED', (data) => this.emit('GAME_CREATED', data));
    this.socket.on('GAME_JOINED', (data) => this.emit('GAME_JOINED', data));
    this.socket.on('PLAYER_JOINED', (data) => this.emit('PLAYER_JOINED', data));
    this.socket.on('GAME_STARTED', (data) => this.emit('GAME_STARTED', data));
    this.socket.on('COMBINATION_ANNOUNCED', (data) => this.emit('COMBINATION_ANNOUNCED', data));
    this.socket.on('RESOLUTION_PHASE', (data) => this.emit('RESOLUTION_PHASE', data));
    this.socket.on('ROUND_RESOLVED', (data) => this.emit('ROUND_RESOLVED', data));
    this.socket.on('NEW_ROUND', (data) => this.emit('NEW_ROUND', data));
    this.socket.on('GAME_ENDED', (data) => this.emit('GAME_ENDED', data));
    this.socket.on('ERROR', (data) => this.emit('ERROR', data));
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }

  // Actions
  createGame(playerName: string): void {
    this.socket?.emit('CREATE_GAME', { playerName });
  }

  joinGame(gameId: string, playerName: string): void {
    this.socket?.emit('JOIN_GAME', { gameId, playerName });
  }

  startGame(gameId: string): void {
    this.socket?.emit('START_GAME', { gameId });
  }

  announceCombination(gameId: string, combination: Combination): void {
    this.socket?.emit('ANNOUNCE_COMBINATION', { gameId, combination });
  }

  callLiar(gameId: string): void {
    console.log('SocketService.callLiar called, socket connected:', this.socket?.connected);
    this.socket?.emit('CALL_LIAR', { gameId });
  }

  // Event handling
  on(event: string, callback: Function): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);

    return () => {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index !== -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  private emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((cb) => cb(data));
    }
  }

  isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export const socketService = new SocketService();
