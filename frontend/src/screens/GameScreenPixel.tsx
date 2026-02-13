/**
 * 🎮 Game Screen - Style Pixel Art
 * Table de jeu avec tous les joueurs
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  Dimensions,
} from 'react-native';
import { useGameStore } from '../stores/gameStore';
import { socketService } from '../services/socket';
import {
  GameState,
  CombinationType,
  PlayerStatus,
  COMBINATION_LABELS,
} from '../shared/types';
import type { Combination, Card } from '../shared/types';
import {
  PixelButton,
  PixelCard,
  PlayerCard,
  PixelModal,
  AnnouncementBanner,
  CombinationSelector,
} from '../components/pixel';
import {
  COLORS,
  FONTS,
  FONT_SIZES,
  SPACING,
  commonStyles,
} from '../styles/pixelTheme';

const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

export const GameScreenPixel: React.FC = () => {
  const [showCombinationModal, setShowCombinationModal] = useState(false);
  const [selectedType, setSelectedType] = useState<CombinationType | null>(null);
  const [selectedRank, setSelectedRank] = useState<string>('');
  const [resolutionData, setResolutionData] = useState<any>(null);

  const {
    gameState,
    gameId,
    setGameState,
    isCurrentPlayer,
    getCurrentPlayer,
    getActivePlayers,
  } = useGameStore();

  useEffect(() => {
    const unsubscribeGameState = socketService.on(
      'GAME_STATE_UPDATE',
      (data: any) => {
        setGameState(data);
      }
    );

    const unsubscribeCombination = socketService.on(
      'COMBINATION_ANNOUNCED',
      (data: { gameState: any }) => {
        setGameState(data.gameState);
      }
    );

    const unsubscribeResolution = socketService.on(
      'RESOLUTION_PHASE',
      (data: any) => {
        setResolutionData(data);
        setGameState((prev: any) => ({
          ...prev!,
          state: GameState.RESOLUTION,
        }));
      }
    );

    const unsubscribeRoundResolved = socketService.on(
      'ROUND_RESOLVED',
      (data: { gameState: any }) => {
        setResolutionData(null);
        setGameState(data.gameState);
      }
    );

    const unsubscribeNewRound = socketService.on(
      'NEW_ROUND',
      (data: { gameState: any }) => {
        setResolutionData(null);
        setGameState(data.gameState);
      }
    );

    const unsubscribeError = socketService.on(
      'ERROR',
      (data: { message: string }) => {
        Alert.alert('Erreur', data.message);
      }
    );

    return () => {
      unsubscribeGameState();
      unsubscribeCombination();
      unsubscribeResolution();
      unsubscribeRoundResolved();
      unsubscribeNewRound();
      unsubscribeError();
    };
  }, []);

  const handleAnnounceCombination = () => {
    if (!selectedType || !gameId) return;

    const combination: Combination = {
      type: selectedType,
      rank: selectedRank as any,
      value:
        (Object.values(CombinationType).indexOf(selectedType) + 1) * 1000 +
        (selectedRank ? RANKS.indexOf(selectedRank) : 0),
    };

    socketService.announceCombination(gameId, combination);
    setShowCombinationModal(false);
    setSelectedType(null);
    setSelectedRank('');
  };

  const handleCallLiar = () => {
    if (!gameId) return;
    socketService.callLiar(gameId);
  };

  const currentPlayer = getCurrentPlayer();
  const activePlayers = getActivePlayers();
  const screenWidth = Dimensions.get('window').width;
  const isSmallScreen = screenWidth < 360;

  // Écran de résolution
  if (gameState?.state === GameState.RESOLUTION && resolutionData) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerIcon}>🎭</Text>
          <Text style={styles.headerTitle}>RÉSOLUTION</Text>
        </View>

        <View style={styles.resolutionBox}>
          {/* Annonce */}
          <View style={styles.announcementSection}>
            <Text style={styles.sectionLabel}>📢 Annonce :</Text>
            <View style={styles.announcementValue}>
              <Text style={styles.annText}>
                {gameState.lastAnnouncement?.combination.type}
              </Text>
              {gameState.lastAnnouncement?.combination.rank && (
                <Text style={styles.annRank}>
                  DE {gameState.lastAnnouncement.combination.rank}
                </Text>
              )}
            </View>
          </View>

          {/* Résultat */}
          <View style={styles.resultSection}>
            {resolutionData.isLiar ? (
              <>
                <Text style={styles.resultIcon}>✅</Text>
                <Text style={styles.resultTitle}>MENTEUR TROUVÉ !</Text>
                <Text style={styles.resultDesc}>L'annonce était fausse</Text>
              </>
            ) : (
              <>
                <Text style={styles.resultIcon}>❌</Text>
                <Text style={styles.resultTitle}>PAS MENTEUR</Text>
                <Text style={styles.resultDesc}>L'annonce était vraie</Text>
              </>
            )}
          </View>

          {/* Perdant */}
          <View style={styles.loserSection}>
            <Text style={styles.loserLabel}>Perdant :</Text>
            <Text style={styles.loserName}>{resolutionData.loserName}</Text>
            <Text style={styles.loserPenalty}>pioche une carte</Text>
          </View>

          {/* Cartes révélées */}
          <View style={styles.cardsSection}>
            <Text style={styles.cardsLabel}>🃏 Cartes révélées :</Text>
            <View style={styles.cardsGrid}>
              {resolutionData.allCards?.map((card: Card, index: number) => (
                <View key={index} style={styles.cardWrapper}>
                  <PixelCard card={card} small={isSmallScreen} />
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header avec manche */}
      <View style={styles.header}>
        <View style={styles.roundBadge}>
          <Text style={styles.roundLabel}>MANCHE</Text>
          <Text style={styles.roundNumber}>{gameState?.round || 1}</Text>
        </View>
        <Text style={styles.headerTitle}>🎮 POKER MENTEUR</Text>
      </View>

      {/* Bannière d'annonce */}
      <AnnouncementBanner
        combination={gameState?.lastAnnouncement?.combination || null}
        playerName={gameState?.lastAnnouncement?.playerName}
      />

      {/* Liste des joueurs */}
      <View style={styles.playersSection}>
        <Text style={styles.sectionTitle}>👥 JOUEURS</Text>
        <FlatList
          data={activePlayers}
          renderItem={({ item }) => (
            <PlayerCard
              name={item.name}
              cardCount={item.cardCount}
              isCurrentTurn={gameState?.currentPlayerId === item.id}
              isHost={item.isHost}
              isMe={currentPlayer?.id === item.id}
              status={item.status}
            />
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.playersRow}
          scrollEnabled={true}
          contentContainerStyle={styles.playersList}
        />
      </View>

      {/* Ma main */}
      {currentPlayer && (
        <View style={styles.handSection}>
          <View style={styles.handHeader}>
            <Text style={styles.handTitle}>🎴 VOTRE MAIN</Text>
            <Text style={styles.cardCount}>
              {currentPlayer.hand?.length || 0} cartes
            </Text>
          </View>
          <View style={styles.handCards}>
            {currentPlayer.hand?.map((card: Card, index: number) => (
              <View key={index} style={styles.handCardWrapper}>
                <PixelCard card={card} />
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Actions */}
      {isCurrentPlayer() && gameState?.state === GameState.PLAYING && (
        <View style={styles.actionsSection}>
          <PixelButton
            title="Annoncer"
            onPress={() => setShowCombinationModal(true)}
            variant="primary"
            icon="📢"
          />
          {gameState?.lastAnnouncement && (
            <PixelButton
              title="Menteur !"
              onPress={handleCallLiar}
              variant="danger"
              icon="🤥"
            />
          )}
        </View>
      )}

      {/* En attente */}
      {!isCurrentPlayer() && gameState?.state === GameState.PLAYING && (
        <View style={styles.waitingSection}>
          <Text style={styles.waitingIcon}>⏳</Text>
          <Text style={styles.waitingText}>
            Tour de {' '}
            {activePlayers.find((p) => p.id === gameState.currentPlayerId)?.name}
          </Text>
        </View>
      )}

      {/* Modal de sélection */}
      <PixelModal
        visible={showCombinationModal}
        title="Annoncer"
        onClose={() => {
          setShowCombinationModal(false);
          setSelectedType(null);
          setSelectedRank('');
        }}
      >
        <CombinationSelector
          selectedType={selectedType}
          onSelectType={setSelectedType}
          selectedRank={selectedRank}
          onSelectRank={setSelectedRank}
        />

        <View style={styles.modalButtons}>
          <PixelButton
            title="Annuler"
            onPress={() => {
              setShowCombinationModal(false);
              setSelectedType(null);
              setSelectedRank('');
            }}
            variant="secondary"
          />
          <PixelButton
            title="Confirmer"
            onPress={handleAnnounceCombination}
            variant={selectedType && selectedRank ? 'gold' : 'disabled'}
            disabled={!selectedType || !selectedRank}
          />
        </View>
      </PixelModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
    padding: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    position: 'relative',
  },
  roundBadge: {
    position: 'absolute',
    right: 0,
    backgroundColor: COLORS.bgMedium,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.accentGold,
    padding: SPACING.xs,
    alignItems: 'center',
    minWidth: 50,
  },
  roundLabel: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.tiny,
    color: COLORS.accentGold,
  },
  roundNumber: {
    fontFamily: FONTS.numbers,
    fontSize: FONT_SIZES.subtitle,
    color: COLORS.accentGold,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontFamily: FONTS.title,
    fontSize: FONT_SIZES.subtitle - 4,
    color: COLORS.accentGold,
  },
  playersSection: {
    flex: 1,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.small,
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  playersRow: {
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  playersList: {
    paddingBottom: SPACING.md,
  },
  handSection: {
    backgroundColor: COLORS.bgMedium,
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: COLORS.borderWood,
  },
  handHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  handTitle: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.body,
    color: COLORS.textLight,
    fontWeight: 'bold',
  },
  cardCount: {
    fontFamily: FONTS.numbers,
    fontSize: FONT_SIZES.small,
    color: COLORS.accentGold,
  },
  handCards: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  handCardWrapper: {
    margin: SPACING.xs,
  },
  actionsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: SPACING.md,
  },
  waitingSection: {
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.bgMedium,
    borderRadius: 8,
  },
  waitingIcon: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  waitingText: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.body,
    color: COLORS.textMuted,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.lg,
    gap: SPACING.md,
  },
  // Résolution styles
  resolutionBox: {
    backgroundColor: COLORS.bgMedium,
    borderRadius: 8,
    padding: SPACING.lg,
    borderWidth: 2,
    borderColor: COLORS.accentGold,
  },
  announcementSection: {
    marginBottom: SPACING.md,
  },
  sectionLabel: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.small,
    color: COLORS.textMuted,
    marginBottom: SPACING.xs,
  },
  announcementValue: {
    backgroundColor: COLORS.bgDark,
    borderRadius: 4,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderWood,
  },
  annText: {
    fontFamily: FONTS.title,
    fontSize: FONT_SIZES.body,
    color: COLORS.textLight,
  },
  annRank: {
    fontFamily: FONTS.title,
    fontSize: FONT_SIZES.subtitle,
    color: COLORS.accentGold,
    marginTop: SPACING.xs,
  },
  resultSection: {
    alignItems: 'center',
    marginBottom: SPACING.md,
    padding: SPACING.md,
    backgroundColor: COLORS.bgDark,
    borderRadius: 4,
  },
  resultIcon: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  resultTitle: {
    fontFamily: FONTS.title,
    fontSize: FONT_SIZES.subtitle,
    color: COLORS.accentGold,
    marginBottom: SPACING.xs,
  },
  resultDesc: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.small,
    color: COLORS.textMuted,
  },
  loserSection: {
    alignItems: 'center',
    marginBottom: SPACING.md,
    padding: SPACING.md,
    backgroundColor: 'rgba(196, 30, 58, 0.2)',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.accentRed,
  },
  loserLabel: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.small,
    color: COLORS.textMuted,
  },
  loserName: {
    fontFamily: FONTS.title,
    fontSize: FONT_SIZES.subtitle,
    color: COLORS.accentRed,
    marginVertical: SPACING.xs,
  },
  loserPenalty: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.body,
    color: COLORS.textLight,
  },
  cardsSection: {
    marginTop: SPACING.md,
  },
  cardsLabel: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.small,
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  cardWrapper: {
    margin: SPACING.xs,
  },
});
