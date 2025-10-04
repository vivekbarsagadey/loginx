import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import React, { useState } from 'react';
import { LayoutAnimation, Pressable, StyleSheet, View } from 'react-native';

export interface AccordionProps {
  /** Accordion title */
  title: string;
  /** Accordion content */
  children: React.ReactNode;
  /** Initially expanded state */
  defaultExpanded?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Accessibility label */
  accessibilityLabel?: string;
}

export function Accordion({ title, children, defaultExpanded = false, disabled = false, accessibilityLabel }: AccordionProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');

  const handlePress = () => {
    if (!disabled) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setExpanded(!expanded);
    }
  };

  return (
    <View style={[styles.container, { borderColor }]}>
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        style={styles.header}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || title}
        accessibilityState={{ disabled, expanded }}
      >
        <ThemedText type="bodyBold" style={[styles.title, { color: textColor, opacity: disabled ? 0.4 : 1 }]}>
          {title}
        </ThemedText>
        <ThemedText style={[styles.icon, { color: textColor, opacity: disabled ? 0.4 : 1 }]}>{expanded ? '−' : '+'}</ThemedText>
      </Pressable>

      {expanded && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  content: {
    padding: Spacing.md,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  icon: {
    fontSize: 20,
    fontWeight: '700',
  },
  title: {
    flex: 1,
  },
});
