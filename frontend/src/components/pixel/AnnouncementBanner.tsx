/**
 * 📢 Bannière d'Annonce
 * Affiche la dernière combinaison annoncée
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, FONT_SIZES, RADIUS, SPACING, SHADOWS } from '../../styles/pixelTheme';
import { CombinationType } from '../../shared/types';
import type { Combination } from '../../shared/types';

// Labels locaux pour éviter les problèmes d'import
const COMBINATION_LABELS: Record<string, string> = {
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

interface AnnouncementBannerProps {
  combination: Combination | null;
  playerName?: string;
}

export const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({
  combination,
  playerName,
}) => {
  if (!combination) {
    return (
      <View style={[styles.container, styles.empty]}>
        <Text style={styles.emptyText}>📢 Aucune annonce</Text>
        <Text style={styles.emptySubtext}>Soyez le premier à annoncer !</Text>
      </View>
    );
  }

  const label = COMBINATION_LABELS[combination.type] || 'Inconnu';

  return (
    <View style={[styles.container, styles.active]}>
      <View style={styles.iconRow}>
        <Text style={styles.icon}>📢</Text>
        <Text style={styles.label}>DERNIÈRE ANNONCE</Text>
      </View>
      
      <View style={styles.combinationBox}>
        <Text style={styles.combinationText}>
          {label.toUpperCase()}
        </Text>
        {combination.rank && (
          <Text style={styles.rankText}>
            DE {combination.rank}
          </Text>
        )}
      </View>

      {playerName && (
        <Text style={styles.playerText}>
          par {playerName}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: RADIUS.medium,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  empty: {
    backgroundColor: COLORS.bgMedium,
    borderWidth: 2,
    borderColor: COLORS.borderWood,
    borderStyle: 'dashed' as const,
    alignItems: 'center',
  },
  emptyText: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.body,
    color: COLORS.textMuted,
  },
  emptySubtext: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.small,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  active: {
    backgroundColor: COLORS.bgMedium,
    borderWidth: 2,
    borderColor: COLORS.accentGold,
    ...SHADOWS.card,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  icon: {
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  label: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.small,
    color: COLORS.accentGold,
    letterSpacing: 2,
  },
  combinationBox: {
    backgroundColor: COLORS.bgDark,
    borderRadius: RADIUS.small,
    padding: SPACING.md,
    alignItems: 'center',
    marginVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.borderWood,
  },
  combinationText: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.subtitle,
    color: COLORS.textLight,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  rankText: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.body,
    color: COLORS.accentGold,
    marginTop: SPACING.xs,
    fontWeight: 'bold',
  },
  playerText: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.small,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
