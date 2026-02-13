import {
  CombinationType,
  CardRank,
  CardSuit,
  COMBINATION_HIERARCHY,
  RANK_VALUES,
} from '../../../shared/types';
import type { Card, Combination } from '../../../shared/types';

export class CombinationEvaluator {
  static evaluate(cards: Card[]): Map<CombinationType, Combination[]> {
    const combinations = new Map<CombinationType, Combination[]>();

    combinations.set(CombinationType.HIGH_CARD, this.findHighCards(cards));
    combinations.set(CombinationType.PAIR, this.findPairs(cards));
    combinations.set(CombinationType.TWO_PAIR, this.findTwoPairs(cards));
    combinations.set(CombinationType.THREE_OF_A_KIND, this.findThreeOfAKind(cards));
    combinations.set(CombinationType.STRAIGHT, this.findStraights(cards));
    combinations.set(CombinationType.FLUSH, this.findFlushes(cards));
    combinations.set(CombinationType.FULL_HOUSE, this.findFullHouses(cards));
    combinations.set(CombinationType.FOUR_OF_A_KIND, this.findFourOfAKind(cards));
    combinations.set(CombinationType.STRAIGHT_FLUSH, this.findStraightFlushes(cards));

    return combinations;
  }

  static hasCombination(cards: Card[], combination: Combination): boolean {
    const allCombinations = this.evaluate(cards);
    const matchingType = allCombinations.get(combination.type);

    if (!matchingType || matchingType.length === 0) {
      return false;
    }

    // Vérifier si une combinaison du même type et du même rank existe
    // On ne compare pas la valeur car elle peut être calculée différemment
    return matchingType.some(
      (c) =>
        (combination.rank === undefined || c.rank === combination.rank) &&
        (combination.secondaryRank === undefined ||
          c.secondaryRank === combination.secondaryRank)
    );
  }

  static compareCombinations(a: Combination, b: Combination): number {
    const aValue = COMBINATION_HIERARCHY[a.type] * 1000 + a.value;
    const bValue = COMBINATION_HIERARCHY[b.type] * 1000 + b.value;
    return aValue - bValue;
  }

  static isStrongerThan(candidate: Combination, current: Combination | null): boolean {
    if (!current) return true;
    return this.compareCombinations(candidate, current) > 0;
  }

  private static findHighCards(cards: Card[]): Combination[] {
    const result: Combination[] = [];
    const uniqueRanks = [...new Set(cards.map((c) => c.rank))];

    for (const rank of uniqueRanks) {
      result.push({
        type: CombinationType.HIGH_CARD,
        rank,
        value: RANK_VALUES[rank],
      });
    }

    return result.sort((a, b) => (b.value || 0) - (a.value || 0));
  }

  private static findPairs(cards: Card[]): Combination[] {
    const rankCounts = this.countRanks(cards);
    const result: Combination[] = [];

    for (const [rank, count] of rankCounts) {
      if (count >= 2) {
        result.push({
          type: CombinationType.PAIR,
          rank,
          value: RANK_VALUES[rank] * 10,
        });
      }
    }

    return result.sort((a, b) => (b.value || 0) - (a.value || 0));
  }

  private static findTwoPairs(cards: Card[]): Combination[] {
    const pairs = this.findPairs(cards);
    const result: Combination[] = [];

    if (pairs.length >= 2) {
      for (let i = 0; i < pairs.length - 1; i++) {
        for (let j = i + 1; j < pairs.length; j++) {
          const higherPair = pairs[i];
          const lowerPair = pairs[j];
          result.push({
            type: CombinationType.TWO_PAIR,
            rank: higherPair.rank,
            secondaryRank: lowerPair.rank,
            value: (RANK_VALUES[higherPair.rank!] * 100) + RANK_VALUES[lowerPair.rank!],
          });
        }
      }
    }

    return result.sort((a, b) => (b.value || 0) - (a.value || 0));
  }

  private static findThreeOfAKind(cards: Card[]): Combination[] {
    const rankCounts = this.countRanks(cards);
    const result: Combination[] = [];

    for (const [rank, count] of rankCounts) {
      if (count >= 3) {
        result.push({
          type: CombinationType.THREE_OF_A_KIND,
          rank,
          value: RANK_VALUES[rank] * 100,
        });
      }
    }

    return result.sort((a, b) => (b.value || 0) - (a.value || 0));
  }

