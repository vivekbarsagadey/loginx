import { getAllThemes } from '@/constants/theme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useThemeContext } from '@/hooks/use-theme-context';
import i18n from '@/i18n';
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

  return (
    <ThemedView>
      <ThemedText style={styles.label}>{i18n.t('onb.personalize.theme')}</ThemedText>
      <ThemedView style={[styles.container, dynamicStyles.containerBorder]}>
        {themes.map((theme) => (
          <Pressable
            key={theme.name}
            style={[styles.chip, themePreference === theme.name ? dynamicStyles.chipActive : dynamicStyles.chipInactive]}
            onPress={() => setThemePreference(theme.name as any)}
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
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
    gap: 8,
    backgroundColor: 'transparent',
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: '30%',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
