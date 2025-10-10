import { ThemedScrollView } from '@/components/themed-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CommonContainers, CommonSelectionCards, CommonText } from '@/constants/common-styles';
import { Shadow, Spacing } from '@/constants/layout';
import { languages } from '@/data/languages';
import { useAlert } from '@/hooks/use-alert';
import { useLanguage } from '@/hooks/use-language-provider';
import { useThemeColor } from '@/hooks/use-theme-color';
import { provideLightFeedback } from '@/utils/feedback';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

export default function LanguageScreen() {
  const { language, persistLanguage } = useLanguage();
  const alert = useAlert();

  const primaryColor = useThemeColor({}, 'primary');
  const surfaceColor = useThemeColor({}, 'surface');
  const textColor = useThemeColor({}, 'text');
  const textMutedColor = useThemeColor({}, 'text-muted');
  const borderColor = useThemeColor({}, 'border');
  const onPrimaryColor = useThemeColor({}, 'on-primary');

  const handleLanguageSelect = async (code: string) => {
    try {
      await provideLightFeedback();
      await persistLanguage(code);
      alert.show('Success', `Language changed to ${languages.find((l) => l.code === code)?.name}`);
    } catch (_error) {
      alert.show('Error', 'Failed to change language');
    }
  };

  return (
    <>
      <ThemedScrollView style={CommonContainers.screenContainer} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <ThemedText style={CommonText.subtitleMedium}>Choose your preferred language for the app interface</ThemedText>

        <ThemedView style={styles.optionsContainer}>
          {languages.map((languageOption) => {
            const isSelected = language.startsWith(languageOption.code);
            return (
              <Pressable
                key={languageOption.code}
                onPress={() => handleLanguageSelect(languageOption.code)}
                style={({ pressed }) => [
                  styles.optionItem,
                  {
                    backgroundColor: surfaceColor,
                    borderColor: borderColor,
                    opacity: pressed ? 0.7 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                    ...Platform.select({
                      ios: {
                        shadowColor: textColor,
                      },
                      android: {},
                    }),
                  },
                  isSelected && [
                    styles.selectedOption,
                    {
                      borderColor: primaryColor,
                      backgroundColor: primaryColor + '10',
                      ...Platform.select({
                        ios: {
                          shadowColor: textColor,
                        },
                        android: {},
                      }),
                    },
                  ],
                ]}
              >
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
              </Pressable>
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
  selectedOption: Shadow.xl,
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
