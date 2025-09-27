
import React from 'react';
import { View, Text, Pressable, StyleSheet, useColorScheme } from 'react-native';
import { useLanguage } from '@/hooks/use-language';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import i18n from '@/i18n';

const LANGUAGE_OPTIONS = ['en', 'es', 'hi'];

export const LanguagePicker = () => {
  const { language, persistLanguage } = useLanguage();
  const { theme } = useTheme();
  const colorScheme = useColorScheme();
  const colors = Colors[theme === 'system' ? (colorScheme || 'light') : theme];

  return (
    <View>
      <Text style={[styles.label, { color: colors.text }]}>{i18n.t('onb.personalize.language')}</Text>
      <View style={styles.container}>
        {LANGUAGE_OPTIONS.map((option) => (
          <Pressable
            key={option}
            style={[
              styles.chip,
              { backgroundColor: language === option ? colors.primary : colors.surface },
            ]}
            onPress={() => persistLanguage(option)}>
            <Text
              style={{
                color: language === option ? colors['on-primary'] : colors.text,
                fontWeight: '600',
              }}>
              {option.toUpperCase()}
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
