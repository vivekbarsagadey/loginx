import { ThemedText } from '@/components/themed-text';
import { Overlay, Spacing, TouchTarget } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import { hexToRgba } from '@/utils/color';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';

export interface ActionSheetOption {
  /** Option label */
  label: string;
  /** Option icon name from Feather icons */
  icon?: React.ComponentProps<typeof Feather>['name'];
  /** Callback when option is selected */
  onPress: () => void | Promise<void>;
  /** Whether this is a destructive action (red) */
  destructive?: boolean;
  /** Whether option is disabled */
  disabled?: boolean;
}

export interface ActionSheetProps {
  /** Whether the action sheet is visible */
  visible: boolean;
  /** Callback when sheet should close */
  onClose: () => void;
  /** Sheet title */
  title?: string;
  /** Sheet message/description */
  message?: string;
  /** Action options */
  options: ActionSheetOption[];
  /** Show cancel button */
  showCancel?: boolean;
  /** Cancel button text */
  cancelText?: string;
}

/**
 * Action Sheet Component
 * iOS-style action sheet for selecting from multiple options
 */
export function ActionSheet({ visible, onClose, title, message, options, showCancel = true, cancelText = 'Cancel' }: ActionSheetProps) {
  const backgroundColor = useThemeColor({}, 'surface');
  const inverseTextColor = useThemeColor({}, 'inverse-text');
  const overlayColor = hexToRgba(inverseTextColor, Overlay.medium);
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const textMutedColor = useThemeColor({}, 'text-muted');
  const primaryColor = useThemeColor({}, 'primary');
  const errorColor = useThemeColor({}, 'error');

  const handleBackdropPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  const handleOptionPress = async (option: ActionSheetOption) => {
    if (option.disabled) {
      return;
    }

    await Haptics.impactAsync(option.destructive ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Light);

    await option.onPress();
    onClose();
  };

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        overlay: {
          flex: 1,
          backgroundColor: overlayColor,
          justifyContent: 'flex-end',
        },
        sheetContainer: {
          backgroundColor,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          borderTopWidth: 1,
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderColor,
          paddingBottom: Spacing.xl,
          maxHeight: '80%',
        },
        header: {
          paddingHorizontal: Spacing.lg,
          paddingVertical: Spacing.lg,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: borderColor,
        },
        title: {
          color: textColor,
          textAlign: 'center',
        },
        message: {
          color: textMutedColor,
          textAlign: 'center',
          marginTop: Spacing.xs,
        },
        scrollView: {
          maxHeight: '70%',
        },
        optionsContainer: {
          paddingTop: Spacing.sm,
        },
        option: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: Spacing.lg,
          paddingVertical: Spacing.md,
          minHeight: TouchTarget.large,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: borderColor,
        },
        optionDisabled: {
          opacity: 0.4,
        },
        optionIcon: {
          marginRight: Spacing.md,
        },
        optionLabel: {
          flex: 1,
          color: textColor,
          fontSize: 16,
          lineHeight: 22,
        },
        optionLabelDestructive: {
          color: errorColor,
        },
        cancelButton: {
          marginTop: Spacing.sm,
          marginHorizontal: Spacing.lg,
          minHeight: TouchTarget.large,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor,
          borderRadius: 12,
          borderWidth: 1,
          borderColor,
        },
        cancelText: {
          color: textColor,
          fontWeight: '600',
        },
      }),
    [backgroundColor, overlayColor, borderColor, textColor, textMutedColor, errorColor]
  );

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent onRequestClose={handleBackdropPress}>
      <Animated.View style={styles.overlay} entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleBackdropPress} />
        <Animated.View style={styles.sheetContainer} entering={SlideInDown.duration(300).springify()} exiting={SlideOutDown.duration(250)}>
          {(title || message) && (
            <View style={styles.header}>
              {title && (
                <ThemedText type="h3" style={styles.title}>
                  {title}
                </ThemedText>
              )}
              {message && (
                <ThemedText type="caption" style={styles.message}>
                  {message}
                </ThemedText>
              )}
            </View>
          )}
          <ScrollView style={styles.scrollView}>
            <View style={styles.optionsContainer}>
              {options.map((option, index) => (
                <Pressable
                  key={`${option.label}-${index}`}
                  style={({ pressed }) => [styles.option, option.disabled && styles.optionDisabled, pressed && { opacity: 0.6 }]}
                  onPress={() => handleOptionPress(option)}
                  disabled={option.disabled}
                  accessibilityRole="button"
                  accessibilityLabel={option.label}
                  accessibilityState={{ disabled: option.disabled }}
                >
                  {option.icon && <Feather name={option.icon} size={24} color={option.destructive ? errorColor : textColor} style={styles.optionIcon} />}
                  <ThemedText type="body" style={[styles.optionLabel, option.destructive && styles.optionLabelDestructive]}>
                    {option.label}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </ScrollView>
          {showCancel && (
            <Pressable style={({ pressed }) => [styles.cancelButton, pressed && { opacity: 0.6 }]} onPress={handleBackdropPress} accessibilityRole="button" accessibilityLabel={cancelText}>
              <ThemedText style={styles.cancelText}>{cancelText}</ThemedText>
            </Pressable>
          )}
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

/**
 * Hook to manage action sheet state
 */
export function useActionSheet() {
  const [visible, setVisible] = React.useState(false);
  const [config, setConfig] = React.useState<{
    title?: string;
    message?: string;
    options: ActionSheetOption[];
  } | null>(null);

  const show = React.useCallback((options: ActionSheetOption[], title?: string, message?: string) => {
    setConfig({ title, message, options });
    setVisible(true);
  }, []);

  const hide = React.useCallback(() => {
    setVisible(false);
    setTimeout(() => setConfig(null), 300);
  }, []);

  return {
    visible,
    config,
    show,
    hide,
  };
}
