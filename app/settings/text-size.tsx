import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CommonText } from '@/constants/common-styles';
import { BorderRadius, Spacing, Typography } from '@/constants/layout';
import { DEFAULT_TEXT_SIZE, getTextSizeOptions } from '@/data';
import { useAlert } from '@/hooks/use-alert';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/i18n';
import type { TextSizeOption } from '@/types/text-size';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function TextSizeScreen() {
  const [selectedSize, setSelectedSize] = useState<TextSizeOption>(DEFAULT_TEXT_SIZE);
  const alert = useAlert();

  const primaryColor = useThemeColor({}, 'primary');
  const surfaceVariant = useThemeColor({}, 'surface-variant');

  const sizeOptions = getTextSizeOptions();

  const handleSizeSelect = (size: TextSizeOption) => {
    setSelectedSize(size);
    alert.show(i18n.t('success.profileUpdate.title'), i18n.t('screens.settings.textSize.applied'));
  };

  const getPreviewStyles = (multiplier: number) => ({
    fontSize: Spacing.md * multiplier, // 16px base
    lineHeight: (Spacing.lg - 2) * multiplier, // 22px base
  });

  return (
    <>
      <ThemedView style={styles.container}>
        <ThemedText style={CommonText.subtitle}>{i18n.t('screens.settings.textSize.subtitle')}</ThemedText>

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
      {alert.AlertComponent}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
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
    fontWeight: Typography.bodyBold.fontWeight,
    marginBottom: Spacing.sm,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkmark: {
    fontSize: Typography.h3.fontSize,
    fontWeight: Typography.bodyBold.fontWeight,
  },
  previewSection: {
    marginTop: Spacing.lg,
  },
  previewTitle: {
    marginBottom: Spacing.md,
    fontWeight: Typography.h3.fontWeight,
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
