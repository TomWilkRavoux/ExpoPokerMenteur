/**
 * 🎨 Thème Pixel Art - Poker Menteur
 * Style rétro 8-bit/16-bit western saloon
 * VERSION SIMPLIFIÉE - Fonts système
 */

import { Platform } from 'react-native';

// Palette de couleurs
export const COLORS = {
  // Fonds
  bgDark: '#1a0f0a',
  bgMedium: '#2d1f16',
  bgLight: '#4a3428',
  bgTable: '#2e8b57',
  bgTableDark: '#276749',

  // Accents
  accentRed: '#c41e3a',
  accentRedDark: '#9a1830',
  accentGold: '#ffd700',
  accentGoldDark: '#b8860b',
  accentGreen: '#2e8b57',
  accentGreenDark: '#1a5233',

  // Texte
  textLight: '#f4e4c1',
  textDark: '#2d1f16',
  textMuted: '#8b7355',

  // États
  danger: '#dc2626',
  dangerDark: '#991b1b',
  warning: '#f59e0b',
  success: '#22c55e',
  successDark: '#166534',
  info: '#3b82f6',

  // Cartes
  cardBg: '#f4e4c1',
  cardBorder: '#2d1f16',
  spade: '#2d2d2d',
  heart: '#c41e3a',
  diamond: '#dc2626',
  club: '#1a1a1a',

  // Bordures
  borderWood: '#8b4513',
  borderWoodDark: '#5d2e0c',
};

// Fonts système (fallback qui fonctionne partout)
export const FONTS = {
  title: Platform.select({ 
    ios: 'Courier-Bold', 
    android: 'monospace',
    default: 'monospace'
  }),
  body: Platform.select({ 
    ios: 'Courier', 
    android: 'monospace',
    default: 'monospace'
  }),
  numbers: Platform.select({ 
    ios: 'Courier', 
    android: 'monospace',
    default: 'monospace'
  }),
};

// Tailles de texte
export const FONT_SIZES = {
  title: 22,
  subtitle: 16,
  button: 14,
  body: 16,
  small: 12,
  card: 18,
  tiny: 10,
};

// Ombres pixel (sans blur)
export const SHADOWS = {
  button: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 0,
    elevation: 4,
  },
  buttonPressed: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 0,
    elevation: 0,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 0,
    elevation: 2,
  },
  modal: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 0,
    elevation: 8,
  },
};

// Bordures
export const BORDERS = {
  thin: {
    borderWidth: 1,
    borderColor: COLORS.borderWood,
  },
  thick: {
    borderWidth: 2,
    borderColor: COLORS.borderWood,
  },
  gold: {
    borderWidth: 2,
    borderColor: COLORS.accentGold,
  },
  danger: {
    borderWidth: 2,
    borderColor: COLORS.danger,
  },
};

// Border radius pixel
export const RADIUS = {
  none: 0,
  small: 2,
  medium: 4,
  large: 8,
  card: 4,
  button: 4,
};

// Espacements
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

// Dimensions
export const DIMENSIONS = {
  cardWidth: 42,
  cardHeight: 60,
  buttonHeight: 48,
  buttonWidth: 160,
  inputHeight: 48,
  playerCardWidth: 140,
  playerCardHeight: 80,
  modalWidth: 320,
  iconSize: 24,
  badgeSize: 16,
};

// Styles communs
export const commonStyles = {
  textShadow: {
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  titleShadow: {
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  centerContent: {
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
};
