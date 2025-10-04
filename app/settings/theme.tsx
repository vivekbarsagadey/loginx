import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BorderRadius, Spacing, Typography } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/i18n';
import { useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';

type ThemeOption = 'system' | 'light' | 'dark';

export default function ThemeScreen() {
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption>('system');

  const primaryColor = useThemeColor({}, 'primary');
  const surfaceVariant = useThemeColor({}, 'surface-variant');

  const themeOptions = [
    {
      key: 'system' as ThemeOption,
      title: i18n.t('screens.settings.theme.options.system.title'),
      description: i18n.t('screens.settings.theme.options.system.description'),
      icon: '📱',
    },
    {
      key: 'light' as ThemeOption,
      title: i18n.t('screens.settings.theme.options.light.title'),
      description: i18n.t('screens.settings.theme.options.light.description'),
      icon: '☀️',
    },
    {
      key: 'dark' as ThemeOption,
      title: i18n.t('screens.settings.theme.options.dark.title'),
      description: i18n.t('screens.settings.theme.options.dark.description'),
      icon: '🌙',
    },
  ];

  const handleThemeSelect = (theme: ThemeOption) => {
    setSelectedTheme(theme);
    Alert.alert(i18n.t('success.profileUpdate.title'), i18n.t('screens.settings.theme.applied'));
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="h1" style={styles.title}>
        {i18n.t('screens.settings.theme.title')}
      </ThemedText>
      <ThemedText style={styles.subtitle}>{i18n.t('screens.settings.theme.subtitle')}</ThemedText>

      <ThemedView style={styles.optionsContainer}>
        {themeOptions.map((option) => (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.optionItem,
              { backgroundColor: surfaceVariant },
              selectedTheme === option.key && [
                styles.selectedOption,
                {
                  borderColor: primaryColor,
                  backgroundColor: primaryColor + '1A',
                },
              ],
            ]}
            onPress={() => handleThemeSelect(option.key)}
          >
            <ThemedView style={styles.optionContent}>
              <ThemedText style={styles.optionIcon}>{option.icon}</ThemedText>
              <ThemedView style={styles.optionText}>
                <ThemedText type="body" style={styles.optionTitle}>
                  {option.title}
                </ThemedText>
                <ThemedText style={styles.optionDescription}>{option.description}</ThemedText>
              </ThemedView>
              {selectedTheme === option.key && <ThemedText style={[styles.checkmark, { color: primaryColor }]}>✓</ThemedText>}
            </ThemedView>
          </TouchableOpacity>
        ))}
      </ThemedView>

      <ThemedView style={styles.previewSection}>
        <ThemedText type="h3" style={styles.previewTitle}>
          {i18n.t('screens.settings.theme.preview')}
        </ThemedText>
        <ThemedView style={styles.previewContainer}>
          <ThemedView style={[styles.previewBox, { backgroundColor: surfaceVariant }]}>
            <ThemedText style={styles.previewText}>Sample Text</ThemedText>
            <ThemedText style={styles.previewSubtext}>This is how text will appear with the selected theme</ThemedText>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: Spacing.lg,
    opacity: 0.7,
  },
  optionsContainer: {
    marginBottom: Spacing.xl,
  },
  optionItem: {
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    // Border color applied inline with theme
    // Background handled by theme
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  optionIcon: {
    fontSize: Typography.h1.fontSize,
    marginRight: Spacing.md,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontWeight: Typography.bodyBold.fontWeight,
    marginBottom: Spacing.xs,
  },
  optionDescription: {
    opacity: 0.7,
    fontSize: Typography.caption.fontSize,
  },
  checkmark: {
    fontSize: Typography.h3.fontSize,
    // Color applied inline with theme
    fontWeight: Typography.bodyBold.fontWeight,
  },
  previewSection: {
    marginTop: Spacing.md,
  },
  previewTitle: {
    marginBottom: Spacing.md,
    fontWeight: Typography.h3.fontWeight,
  },
  previewContainer: {
    alignItems: 'center',
  },
  previewBox: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    width: '100%',
    alignItems: 'center',
  },
  previewText: {
    fontSize: Typography.body.fontSize,
    fontWeight: Typography.bodyBold.fontWeight,
    marginBottom: Spacing.sm,
  },
  previewSubtext: {
    opacity: 0.7,
    textAlign: 'center',
  },
});
