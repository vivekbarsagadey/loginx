import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Feather } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface QuickActionCardProps {
  /** Icon name from Feather icons */
  icon: ComponentProps<typeof Feather>['name'];
  /** Action title */
  title: string;
  /** Action description */
  description: string;
  /** Press handler */
  onPress: () => void;
  /** Custom style */
  style?: object;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Accessibility hint */
  accessibilityHint?: string;
}

/**
 * Reusable QuickActionCard component
 * Displays an action card with icon, title, description, and chevron
 * Extracted from help.tsx for reuse across screens
 */
export function QuickActionCard({ icon, title, description, onPress, style, accessibilityLabel, accessibilityHint }: QuickActionCardProps) {
  const borderColor = useThemeColor({}, 'border');
  const iconColor = useThemeColor({}, 'primary');

  return (
    <TouchableOpacity
      style={[styles.quickAction, { borderColor }, style]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint || description}
    >
      <View style={styles.quickActionIcon}>
        <Feather name={icon} size={24} color={iconColor} />
      </View>
      <View style={styles.quickActionContent}>
        <ThemedText type="h3" style={styles.quickActionTitle}>
          {title}
        </ThemedText>
        <ThemedText style={styles.quickActionDescription}>{description}</ThemedText>
      </View>
      <Feather name="chevron-right" size={20} color={iconColor} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    gap: 16,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    marginBottom: 2,
    fontWeight: '600',
  },
  quickActionDescription: {
    fontSize: 13,
    opacity: 0.7,
  },
});
