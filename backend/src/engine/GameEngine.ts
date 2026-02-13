import { v4 as uuidv4 } from 'uuid';
import {
  GameState,
  DEFAULT_GAME_CONFIG,
  FIVE_PLAYER_CONFIG,
  PlayerStatus,
} from '../../../shared/types';
import type {
  GameStateData,
  Player,
  Combination,
  Announcement,
  GameConfig,
} from '../../../shared/types';
import { PlayerModel } from '../models/Player';
import { CardModel } from '../models/Card';
import { DeckManager } from './DeckManager';
import { CombinationEvaluator } from './CombinationEvaluator';

export class GameEngine {
  private state: GameStateData;
  private deckManager: DeckManager;
  private players: Map<string, PlayerModel> = new Map();

  constructor(gameId?: string) {
    this.state = {
      id: gameId || uuidv4(),
      state: GameState.WAITING,
      players: [],
      currentPlayerIndex: 0,
      currentPlayerId: null,
      lastAnnouncement: null,
      deck: [],
      round: 0,
      turn: 0,
      config: DEFAULT_GAME_CONFIG,
      eliminatedPlayers: [],
      history: [],
    };
    this.deckManager = new DeckManager(this.state.config);
  }

  // ============================================
  // GETTERS
  // ============================================

  getGameState(): GameStateData {
    return {
      ...this.state,
      players: this.getAllPlayers(),
    };
  }

  getPublicState(): GameStateData {
    return {
      ...this.state,
      players: this.getPublicPlayers(),
      deck: [],
    };
  }

  getPlayerState(playerId: string): GameStateData | null {
    const player = this.players.get(playerId);
    if (!player) return null;

    return {
      ...this.state,
      players: this.getPublicPlayers().map((p) =>
        p.id === playerId ? player.toJSON() : p
      ),
    };
  }

  // ============================================
  // GESTION DES JOUEURS
  // ============================================

  addPlayer(playerId: string, name: string, isHost = false): PlayerModel {
    if (this.state.state !== GameState.WAITING) {
      throw new Error('Cannot join: game already started');
    }

    if (this.players.has(playerId)) {
      return this.players.get(playerId)!;
    }

    const player = new PlayerModel(playerId, name, isHost);
    this.players.set(playerId, player);

    this.updateConfigForPlayerCount();
    this.logEvent('PLAYER_JOINED', { playerId, name, isHost });

    return player;
  }

  removePlayer(playerId: string): void {
    if (this.state.state === GameState.WAITING) {
      this.players.delete(playerId);
      this.updateConfigForPlayerCount();
    } else {
      const player = this.players.get(playerId);
      if (player) {
        player.eliminate();
        this.state.eliminatedPlayers.push(playerId);
      }
    }
    this.logEvent('PLAYER_LEFT', { playerId });
  }

  private updateConfigForPlayerCount(): void {
    const playerCount = this.players.size;
    if (playerCount === 5) {
      this.state.config = FIVE_PLAYER_CONFIG;
    } else {
      this.state.config = DEFAULT_GAME_CONFIG;
    }
  }

  private getAllPlayers(): Player[] {
    return Array.from(this.players.values()).map((p) => p.toJSON());
  }

  private getPublicPlayers(): Player[] {
    return Array.from(this.players.values()).map((p) => p.toPublicJSON());
  }

  getActivePlayers(): PlayerModel[] {
    return Array.from(this.players.values()).filter((p) => p.isActive);
  }

  // ============================================
  // CONTRÔLE DU JEU
  // ============================================

  canStart(): { canStart: boolean; reason?: string } {
    const activePlayers = this.getActivePlayers();
    if (activePlayers.length < this.state.config.minPlayers) {
      return {
        canStart: false,
        reason: `Minimum ${this.state.config.minPlayers} joueurs requis`,
      };
    }
    return { canStart: true };
  }

  startGame(): void {
    const check = this.canStart();
    if (!check.canStart) {
      throw new Error(check.reason);
    }

    this.state.state = GameState.INIT_ROUND;
    this.state.round = 1;
    this.logEvent('GAME_STARTED', { playerCount: this.getActivePlayers().length });
    this.initRound();
  }

  // ============================================
  // INITIALISATION DE MANCHE
  // ============================================

