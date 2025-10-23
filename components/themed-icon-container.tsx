/**
 * ThemedIconContainer Component
 * Icon with themed background container
 *
 * Features:
 * - Size variants (sm, md, lg, xl)
 * - Shape variants (circle, square, rounded)
 * - Color variants matching design system
 * - Automatic icon sizing based on container
 * - Optional press handler
 *
 * @example
 * ```tsx
 * <ThemedIconContainer icon="check" variant="success" />
 * <ThemedIconContainer icon="alert" variant="error" size="lg" />
 * <ThemedIconContainer icon="info" variant="info" shape="square" />
 * <ThemedIconContainer icon="settings" variant="primary" onPress={handlePress} />
 * ```
 */

import { BorderRadius } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

export interface ThemedIconContainerProps {
  /**
   * Icon name from Feather icons
   */
  icon: string;

  /**
   * Color variant
   * @default 'default'
   */
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'default';

  /**
   * Size variant
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Shape of the container
   * @default 'circle'
   */
  shape?: 'circle' | 'square' | 'rounded';

  /**
   * Optional press handler
   */
  onPress?: () => void;

  /**
   * Accessibility label
   */
  accessibilityLabel?: string;

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;
}

function ThemedIconContainerComponent({ icon, variant = 'default', size = 'md', shape = 'circle', onPress, accessibilityLabel, disabled = false }: ThemedIconContainerProps) {
  const colors = useThemeColors();

  // Size configurations
  const sizeConfig = {
    sm: { container: 32, icon: 16 },
    md: { container: 48, icon: 24 },
    lg: { container: 64, icon: 32 },
    xl: { container: 80, icon: 40 },
  };

  const config = sizeConfig[size];

  // Get variant colors
  const variantColors = {
    success: { bg: colors.success, icon: colors['on-primary'] },
    warning: { bg: colors.warning, icon: colors['on-primary'] },
    _error: { bg: colors.error, icon: colors['on-primary'] },
    info: { bg: colors.info, icon: colors['on-primary'] },
    primary: { bg: colors.primary, icon: colors['on-primary'] },
    default: { bg: colors['surface-variant'], icon: colors.text },
  };

  const colorScheme = variantColors[variant];

  // Get border radius based on shape
  const getBorderRadius = () => {
    switch (shape) {
      case 'circle':
        return config.container / 2;
      case 'square':
        return 0;
      case 'rounded':
        return BorderRadius.md;
      default:
        return config.container / 2;
    }
  };

  const containerStyle = {
    width: config.container,
    height: config.container,
    borderRadius: getBorderRadius(),
    backgroundColor: colorScheme.bg,
    opacity: disabled ? 0.5 : 1,
  };

  const handlePress = async () => {
    if (!disabled && onPress) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress();
    }
  };

  const content = (
    <View style={[styles.container, containerStyle]} accessible={true} accessibilityRole={onPress ? 'button' : 'image'} accessibilityLabel={accessibilityLabel || `${variant} icon`}>
      <Feather name={icon as keyof typeof Feather.glyphMap} size={config.icon} color={colorScheme.icon} />
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        style={({ pressed }) => [styles.pressable, { opacity: pressed ? 0.7 : 1 }]}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled }}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

export const ThemedIconContainer = memo(ThemedIconContainerComponent);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressable: {
    // Pressable wrapper styling
  },
});
