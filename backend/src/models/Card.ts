import { CardSuit, CardRank, RANK_VALUES } from '../../../shared/types';
import type { Card } from '../../../shared/types';

export class CardModel implements Card {
  suit: CardSuit;
  rank: CardRank;
  value: number;

  constructor(suit: CardSuit, rank: CardRank) {
    this.suit = suit;
    this.rank = rank;
    this.value = RANK_VALUES[rank];
  }

  static createDeck(excludedRanks: CardRank[] = []): CardModel[] {
    const deck: CardModel[] = [];
    const suits = Object.values(CardSuit);
    const ranks = Object.values(CardRank).filter(
      (rank) => !excludedRanks.includes(rank)
    );

    for (const suit of suits) {
      for (const rank of ranks) {
        deck.push(new CardModel(suit, rank));
      }
    }

    return deck;
  }

  static shuffle(deck: CardModel[]): CardModel[] {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  toJSON(): Card {
    return {
      suit: this.suit,
      rank: this.rank,
      value: this.value,
    };
  }

  equals(other: Card): boolean {
    return this.suit === other.suit && this.rank === other.rank;
  }
}
