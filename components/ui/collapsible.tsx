import { PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import * as Haptics from 'expo-haptics';

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useColorScheme() ?? 'light';

  const handleToggle = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsOpen((value) => !value);
  };

  return (
    <ThemedView>
      <TouchableOpacity
        style={styles.heading}
        onPress={handleToggle}
        activeOpacity={0.7}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`${isOpen ? 'Collapse' : 'Expand'} ${title}`}
        accessibilityState={{ expanded: isOpen }}
      >
        <IconSymbol name="chevron.right" size={18} weight="medium" color={theme === 'light' ? Colors.light.icon : Colors.dark.icon} style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }} />

        <ThemedText type="h3">{title}</ThemedText>
      </TouchableOpacity>
      {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 44,
    paddingVertical: 8,
  },
  content: {
    marginTop: 8,
    marginLeft: 26,
  },
});
