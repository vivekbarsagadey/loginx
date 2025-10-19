/**
 * Flow Header Component
 * 
 * Optional header for flows with title and close button
 */

import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/hooks/use-theme-colors';

interface FlowHeaderProps {
  title: string;
  onClose: () => void;
  style?: ViewStyle;
}

export function FlowHeader({ title, onClose, style }: FlowHeaderProps) {
  const colors = useThemeColors();

  return (
    <ThemedView style={[styles.container, style]}>
      <ThemedText type="title" style={styles.title}>
        {title}
      </ThemedText>
      <TouchableOpacity onPress={onClose} style={styles.closeButton} accessibilityLabel="Close flow" accessibilityRole="button">
        <Ionicons name="close" size={24} color={colors.text} />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    flex: 1,
  },
  closeButton: {
    padding: 8,
  },
});
