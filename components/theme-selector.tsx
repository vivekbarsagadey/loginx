
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { Colors } from '@/constants/theme';
import i18n from '@/i18n';
import { useColorScheme } from '@/hooks/use-color-scheme';

const THEME_OPTIONS = ['system', 'light', 'dark'];

export const ThemeSelector = () => {
  const { theme, persistTheme } = useTheme();
  const colorScheme = useColorScheme();

  const getColors = () => {
    if (theme === 'system') {
      return Colors[colorScheme || 'light'];
    }
    return Colors[theme];
  };

  const colors = getColors();

  return (
    <View>
      <Text style={[styles.label, { color: colors.text }]}>{i18n.t('onb.personalize.theme')}</Text>
      <View style={styles.container}>
        {THEME_OPTIONS.map((option) => (
          <Pressable
            key={option}
            style={[
              styles.chip,
              { backgroundColor: theme === option ? colors.primary : colors.surface },
            ]}
            onPress={() => persistTheme(option as 'light' | 'dark' | 'system')}>
            <Text
              style={{
                color: theme === option ? colors['on-primary'] : colors.text,
                fontWeight: '600',
              }}>
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
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
    borderColor: Colors.light.border,
    overflow: 'hidden',
  },
  chip: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
