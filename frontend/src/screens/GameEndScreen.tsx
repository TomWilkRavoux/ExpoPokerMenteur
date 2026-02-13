import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import { useGameStore } from '../stores/gameStore';

export const GameEndScreen: React.FC = () => {
  const { gameState, reset } = useGameStore();

  if (!gameState || gameState.state !== 'GAME_END') {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.title}>Chargement...</Text>
      </View>
    );
  }

  const winner = gameState.players.find((p) => p.isActive);
  const eliminations = gameState.history.filter((h) => h.type === 'ROUND_RESOLVED');

  const handleReplay = () => {
    reset();
  };

  const handleQuit = () => {
    reset();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏆 Fin de partie</Text>

      {winner && (
        <View style={styles.winnerContainer}>
          <Text style={styles.winnerEmoji}>👑</Text>
          <Text style={styles.winnerName}>{winner.name}</Text>
          <Text style={styles.winnerText}>a gagné la partie !</Text>
        </View>
      )}

      <ScrollView style={styles.historyContainer}>
        <Text style={styles.historyTitle}>📜 Historique</Text>

        {eliminations.map((event, index) => (
          <View key={index} style={styles.historyItem}>
            <Text style={styles.historyText}>
              Manche {event.data.round || index + 1}: {event.data.loserName} a pioché
              {event.data.eliminated && ' et a été éliminé'}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.button} onPress={handleReplay}>
          <Text style={styles.buttonText}>🔄 Rejouer</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.quitButton]} onPress={handleQuit}>
          <Text style={styles.buttonText}>🚪 Quitter</Text>
        </TouchableOpacity>
      </View>
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
    marginVertical: 20,
  },
  winnerContainer: {
    backgroundColor: '#16213e',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
    borderColor: '#ffd700',
    borderWidth: 3,
  },
  winnerEmoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  winnerName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffd700',
  },
  winnerText: {
    fontSize: 18,
    color: '#fff',
    marginTop: 5,
  },
  historyContainer: {
    flex: 1,
    backgroundColor: '#16213e',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  historyTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  historyItem: {
    backgroundColor: '#0f3460',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  historyText: {
    color: '#ccc',
    fontSize: 14,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  quitButton: {
    backgroundColor: '#e94560',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
