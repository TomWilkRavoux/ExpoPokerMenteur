import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import { useGameStore } from '../stores/gameStore';
import { socketService } from '../services/socket';
import { GameState, PlayerStatus } from '../shared/types';

export const LobbyScreen: React.FC = () => {
  const [playerName, setPlayerName] = useState('');
  const [gameIdInput, setGameIdInput] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const {
    gameState,
    gameId,
    playerId,
    setGameState,
    setGameId,
    setPlayerId,
    setError,
    isHost,
    canStartGame,
    getActivePlayers,
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
      Alert.alert('Erreur', 'Veuillez entrer l\'ID de la partie');
      return;
    }
    socketService.joinGame(gameIdInput.trim(), playerName.trim());
  };

  const handleStartGame = () => {
    if (gameId) {
      socketService.startGame(gameId);
    }
  };

  const renderPlayer = ({ item }: { item: any }) => (
    <View style={styles.playerItem}>
      <Text style={styles.playerName}>
        {item.name} {item.id === playerId ? '(Vous)' : ''}
        {item.isHost ? ' 👑' : ''}
      </Text>
    </View>
  );

  // Écran de création/rejoindre
  if (!gameState || gameState.state === GameState.WAITING) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🎮 Poker Menteur</Text>

        {!isJoining ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Votre nom"
              value={playerName}
              onChangeText={setPlayerName}
              maxLength={20}
            />

            <TouchableOpacity style={styles.button} onPress={handleCreateGame}>
              <Text style={styles.buttonText}>Créer une partie</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() => setIsJoining(true)}
            >
              <Text style={styles.buttonText}>Rejoindre une partie</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Votre nom"
              value={playerName}
              onChangeText={setPlayerName}
              maxLength={20}
            />
            <TextInput
              style={styles.input}
              placeholder="ID de la partie"
              value={gameIdInput}
              onChangeText={setGameIdInput}
              autoCapitalize="none"
            />

            <TouchableOpacity style={styles.button} onPress={handleJoinGame}>
              <Text style={styles.buttonText}>Rejoindre</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={() => setIsJoining(false)}
            >
              <Text style={styles.buttonText}>Retour</Text>
            </TouchableOpacity>
          </>
        )}

        {gameState && (
          <View style={styles.lobbyContainer}>
            <Text style={styles.lobbyTitle}>Lobby - {gameId}</Text>
            <Text style={styles.infoText}>
              Deck : 52 cartes
              {gameState.config.excludedRanks.length > 0 && (
                <>
                  {'\n'}Cartes actives : 7 → As
                </>
              )}
            </Text>

            <FlatList
              data={gameState.players}
              renderItem={renderPlayer}
              keyExtractor={(item) => item.id}
              style={styles.playerList}
            />

            {isHost() && (
              <TouchableOpacity
                style={[
                  styles.button,
                  !canStartGame() && styles.disabledButton,
                ]}
                onPress={handleStartGame}
                disabled={!canStartGame()}
              >
                <Text style={styles.buttonText}>
                  Lancer la partie ({gameState.players.length} joueurs)
                </Text>
              </TouchableOpacity>
            )}

            {!isHost() && (
              <Text style={styles.waitingText}>
                En attente de l'hôte pour lancer la partie...
              </Text>
            )}
          </View>
        )}
      </View>
    );
  }

  // Écran de transition quand le jeu démarre
  return (
    <View style={[styles.container, styles.centerContent]}>
      <Text style={styles.title}>🎮 Démarrage...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1a1a2e',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginVertical: 30,
  },
  input: {
    backgroundColor: '#16213e',
    color: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#e94560',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  secondaryButton: {
    backgroundColor: '#0f3460',
  },
  disabledButton: {
    backgroundColor: '#666',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  lobbyContainer: {
    flex: 1,
    marginTop: 20,
    backgroundColor: '#16213e',
    borderRadius: 15,
    padding: 20,
  },
  lobbyTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    color: '#aaa',
    marginBottom: 15,
  },
  playerList: {
    flex: 1,
  },
  playerItem: {
    backgroundColor: '#0f3460',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  playerName: {
    color: '#fff',
    fontSize: 16,
  },
  waitingText: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 10,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
