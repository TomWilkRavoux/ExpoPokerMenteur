import React, { useEffect, useState } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

// Écrans Pixel Art
import { LobbyScreenPixel } from './src/screens/LobbyScreenPixel';
import { GameScreenPixel } from './src/screens/GameScreenPixel';
import { GameEndScreenPixel } from './src/screens/GameEndScreenPixel';

import { useGameStore } from './src/stores/gameStore';
import { GameState } from './src/shared/types';
import { COLORS } from './src/styles/pixelTheme';

// Navigation ref pour navigation imperative
export const navigationRef = React.createRef<any>();

// Écran de chargement
function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingIcon}>🎰</Text>
      <Text style={styles.loadingText}>CHARGEMENT...</Text>
      <ActivityIndicator 
        size="large" 
        color={COLORS.accentGold}
        style={styles.spinner}
      />
    </View>
  );
}

// Composant de navigation qui surveille l'état du jeu
function GameNavigator() {
  const gameState = useGameStore((state) => state.gameState);

  useEffect(() => {
    if (!gameState) return;
    if (!navigationRef.current) return;

    console.log('GameNavigator: state changed to', gameState.state);

    switch (gameState.state) {
      case GameState.WAITING:
        navigationRef.current.navigate('Lobby');
        break;
      case GameState.GAME_END:
        navigationRef.current.navigate('GameEnd');
        break;
      case GameState.PLAYING:
      case GameState.INIT_ROUND:
      case GameState.RESOLUTION:
      case GameState.ROUND_END:
        navigationRef.current.navigate('Game');
        break;
    }
  }, [gameState?.state]);

  return null;
}

const Stack = createStackNavigator();

function Navigation() {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="Lobby"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: COLORS.bgDark },
          animationEnabled: false,
        }}
      >
        <Stack.Screen name="Lobby" component={LobbyScreenPixel} />
        <Stack.Screen name="Game" component={GameScreenPixel} />
        <Stack.Screen name="GameEnd" component={GameEndScreenPixel} />
      </Stack.Navigator>
      <GameNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simuler un court chargement pour l'expérience utilisateur
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" />
        <LoadingScreen />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Navigation />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.bgDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 20,
    color: COLORS.accentGold,
    marginBottom: 20,
    fontWeight: 'bold',
    letterSpacing: 2,
    fontFamily: 'monospace',
  },
  spinner: {
    marginTop: 10,
  },
});
