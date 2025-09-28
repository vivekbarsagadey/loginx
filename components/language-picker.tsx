
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useLanguage } from '@/hooks/use-language';
import { useTheme } from '@/hooks/use-theme';
import i18n from '@/i18n';
import { ThemedView } from './themed-view';
import { ThemedText } from './themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from 'react-native';

const LANGUAGE_OPTIONS = ['en', 'es', 'hi'];

export const LanguagePicker = () => {
  const { language, persistLanguage } = useLanguage();
  const { theme } = useTheme();
  const colorScheme = useColorScheme();
  const colors = Colors[theme === 'system' ? (colorScheme || 'light') : theme];

  return (
    <ThemedView>
      <ThemedText style={styles.label}>{i18n.t('onb.personalize.language')}</ThemedText>
      <ThemedView style={styles.container}>
        {LANGUAGE_OPTIONS.map((option) => (
          <Pressable
            key={option}
            style={[
              styles.chip,
              { backgroundColor: language === option ? colors.primary : colors.surface },
            ]}
            onPress={() => persistLanguage(option)}>
            <ThemedText
              style={{
                color: language === option ? colors['on-primary'] : colors.text,
                fontWeight: '600',
              }}>
              {option.toUpperCase()}
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
