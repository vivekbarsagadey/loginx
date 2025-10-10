import { ThemedScrollView } from '@/components/themed-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CommonContainers, CommonText } from '@/constants/common-styles';
import { BorderRadius, Spacing, Typography } from '@/constants/layout';
import { getAllThemes, getTheme } from '@/constants/theme';
import { useAlert } from '@/hooks/use-alert';
import { useThemeColor } from '@/hooks/use-theme-color';
import { type ThemePreference, useThemeContext } from '@/hooks/use-theme-context';
import i18n from '@/i18n';
import { provideLightFeedback } from '@/utils/feedback';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

export default function ThemeScreen() {
  const { themePreference, setThemePreference } = useThemeContext();
  const alert = useAlert();

  const primaryColor = useThemeColor({}, 'primary');
  const surfaceColor = useThemeColor({}, 'surface');
  const textColor = useThemeColor({}, 'text');
  const textMutedColor = useThemeColor({}, 'text-muted');
  const borderColor = useThemeColor({}, 'border');

  // Get all available themes
  const availableThemes = getAllThemes();

  const themeOptions = [
    {
      key: 'system' as ThemePreference,
      title: i18n.t('screens.settings.theme.options.system.title'),
      description: i18n.t('screens.settings.theme.options.system.description'),
      icon: '📱',
      color: textColor,
    },
    ...availableThemes.map((themeInfo) => {
      const theme = getTheme(themeInfo.name);
      return {
        key: themeInfo.name as ThemePreference,
        title: themeInfo.displayName,
        description: `${themeInfo.displayName} color theme with light and dark modes`,
        icon: themeInfo.icon,
        color: theme.light.primary, // Use theme's primary color
      };
    }),
  ];

  const handleThemeSelect = async (theme: ThemePreference) => {
    try {
      await provideLightFeedback();
      await setThemePreference(theme);
      alert.show(i18n.t('success.profileUpdate.title'), i18n.t('screens.settings.theme.applied'));
    } catch (_error) {
      alert.show('Error', 'Failed to save theme preference');
    }
  };

  return (
    <>
      <ThemedScrollView style={CommonContainers.screenContainer} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <ThemedText style={CommonText.subtitleMedium}>{i18n.t('screens.settings.theme.subtitle')}</ThemedText>

        <ThemedView style={styles.optionsContainer}>
          {themeOptions.map((option) => {
            const isSelected = themePreference === option.key;
            return (
              <Pressable
                key={option.key}
                onPress={() => handleThemeSelect(option.key)}
                style={({ pressed }) => [
                  styles.optionItem,
                  {
                    backgroundColor: surfaceColor,
                    borderColor: borderColor,
                    opacity: pressed ? 0.7 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  },
                  isSelected && [
                    styles.selectedOption,
                    {
                      borderColor: primaryColor,
                      backgroundColor: primaryColor + '10',
                    },
                  ],
                ]}
              >
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
    paddingBottom: Spacing.xxl * 2, // Extra space at bottom for scrolling
  },
  optionsContainer: {
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  optionItem: {
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
    minHeight: 72, // Reduced from 88 for more compact design
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  selectedOption: {
    // Border and background colors applied inline
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  iconContainer: {
    position: 'relative',
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorIndicator: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  iconEmoji: {
    fontSize: 24,
    textAlign: 'center',
  },
  iconEmojiOverlay: {
    position: 'absolute',
    fontSize: 24,
    textAlign: 'center',
    top: 12,
    left: 12,
  },
  optionText: {
    flex: 1,
    gap: Spacing.xs,
  },
  optionTitle: {
    fontWeight: Typography.bodyBold.fontWeight,
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight,
  },
  optionDescription: {
    fontSize: Typography.caption.fontSize,
    lineHeight: Typography.caption.lineHeight,
    opacity: 0.8,
  },
  radioContainer: {
    paddingLeft: Spacing.sm,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
