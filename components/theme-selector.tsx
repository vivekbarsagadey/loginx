import { Spacing, Typography } from '@/constants/layout';
import { gap, padding, rounded } from '@/constants/style-utils';
import { getAllThemes } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { type ThemePreference, useThemeContext } from '@/hooks/use-theme-context';
import i18n from '@/i18n';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

export const ThemeSelector = () => {
  const { themePreference, setThemePreference } = useThemeContext();
  const primaryColor = useThemeColor({}, 'primary');
  const onPrimaryColor = useThemeColor({}, 'on-primary');
  const surfaceColor = useThemeColor({}, 'surface');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');

  // Get all available themes
  const themes = [{ name: 'system', displayName: 'System', icon: '📱' }, ...getAllThemes()];

  const dynamicStyles = React.useMemo(
    () =>
      StyleSheet.create({
        containerBorder: {
          borderColor: borderColor,
        },
        chipActive: {
          backgroundColor: primaryColor,
        },
        chipInactive: {
          backgroundColor: surfaceColor,
        },
        textActive: {
          color: onPrimaryColor,
          fontWeight: '600',
        },
        textInactive: {
          color: textColor,
          fontWeight: '600',
        },
      }),
    [borderColor, primaryColor, surfaceColor, onPrimaryColor, textColor]
  );

  const handleThemeSelect = async (themeName: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setThemePreference(themeName as ThemePreference);
  };

  return (
    <ThemedView>
      <ThemedText style={styles.label}>{i18n.t('onb.personalize.theme')}</ThemedText>
      <ThemedView style={[styles.container, dynamicStyles.containerBorder]}>
        {themes.map((theme) => (
          <Pressable
            key={theme.name}
            style={({ pressed }) => [styles.chip, themePreference === theme.name ? dynamicStyles.chipActive : dynamicStyles.chipInactive, pressed && styles.chipPressed]}
            onPress={() => handleThemeSelect(theme.name)}
            accessibilityRole="button"
            accessibilityLabel={`Select ${theme.displayName} theme`}
            accessibilityState={{ selected: themePreference === theme.name }}
          >
            <ThemedText style={themePreference === theme.name ? dynamicStyles.textActive : dynamicStyles.textInactive}>
              {theme.icon} {theme.displayName}
            </ThemedText>
          </Pressable>
        ))}
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: Typography.body.fontSize,
    fontWeight: Typography.bodyBold.fontWeight,
    marginBottom: Spacing.sm,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    ...rounded.md,
    borderWidth: 1,
    ...padding.xs,
    ...gap.sm,
    backgroundColor: 'transparent',
  },
  chip: {
    ...padding.md,
    ...rounded.sm,
    minWidth: '30%',
    minHeight: 44,
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipPressed: {
    opacity: 0.7,
  },
});