  private static findStraights(cards: Card[]): Combination[] {
    const uniqueValues = [...new Set(cards.map((c) => c.value))].sort((a, b) => a - b);
    const result: Combination[] = [];

    if (uniqueValues.length < 5) return result;

    for (let i = 0; i <= uniqueValues.length - 5; i++) {
      const sequence = uniqueValues.slice(i, i + 5);
      if (sequence[4] - sequence[0] === 4) {
        const highCardRank = this.valueToRank(sequence[4]);
        if (highCardRank) {
          result.push({
            type: CombinationType.STRAIGHT,
            rank: highCardRank,
            value: sequence[4] * 1000,
          });
        }
      }
    }

    // Vérifier la suite basse (A-2-3-4-5)
    if (uniqueValues.includes(14) && uniqueValues.includes(2) &&
        uniqueValues.includes(3) && uniqueValues.includes(4) &&
        uniqueValues.includes(5)) {
      result.push({
        type: CombinationType.STRAIGHT,
        rank: CardRank.FIVE,
        value: 5000,
      });
    }

    return result.sort((a, b) => (b.value || 0) - (a.value || 0));
  }

  private static findFlushes(cards: Card[]): Combination[] {
    const suitCounts = new Map<CardSuit, Card[]>();

    for (const card of cards) {
      if (!suitCounts.has(card.suit)) {
        suitCounts.set(card.suit, []);
      }
      suitCounts.get(card.suit)!.push(card);
    }

    const result: Combination[] = [];

    for (const [suit, suitCards] of suitCounts) {
      if (suitCards.length >= 5) {
        const highestCard = suitCards.sort((a, b) => b.value - a.value)[0];
        result.push({
          type: CombinationType.FLUSH,
          rank: highestCard.rank,
          value: highestCard.value * 10000,
        });
      }
    }

    return result.sort((a, b) => (b.value || 0) - (a.value || 0));
  }

  private static findFullHouses(cards: Card[]): Combination[] {
    const threeOfAKind = this.findThreeOfAKind(cards);
    const pairs = this.findPairs(cards);
    const result: Combination[] = [];

    for (const three of threeOfAKind) {
      for (const pair of pairs) {
        if (three.rank !== pair.rank) {
          result.push({
            type: CombinationType.FULL_HOUSE,
            rank: three.rank,
            secondaryRank: pair.rank,
            value: (RANK_VALUES[three.rank!] * 10000) + RANK_VALUES[pair.rank!],
          });
        }
      }
    }

    return result.sort((a, b) => (b.value || 0) - (a.value || 0));
  }

  private static findFourOfAKind(cards: Card[]): Combination[] {
    const rankCounts = this.countRanks(cards);
    const result: Combination[] = [];

    for (const [rank, count] of rankCounts) {
      if (count >= 4) {
        result.push({
          type: CombinationType.FOUR_OF_A_KIND,
          rank,
          value: RANK_VALUES[rank] * 100000,
        });
      }
    }

    return result.sort((a, b) => (b.value || 0) - (a.value || 0));
  }

  private static findStraightFlushes(cards: Card[]): Combination[] {
    const suitGroups = new Map<CardSuit, Card[]>();

    for (const card of cards) {
      if (!suitGroups.has(card.suit)) {
        suitGroups.set(card.suit, []);
      }
      suitGroups.get(card.suit)!.push(card);
    }

    const result: Combination[] = [];

    for (const [suit, suitCards] of suitGroups) {
      if (suitCards.length >= 5) {
        const straights = this.findStraights(suitCards);
        for (const straight of straights) {
          result.push({
            type: CombinationType.STRAIGHT_FLUSH,
            rank: straight.rank,
            value: (straight.value || 0) * 10,
          });
        }
      }
    }

    return result.sort((a, b) => (b.value || 0) - (a.value || 0));
  }

  private static countRanks(cards: Card[]): Map<CardRank, number> {
    const counts = new Map<CardRank, number>();

    for (const card of cards) {
      counts.set(card.rank, (counts.get(card.rank) || 0) + 1);
    }

    return counts;
  }

  private static valueToRank(value: number): CardRank | undefined {
    for (const [rank, val] of Object.entries(RANK_VALUES)) {
      if (val === value) {
        return rank as CardRank;
      }
    }
    return undefined;
  }
}
