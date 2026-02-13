/**
 * 🃏 Carte à Jouer Pixel Art
 * Affichage d'une carte de poker en style pixel
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, FONTS, FONT_SIZES, SHADOWS, RADIUS, DIMENSIONS } from '../../styles/pixelTheme';
import type { Card } from '../../shared/types';

interface PixelCardProps {
  card?: Card;
  hidden?: boolean;
  small?: boolean;
  style?: ViewStyle;
}

const SUIT_SYMBOLS: Record<string, string> = {
  'SPADES': '♠',
  'HEARTS': '♥',
  'DIAMONDS': '♦',
  'CLUBS': '♣',
  '♥️': '♥',
  '♦️': '♦',
  '♣️': '♣',
  '♠️': '♠',
};

const SUIT_COLORS: Record<string, string> = {
  'SPADES': COLORS.spade,
  'HEARTS': COLORS.heart,
  'DIAMONDS': COLORS.diamond,
  'CLUBS': COLORS.club,
  '♥️': COLORS.heart,
  '♦️': COLORS.diamond,
  '♣️': COLORS.club,
  '♠️': COLORS.spade,
};

export const PixelCard: React.FC<PixelCardProps> = ({
  card,
  hidden = false,
  small = false,
  style,
}) => {
  if (hidden) {
    return (
      <View style={[
        styles.card,
        styles.hiddenCard,
        small && styles.small,
        SHADOWS.card,
        style,
      ]}>
        <Text style={styles.hiddenText}>🂠</Text>
      </View>
    );
  }

  if (!card) {
    return (
      <View style={[
        styles.card,
        styles.placeholder,
        small && styles.small,
        style,
      ]} />
    );
  }

  const suitColor = SUIT_COLORS[card.suit] || COLORS.spade;
  const suitSymbol = SUIT_SYMBOLS[card.suit] || '?';
  const rank = card.rank || '?';

  return (
    <View style={[
      styles.card,
      small && styles.small,
      SHADOWS.card,
      style,
    ]}>
      {/* Coin supérieur gauche */}
      <View style={styles.cornerTop}>
        <Text style={[styles.cornerRank, { color: suitColor }]}>
          {rank}
        </Text>
        <Text style={[styles.cornerSuit, { color: suitColor }]}>
          {suitSymbol}
        </Text>
      </View>

      {/* Centre */}
      <View style={styles.centerContainer}>
        <Text style={[styles.centerSuit, { color: suitColor }]}>
          {suitSymbol}
        </Text>
      </View>

      {/* Coin inférieur droit (inversé) */}
      <View style={styles.cornerBottom}>
        <Text style={[styles.cornerRank, { color: suitColor }]}>
          {rank}
        </Text>
        <Text style={[styles.cornerSuit, { color: suitColor }]}>
          {suitSymbol}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: DIMENSIONS.cardWidth,
    height: DIMENSIONS.cardHeight,
    backgroundColor: COLORS.cardBg,
    borderRadius: RADIUS.card,
    borderWidth: 2,
    borderColor: COLORS.cardBorder,
    position: 'relative',
    overflow: 'hidden',
  },
  small: {
    width: 32,
    height: 44,
  },
  placeholder: {
    backgroundColor: 'transparent',
    borderColor: COLORS.borderWood,
    borderStyle: 'dashed' as const,
  },
  hiddenCard: {
    backgroundColor: '#8b0000',
    borderColor: '#5d0000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hiddenText: {
    fontSize: 28,
    color: COLORS.cardBg,
  },
  cornerTop: {
    position: 'absolute',
    top: 4,
    left: 4,
    alignItems: 'center',
  },
  cornerBottom: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    alignItems: 'center',
    transform: [{ rotate: '180deg' }],
  },
  cornerRank: {
    fontFamily: FONTS.numbers,
    fontSize: 10,
    fontWeight: 'bold',
    lineHeight: 12,
  },
  cornerSuit: {
    fontFamily: FONTS.numbers,
    fontSize: 10,
    lineHeight: 12,
  },
  centerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerSuit: {
    fontFamily: FONTS.numbers,
    fontSize: 20,
  },
});
