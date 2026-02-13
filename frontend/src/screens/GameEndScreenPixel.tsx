/**
 * 🏆 Game End Screen - Style Pixel Art
 * Écran de fin de partie avec podium
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import { useGameStore } from '../stores/gameStore';
import { PixelButton } from '../components/pixel';
import {
  COLORS,
  FONTS,
  FONT_SIZES,
  SPACING,
  commonStyles,
} from '../styles/pixelTheme';

export const GameEndScreenPixel: React.FC = () => {
  const { gameState, reset } = useGameStore();

  // Animation de confetti simple
  const animatedValue = new Animated.Value(0);
  
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  if (!gameState || gameState.state !== 'GAME_END') {
    return (
      <View style={[styles.container, commonStyles.centerContent]}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  const winner = gameState.players.find((p) => p.isActive);
  const history = gameState.history || [];

  const handleReplay = () => {
    reset();
  };

  const handleQuit = () => {
    reset();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerIcon}>🏆</Text>
        <Text style={styles.headerTitle}>FIN DE PARTIE</Text>
        <Text style={styles.line}>═══════════════════</Text>
      </View>

      {/* Podium du gagnant */}
      {winner && (
        <View style={styles.winnerSection}>
          <Animated.View 
            style={[
              styles.winnerPodium,
              {
                transform: [{
                  scale: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.02],
                  }),
                }],
              },
            ]}
          >
            {/* Couronne */}
            <View style={styles.crownContainer}>
              <Text style={styles.crown}>👑</Text>
            </View>

            {/* Avatar placeholder */}
            <View style={styles.winnerAvatar}>
              <Text style={styles.winnerEmoji}>🎰</Text>
            </View>

            {/* Nom */}
            <Text style={styles.winnerName}>{winner.name}</Text>

            {/* Ligne décorative */}
            <Text style={styles.winnerLine}>━━━━━━━━━━━━━━</Text>

            {/* Texte victoire */}
            <Text style={styles.winnerText}>A GAGNÉ !</Text>

            {/* Confetti ASCII */}
            <View style={styles.confettiContainer}>
              <Text style={styles.confetti}>✨ 🎉 🎊 🎉 ✨</Text>
            </View>
          </Animated.View>
        </View>
      )}

      {/* Statistiques */}
      <View style={styles.statsSection}>
        <View style={styles.statBox}>
          <Text style={styles.statIcon}>🎮</Text>
          <Text style={styles.statValue}>{history.length || 0}</Text>
          <Text style={styles.statLabel}>Manches</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statIcon}>🃏</Text>
          <Text style={styles.statValue}>
            {winner ? winner.cardCount : 0}
          </Text>
          <Text style={styles.statLabel}>Cartes restantes</Text>
        </View>
      </View>

      {/* Historique */}
      <View style={styles.historySection}>
        <View style={styles.historyHeader}>
          <Text style={styles.historyIcon}>📜</Text>
          <Text style={styles.historyTitle}>HISTORIQUE</Text>
        </View>

        <View style={styles.historyList}>
          {history.length === 0 ? (
            <View style={styles.emptyHistory}>
              <Text style={styles.emptyText}>Aucun événement</Text>
            </View>
          ) : (
            history
              .filter((h: any) => h.type === 'ROUND_RESOLVED')
              .map((event: any, index: number) => (
                <View key={index} style={styles.historyItem}>
                  <View style={styles.roundBadgeSmall}>
                    <Text style={styles.roundNumber}>M{index + 1}</Text>
                  </View>
                  <View style={styles.historyContent}>
                    <Text style={styles.historyPlayer}>
                      {event.data?.loserName || 'Joueur'}
                    </Text>
                    <Text style={styles.historyAction}>
                      a pioché une carte
                      {event.data?.eliminated && (
                        <Text style={styles.eliminatedTag}> et été éliminé</Text>
                      )}
                    </Text>
                  </View>
                </View>
              ))
          )}
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <PixelButton
          title="Rejouer"
          onPress={handleReplay}
          variant="gold"
          icon="🔄"
        />
        <View style={styles.spacer} />
        <PixelButton
          title="Quitter"
          onPress={handleQuit}
          variant="secondary"
          icon="🚪"
        />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Merci d'avoir joué ! 🎮</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl * 2,
  },
  header: {
    alignItems: 'center',
    marginTop: SPACING.xxl,
    marginBottom: SPACING.xl,
  },
  headerIcon: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  headerTitle: {
    fontFamily: FONTS.title,
    fontSize: FONT_SIZES.title,
    color: COLORS.accentGold,
    ...commonStyles.titleShadow,
  },
  line: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.body,
    color: COLORS.borderWood,
    marginTop: SPACING.sm,
  },
  loadingText: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.body,
    color: COLORS.textMuted,
  },
  winnerSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  winnerPodium: {
    backgroundColor: COLORS.bgMedium,
    borderRadius: 8,
    padding: SPACING.xl,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.accentGold,
    width: '100%',
    maxWidth: 300,
  },
  crownContainer: {
    marginTop: -40,
    backgroundColor: COLORS.accentGold,
    borderRadius: 20,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
  },
  crown: {
    fontSize: 32,
  },
  winnerAvatar: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.bgDark,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.accentGold,
    marginBottom: SPACING.md,
  },
  winnerEmoji: {
    fontSize: 40,
  },
  winnerName: {
    fontFamily: FONTS.title,
    fontSize: FONT_SIZES.subtitle,
    color: COLORS.accentGold,
    marginBottom: SPACING.xs,
  },
  winnerLine: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.body,
    color: COLORS.borderWood,
    marginVertical: SPACING.xs,
  },
  winnerText: {
    fontFamily: FONTS.title,
    fontSize: FONT_SIZES.subtitle,
    color: COLORS.textLight,
  },
  confettiContainer: {
    marginTop: SPACING.md,
  },
  confetti: {
    fontSize: 20,
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.xl,
  },
  statBox: {
    backgroundColor: COLORS.bgMedium,
    borderRadius: 8,
    padding: SPACING.lg,
    alignItems: 'center',
    minWidth: 120,
    borderWidth: 2,
    borderColor: COLORS.borderWood,
  },
  statIcon: {
    fontSize: 28,
    marginBottom: SPACING.xs,
  },
  statValue: {
    fontFamily: FONTS.numbers,
    fontSize: FONT_SIZES.title,
    color: COLORS.accentGold,
    fontWeight: 'bold',
  },
  statLabel: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.small,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
  historySection: {
    backgroundColor: COLORS.bgMedium,
    borderRadius: 8,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    borderWidth: 2,
    borderColor: COLORS.borderWood,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderWood,
  },
  historyIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  historyTitle: {
    fontFamily: FONTS.title,
    fontSize: FONT_SIZES.subtitle - 4,
    color: COLORS.textLight,
  },
  historyList: {
    maxHeight: 200,
  },
  emptyHistory: {
    alignItems: 'center',
    padding: SPACING.lg,
  },
  emptyText: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.body,
    color: COLORS.textMuted,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgDark,
    borderRadius: 4,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.borderWood,
  },
  roundBadgeSmall: {
    backgroundColor: COLORS.accentRed,
    borderRadius: 4,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    marginRight: SPACING.md,
  },
  roundNumber: {
    fontFamily: FONTS.numbers,
    fontSize: FONT_SIZES.small,
    color: COLORS.textLight,
    fontWeight: 'bold',
  },
  historyContent: {
    flex: 1,
  },
  historyPlayer: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.body,
    color: COLORS.textLight,
    fontWeight: 'bold',
  },
  historyAction: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.small,
    color: COLORS.textMuted,
  },
  eliminatedTag: {
    color: COLORS.danger,
    fontWeight: 'bold',
  },
  actions: {
    marginBottom: SPACING.xl,
  },
  spacer: {
    height: SPACING.md,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.small,
    color: COLORS.textMuted,
  },
});