  private initRound(): void {
    this.state.state = GameState.INIT_ROUND;
    this.state.turn = 0;
    this.state.lastAnnouncement = null;

    // Créer et mélanger le deck
    this.deckManager = new DeckManager(this.state.config);
    this.deckManager.createNewDeck();

    // Distribuer 1 carte à chaque joueur actif
    // Les joueurs gardent leurs cartes de pénalité des manches précédentes
    const activePlayers = this.getActivePlayers();
    for (const player of activePlayers) {
      // On ne réinitialise PAS la main - le joueur garde ses cartes
      // On ajoute juste 1 nouvelle carte
      const cards = this.deckManager.drawMultiple(this.state.config.cardsPerPlayer);
      player.addCards(cards);
    }

    // Déterminer le joueur actif
    this.state.currentPlayerIndex = 0;
    this.state.currentPlayerId = activePlayers[0]?.id || null;

    this.state.state = GameState.PLAYING;
    this.logEvent('ROUND_STARTED', {
      round: this.state.round,
      players: activePlayers.map(p => ({ id: p.id, cardCount: p.cardCount })),
      startingPlayer: this.state.currentPlayerId,
    });
  }

  // ============================================
  // PRÉPARATION MANCHE SUIVANTE (sans redistribution)
  // ============================================

  private prepareNextRound(loserId: string): void {
    this.state.state = GameState.INIT_ROUND;
    this.state.turn = 0;
    this.state.lastAnnouncement = null;

    // Créer un nouveau deck
    this.deckManager = new DeckManager(this.state.config);
    this.deckManager.createNewDeck();

    const activePlayers = this.getActivePlayers();
    
    // Sauvegarder le nombre de cartes de chaque joueur (pénalités accumulées)
    const playerCardCounts = new Map<string, number>();
    for (const player of activePlayers) {
      playerCardCounts.set(player.id, player.cardCount);
      // Vider la main et remettre les cartes dans le deck
      const playerCards = player.clearHand();
      this.deckManager.addCards(playerCards);
    }
    
    // Mélanger
    this.deckManager.shuffle();
    
    // Redistribuer : 1 carte de base + 1 carte par pénalité accumulée
    for (const player of activePlayers) {
      const cardCount = playerCardCounts.get(player.id) || 1;
      const cardsToDraw = this.deckManager.drawMultiple(cardCount);
      player.addCards(cardsToDraw);
    }

    // Le perdant commence la prochaine manche
    const loserIndex = activePlayers.findIndex(p => p.id === loserId);
    this.state.currentPlayerIndex = loserIndex >= 0 ? loserIndex : 0;
    this.state.currentPlayerId = activePlayers[this.state.currentPlayerIndex]?.id || null;

    this.state.state = GameState.PLAYING;
    this.logEvent('ROUND_STARTED', {
      round: this.state.round,
      players: activePlayers.map(p => ({ id: p.id, name: p.name, cardCount: p.cardCount })),
      startingPlayer: this.state.currentPlayerId,
    });
    console.log(`[prepareNextRound] Round ${this.state.round} started. Cards redistributed. ${activePlayers.length} players, starting with ${activePlayers[this.state.currentPlayerIndex]?.name}`);
  }

  // ============================================
  // ACTIONS DE JEU
  // ============================================

  announceCombination(
    playerId: string,
    combination: Combination
  ): { success: boolean; error?: string } {
    if (this.state.state !== GameState.PLAYING) {
      return { success: false, error: 'Not in playing state' };
    }

    if (this.state.currentPlayerId !== playerId) {
      return { success: false, error: 'Not your turn' };
    }

    // Vérifier que la combinaison est plus forte que la précédente
    if (
      this.state.lastAnnouncement &&
      !CombinationEvaluator.isStrongerThan(combination, this.state.lastAnnouncement.combination)
    ) {
      return { success: false, error: 'Combination must be stronger than previous' };
    }

    const player = this.players.get(playerId);
    if (!player) {
      return { success: false, error: 'Player not found' };
    }

    this.state.lastAnnouncement = {
      playerId,
      playerName: player.name,
      combination,
      timestamp: Date.now(),
    };

    this.state.turn++;
    this.nextPlayer();

    this.logEvent('COMBINATION_ANNOUNCED', {
      playerId,
      combination,
    });

    return { success: true };
  }

