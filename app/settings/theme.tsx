
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet, TouchableOpacity, Alert } from 'react-native';
import i18n from '@/i18n';
import { useState } from 'react';

type ThemeOption = 'system' | 'light' | 'dark';

export default function ThemeScreen() {
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption>('system');

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
    Alert.alert(
      i18n.t('success.profileUpdate.title'),
      i18n.t('screens.settings.theme.applied')
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="h1" style={styles.title}>
        {i18n.t('screens.settings.theme.title')}
      </ThemedText>
      <ThemedText style={styles.subtitle}>
        {i18n.t('screens.settings.theme.subtitle')}
      </ThemedText>

      <ThemedView style={styles.optionsContainer}>
        {themeOptions.map((option) => (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.optionItem,
              selectedTheme === option.key && styles.selectedOption,
            ]}
            onPress={() => handleThemeSelect(option.key)}
          >
            <ThemedView style={styles.optionContent}>
              <ThemedText style={styles.optionIcon}>{option.icon}</ThemedText>
              <ThemedView style={styles.optionText}>
                <ThemedText type="body" style={styles.optionTitle}>
                  {option.title}
                </ThemedText>
                <ThemedText style={styles.optionDescription}>
                  {option.description}
                </ThemedText>
              </ThemedView>
              {selectedTheme === option.key && (
                <ThemedText style={styles.checkmark}>✓</ThemedText>
              )}
            </ThemedView>
          </TouchableOpacity>
        ))}
      </ThemedView>

      <ThemedView style={styles.previewSection}>
        <ThemedText type="h3" style={styles.previewTitle}>
          {i18n.t('screens.settings.theme.preview')}
        </ThemedText>
        <ThemedView style={styles.previewContainer}>
          <ThemedView style={styles.previewBox}>
            <ThemedText style={styles.previewText}>Sample Text</ThemedText>
            <ThemedText style={styles.previewSubtext}>
              This is how text will appear with the selected theme
            </ThemedText>
          </ThemedView>
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
    padding: 16,
  },
  optionIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  optionDescription: {
    opacity: 0.7,
    fontSize: 14,
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
    alignItems: 'center',
  },
  previewBox: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    width: '100%',
    alignItems: 'center',
  },
  previewText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  previewSubtext: {
    opacity: 0.7,
    textAlign: 'center',
  },
});
