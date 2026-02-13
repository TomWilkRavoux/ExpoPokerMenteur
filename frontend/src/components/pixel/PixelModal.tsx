/**
 * 🪟 Modale Pixel Art
 * Fenêtre modale avec cadre décoratif
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { COLORS, FONTS, FONT_SIZES, SHADOWS, RADIUS, SPACING } from '../../styles/pixelTheme';

interface PixelModalProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  style?: ViewStyle;
}

export const PixelModal: React.FC<PixelModalProps> = ({
  visible,
  title,
  onClose,
  children,
  style,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, SHADOWS.modal, style]}>
          {/* Coins décoratifs */}
          <Text style={[styles.corner, styles.cornerTL]}>╔</Text>
          <Text style={[styles.corner, styles.cornerTR]}>╗</Text>
          <Text style={[styles.corner, styles.cornerBL]}>╚</Text>
          <Text style={[styles.corner, styles.cornerBR]}>╝</Text>

          {/* Titre */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.titleLine}>
              <Text style={styles.lineText}>══════════════════</Text>
            </View>
          </View>

          {/* Contenu */}
          <View style={styles.content}>
            {children}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  container: {
    backgroundColor: COLORS.bgMedium,
    borderRadius: RADIUS.medium,
    borderWidth: 2,
    borderColor: COLORS.borderWood,
    padding: SPACING.xl,
    width: '100%',
    maxWidth: 340,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.body,
    color: COLORS.accentGold,
  },
  cornerTL: { top: 4, left: 8 },
  cornerTR: { top: 4, right: 8 },
  cornerBL: { bottom: 4, left: 8 },
  cornerBR: { bottom: 4, right: 8 },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontFamily: FONTS.title,
    fontSize: FONT_SIZES.subtitle,
    color: COLORS.accentGold,
    textAlign: 'center',
  },
  titleLine: {
    marginTop: SPACING.xs,
  },
  lineText: {
    fontFamily: FONTS.body,
    fontSize: FONT_SIZES.small,
    color: COLORS.borderWood,
  },
  content: {
    width: '100%',
  },
});
