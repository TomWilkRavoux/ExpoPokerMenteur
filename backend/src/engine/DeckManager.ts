import { CardRank } from '../../../shared/types';
import type { GameConfig } from '../../../shared/types';
import { CardModel } from '../models/Card';

export class DeckManager {
  private deck: CardModel[] = [];
  private config: GameConfig;

  constructor(config: GameConfig) {
    this.config = config;
  }

  createNewDeck(): void {
    this.deck = CardModel.createDeck(this.config.excludedRanks);
    this.shuffle();
  }

  shuffle(): void {
    this.deck = CardModel.shuffle(this.deck);
  }

  draw(): CardModel | null {
    return this.deck.pop() || null;
  }

  drawMultiple(count: number): CardModel[] {
    const cards: CardModel[] = [];
    for (let i = 0; i < count; i++) {
      const card = this.draw();
      if (card) {
        cards.push(card);
      }
    }
    return cards;
  }

  addCards(cards: CardModel[]): void {
    this.deck.unshift(...cards);
  }

  getRemainingCount(): number {
    return this.deck.length;
  }

  getCards(): CardModel[] {
    return [...this.deck];
  }

  isEmpty(): boolean {
    return this.deck.length === 0;
  }
}
