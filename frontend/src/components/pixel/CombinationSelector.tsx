/**
 * 🎯 Sélecteur de Combinaison
 * Grille de sélection type + valeur
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, FONT_SIZES, RADIUS, SPACING } from '../../styles/pixelTheme';
import { CombinationType } from '../../shared/types';

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

const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

interface CombinationSelectorProps {
  selectedType: CombinationType | null;
  onSelectType: (type: CombinationType) => void;
  selectedRank: string;
  onSelectRank: (rank: string) => void;
}

export const CombinationSelector: React.FC<CombinationSelectorProps> = ({
  selectedType,
  onSelectType,
  selectedRank,
  onSelectRank,
}) => {
  return (
    <View style={styles.container}>
      {/* Section Type */}
      <Text style={styles.sectionTitle}>🎯 TYPE DE COMBINAISON</Text>
      <View style={styles.typesGrid}>
        {Object.entries(COMBINATION_LABELS).map(([type, label]) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.typeButton,
              selectedType === type && styles.typeButtonSelected,
            ]}
            onPress={() => onSelectType(type as CombinationType)}
          >
            <Text
              style={[
                styles.typeText,
                selectedType === type && styles.typeTextSelected,
              ]}
              numberOfLines={2}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Section Valeur */}
      {selectedType && (
        <>
          <Text style={styles.sectionTitle}>🎴 VALEUR</Text>
          <View style={styles.ranksGrid}>
            {RANKS.map((rank) => (
              <TouchableOpacity
                key={rank}
                style={[
                  styles.rankButton,
                  selectedRank === rank && styles.rankButtonSelected,
                ]}
                onPress={() => onSelectRank(rank)}
              >
                <Text
                  style={[
                    styles.rankText,
                    selectedRank === rank && styles.rankTextSelected,
                  ]}
                >
                  {rank}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  sectionTitle: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.small,
    color: COLORS.textMuted,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  typesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  typeButton: {
    backgroundColor: COLORS.bgDark,
    borderRadius: RADIUS.small,
    borderWidth: 2,
    borderColor: COLORS.borderWood,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
    width: '31%',
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeButtonSelected: {
    backgroundColor: COLORS.accentRed,
    borderColor: COLORS.accentGold,
  },
  typeText: {
    fontFamily: FONTS.body,
    fontSize: 11,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 14,
  },
  typeTextSelected: {
    color: COLORS.textLight,
    fontWeight: 'bold',
  },
  ranksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  rankButton: {
    backgroundColor: COLORS.bgDark,
    borderRadius: RADIUS.small,
    borderWidth: 2,
    borderColor: COLORS.borderWood,
    padding: SPACING.sm,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
    minWidth: 40,
    alignItems: 'center',
  },
  rankButtonSelected: {
    backgroundColor: COLORS.accentGold,
    borderColor: COLORS.accentGoldDark,
  },
  rankText: {
    fontFamily: FONTS.numbers,
    fontSize: FONT_SIZES.body,
    color: COLORS.textLight,
  },
  rankTextSelected: {
    color: COLORS.textDark,
    fontWeight: 'bold',
  },
});
