/**
 * 🎮 Bouton Pixel Art
 * Style rétro avec effet pressé
 */

import React, { useState } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS, FONTS, FONT_SIZES, SHADOWS, RADIUS, SPACING } from '../../styles/pixelTheme';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'gold' | 'disabled';

interface PixelButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: string;
}

const getVariantColors = (variant: ButtonVariant) => {
  switch (variant) {
    case 'primary':
      return {
        bg: COLORS.accentRed,
        bgActive: COLORS.accentRedDark,
        border: COLORS.borderWood,
        text: COLORS.textLight,
      };
    case 'secondary':
      return {
        bg: COLORS.accentGreen,
        bgActive: COLORS.accentGreenDark,
        border: COLORS.borderWoodDark,
        text: COLORS.textLight,
      };
    case 'danger':
      return {
        bg: COLORS.danger,
        bgActive: COLORS.dangerDark,
        border: COLORS.dangerDark,
        text: COLORS.textLight,
      };
    case 'gold':
      return {
        bg: COLORS.accentGold,
        bgActive: COLORS.accentGoldDark,
        border: COLORS.accentGoldDark,
        text: COLORS.textDark,
      };
    case 'disabled':
      return {
        bg: COLORS.bgLight,
        bgActive: COLORS.bgLight,
        border: COLORS.textMuted,
        text: COLORS.textMuted,
      };
  }
};

export const PixelButton: React.FC<PixelButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  textStyle,
  icon,
}) => {
  const [pressed, setPressed] = useState(false);
  const colors = getVariantColors(disabled ? 'disabled' : variant);

  const handlePressIn = () => {
    if (!disabled) setPressed(true);
  };

  const handlePressOut = () => {
    setPressed(false);
  };

  const displayTitle = icon ? `${icon} ${title}` : title;

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={1}
      style={[
        styles.button,
        {
          backgroundColor: pressed ? colors.bgActive : colors.bg,
          borderColor: colors.border,
          transform: [{ translateY: pressed ? 4 : 0 }],
        },
        pressed ? SHADOWS.buttonPressed : SHADOWS.button,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: colors.text },
          textStyle,
        ]}
      >
        {displayTitle}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.button,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  text: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.button,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  disabled: {
    opacity: 0.6,
  },
});
