import { create } from 'zustand';
import type {
  GameStateData,
  Player,
  Combination,
  Announcement,
  GameState,
} from '../shared/types';

interface GameStore {
  // State
  gameState: GameStateData | null;
  playerId: string | null;
  gameId: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setGameState: (state: GameStateData | ((prev: GameStateData | null) => GameStateData)) => void;
  setPlayerId: (id: string) => void;
  setGameId: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;

  // Selectors
  getCurrentPlayer: () => Player | null;
  getActivePlayers: () => Player[];
  isCurrentPlayer: () => boolean;
  isHost: () => boolean;
  canStartGame: () => boolean;
}

const initialState = {
  gameState: null,
  playerId: null,
  gameId: null,
  isLoading: false,
  error: null,
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,

  setGameState: (state) => set((store) => ({
    gameState: typeof state === 'function' ? state(store.gameState) : state
  })),
  setPlayerId: (id) => set({ playerId: id }),
  setGameId: (id) => set({ gameId: id }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  reset: () => set(initialState),

  getCurrentPlayer: () => {
    const { gameState, playerId } = get();
    if (!gameState || !playerId || !gameState.players) return null;
    return gameState.players.find((p) => p.id === playerId) || null;
  },

  getActivePlayers: () => {
    const { gameState } = get();
    if (!gameState || !gameState.players) return [];
    return gameState.players.filter((p) => p.isActive);
  },

  isCurrentPlayer: () => {
    const { gameState, playerId } = get();
    if (!gameState || !playerId) return false;
    return gameState.currentPlayerId === playerId;
  },

  isHost: () => {
    const player = get().getCurrentPlayer();
    return player?.isHost ?? false;
  },

  canStartGame: () => {
    const { gameState, isHost } = get();
    if (!gameState || !isHost()) return false;
    const activePlayers = gameState.players.filter((p) => p.isActive);
    return (
      gameState.state === 'WAITING' &&
      activePlayers.length >= gameState.config.minPlayers
    );
  },
}));
