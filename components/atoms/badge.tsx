import { ThemedText } from '@/components/themed-text';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { StyleSheet, View, type ViewStyle } from 'react-native';

interface BadgeProps {
  /**
   * Text to display in the badge
   */
  label: string;
  /**
   * Visual variant of the badge
   * @default 'primary'
   */
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  /**
   * Size of the badge
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Optional style overrides
   */
  style?: ViewStyle;
  /**
   * Accessibility label for the badge
   */
  accessibilityLabel?: string;
}

/**
 * Badge component for displaying status, counts, or labels.
 * Supports multiple variants and sizes with automatic theme colors.
 *
 * @example
 * <Badge label="New" variant="success" />
 * <Badge label="3" variant="error" size="sm" />
 * <Badge label="Premium" variant="primary" size="lg" />
 */
export function Badge({ label, variant = 'primary', size = 'md', style, accessibilityLabel }: BadgeProps) {
  const themeColors = useThemeColors();

  const variantColors = {
    primary: { bg: themeColors.primary, text: themeColors['on-primary'] },
    success: { bg: themeColors.success, text: themeColors['on-primary'] },
    warning: { bg: themeColors.warning, text: themeColors['on-primary'] },
    _error: { bg: themeColors.error, text: themeColors['on-primary'] },
    info: { bg: themeColors.info, text: themeColors['on-primary'] },
    neutral: { bg: themeColors.surface, text: themeColors.text },
  };

  const sizeStyles = {
    sm: { paddingHorizontal: 6, paddingVertical: 2, fontSize: 10 },
    md: { paddingHorizontal: 8, paddingVertical: 4, fontSize: 12 },
    lg: { paddingHorizontal: 12, paddingVertical: 6, fontSize: 14 },
  };

  const colors = variantColors[variant];
  const sizing = sizeStyles[size];

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: colors.bg,
          paddingHorizontal: sizing.paddingHorizontal,
          paddingVertical: sizing.paddingVertical,
        },
        style,
      ]}
      accessible
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel || label}
    >
      <ThemedText
        style={[
          styles.text,
          {
            color: colors.text,
            fontSize: sizing.fontSize,
          },
        ]}
      >
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
});
