/**
 * Types partagés entre frontend et backend
 * Poker Menteur
 */

// ============================================
// ÉNUMÉRATIONS
// ============================================

export enum GameState {
  WAITING = 'WAITING',
  INIT_ROUND = 'INIT_ROUND',
  PLAYING = 'PLAYING',
  RESOLUTION = 'RESOLUTION',
  ROUND_END = 'ROUND_END',
  GAME_END = 'GAME_END',
}

export enum CardSuit {
  HEARTS = '♥️',
  DIAMONDS = '♦️',
  CLUBS = '♣️',
  SPADES = '♠️',
}

export enum CardRank {
  TWO = '2',
  THREE = '3',
  FOUR = '4',
  FIVE = '5',
  SIX = '6',
  SEVEN = '7',
  EIGHT = '8',
  NINE = '9',
  TEN = '10',
  JACK = 'J',
  QUEEN = 'Q',
  KING = 'K',
  ACE = 'A',
}

export enum CombinationType {
  HIGH_CARD = 'HIGH_CARD',
  PAIR = 'PAIR',
  TWO_PAIR = 'TWO_PAIR',
  THREE_OF_A_KIND = 'THREE_OF_A_KIND',
  STRAIGHT = 'STRAIGHT',
  FLUSH = 'FLUSH',
  FULL_HOUSE = 'FULL_HOUSE',
  FOUR_OF_A_KIND = 'FOUR_OF_A_KIND',
  STRAIGHT_FLUSH = 'STRAIGHT_FLUSH',
}

export enum PlayerStatus {
  ACTIVE = 'ACTIVE',
  DANGER = 'DANGER',
  ELIMINATED = 'ELIMINATED',
}

// ============================================
// INTERFACES
// ============================================

export interface Card {
  suit: CardSuit;
  rank: CardRank;
  value: number;
}

export interface Player {
  id: string;
  name: string;
  hand: Card[];
  cardCount: number;
  status: PlayerStatus;
  isHost: boolean;
  isActive: boolean;
}

export interface Combination {
  type: CombinationType;
  rank?: CardRank;
  secondaryRank?: CardRank;
  value: number;
}

export interface Announcement {
  playerId: string;
  playerName: string;
  combination: Combination;
  timestamp: number;
}

export interface GameConfig {
  maxPlayers: number;
  minPlayers: number;
  cardsPerPlayer: number;
  excludedRanks: CardRank[];
  dangerThreshold: number;
  eliminationThreshold: number;
}

export interface GameStateData {
  id: string;
  state: GameState;
  players: Player[];
  currentPlayerIndex: number;
  currentPlayerId: string | null;
  lastAnnouncement: Announcement | null;
  deck: Card[];
  round: number;
  turn: number;
  config: GameConfig;
  eliminatedPlayers: string[];
  history: GameEvent[];
}

export interface GameEvent {
  type: string;
  timestamp: number;
  data: Record<string, unknown>;
}

// ============================================
// CONSTANTES
// ============================================

export const DEFAULT_GAME_CONFIG: GameConfig = {
  maxPlayers: 6,
  minPlayers: 2,
  cardsPerPlayer: 1,
  excludedRanks: [],
  dangerThreshold: 4,
  eliminationThreshold: 5,
};

export const FIVE_PLAYER_CONFIG: GameConfig = {
  ...DEFAULT_GAME_CONFIG,
  excludedRanks: [
    CardRank.TWO,
    CardRank.THREE,
    CardRank.FOUR,
    CardRank.FIVE,
    CardRank.SIX,
  ],
};

export const COMBINATION_HIERARCHY: Record<CombinationType, number> = {
  [CombinationType.HIGH_CARD]: 1,
  [CombinationType.PAIR]: 2,
  [CombinationType.TWO_PAIR]: 3,
  [CombinationType.THREE_OF_A_KIND]: 4,
  [CombinationType.STRAIGHT]: 5,
  [CombinationType.FLUSH]: 6,
  [CombinationType.FULL_HOUSE]: 7,
  [CombinationType.FOUR_OF_A_KIND]: 8,
  [CombinationType.STRAIGHT_FLUSH]: 9,
};

export const RANK_VALUES: Record<CardRank, number> = {
  [CardRank.TWO]: 2,
  [CardRank.THREE]: 3,
  [CardRank.FOUR]: 4,
  [CardRank.FIVE]: 5,
  [CardRank.SIX]: 6,
  [CardRank.SEVEN]: 7,
  [CardRank.EIGHT]: 8,
  [CardRank.NINE]: 9,
  [CardRank.TEN]: 10,
  [CardRank.JACK]: 11,
  [CardRank.QUEEN]: 12,
  [CardRank.KING]: 13,
  [CardRank.ACE]: 14,
};

// Labels des combinaisons pour l'affichage
export const COMBINATION_LABELS: Record<CombinationType, string> = {
  [CombinationType.HIGH_CARD]: 'Carte Haute',
  [CombinationType.PAIR]: 'Paire',
  [CombinationType.TWO_PAIR]: 'Double Paire',
  [CombinationType.THREE_OF_A_KIND]: 'Brelan',
  [CombinationType.STRAIGHT]: 'Suite',
  [CombinationType.FLUSH]: 'Couleur',
  [CombinationType.FULL_HOUSE]: 'Full',
  [CombinationType.FOUR_OF_A_KIND]: 'Carré',
  [CombinationType.STRAIGHT_FLUSH]: 'Quinte Flush',
};
