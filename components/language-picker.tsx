import { BorderRadius, Spacing, Typography } from '@/constants/layout';
import { useLanguage } from '@/hooks/use-language';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/i18n';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

const LANGUAGE_OPTIONS = ['en', 'es', 'hi'];

export const LanguagePicker = () => {
  const { language, persistLanguage } = useLanguage();
  const primaryColor = useThemeColor({}, 'primary');
  const onPrimaryColor = useThemeColor({}, 'on-primary');
  const surfaceColor = useThemeColor({}, 'surface');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');

  const dynamicStyles = React.useMemo(
    () =>
      StyleSheet.create({
        chipActive: {
          backgroundColor: primaryColor,
        },
        chipInactive: {
          backgroundColor: surfaceColor,
        },
        textActive: {
          color: onPrimaryColor,
          fontWeight: Typography.bodyBold.fontWeight,
        },
        textInactive: {
          color: textColor,
          fontWeight: Typography.bodyBold.fontWeight,
        },
      }),
    [primaryColor, surfaceColor, onPrimaryColor, textColor]
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
    fontSize: Typography.body.fontSize,
    fontWeight: Typography.bodyBold.fontWeight,
    marginBottom: Spacing.sm,
  },
  container: {
    flexDirection: 'row',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  chip: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
