import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

export interface Tab {
  /** Tab label */
  label: string;
  /** Tab value/key */
  value: string;
  /** Optional icon */
  icon?: React.ReactNode;
  /** Disabled state */
  disabled?: boolean;
}

export interface TabsProps {
  /** Array of tabs */
  tabs: Tab[];
  /** Currently active tab value */
  value: string;
  /** Called when tab changes */
  onChange: (value: string) => void;
  /** Orientation */
  variant?: 'horizontal' | 'vertical';
  /** Scrollable tabs */
  scrollable?: boolean;
  /** Accessibility label */
  accessibilityLabel?: string;
}

export function Tabs({ tabs, value, onChange, variant = 'horizontal', scrollable = false, accessibilityLabel }: TabsProps) {
  const primaryColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');

  const TabContent = scrollable ? ScrollView : View;

  return (
    <TabContent
      horizontal={variant === 'horizontal' && scrollable}
      showsHorizontalScrollIndicator={false}
      style={[styles.container, variant === 'vertical' ? styles.vertical : styles.horizontal]}
      accessible={true}
      accessibilityLabel={accessibilityLabel || 'Tabs'}
    >
      {tabs.map((tab) => {
        const isActive = tab.value === value;
        return (
          <Pressable
            key={tab.value}
            onPress={() => {
              if (!tab.disabled) {
                onChange(tab.value);
              }
            }}
            disabled={tab.disabled}
            style={[styles.tab, variant === 'vertical' ? styles.tabVertical : styles.tabHorizontal, isActive && { borderBottomColor: primaryColor }, { borderColor }]}
            accessible={true}
            accessibilityRole="tab"
            accessibilityState={{ disabled: tab.disabled, selected: isActive }}
            accessibilityLabel={tab.label}
          >
            {tab.icon && <View style={styles.icon}>{tab.icon}</View>}
            <ThemedText
              style={[
                styles.label,
                {
                  color: isActive ? primaryColor : textColor,
                  opacity: tab.disabled ? 0.4 : 1,
                },
              ]}
            >
              {tab.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </TabContent>
  );
}

const styles = StyleSheet.create({
  container: {
    // Dynamic styles applied inline
  },
  horizontal: {
    flexDirection: 'row',
  },
  icon: {
    marginRight: Spacing.xs,
  },
  label: {
    fontWeight: '500',
  },
  tab: {
    alignItems: 'center',
    borderBottomWidth: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: Spacing.md,
  },
  tabHorizontal: {
    // Tab horizontal specific styles
  },
  tabVertical: {
    borderBottomWidth: 0,
    borderLeftWidth: 2,
  },
  vertical: {
    flexDirection: 'column',
  },
});
