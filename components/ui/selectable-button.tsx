import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BorderRadius, BorderWidth, FontWeight, Spacing, Typography } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Feather } from '@expo/vector-icons';
import type { ComponentProps, ReactNode } from 'react';
import { Pressable, StyleSheet } from 'react-native';

interface SelectableButtonProps {
  /** Button label text */
  label: string;
  /** Optional description text */
  description?: string;
  /** Icon name from Feather icons */
  icon?: ComponentProps<typeof Feather>['name'];
  /** Whether the button is selected */
  isSelected: boolean;
  /** Press handler */
  onPress: () => void;
  /** Layout variant */
  variant?: 'compact' | 'default' | 'large';
  /** Icon size */
  iconSize?: number;
  /** Custom style */
  style?: object;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Custom content to render instead of icon */
  customIcon?: ReactNode;
}

/**
 * Reusable SelectableButton component
 * Unifies CategoryButton, OptionButton, IssueTypeButton patterns
 * Used across feedback, rating, and issue reporting screens
 */
export function SelectableButton({ label, description, icon, isSelected, onPress, variant = 'default', iconSize = 24, style, accessibilityLabel, customIcon }: SelectableButtonProps) {
  const borderColor = useThemeColor({}, 'border');
  const primaryColor = useThemeColor({}, 'primary');
  const surfaceColor = useThemeColor({}, 'surface');
  const textMutedColor = useThemeColor({}, 'text-muted');

  const isCompact = variant === 'compact';
  const isLarge = variant === 'large';

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        isCompact && styles.compactButton,
        isLarge && styles.largeButton,
        {
          borderColor: isSelected ? primaryColor : borderColor,
          backgroundColor: isSelected ? `${primaryColor}15` : surfaceColor,
        },
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={accessibilityLabel || label}
    >
      {/* Icon or Custom Icon */}
      {(icon || customIcon) && <ThemedView style={styles.iconContainer}>{customIcon || (icon && <Feather name={icon} size={iconSize} color={isSelected ? primaryColor : borderColor} />)}</ThemedView>}

      {/* Content */}
      <ThemedView style={styles.content}>
        <ThemedText
          style={[
            styles.label,
            isCompact && styles.compactLabel,
            {
              color: isSelected ? primaryColor : undefined,
            },
          ]}
        >
          {label}
        </ThemedText>
        {description && (
          <ThemedText
            style={[
              styles.description,
              {
                color: isSelected ? primaryColor : textMutedColor,
              },
            ]}
          >
            {description}
          </ThemedText>
        )}
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: BorderWidth.thick,
    gap: Spacing.sm,
  },
  compactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 20,
    borderWidth: 1.5,
    gap: Spacing.xs,
  },
  largeButton: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: Spacing.xs,
  },
  label: {
    fontSize: Typography.body.fontSize,
    fontWeight: FontWeight.semibold,
  },
  compactLabel: {
    fontSize: Typography.bodySmall.fontSize,
    fontWeight: FontWeight.medium,
  },
  description: {
    fontSize: Typography.caption.fontSize + 1,
    opacity: 0.8,
  },
});
