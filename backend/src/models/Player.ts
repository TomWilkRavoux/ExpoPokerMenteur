import { PlayerStatus } from '../../../shared/types';
import type { Player, Card, GameConfig } from '../../../shared/types';
import { CardModel } from './Card';

export class PlayerModel implements Player {
  id: string;
  name: string;
  hand: Card[];
  cardCount: number;
  status: PlayerStatus;
  isHost: boolean;
  isActive: boolean;

  constructor(id: string, name: string, isHost = false) {
    this.id = id;
    this.name = name;
    this.hand = [];
    this.cardCount = 0;
    this.status = PlayerStatus.ACTIVE;
    this.isHost = isHost;
    this.isActive = true;
  }

  addCard(card: CardModel): void {
    this.hand.push(card);
    this.cardCount = this.hand.length;
    this.updateStatus();
  }

  addCards(cards: CardModel[]): void {
    this.hand.push(...cards);
    this.cardCount = this.hand.length;
    this.updateStatus();
  }

  removeCards(cardsToRemove: Card[]): CardModel[] {
    const removed: CardModel[] = [];
    for (const cardToRemove of cardsToRemove) {
      const index = this.hand.findIndex(
        (c) => c.suit === cardToRemove.suit && c.rank === cardToRemove.rank
      );
      if (index !== -1) {
        const [card] = this.hand.splice(index, 1);
        removed.push(card as CardModel);
      }
    }
    this.cardCount = this.hand.length;
    this.updateStatus();
    return removed;
  }

  clearHand(): CardModel[] {
    const cards = [...this.hand];
    this.hand = [];
    this.cardCount = 0;
    return cards as CardModel[];
  }

  updateStatus(): void {
    if (this.cardCount >= 5) {
      this.status = PlayerStatus.ELIMINATED;
      this.isActive = false;
    } else if (this.cardCount >= 4) {
      this.status = PlayerStatus.DANGER;
    } else {
      this.status = PlayerStatus.ACTIVE;
    }
  }

  eliminate(): void {
    const cards = this.clearHand();
    this.status = PlayerStatus.ELIMINATED;
    this.isActive = false;
  }

  resetForNewRound(config: GameConfig): void {
    if (this.isActive) {
      this.hand = [];
      this.cardCount = 0;
      this.status = PlayerStatus.ACTIVE;
    }
  }

  toJSON(): Player {
    return {
      id: this.id,
      name: this.name,
      hand: this.isActive ? this.hand : [],
      cardCount: this.cardCount,
      status: this.status,
      isHost: this.isHost,
      isActive: this.isActive,
    };
  }

  toPublicJSON(): Player {
    return {
      id: this.id,
      name: this.name,
      hand: [],
      cardCount: this.cardCount,
      status: this.status,
      isHost: this.isHost,
      isActive: this.isActive,
    };
  }
}
