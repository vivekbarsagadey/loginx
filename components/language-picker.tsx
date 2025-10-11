import { Spacing, Typography } from '@/constants/layout';
import { rounded } from '@/constants/style-utils';
import { useLanguage } from '@/hooks/use-language';
import { useThemeColors } from '@/hooks/use-theme-colors';
import i18n from '@/i18n';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

const LANGUAGE_OPTIONS = ['en', 'es', 'hi'];

export const LanguagePicker = () => {
  const { language, persistLanguage } = useLanguage();
  const colors = useThemeColors();

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
          fontWeight: Typography.bodyBold.fontWeight,
        },
        textInactive: {
          color: colors.text,
          fontWeight: Typography.bodyBold.fontWeight,
        },
      }),
    [colors]
  );

  const handleLanguageSelect = async (option: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    persistLanguage(option);
  };

  return (
    <ThemedView>
      <ThemedText style={styles.label}>{i18n.t('onb.personalize.language')}</ThemedText>
      <ThemedView style={styles.container}>
        {LANGUAGE_OPTIONS.map((option) => (
          <Pressable
            key={option}
            style={({ pressed }) => [styles.chip, language === option ? dynamicStyles.chipActive : dynamicStyles.chipInactive, pressed && styles.chipPressed]}
            onPress={() => handleLanguageSelect(option)}
            accessibilityRole="button"
            accessibilityLabel={`Select ${option} language`}
            accessibilityState={{ selected: language === option }}
          >
            <ThemedText style={language === option ? dynamicStyles.textActive : dynamicStyles.textInactive}>{option.toUpperCase()}</ThemedText>
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
    ...rounded.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  chip: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  chipPressed: {
    opacity: 0.7,
  },
});