  callLiar(accuserId: string): {
    success: boolean;
    error?: string;
    result?: {
      isLiar: boolean;
      announcerId: string;
      announcerName: string;
      allCards: CardModel[];
      loserId: string;
      loserName: string;
    };
  } {
    if (this.state.state !== GameState.PLAYING) {
      return { success: false, error: 'Not in playing state' };
    }

    if (!this.state.lastAnnouncement) {
      return { success: false, error: 'No announcement to challenge' };
    }

    const announcerId = this.state.lastAnnouncement.playerId;
    const announcer = this.players.get(announcerId);
    const accuser = this.players.get(accuserId);

    if (!announcer || !accuser) {
      return { success: false, error: 'Player not found' };
    }

    this.state.state = GameState.RESOLUTION;

    // Révéler toutes les cartes
    const allCards = this.getAllRevealedCards();

    // Vérifier si l'annonce était vraie
    const isLiar = !CombinationEvaluator.hasCombination(
      allCards,
      this.state.lastAnnouncement.combination
    );

    const loserId = isLiar ? announcerId : accuserId;
    const loser = isLiar ? announcer : accuser;

    this.logEvent('LIAR_CALLED', {
      accuserId,
      announcerId,
      isLiar,
      allCards: allCards.map((c) => c.toJSON()),
    });

    return {
      success: true,
      result: {
        isLiar,
        announcerId,
        announcerName: announcer.name,
        allCards,
        loserId,
        loserName: loser.name,
      },
    };
  }

  // ============================================
  // RÉSOLUTION DE MANCHE
  // ============================================

  resolveRound(loserId: string): { eliminated: boolean; newCardCount: number } {
    const loser = this.players.get(loserId);
    if (!loser) {
      throw new Error('Loser not found');
    }

    this.state.state = GameState.ROUND_END;
    console.log(`[resolveRound] Before: ${loser.name} has ${loser.cardCount} cards`);

    // Le perdant pioche 1 carte
    const newCard = this.deckManager.draw();
    if (newCard) {
      loser.addCard(newCard);
    }

    const newCardCount = loser.cardCount;
    console.log(`[resolveRound] After draw: ${loser.name} has ${newCardCount} cards`);
    let eliminated = false;

    // Vérifier élimination (5 cartes ou plus)
    if (newCardCount >= this.state.config.eliminationThreshold) {
      console.log(`[resolveRound] ${loser.name} ELIMINATED with ${newCardCount} cards!`);
      loser.eliminate();
      this.state.eliminatedPlayers.push(loserId);
      eliminated = true;

      // Retourner les cartes dans le deck
      const returnedCards = loser.clearHand();
      this.deckManager.addCards(returnedCards);
    }

    this.logEvent('ROUND_RESOLVED', {
      loserId,
      newCardCount,
      eliminated,
    });

    // Vérifier fin de partie
    const activePlayers = this.getActivePlayers();
    console.log(`[resolveRound] Active players remaining: ${activePlayers.length}`);
    
    if (activePlayers.length <= 1) {
      this.state.state = GameState.GAME_END;
      this.logEvent('GAME_ENDED', { winnerId: activePlayers[0]?.id });
      console.log(`[resolveRound] GAME ENDED! Winner: ${activePlayers[0]?.name}`);
    } else {
      // Passer à la manche suivante - seul le perdant a pris une carte
      this.state.round++;
      this.prepareNextRound(loserId);
    }

    return { eliminated, newCardCount };
  }

  // ============================================
  // UTILITAIRES
  // ============================================

  private nextPlayer(): void {
    const activePlayers = this.getActivePlayers();
    if (activePlayers.length === 0) return;

    this.state.currentPlayerIndex =
      (this.state.currentPlayerIndex + 1) % activePlayers.length;
    this.state.currentPlayerId = activePlayers[this.state.currentPlayerIndex].id;
  }

  private getAllRevealedCards(): CardModel[] {
    const cards: CardModel[] = [];
    for (const player of this.getActivePlayers()) {
      cards.push(...(player.hand as CardModel[]));
    }
    return cards;
  }

  private logEvent(type: string, data: Record<string, unknown>): void {
    this.state.history.push({
      type,
      timestamp: Date.now(),
      data,
    });
  }

  // ============================================
  // VALIDATION
  // ============================================

  validateCombination(
    playerId: string,
    combination: Combination
  ): { valid: boolean; error?: string } {
    const player = this.players.get(playerId);
    if (!player) {
      return { valid: false, error: 'Player not found' };
    }

    if (this.state.state !== GameState.PLAYING) {
      return { valid: false, error: 'Not in playing state' };
    }

    if (this.state.currentPlayerId !== playerId) {
      return { valid: false, error: 'Not your turn' };
    }

    if (
      this.state.lastAnnouncement &&
      !CombinationEvaluator.isStrongerThan(combination, this.state.lastAnnouncement.combination)
    ) {
      return { valid: false, error: 'Combination must be stronger than previous' };
    }

    return { valid: true };
  }
}
