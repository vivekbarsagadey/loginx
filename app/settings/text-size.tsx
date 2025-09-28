
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet, TouchableOpacity, Alert } from 'react-native';
import i18n from '@/i18n';
import { useState } from 'react';

type TextSizeOption = 'small' | 'default' | 'large' | 'extraLarge';

export default function TextSizeScreen() {
  const [selectedSize, setSelectedSize] = useState<TextSizeOption>('default');

  const sizeOptions = [
    { key: 'small' as TextSizeOption, title: i18n.t('screens.settings.textSize.options.small'), multiplier: 0.85 },
    { key: 'default' as TextSizeOption, title: i18n.t('screens.settings.textSize.options.default'), multiplier: 1.0 },
    { key: 'large' as TextSizeOption, title: i18n.t('screens.settings.textSize.options.large'), multiplier: 1.15 },
    { key: 'extraLarge' as TextSizeOption, title: i18n.t('screens.settings.textSize.options.extraLarge'), multiplier: 1.3 },
  ];

  const handleSizeSelect = (size: TextSizeOption) => {
    setSelectedSize(size);
    Alert.alert(
      i18n.t('success.profileUpdate.title'),
      i18n.t('screens.settings.textSize.applied')
    );
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
      <ThemedText style={styles.subtitle}>
        {i18n.t('screens.settings.textSize.subtitle')}
      </ThemedText>

      <ThemedView style={styles.optionsContainer}>
        {sizeOptions.map((option) => (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.optionItem,
              selectedSize === option.key && styles.selectedOption,
            ]}
            onPress={() => handleSizeSelect(option.key)}
          >
            <ThemedView style={styles.optionContent}>
              <ThemedText 
                style={[
                  styles.optionTitle,
                  getPreviewStyles(option.multiplier)
                ]}
              >
                {option.title}
              </ThemedText>
              {selectedSize === option.key && (
                <ThemedText style={styles.checkmark}>✓</ThemedText>
              )}
            </ThemedView>
          </TouchableOpacity>
        ))}
      </ThemedView>

      <ThemedView style={styles.previewSection}>
        <ThemedText type="h3" style={styles.previewTitle}>
          {i18n.t('screens.settings.textSize.preview.title')}
        </ThemedText>
        <ThemedView style={styles.previewContainer}>
          <ThemedText 
            style={[
              styles.previewText,
              getPreviewStyles(sizeOptions.find(o => o.key === selectedSize)?.multiplier || 1)
            ]}
          >
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
    padding: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.7,
  },
  optionsContainer: {
    marginBottom: 32,
  },
  optionItem: {
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  selectedOption: {
    borderColor: '#007AFF',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  optionTitle: {
    fontWeight: 'bold',
  },
  checkmark: {
    fontSize: 20,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  previewSection: {
    marginTop: 16,
  },
  previewTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  previewContainer: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  previewText: {
    textAlign: 'center',
  },
});
