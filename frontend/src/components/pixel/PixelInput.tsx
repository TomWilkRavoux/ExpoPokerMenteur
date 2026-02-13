/**
 * 📝 Input Pixel Art
 * Champ de texte style rétro
 */

import React from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS, FONTS, FONT_SIZES, RADIUS, SPACING } from '../../styles/pixelTheme';

interface PixelInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  secureTextEntry?: boolean;
  maxLength?: number;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  style?: ViewStyle;
  inputStyle?: TextStyle;
}

export const PixelInput: React.FC<PixelInputProps> = ({
  value,
  onChangeText,
  placeholder,
  label,
  secureTextEntry = false,
  maxLength,
  autoCapitalize = 'sentences',
  style,
  inputStyle,
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={styles.label}>{label}</Text>
      )}
      <View style={styles.inputWrapper}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          secureTextEntry={secureTextEntry}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          style={[styles.input, inputStyle]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.small,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
  },
  inputWrapper: {
    backgroundColor: COLORS.bgDark,
    borderRadius: RADIUS.medium,
    borderWidth: 2,
    borderColor: COLORS.borderWood,
  },
  input: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.body,
    color: COLORS.textLight,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    minHeight: 48,
  },
});
