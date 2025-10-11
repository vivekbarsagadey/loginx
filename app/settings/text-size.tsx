import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SelectableButton } from '@/components/ui/selectable-button';
import { CommonText } from '@/constants/common-styles';
import { BorderRadius, Spacing, Typography } from '@/constants/layout';
import { DEFAULT_TEXT_SIZE, getTextSizeOptions } from '@/data';
import { useAlert } from '@/hooks/use-alert';
import i18n from '@/i18n';
import type { TextSizeOption } from '@/types/text-size';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';

export default function TextSizeScreen() {
  const [selectedSize, setSelectedSize] = useState<TextSizeOption>(DEFAULT_TEXT_SIZE);
  const alert = useAlert();

  const sizeOptions = getTextSizeOptions();

  const handleSizeSelect = async (size: TextSizeOption) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
            <SelectableButton key={option.key} label={option.title} isSelected={selectedSize === option.key} onPress={() => handleSizeSelect(option.key)} variant="large" />
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
