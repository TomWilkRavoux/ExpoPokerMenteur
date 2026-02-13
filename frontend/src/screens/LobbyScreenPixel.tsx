/**
 * 🎮 Lobby Screen - Style Pixel Art
 * SOLUTION : Scroll natif du navigateur, pas de ScrollView RN
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useGameStore } from '../stores/gameStore';
import { socketService } from '../services/socket';
import { GameState } from '../shared/types';
import { PixelButton, PixelInput } from '../components/pixel';
import {
  COLORS,
  FONTS,
  FONT_SIZES,
  SPACING,
  commonStyles,
} from '../styles/pixelTheme';

// Wrapper pour web qui utilise des divs natives
const WebScrollContainer: React.FC<{children: React.ReactNode}> = ({ children }) => {
  if (Platform.OS === 'web') {
    return (
      <div 
        style={{
          height: '100vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
          backgroundColor: COLORS.bgDark,
        }}
      >
        <div style={{ padding: '20px', paddingBottom: '200px', minHeight: '100vh' }}>
          {children}
        </div>
      </div>
    );
  }
  // Fallback mobile
  return (
    <View style={{ flex: 1 }}>
      {children}
    </View>
  );
};

export const LobbyScreenPixel: React.FC = () => {
  const [playerName, setPlayerName] = useState('');
  const [gameIdInput, setGameIdInput] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [copied, setCopied] = useState(false);

  const {
    gameState,
    gameId,
    playerId,
    setGameState,
    setGameId,
    setPlayerId,
    setError,
    reset,
    isHost,
    canStartGame,
  } = useGameStore();

  useEffect(() => {
    socketService.connect();

    const unsubscribeGameCreated = socketService.on(
      'GAME_CREATED',
      (data: { gameId: string; playerId: string; gameState: any }) => {
        setGameId(data.gameId);
        setPlayerId(data.playerId);
        setGameState(data.gameState);
      }
    );

    const unsubscribeGameJoined = socketService.on(
      'GAME_JOINED',
      (data: { gameId: string; playerId: string; gameState: any }) => {
        setGameId(data.gameId);
        setPlayerId(data.playerId);
        setGameState(data.gameState);
      }
    );

    const unsubscribePlayerJoined = socketService.on(
      'PLAYER_JOINED',
      (data: { gameState: any }) => {
        setGameState(data.gameState);
      }
    );

    const unsubscribeGameStarted = socketService.on(
      'GAME_STARTED',
      (data: { gameState: any }) => {
        setGameState(data.gameState);
      }
    );

    const unsubscribeError = socketService.on('ERROR', (data: { message: string }) => {
      setError(data.message);
      Alert.alert('Erreur', data.message);
    });

    return () => {
      unsubscribeGameCreated();
      unsubscribeGameJoined();
      unsubscribePlayerJoined();
      unsubscribeGameStarted();
      unsubscribeError();
    };
  }, []);

  const handleCreateGame = () => {
    if (!playerName.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer votre nom');
      return;
    }
    socketService.createGame(playerName.trim());
  };

  const handleJoinGame = () => {
    if (!playerName.trim()) {
      Alert.alert('Erreur', 'Veuillez entrer votre nom');
      return;
    }
    if (!gameIdInput.trim()) {
      Alert.alert('Erreur', "Veuillez entrer l'ID de la partie");
      return;
    }
    socketService.joinGame(gameIdInput.trim(), playerName.trim());
  };

  const handleStartGame = () => {
    if (gameId) {
      socketService.startGame(gameId);
    }
  };

  const handleCopyGameId = async () => {
    if (!gameId) return;
    try {
      await navigator.clipboard.writeText(gameId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      Alert.alert('ID copié !', gameId);
    } catch (err) {
      Alert.alert('ID', gameId);
    }
  };

  const handleLeaveLobby = () => {
    Alert.alert('Quitter ?', 'Quitter cette partie ?', [
      { text: 'Annuler', style: 'cancel' },
      { 
        text: 'Quitter', 
        style: 'destructive',
        onPress: () => {
          socketService.disconnect();
          reset();
          setPlayerName('');
          setGameIdInput('');
          setIsJoining(false);
        }
      },
    ]);
  };

  const handleCloseRoom = () => {
    Alert.alert('Fermer ?', 'Fermer cette salle ?', [
      { text: 'Annuler', style: 'cancel' },
      { 
        text: 'Fermer', 
        style: 'destructive',
        onPress: () => {
          socketService.disconnect();
          reset();
          setPlayerName('');
          setGameIdInput('');
          setIsJoining(false);
        }
      },
    ]);
  };

  // ÉCRAN FORMULAIRE
  if (!gameState) {
    return (
      <WebScrollContainer>
        <View style={styles.header}>
          <Text style={styles.titleIcon}>🎰</Text>
          <Text style={styles.title}>POKER</Text>
          <Text style={styles.title}>MENTEUR</Text>
        </View>

        <PixelInput
          value={playerName}
          onChangeText={setPlayerName}
          placeholder="Votre nom"
          label="Pseudo"
          maxLength={20}
        />

        {!isJoining ? (
          <>
            <PixelButton
              title="Créer une partie"
              onPress={handleCreateGame}
              variant="primary"
              icon="🎮"
            />
            <View style={styles.orContainer}>
              <Text style={styles.orText}>─── ou ───</Text>
            </View>
            <PixelButton
              title="Rejoindre une partie"
              onPress={() => setIsJoining(true)}
              variant="secondary"
              icon="🔗"
            />
          </>
        ) : (
          <>
            <PixelInput
              value={gameIdInput}
              onChangeText={setGameIdInput}
              placeholder="ID de la partie"
              label="Code partie"
              autoCapitalize="none"
            />
            <PixelButton
              title="Rejoindre"
              onPress={handleJoinGame}
              variant="gold"
              icon="🎯"
            />
            <PixelButton
              title="Retour"
              onPress={() => setIsJoining(false)}
              variant="secondary"
            />
          </>
        )}
        <View style={{ height: 50 }} />
      </WebScrollContainer>
    );
  }

  // ÉCRAN LOBBY
  if (gameState.state === GameState.WAITING) {
    const host = isHost();
    
    return (
      <>
        {/* CONTENU SCROLLABLE */}
        <WebScrollContainer>
          <View style={styles.header}>
            <Text style={styles.titleIcon}>🎰</Text>
            <Text style={styles.title}>POKER</Text>
            <Text style={styles.title}>MENTEUR</Text>
          </View>

          <View style={styles.lobbyBox}>
            <View style={styles.lobbyHeader}>
              <Text style={styles.lobbyTitle}>🎮 LOBBY</Text>
              <Text style={styles.playerCount}>{gameState.players.length}/5</Text>
            </View>

            <TouchableOpacity style={styles.idBox} onPress={handleCopyGameId}>
              <Text style={styles.idLabel}>🔗 ID DE PARTIE</Text>
              <Text style={styles.idValue}>{gameId}</Text>
              <Text style={styles.idHint}>{copied ? '✓ Copié !' : 'Touchez pour copier'}</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>Joueurs :</Text>
            
            {gameState.players.map((item: any) => (
              <View key={item.id} style={styles.playerRow}>
                <Text style={styles.playerText}>
                  {item.isHost ? '👑 ' : ''}{item.name}{item.id === playerId ? ' (Vous)' : ''}
                </Text>
              </View>
            ))}
          </View>

          {/* Espace pour les boutons */}
          <View style={{ height: 180 }} />
        </WebScrollContainer>

        {/* BARRE DE BOUTONS - FIXE SANS POSITION ABSOLUTE */}
        {Platform.OS === 'web' ? (
          <div style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: COLORS.bgDark,
            padding: '15px 20px',
            borderTop: `2px solid ${COLORS.borderWood}`,
            zIndex: 1000,
          }}>
            {host ? (
              <>
                <button
                  onClick={handleStartGame}
                  disabled={!canStartGame()}
                  style={{
                    width: '100%',
                    padding: '15px',
                    backgroundColor: canStartGame() ? COLORS.accentGold : '#666',
                    color: canStartGame() ? COLORS.textDark : '#999',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: canStartGame() ? 'pointer' : 'not-allowed',
                    marginBottom: '10px',
                  }}
                >
                  ⚡ LANCER ({gameState.players.length})
                </button>
                <button
                  onClick={handleCloseRoom}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: COLORS.danger,
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  🚪 Fermer la salle
                </button>
              </>
            ) : (
              <>
                <div style={{
                  backgroundColor: COLORS.bgMedium,
                  padding: '15px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  color: COLORS.textMuted,
                  marginBottom: '10px',
                }}>
                  ⏳ En attente de l'hôte...
                </div>
                <button
                  onClick={handleLeaveLobby}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: COLORS.accentGreen,
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    cursor: 'pointer',
                  }}
                >
                  🚪 Quitter
                </button>
              </>
            )}
          </div>
        ) : (
          // Mobile : View normale
          <View style={styles.bottomBar}>
            {host ? (
              <>
                <PixelButton
                  title={`⚡ LANCER (${gameState.players.length})`}
                  onPress={handleStartGame}
                  variant={canStartGame() ? 'gold' : 'disabled'}
                  disabled={!canStartGame()}
                />
                <View style={{ height: 10 }} />
                <PixelButton
                  title="🚪 Fermer"
                  onPress={handleCloseRoom}
                  variant="danger"
                />
              </>
            ) : (
              <>
                <View style={styles.waitingBox}>
                  <Text style={styles.waitingText}>⏳ En attente...</Text>
                </View>
                <View style={{ height: 10 }} />
                <PixelButton
                  title="🚪 Quitter"
                  onPress={handleLeaveLobby}
                  variant="secondary"
                />
              </>
            )}
          </View>
        )}
      </>
    );
  }

  // Loading
  return (
    <View style={[styles.container, commonStyles.centerContent]}>
      <Text style={styles.titleIcon}>🎰</Text>
      <Text style={styles.loadingText}>Chargement...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  titleIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  title: {
    fontFamily: FONTS.title,
    fontSize: 24,
    color: COLORS.accentGold,
  },
  orContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  orText: {
    color: COLORS.textMuted,
  },
  
  lobbyBox: {
    backgroundColor: COLORS.bgMedium,
    borderRadius: 8,
    padding: 20,
    borderWidth: 2,
    borderColor: COLORS.borderWood,
  },
  lobbyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderWood,
  },
  lobbyTitle: {
    fontFamily: FONTS.title,
    fontSize: 16,
    color: COLORS.textLight,
  },
  playerCount: {
    color: COLORS.accentGold,
    borderWidth: 1,
    borderColor: COLORS.accentGold,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  
  idBox: {
    backgroundColor: COLORS.bgDark,
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: COLORS.accentGold,
    borderStyle: 'dashed' as const,
  },
  idLabel: {
    color: COLORS.accentGold,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  idValue: {
    color: COLORS.textLight,
    fontSize: 13,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 10,
    borderRadius: 4,
    textAlign: 'center',
  },
  idHint: {
    color: COLORS.textMuted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 8,
  },
  
  sectionTitle: {
    color: COLORS.textLight,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  playerRow: {
    backgroundColor: COLORS.bgDark,
    padding: 12,
    borderRadius: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.borderWood,
  },
  playerText: {
    color: COLORS.textLight,
  },
  
  bottomBar: {
    backgroundColor: COLORS.bgDark,
    padding: 20,
    paddingTop: 15,
    borderTopWidth: 2,
    borderTopColor: COLORS.borderWood,
  },
  waitingBox: {
    backgroundColor: COLORS.bgMedium,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderWood,
  },
  waitingText: {
    color: COLORS.textMuted,
  },
  
  loadingText: {
    color: COLORS.textLight,
    marginTop: 20,
    fontSize: 18,
  },
});
