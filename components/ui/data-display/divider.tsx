import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export interface DividerProps {
  /** Orientation of the divider */
  orientation?: 'horizontal' | 'vertical';
  /** Optional text label in the center */
  label?: string;
  /** Thickness of the divider line */
  thickness?: number;
  /** Custom color (overrides theme color) */
  color?: string;
  /** Spacing around the divider */
  spacing?: number;
  /** Accessibility label */
  accessibilityLabel?: string;
}

export function Divider({ orientation = 'horizontal', label, thickness = 1, color, spacing = 16, accessibilityLabel }: DividerProps) {
  const borderColor = useThemeColor({}, 'border');
  const dividerColor = color || borderColor;

  if (label) {
    return (
      <View
        style={[styles.labelContainer, orientation === 'horizontal' ? styles.horizontalLabel : styles.verticalLabel, { marginVertical: orientation === 'horizontal' ? spacing : 0 }]}
        accessible={true}
        accessibilityRole="none"
        accessibilityLabel={accessibilityLabel || `Divider with label: ${label}`}
      >
        <View
          style={[
            styles.line,
            orientation === 'horizontal' ? styles.horizontalLine : styles.verticalLine,
            {
              backgroundColor: dividerColor,
              height: orientation === 'horizontal' ? thickness : undefined,
              width: orientation === 'vertical' ? thickness : undefined,
            },
          ]}
        />
        <ThemedText type="caption" style={styles.labelText}>
          {label}
        </ThemedText>
        <View
          style={[
            styles.line,
            orientation === 'horizontal' ? styles.horizontalLine : styles.verticalLine,
            {
              backgroundColor: dividerColor,
              height: orientation === 'horizontal' ? thickness : undefined,
              width: orientation === 'vertical' ? thickness : undefined,
            },
          ]}
        />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.divider,
        orientation === 'horizontal' ? styles.horizontal : styles.vertical,
        {
          backgroundColor: dividerColor,
          height: orientation === 'horizontal' ? thickness : '100%',
          width: orientation === 'vertical' ? thickness : '100%',
          marginVertical: orientation === 'horizontal' ? spacing : 0,
          marginHorizontal: orientation === 'vertical' ? spacing : 0,
        },
      ]}
      accessible={true}
      accessibilityRole="none"
      accessibilityLabel={accessibilityLabel || 'Divider'}
    />
  );
}

const styles = StyleSheet.create({
  divider: {
    // Dynamic styles applied inline
  },
  horizontal: {
    alignSelf: 'stretch',
  },
  vertical: {
    height: '100%',
  },
  labelContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
  },
  horizontalLabel: {
    alignSelf: 'stretch',
  },
  verticalLabel: {
    flexDirection: 'column',
    height: '100%',
  },
  horizontalLine: {
    height: 1,
  },
  labelText: {
    paddingHorizontal: 8,
  },
  line: {
    flex: 1,
  },
  verticalLine: {
    width: 1,
  },
});
