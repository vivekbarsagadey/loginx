import { useTheme } from '@/hooks/use-theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/i18n';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

const THEME_OPTIONS = ['system', 'light', 'dark'];

export const ThemeSelector = () => {
  const { theme, persistTheme } = useTheme();
  const primaryColor = useThemeColor({}, 'primary');
  const onPrimaryColor = useThemeColor({}, 'on-primary');
  const surfaceColor = useThemeColor({}, 'surface');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');

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

  return (
    <ThemedView>
      <ThemedText style={styles.label}>{i18n.t('onb.personalize.theme')}</ThemedText>
      <ThemedView style={[styles.container, dynamicStyles.containerBorder]}>
        {THEME_OPTIONS.map((option) => (
          <Pressable key={option} style={[styles.chip, theme === option ? dynamicStyles.chipActive : dynamicStyles.chipInactive]} onPress={() => persistTheme(option as 'light' | 'dark' | 'system')}>
            <ThemedText style={theme === option ? dynamicStyles.textActive : dynamicStyles.textInactive}>{option.charAt(0).toUpperCase() + option.slice(1)}</ThemedText>
          </Pressable>
        ))}
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  chip: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
