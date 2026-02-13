/**
 * 👤 Carte Joueur Pixel Art
 * Affiche les infos d'un joueur autour de la table
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, FONTS, FONT_SIZES, SHADOWS, RADIUS, SPACING, DIMENSIONS } from '../../styles/pixelTheme';
import { PlayerStatus } from '../../shared/types';

interface PlayerCardProps {
  name: string;
  cardCount: number;
  isCurrentTurn: boolean;
  isHost?: boolean;
  isMe?: boolean;
  status?: PlayerStatus;
  style?: ViewStyle;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  name,
  cardCount,
  isCurrentTurn,
  isHost = false,
  isMe = false,
  status = PlayerStatus.ACTIVE,
  style,
}) => {
  const getBackgroundColor = () => {
    if (status === PlayerStatus.ELIMINATED) return COLORS.bgLight;
    if (status === PlayerStatus.DANGER) return '#4a2c1a';
    return COLORS.bgMedium;
  };

  const getBorderColor = () => {
    if (isCurrentTurn) return COLORS.accentGold;
    if (status === PlayerStatus.DANGER) return COLORS.warning;
    if (status === PlayerStatus.ELIMINATED) return COLORS.textMuted;
    return COLORS.borderWood;
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
        },
        isCurrentTurn && styles.activeGlow,
        status === PlayerStatus.ELIMINATED && styles.eliminated,
        SHADOWS.card,
        style,
      ]}
    >
      {/* Badge Host */}
      {isHost && (
        <View style={styles.hostBadge}>
          <Text style={styles.badgeText}>👑</Text>
        </View>
      )}

      {/* Badge Tour Actif */}
      {isCurrentTurn && (
        <View style={styles.turnBadge}>
          <Text style={styles.badgeText}>👆</Text>
        </View>
      )}

      {/* Nom */}
      <Text style={styles.name} numberOfLines={1}>
        {name} {isMe && '(Vous)'}
      </Text>

      {/* Compteur de cartes */}
      <View style={styles.cardInfo}>
        <Text style={styles.cardIcon}>🃏</Text>
        <Text style={styles.cardCount}>x {cardCount}</Text>
      </View>

      {/* Badge Danger */}
      {status === PlayerStatus.DANGER && (
        <View style={styles.dangerBadge}>
          <Text style={styles.dangerText}>⚠️</Text>
        </View>
      )}

      {/* Badge Éliminé */}
      {status === PlayerStatus.ELIMINATED && (
        <View style={styles.eliminatedBadge}>
          <Text style={styles.eliminatedText}>❌</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: DIMENSIONS.playerCardWidth,
    padding: SPACING.md,
    borderRadius: RADIUS.medium,
    borderWidth: 2,
    alignItems: 'center',
    position: 'relative',
  },
  activeGlow: {
    shadowColor: COLORS.accentGold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 0,
    elevation: 4,
  },
  eliminated: {
    opacity: 0.5,
  },
  hostBadge: {
    position: 'absolute',
    top: -8,
    left: -8,
    backgroundColor: COLORS.accentGold,
    borderRadius: RADIUS.small,
    padding: 2,
  },
  turnBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: COLORS.accentGreen,
    borderRadius: RADIUS.small,
    padding: 2,
  },
  badgeText: {
    fontSize: 12,
  },
  name: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.body,
    color: COLORS.textLight,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  cardCount: {
    fontFamily: FONTS.numbers,
    fontSize: FONT_SIZES.small,
    color: COLORS.textMuted,
  },
  dangerBadge: {
    position: 'absolute',
    bottom: -8,
    backgroundColor: COLORS.warning,
    borderRadius: RADIUS.small,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  dangerText: {
    fontSize: 10,
  },
  eliminatedBadge: {
    position: 'absolute',
    top: '50%',
    backgroundColor: COLORS.danger,
    borderRadius: RADIUS.small,
    paddingHorizontal: 8,
    paddingVertical: 4,
    transform: [{ translateY: -10 }],
  },
  eliminatedText: {
    fontSize: 12,
  },
});
