import { Server as HttpServer } from 'http';
import { Server as SocketServer, Socket } from 'socket.io';
import { GameEngine } from '../engine/GameEngine';
import { GameState } from '../../../shared/types';

export class SocketService {
  private io: SocketServer;
  private games: Map<string, GameEngine> = new Map();
  private playerSockets: Map<string, string> = new Map(); // playerId -> socketId

  constructor(server: HttpServer) {
    this.io = new SocketServer(server, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    this.setupHandlers();
  }

  private setupHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log(`Client connected: ${socket.id}`);

      // Créer une nouvelle partie
      socket.on('CREATE_GAME', (data: { playerName: string }) => {
        try {
          const game = new GameEngine();
          const playerId = socket.id;
          game.addPlayer(playerId, data.playerName, true);

          this.games.set(game.getGameState().id, game);
          this.playerSockets.set(playerId, socket.id);

          socket.join(game.getGameState().id);

          socket.emit('GAME_CREATED', {
            gameId: game.getGameState().id,
            playerId,
            gameState: game.getPlayerState(playerId),
          });
        } catch (error) {
          socket.emit('ERROR', { message: (error as Error).message });
        }
      });

      // Rejoindre une partie
      socket.on(
        'JOIN_GAME',
        (data: { gameId: string; playerName: string }) => {
          try {
            const game = this.games.get(data.gameId);
            if (!game) {
              socket.emit('ERROR', { message: 'Game not found' });
              return;
            }

            const playerId = socket.id;
            game.addPlayer(playerId, data.playerName);
            this.playerSockets.set(playerId, socket.id);

            socket.join(data.gameId);

            // Notifier tous les joueurs
            this.io.to(data.gameId).emit('PLAYER_JOINED', {
              playerId,
              playerName: data.playerName,
              gameState: game.getPublicState(),
            });

            socket.emit('GAME_JOINED', {
              gameId: data.gameId,
              playerId,
              gameState: game.getPlayerState(playerId),
            });
          } catch (error) {
            socket.emit('ERROR', { message: (error as Error).message });
          }
        }
      );

      // Démarrer la partie
      socket.on('START_GAME', (data: { gameId: string }) => {
        try {
          const game = this.games.get(data.gameId);
          if (!game) {
            socket.emit('ERROR', { message: 'Game not found' });
            return;
          }

          const check = game.canStart();
          if (!check.canStart) {
            socket.emit('ERROR', { message: check.reason });
            return;
          }

          game.startGame();

          // Envoyer l'état à chaque joueur individuellement
          for (const player of game.getGameState().players) {
            const socketId = this.playerSockets.get(player.id);
            if (socketId) {
              this.io.to(socketId).emit('GAME_STARTED', {
                gameState: game.getPlayerState(player.id),
              });
            }
          }
        } catch (error) {
          socket.emit('ERROR', { message: (error as Error).message });
        }
      });

      // Annoncer une combinaison
      socket.on(
        'ANNOUNCE_COMBINATION',
        (data: { gameId: string; combination: any }) => {
          try {
            const game = this.games.get(data.gameId);
            if (!game) {
              socket.emit('ERROR', { message: 'Game not found' });
              return;
            }

            const playerId = socket.id;
            const result = game.announceCombination(playerId, data.combination);

            if (!result.success) {
              socket.emit('ERROR', { message: result.error });
              return;
            }

            // Envoyer l'état individuel à chaque joueur pour qu'ils voient leur main
            for (const player of game.getGameState().players) {
              const socketId = this.playerSockets.get(player.id);
              if (socketId) {
                this.io.to(socketId).emit('COMBINATION_ANNOUNCED', {
                  playerId,
                  combination: data.combination,
                  gameState: game.getPlayerState(player.id),
                });
              }
            }
          } catch (error) {
            socket.emit('ERROR', { message: (error as Error).message });
          }
        }
      );

      // Appeler menteur
      socket.on('CALL_LIAR', (data: { gameId: string }) => {
        console.log('CALL_LIAR received:', data, 'from socket:', socket.id);
        try {
          const game = this.games.get(data.gameId);
          if (!game) {
            console.log('Game not found:', data.gameId);
            socket.emit('ERROR', { message: 'Game not found' });
            return;
          }

          const accuserId = socket.id;
          const result = game.callLiar(accuserId);

          if (!result.success || !result.result) {
            socket.emit('ERROR', { message: result.error });
            return;
          }

          // Phase de résolution
          this.io.to(data.gameId).emit('RESOLUTION_PHASE', {
            accuserId,
            announcerId: result.result.announcerId,
            isLiar: result.result.isLiar,
            allCards: result.result.allCards,
            loserId: result.result.loserId,
            loserName: result.result.loserName,
          });

          // Résoudre la manche après un délai
          setTimeout(() => {
            const resolution = game.resolveRound(result.result!.loserId);

            this.io.to(data.gameId).emit('ROUND_RESOLVED', {
              loserId: result.result!.loserId,
              loserName: result.result!.loserName,
              eliminated: resolution.eliminated,
              newCardCount: resolution.newCardCount,
              gameState: game.getPublicState(),
            });

            // Si fin de partie
            if (game.getGameState().state === GameState.GAME_END) {
              const winner = game.getActivePlayers()[0];
              this.io.to(data.gameId).emit('GAME_ENDED', {
                winnerId: winner?.id,
                winnerName: winner?.name,
                history: game.getGameState().history,
              });
            } else {
              // Nouvelle manche - envoyer état individuel
              for (const player of game.getGameState().players) {
                const socketId = this.playerSockets.get(player.id);
                if (socketId) {
                  this.io.to(socketId).emit('NEW_ROUND', {
                    gameState: game.getPlayerState(player.id),
                  });
                }
              }
            }
          }, 3000);
        } catch (error) {
          socket.emit('ERROR', { message: (error as Error).message });
        }
      });

      // Déconnexion
      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
        this.playerSockets.delete(socket.id);
      });
    });
  }

  broadcastGameState(gameId: string, game: GameEngine): void {
    this.io.to(gameId).emit('GAME_STATE_UPDATE', game.getPublicState());
  }
}
