import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
} from 'react-native';
import { useGameStore } from '../stores/gameStore';
import { socketService } from '../services/socket';
import {
  GameState,
  CombinationType,
  PlayerStatus,
  COMBINATION_HIERARCHY,
} from '../shared/types';
import type { Combination, Card } from '../shared/types';

const COMBINATION_LABELS: Record<CombinationType, string> = {
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

export const GameScreen: React.FC = () => {
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

  // Debug log
  useEffect(() => {
    console.log('GameScreen mounted, gameState:', gameState?.state);
    return () => {
      console.log('GameScreen unmounted');
    };
  }, []);

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

    const unsubscribeNewRound = socketService.on('NEW_ROUND', (data: { gameState: any }) => {
      setResolutionData(null);
      setGameState(data.gameState);
    });

    const unsubscribeError = socketService.on('ERROR', (data: { message: string }) => {
      Alert.alert('Erreur', data.message);
    });

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
      value: COMBINATION_HIERARCHY[selectedType] * 1000 + (selectedRank ? RANKS.indexOf(selectedRank) : 0),
    };

    socketService.announceCombination(gameId, combination);
    setShowCombinationModal(false);
    setSelectedType(null);
    setSelectedRank('');
  };

  const handleCallLiar = () => {
    console.log('handleCallLiar clicked, gameId:', gameId);
    if (!gameId) {
      console.log('No gameId, returning');
      return;
    }
    console.log('Calling socketService.callLiar with gameId:', gameId);
    socketService.callLiar(gameId);
  };

  const renderPlayer = ({ item }: { item: any }) => {
    const isCurrent = gameState?.currentPlayerId === item.id;
    const isMe = getCurrentPlayer()?.id === item.id;

    return (
      <View
        style={[
          styles.playerCard,
          isCurrent && styles.currentPlayerCard,
          item.status === PlayerStatus.DANGER && styles.dangerCard,
          item.status === PlayerStatus.ELIMINATED && styles.eliminatedCard,
        ]}
      >
        <Text style={styles.playerName}>
          {item.name} {isMe ? '(Vous)' : ''}
          {isCurrent && ' 👆'}
        </Text>
        <Text style={styles.cardCount}>{item.cardCount} carte(s)</Text>
        {item.status === PlayerStatus.DANGER && (
          <Text style={styles.dangerBadge}>⚠️ Danger</Text>
        )}
        {item.status === PlayerStatus.ELIMINATED && (
          <Text style={styles.eliminatedBadge}>❌ Éliminé</Text>
        )}
      </View>
    );
  };

  const currentPlayer = getCurrentPlayer();
  const activePlayers = getActivePlayers();

  if (!gameState) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.title}>Chargement...</Text>
      </View>
    );
  }

  // Écran de résolution
  if (gameState.state === GameState.RESOLUTION && resolutionData) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🎭 Résolution</Text>

        <View style={styles.resolutionContainer}>
          <Text style={styles.announcementText}>
            Annonce : {COMBINATION_LABELS[gameState.lastAnnouncement?.combination.type as CombinationType]}
            {gameState.lastAnnouncement?.combination.rank && ` - ${gameState.lastAnnouncement.combination.rank}`}
          </Text>

          <Text style={styles.resultText}>
            {resolutionData.isLiar
              ? `✅ C'était bien un MENTEUR !`
              : `❌ Ce n'était pas un menteur...`}
          </Text>

          <Text style={styles.loserText}>
            {resolutionData.loserName} perd et pioche une carte
          </Text>

          <View style={styles.cardsContainer}>
            <Text style={styles.cardsTitle}>Cartes révélées :</Text>
            <View style={styles.cardsGrid}>
              {resolutionData.allCards.map((card: Card, index: number) => (
                <View key={index} style={styles.card}>
                  <Text style={styles.cardText}>
                    {card.rank}
                    {card.suit}
                  </Text>
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
      <Text style={styles.title}>🎮 Poker Menteur - Manche {gameState.round}</Text>

      {/* Dernière annonce */}
      {gameState.lastAnnouncement && (
        <View style={styles.announcementBanner}>
          <Text style={styles.announcementLabel}>Dernière annonce :</Text>
          <Text style={styles.announcementValue}>
            {COMBINATION_LABELS[gameState.lastAnnouncement.combination.type]} par{' '}
            {gameState.lastAnnouncement.playerName}
          </Text>
        </View>
      )}

      {/* Liste des joueurs */}
      <FlatList
        data={activePlayers}
        renderItem={renderPlayer}
        keyExtractor={(item) => item.id}
        style={styles.playerList}
        numColumns={2}
      />

      {/* Ma main */}
      {currentPlayer && (
        <View style={styles.myHandContainer}>
          <Text style={styles.myHandTitle}>Votre main :</Text>
          <View style={styles.myCards}>
            {currentPlayer.hand.map((card: Card, index: number) => (
              <View key={index} style={styles.myCard}>
                <Text style={styles.myCardText}>
                  {card.rank}
                  {card.suit}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Actions - uniquement pour le joueur actif */}
      {isCurrentPlayer() && gameState.state === GameState.PLAYING && (
        <View style={styles.actionsContainer}>
          {/* Bouton Annoncer */}
          <TouchableOpacity
            style={[styles.actionButton, styles.announceButton]}
            onPress={() => setShowCombinationModal(true)}
          >
            <Text style={styles.actionButtonText}>📢 Annoncer</Text>
          </TouchableOpacity>

          {/* Bouton Menteur - uniquement si une annonce précédente existe */}
          {gameState.lastAnnouncement && (
            <TouchableOpacity
              style={[styles.actionButton, styles.liarButton]}
              onPress={handleCallLiar}
            >
              <Text style={styles.actionButtonText}>🤥 Menteur !</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Message d'attente pour les autres joueurs */}
      {!isCurrentPlayer() && gameState.state === GameState.PLAYING && (
        <Text style={styles.waitingText}>
          En attente de{' '}
          {activePlayers.find((p) => p.id === gameState.currentPlayerId)?.name}...
        </Text>
      )}

      {/* Modal d'annonce */}
      <Modal
        visible={showCombinationModal}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setShowCombinationModal(false);
          setSelectedType(null);
          setSelectedRank('');
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choisir une combinaison</Text>

            <Text style={styles.sectionTitle}>Type :</Text>
            <View style={styles.combinationTypes}>
              {Object.entries(COMBINATION_LABELS).map(([type, label]) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    selectedType === type && styles.selectedType,
                  ]}
                  onPress={() => setSelectedType(type as CombinationType)}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      selectedType === type && styles.selectedTypeText,
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {selectedType && (
              <>
                <Text style={styles.sectionTitle}>Valeur :</Text>
                <View style={styles.ranksContainer}>
                  {RANKS.map((rank) => (
                    <TouchableOpacity
                      key={rank}
                      style={[
                        styles.rankButton,
                        selectedRank === rank && styles.selectedRank,
                      ]}
                      onPress={() => setSelectedRank(rank)}
                    >
                      <Text
                        style={[
                          styles.rankButtonText,
                          selectedRank === rank && styles.selectedRankText,
                        ]}
                      >
                        {rank}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowCombinationModal(false);
                  setSelectedType(null);
                  setSelectedRank('');
                }}
              >
                <Text style={styles.modalButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleAnnounceCombination}
                disabled={!selectedType || !selectedRank}
              >
                <Text style={styles.modalButtonText}>Confirmer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#1a1a2e',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginVertical: 15,
  },
  announcementBanner: {
    backgroundColor: '#0f3460',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  announcementLabel: {
    color: '#aaa',
    fontSize: 14,
  },
  announcementValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  playerList: {
    flex: 1,
  },
  playerCard: {
    flex: 1,
    backgroundColor: '#16213e',
    padding: 15,
    borderRadius: 10,
    margin: 5,
    alignItems: 'center',
  },
  currentPlayerCard: {
    borderColor: '#e94560',
    borderWidth: 2,
  },
  dangerCard: {
    borderColor: '#ffa500',
    borderWidth: 2,
  },
  eliminatedCard: {
    opacity: 0.5,
    backgroundColor: '#333',
  },
  playerName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  cardCount: {
    color: '#aaa',
    marginTop: 5,
  },
  dangerBadge: {
    color: '#ffa500',
    fontSize: 12,
    marginTop: 5,
  },
  eliminatedBadge: {
    color: '#ff4444',
    fontSize: 12,
    marginTop: 5,
  },
  myHandContainer: {
    backgroundColor: '#16213e',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  myHandTitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  myCards: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  myCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    margin: 5,
    minWidth: 50,
    alignItems: 'center',
  },
  myCardText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  announceButton: {
    backgroundColor: '#4CAF50',
  },
  liarButton: {
    backgroundColor: '#e94560',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  waitingText: {
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#16213e',
    borderRadius: 15,
    padding: 20,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 15,
    marginBottom: 10,
  },
  combinationTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  typeButton: {
    backgroundColor: '#0f3460',
    padding: 10,
    borderRadius: 8,
    margin: 3,
  },
  selectedType: {
    backgroundColor: '#e94560',
  },
  typeButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  selectedTypeText: {
    fontWeight: 'bold',
  },
  ranksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  rankButton: {
    backgroundColor: '#0f3460',
    padding: 10,
    borderRadius: 8,
    margin: 3,
    minWidth: 40,
    alignItems: 'center',
  },
  selectedRank: {
    backgroundColor: '#e94560',
  },
  rankButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  selectedRankText: {
    fontWeight: 'bold',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#666',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resolutionContainer: {
    backgroundColor: '#16213e',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  announcementText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
  },
  loserText: {
    color: '#e94560',
    fontSize: 18,
    marginBottom: 20,
  },
  cardsContainer: {
    width: '100%',
  },
  cardsTitle: {
    color: '#aaa',
    marginBottom: 10,
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    margin: 3,
  },
  cardText: {
    color: '#000',
    fontSize: 14,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
