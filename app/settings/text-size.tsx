import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BorderRadius, Spacing } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/i18n';
import React, { useState } from 'react';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';

type TextSizeOption = 'small' | 'default' | 'large' | 'extraLarge';

export default function TextSizeScreen() {
  const [selectedSize, setSelectedSize] = useState<TextSizeOption>('default');

  const primaryColor = useThemeColor({}, 'primary');
  const surfaceVariant = useThemeColor({}, 'surface-variant');

  const sizeOptions = [
    { key: 'small' as TextSizeOption, title: i18n.t('screens.settings.textSize.options.small'), multiplier: 0.85 },
    { key: 'default' as TextSizeOption, title: i18n.t('screens.settings.textSize.options.default'), multiplier: 1.0 },
    { key: 'large' as TextSizeOption, title: i18n.t('screens.settings.textSize.options.large'), multiplier: 1.15 },
    { key: 'extraLarge' as TextSizeOption, title: i18n.t('screens.settings.textSize.options.extraLarge'), multiplier: 1.3 },
  ];

  const handleSizeSelect = (size: TextSizeOption) => {
    setSelectedSize(size);
    Alert.alert(i18n.t('success.profileUpdate.title'), i18n.t('screens.settings.textSize.applied'));
  };

  const getPreviewStyles = (multiplier: number) => ({
    fontSize: 16 * multiplier,
    lineHeight: 22 * multiplier,
  });

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="h1" style={styles.title}>
        {i18n.t('screens.settings.textSize.title')}
      </ThemedText>
      <ThemedText style={styles.subtitle}>{i18n.t('screens.settings.textSize.subtitle')}</ThemedText>

      <ThemedView style={styles.optionsContainer}>
        {sizeOptions.map((option) => (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.option,
              { backgroundColor: surfaceVariant },
              selectedSize === option.key && [
                styles.selectedOption,
                {
                  borderColor: primaryColor,
                  backgroundColor: primaryColor + '1A',
                },
              ],
            ]}
            onPress={() => handleSizeSelect(option.key)}
          >
            <ThemedView style={styles.optionContent}>
              <ThemedText style={[styles.optionTitle, getPreviewStyles(option.multiplier)]}>{option.title}</ThemedText>
              {selectedSize === option.key && <ThemedText style={[styles.checkmark, { color: primaryColor }]}>✓</ThemedText>}
            </ThemedView>
          </TouchableOpacity>
        ))}
      </ThemedView>

      <ThemedView style={styles.previewSection}>
        <ThemedText type="h3" style={styles.previewTitle}>
          {i18n.t('screens.settings.textSize.preview.title')}
        </ThemedText>
        <ThemedView style={styles.previewContainer}>
          <ThemedText style={[styles.previewText, getPreviewStyles(sizeOptions.find((o) => o.key === selectedSize)?.multiplier || 1)]}>
            {i18n.t('screens.settings.textSize.preview.content')}
          </ThemedText>
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
    marginBottom: Spacing.sm,
  },
  subtitle: {
    marginBottom: Spacing.lg,
    opacity: 0.7,
  },
  optionsContainer: {
    gap: Spacing.md,
  },
  option: {
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    borderWidth: 2,
  },
  optionTitle: {
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkmark: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  previewSection: {
    marginTop: Spacing.lg,
  },
  previewTitle: {
    marginBottom: Spacing.md,
    fontWeight: 'bold',
  },
  previewContainer: {
    marginTop: Spacing.xl,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  previewText: {
    textAlign: 'center',
  },
});
