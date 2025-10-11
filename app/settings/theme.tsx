import { ThemedPressable } from '@/components/themed-pressable';
import { ThemedScrollView } from '@/components/themed-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CommonContainers, CommonSelectionCards, CommonText } from '@/constants/common-styles';
import { Shadow, Spacing } from '@/constants/layout';
import { getThemeOptions } from '@/data';
import { useAlert } from '@/hooks/use-alert';
import { useLoadingState } from '@/hooks/use-loading-state';
import { useThemeColor } from '@/hooks/use-theme-color';
import { type ThemePreference, useThemeContext } from '@/hooks/use-theme-context';
import i18n from '@/i18n';
import { provideLightFeedback } from '@/utils/feedback';
import { StyleSheet, View } from 'react-native';

export default function ThemeScreen() {
  const { themePreference, setThemePreference } = useThemeContext();
  const alert = useAlert();

  const primaryColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'text');
  const textMutedColor = useThemeColor({}, 'text-muted');
  const borderColor = useThemeColor({}, 'border');

  // Get all available theme options
  const themeOptions = getThemeOptions(textColor);

  // Use loading state for theme changes
  const { execute } = useLoadingState({ enableHaptics: false });

  const handleThemeSelect = async (theme: ThemePreference) => {
    await execute(async () => {
      await provideLightFeedback();
      await setThemePreference(theme);
      alert.show(i18n.t('success.profileUpdate.title'), i18n.t('screens.settings.theme.applied'));
    });
  };

  return (
    <>
      <ThemedScrollView style={CommonContainers.screenContainer} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <ThemedText style={CommonText.subtitleMedium}>{i18n.t('screens.settings.theme.subtitle')}</ThemedText>

        <ThemedView style={styles.optionsContainer}>
          {themeOptions.map((option) => {
            const isSelected = themePreference === option.key;
            return (
              <ThemedPressable key={option.key} onPress={() => handleThemeSelect(option.key)} style={[styles.optionItem, isSelected && styles.selectedOption]}>
                <ThemedView style={styles.optionContent}>
                  {/* Icon with color indicator */}
                  <View style={styles.iconContainer}>
                    <View
                      style={[
                        styles.colorIndicator,
                        {
                          backgroundColor: option.color,
                          borderWidth: option.key === 'system' ? 2 : 0,
                          borderColor: borderColor,
                        },
                      ]}
                    >
                      {option.key === 'system' && <ThemedText style={styles.iconEmoji}>{option.icon}</ThemedText>}
                    </View>
                    {option.key !== 'system' && <ThemedText style={styles.iconEmojiOverlay}>{option.icon}</ThemedText>}
                  </View>

                  {/* Content */}
                  <ThemedView style={styles.optionText}>
                    <ThemedText type="body" style={styles.optionTitle}>
                      {option.title}
                    </ThemedText>
                    <ThemedText style={[styles.optionDescription, { color: textMutedColor }]}>{option.description}</ThemedText>
                  </ThemedView>

                  {/* Selection indicator - Radio button style */}
                  <ThemedView style={styles.radioContainer}>
                    <View
                      style={[
                        styles.radioOuter,
                        {
                          borderColor: isSelected ? primaryColor : borderColor,
                        },
                      ]}
                    >
                      {isSelected && (
                        <View
                          style={[
                            styles.radioInner,
                            {
                              backgroundColor: primaryColor,
                            },
                          ]}
                        />
                      )}
                    </View>
                  </ThemedView>
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
  optionsContainer: {
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  optionItem: {
    ...CommonSelectionCards.selectionCard,
    ...Shadow.sm,
    minHeight: Spacing.xxl + Spacing.xl, // 72px (40 + 32)
  },
  selectedOption: {
    ...Shadow.lg,
    borderWidth: 2,
  },
  optionContent: CommonSelectionCards.selectionCardContent,
  iconContainer: {
    position: 'relative',
    width: Spacing.xxxl, // 48px
    height: Spacing.xxxl, // 48px
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorIndicator: {
    width: Spacing.xxxl, // 48px
    height: Spacing.xxxl, // 48px
    borderRadius: Spacing.sm, // 8px
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadow.sm,
  },
  iconEmoji: {
    fontSize: Spacing.lg, // 24px
    textAlign: 'center',
  },
  iconEmojiOverlay: {
    position: 'absolute',
    fontSize: Spacing.lg, // 24px
    textAlign: 'center',
    top: Spacing.md - Spacing.xs, // 12px
    left: Spacing.md - Spacing.xs, // 12px
  },
  optionText: CommonSelectionCards.selectionTextContainer,
  optionTitle: CommonSelectionCards.selectionCardTitle,
  optionDescription: {
    ...CommonSelectionCards.selectionCardDescription,
    opacity: 0.8,
  },
  radioContainer: {
    paddingLeft: Spacing.sm,
  },
  radioOuter: {
    ...CommonSelectionCards.checkmark,
    borderWidth: 2,
  },
  radioInner: {
    width: Spacing.md - Spacing.xs, // 12px
    height: Spacing.md - Spacing.xs, // 12px
    borderRadius: Spacing.xs + 2, // 6px
  },
});
