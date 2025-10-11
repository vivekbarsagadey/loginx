import { ThemedPressable } from '@/components/themed-pressable';
import { ThemedScrollView } from '@/components/themed-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CommonContainers, CommonSelectionCards, CommonText } from '@/constants/common-styles';
import { Shadow, Spacing } from '@/constants/layout';
import { languages } from '@/data/languages';
import { useAlert } from '@/hooks/use-alert';
import { useLanguage } from '@/hooks/use-language-provider';
import { useLoadingState } from '@/hooks/use-loading-state';
import { useThemeColor } from '@/hooks/use-theme-color';
import { provideLightFeedback } from '@/utils/feedback';
import { Platform, StyleSheet, View } from 'react-native';

export default function LanguageScreen() {
  const { language, persistLanguage } = useLanguage();
  const alert = useAlert();

  const primaryColor = useThemeColor({}, 'primary');
  const surfaceColor = useThemeColor({}, 'surface');
  const textColor = useThemeColor({}, 'text');
  const textMutedColor = useThemeColor({}, 'text-muted');
  const onPrimaryColor = useThemeColor({}, 'on-primary');

  // Use loading state for language changes
  const { execute } = useLoadingState({ enableHaptics: false });

  const handleLanguageSelect = async (code: string) => {
    await execute(async () => {
      await provideLightFeedback();
      await persistLanguage(code);
      alert.show('Success', `Language changed to ${languages.find((l) => l.code === code)?.name}`);
    });
  };

  return (
    <>
      <ThemedScrollView style={CommonContainers.screenContainer} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <ThemedText style={CommonText.subtitleMedium}>Choose your preferred language for the app interface</ThemedText>

        <ThemedView style={styles.optionsContainer}>
          {languages.map((languageOption) => {
            const isSelected = language.startsWith(languageOption.code);
            return (
              <ThemedPressable key={languageOption.code} onPress={() => handleLanguageSelect(languageOption.code)} style={[styles.optionItem, isSelected && styles.selectedOption]}>
                <ThemedView style={styles.optionContent}>
                  {/* Flag indicator */}
                  <View
                    style={[
                      styles.flagContainer,
                      {
                        backgroundColor: isSelected ? primaryColor + '15' : surfaceColor,
                      },
                    ]}
                  >
                    <ThemedText style={styles.flagEmoji}>{languageOption.flag}</ThemedText>
                  </View>

                  {/* Content */}
                  <ThemedView style={styles.optionText}>
                    <ThemedText type="body" style={styles.optionTitle}>
                      {languageOption.nativeName}
                    </ThemedText>
                    <ThemedText style={[styles.optionDescription, { color: textMutedColor }]}>{languageOption.description}</ThemedText>
                  </ThemedView>

                  {/* Selection indicator - Checkmark for selected */}
                  {isSelected && (
                    <View style={styles.checkmarkContainer}>
                      <View
                        style={[
                          styles.checkmark,
                          {
                            backgroundColor: primaryColor,
                            ...Platform.select({
                              ios: {
                                shadowColor: textColor,
                              },
                              android: {},
                            }),
                          },
                        ]}
                      >
                        <ThemedText style={[styles.checkmarkText, { color: onPrimaryColor }]}>✓</ThemedText>
                      </View>
                    </View>
                  )}
                </ThemedView>
              </ThemedPressable>
            );
          })}
        </ThemedView>
      </ThemedScrollView>
      {alert.AlertComponent}
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: Spacing.xxl * 2,
  },
  optionsContainer: CommonSelectionCards.optionsContainer,
  optionItem: {
    ...CommonSelectionCards.selectionCard,
    ...Shadow.md,
  },
  selectedOption: {
    ...Shadow.xl,
    borderWidth: 2,
  },
  optionContent: CommonSelectionCards.selectionCardContent,
  flagContainer: CommonSelectionCards.selectionIconContainer,
  flagEmoji: CommonSelectionCards.selectionIconEmoji,
  optionText: CommonSelectionCards.selectionTextContainer,
  optionTitle: CommonSelectionCards.selectionCardTitle,
  optionDescription: CommonSelectionCards.selectionCardDescription,
  checkmarkContainer: CommonSelectionCards.checkmarkContainer,
  checkmark: {
    ...CommonSelectionCards.checkmark,
    ...Shadow.md,
  },
  checkmarkText: CommonSelectionCards.checkmarkText,
});
