import { Colors } from '@/constants/theme';
import { useLanguage } from '@/hooks/use-language';
import { useTheme } from '@/hooks/use-theme';
import i18n from '@/i18n';
import React from 'react';
import { Pressable, StyleSheet, useColorScheme } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

const LANGUAGE_OPTIONS = ['en', 'es', 'hi'];

export const LanguagePicker = () => {
  const { language, persistLanguage } = useLanguage();
  const { theme } = useTheme();
  const colorScheme = useColorScheme();
  const colors = Colors[theme === 'system' ? colorScheme || 'light' : theme];

  const dynamicStyles = React.useMemo(
    () =>
      StyleSheet.create({
        chipActive: {
          backgroundColor: colors.primary,
        },
        chipInactive: {
          backgroundColor: colors.surface,
        },
        textActive: {
          color: colors['on-primary'],
          fontWeight: '600',
        },
        textInactive: {
          color: colors.text,
          fontWeight: '600',
        },
      }),
    [colors]
  );

  return (
    <ThemedView>
      <ThemedText style={styles.label}>{i18n.t('onb.personalize.language')}</ThemedText>
      <ThemedView style={styles.container}>
        {LANGUAGE_OPTIONS.map((option) => (
          <Pressable key={option} style={[styles.chip, language === option ? dynamicStyles.chipActive : dynamicStyles.chipInactive]} onPress={() => persistLanguage(option)}>
            <ThemedText style={language === option ? dynamicStyles.textActive : dynamicStyles.textInactive}>{option.toUpperCase()}</ThemedText>
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
