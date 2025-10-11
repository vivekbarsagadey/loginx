import { ThemedText } from '@/components/themed-text';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface QuickActionProps {
  icon: React.ComponentProps<typeof Feather>['name'];
  title: string;
  description: string;
  onPress: () => void;
  disabled?: boolean;
}

/**
 * QuickAction molecule - Reusable action card with icon, title, description, and chevron
 * Used for navigational actions in help screens, settings, and more
 */
export function QuickAction({ icon, title, description, onPress, disabled = false }: QuickActionProps) {
  const colors = useThemeColors();

  const activeIconColor = disabled ? colors['text-muted'] : colors.primary;

  return (
    <TouchableOpacity
      style={[styles.container, { borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={description}
      disabled={disabled}
    >
      <View style={styles.iconContainer}>
        <Feather name={icon} size={24} color={activeIconColor} />
      </View>
      <View style={styles.content}>
        <ThemedText type="h3" style={styles.title}>
          {title}
        </ThemedText>
        <ThemedText style={styles.description}>{description}</ThemedText>
      </View>
      <Feather name="chevron-right" size={20} color={activeIconColor} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    gap: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    marginBottom: 2,
    fontWeight: '600',
  },
  description: {
    fontSize: 13,
    opacity: 0.7,
  },
});
