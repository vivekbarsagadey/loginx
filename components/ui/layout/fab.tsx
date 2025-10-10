import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

export interface FABProps {
  /** Icon or text to display */
  icon: React.ReactNode | string;
  /** Extended label (makes FAB wider with text) */
  label?: string;
  /** Size variant */
  size?: 'small' | 'medium' | 'large';
  /** Position on screen */
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  /** Called when FAB is pressed */
  onPress: () => void;
  /** Disabled state */
  disabled?: boolean;
  /** Accessibility label */
  accessibilityLabel?: string;
}

export function FAB({ icon, label, size = 'medium', position = 'bottom-right', onPress, disabled = false, accessibilityLabel }: FABProps) {
  const primaryColor = useThemeColor({}, 'primary');
  const onPrimaryColor = useThemeColor({}, 'on-primary');
  const shadowColor = useThemeColor({}, 'shadow');

  const sizes = {
    large: 64,
    medium: 56,
    small: 48,
  };

  const fabSize = sizes[size];

  const positions = {
    'bottom-center': { bottom: Spacing.lg, alignSelf: 'center' as const },
    'bottom-left': { bottom: Spacing.lg, left: Spacing.lg },
    'bottom-right': { bottom: Spacing.lg, right: Spacing.lg },
  };

  const dynamicStyles = React.useMemo(
    () =>
      StyleSheet.create({
        fabDynamic: {
          backgroundColor: primaryColor,
          shadowColor,
        },
      }),
    [primaryColor, shadowColor]
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.fab,
        dynamicStyles.fabDynamic,
        label ? styles.extended : {},
        {
          height: fabSize,
          minWidth: label ? undefined : fabSize,
          opacity: disabled ? 0.6 : 1,
        },
        positions[position],
      ]}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || label || 'Floating action button'}
      accessibilityState={{ disabled }}
    >
      {typeof icon === 'string' ? <ThemedText style={[styles.icon, { color: onPrimaryColor }]}>{icon}</ThemedText> : icon}
      {label && (
        <ThemedText type="button" style={[styles.label, { color: onPrimaryColor }]}>
          {label}
        </ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  extended: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  fab: {
    alignItems: 'center',
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    position: 'absolute',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  icon: {
    fontSize: 24,
    fontWeight: '700',
  },
  label: {
    fontWeight: '600',
  },
});
