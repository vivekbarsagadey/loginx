import { ThemedText } from '@/components/themed-text';
import { Overlay, Spacing, TouchTarget } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/i18n';
import { hexToRgba } from '@/utils/color';
import * as Haptics from 'expo-haptics';
import React, { useEffect } from 'react';
import { Modal, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

/**
 * Base Dialog Props Interface
 */
export interface DialogProps {
  /** Whether the dialog is visible */
  visible: boolean;
  /** Callback when dialog should close */
  onClose: () => void;
  /** Dialog title */
  title: string;
  /** Dialog message/description */
  message?: string;
  /** Custom content to render in dialog body */
  children?: React.ReactNode;
  /** Whether dialog can be dismissed by tapping outside */
  dismissable?: boolean;
  /** Dialog variant - affects styling */
  variant?: 'default' | 'success' | 'warning' | 'error';
}

/**
 * Confirmation Dialog Props
 */
export interface ConfirmationDialogProps extends DialogProps {
  /** Confirm button text */
  confirmText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Callback when confirm is pressed */
  onConfirm: () => void | Promise<void>;
  /** Callback when cancel is pressed */
  onCancel?: () => void;
  /** Whether action is destructive (red button) */
  destructive?: boolean;
  /** Whether confirm action is loading */
  loading?: boolean;
}

/**
 * Alert Dialog Props (single button)
 */
export interface AlertDialogProps extends DialogProps {
  /** Button text */
  buttonText?: string;
  /** Callback when button is pressed */
  onPress?: () => void;
}

/**
 * Base Dialog Component
 * Provides themed modal with backdrop and animations
 */
export function Dialog({ visible, onClose, title, message, children, dismissable = true, variant = 'default' }: DialogProps) {
  const { width } = useWindowDimensions();
  const backgroundColor = useThemeColor({}, 'surface');
  const inverseTextColor = useThemeColor({}, 'inverse-text');
  const overlayColor = hexToRgba(inverseTextColor, Overlay.medium);
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const textMutedColor = useThemeColor({}, 'text-muted');

  // Get variant color
  const variantColor = useThemeColor({}, variant === 'default' ? 'primary' : variant === 'success' ? 'success' : variant === 'warning' ? 'warning' : 'error');

  const scale = useSharedValue(0.9);

  useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 150,
      });
    }
  }, [visible, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleBackdropPress = async () => {
    if (dismissable) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onClose();
    }
  };

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        overlay: {
          flex: 1,
          backgroundColor: overlayColor,
          justifyContent: 'center',
          alignItems: 'center',
          padding: Spacing.lg,
        },
        dialogContainer: {
          width: Math.min(width - Spacing.xl * 2, 400),
          backgroundColor,
          borderRadius: 16,
          borderWidth: 1,
          borderColor,
          overflow: 'hidden',
        },
        header: {
          padding: Spacing.lg,
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
        },
        title: {
          color: textColor,
        },
        content: {
          padding: Spacing.lg,
        },
        message: {
          color: textMutedColor,
          lineHeight: 22,
        },
        variantIndicator: {
          height: 4,
          backgroundColor: variantColor,
        },
      }),
    [width, backgroundColor, overlayColor, borderColor, textColor, textMutedColor, variantColor]
  );

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent onRequestClose={handleBackdropPress}>
      <Animated.View style={styles.overlay} entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleBackdropPress} />
        <Animated.View style={[styles.dialogContainer, animatedStyle]}>
          <View style={styles.variantIndicator} />
          <View style={styles.header}>
            <ThemedText type="h2" style={styles.title}>
              {title}
            </ThemedText>
          </View>
          <View style={styles.content}>
            {message && (
              <ThemedText type="body" style={styles.message}>
                {message}
              </ThemedText>
            )}
            {children}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

/**
 * Themed Alert Dialog Component
 * Single action dialog (like Alert.alert with one button)
 */
export function ThemedAlert({ visible, onClose, title, message, buttonText = i18n.t('dialogs.buttons.ok'), onPress, variant = 'default', dismissable = true }: AlertDialogProps) {
  const primaryColor = useThemeColor({}, 'primary');
  const onPrimaryColor = useThemeColor({}, 'on-primary');

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onPress) {
      await onPress();
    }
    onClose();
  };

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        actions: {
          flexDirection: 'row',
          justifyContent: 'flex-end',
          paddingHorizontal: Spacing.lg,
          paddingBottom: Spacing.lg,
          gap: Spacing.md,
        },
        button: {
          minHeight: TouchTarget.comfortable,
          paddingHorizontal: Spacing.lg,
          paddingVertical: Spacing.md,
          borderRadius: 8,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: primaryColor,
        },
        buttonText: {
          color: onPrimaryColor,
          fontWeight: '600',
          fontSize: 16,
        },
      }),
    [primaryColor, onPrimaryColor]
  );

  return (
    <Dialog visible={visible} onClose={onClose} title={title} message={message} variant={variant} dismissable={dismissable}>
      <View style={styles.actions}>
        <Pressable style={({ pressed }) => [styles.button, pressed && { opacity: 0.8 }]} onPress={handlePress} accessibilityRole="button" accessibilityLabel={buttonText}>
          <ThemedText style={styles.buttonText}>{buttonText}</ThemedText>
        </Pressable>
      </View>
    </Dialog>
  );
}

/**
 * Confirmation Dialog Component
 * Two-action dialog (like Alert.alert with confirm/cancel)
 */
export function ConfirmationDialog({
  visible,
  onClose,
  title,
  message,
  confirmText = i18n.t('dialogs.buttons.confirm'),
  cancelText = i18n.t('dialogs.buttons.cancel'),
  onConfirm,
  onCancel,
  destructive = false,
  loading = false,
  variant = 'default',
  dismissable = true,
}: ConfirmationDialogProps) {
  const primaryColor = useThemeColor({}, 'primary');
  const onPrimaryColor = useThemeColor({}, 'on-primary');
  const errorColor = useThemeColor({}, 'error');
  const textMutedColor = useThemeColor({}, 'text-muted');
  const borderColor = useThemeColor({}, 'border');

  const handleConfirm = async () => {
    await Haptics.impactAsync(destructive ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Medium);
    await onConfirm();
    onClose();
  };

  const handleCancel = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        actions: {
          flexDirection: 'row',
          justifyContent: 'flex-end',
          paddingHorizontal: Spacing.lg,
          paddingBottom: Spacing.lg,
          gap: Spacing.md,
        },
        button: {
          minHeight: TouchTarget.comfortable,
          paddingHorizontal: Spacing.lg,
          paddingVertical: Spacing.md,
          borderRadius: 8,
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        },
        cancelButton: {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor,
        },
        confirmButton: {
          backgroundColor: destructive ? errorColor : primaryColor,
        },
        cancelButtonText: {
          color: textMutedColor,
          fontWeight: '600',
          fontSize: 16,
        },
        confirmButtonText: {
          color: onPrimaryColor,
          fontWeight: '600',
          fontSize: 16,
        },
        loadingButton: {
          opacity: 0.6,
        },
      }),
    [primaryColor, errorColor, textMutedColor, borderColor, destructive, onPrimaryColor]
  );

  return (
    <Dialog visible={visible} onClose={onClose} title={title} message={message} variant={destructive ? 'error' : variant} dismissable={dismissable && !loading}>
      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [styles.button, styles.cancelButton, pressed && { opacity: 0.6 }, loading && { opacity: 0.4 }]}
          onPress={handleCancel}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel={cancelText}
        >
          <ThemedText style={styles.cancelButtonText}>{cancelText}</ThemedText>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.button, styles.confirmButton, pressed && { opacity: 0.8 }, loading && styles.loadingButton]}
          onPress={handleConfirm}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel={confirmText}
          accessibilityState={{ busy: loading }}
        >
          <ThemedText style={styles.confirmButtonText}>{loading ? 'Loading...' : confirmText}</ThemedText>
        </Pressable>
      </View>
    </Dialog>
  );
}

/**
 * Bottom Sheet Dialog Component
 * Modern mobile-friendly dialog that slides from bottom
 */
export interface BottomSheetProps {
  /** Whether the bottom sheet is visible */
  visible: boolean;
  /** Callback when sheet should close */
  onClose: () => void;
  /** Sheet title */
  title?: string;
  /** Sheet content */
  children: React.ReactNode;
  /** Whether sheet can be dismissed by swiping down or tapping outside */
  dismissable?: boolean;
  /** Snap points for sheet height (percentage of screen height) */
  snapPoint?: number;
}

export function BottomSheet({ visible, onClose, title, children, dismissable = true }: BottomSheetProps) {
  const backgroundColor = useThemeColor({}, 'surface');
  const inverseTextColor = useThemeColor({}, 'inverse-text');
  const overlayColor = hexToRgba(inverseTextColor, Overlay.medium);
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const textMutedColor = useThemeColor({}, 'text-muted');

  const handleBackdropPress = async () => {
    if (dismissable) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onClose();
    }
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
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          borderTopWidth: 1,
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderColor,
          paddingBottom: Spacing.xl,
        },
        handle: {
          width: 48,
          height: 5,
          backgroundColor: textMutedColor,
          borderRadius: 3,
          alignSelf: 'center',
          marginTop: Spacing.md,
          marginBottom: Spacing.md,
          opacity: 0.4,
        },
        header: {
          paddingHorizontal: Spacing.lg,
          paddingVertical: Spacing.md,
          borderBottomWidth: title ? 1 : 0,
          borderBottomColor: borderColor,
        },
        title: {
          color: textColor,
        },
        content: {
          paddingHorizontal: Spacing.lg,
          paddingTop: Spacing.lg,
        },
      }),
    [backgroundColor, overlayColor, borderColor, textColor, textMutedColor, title]
  );

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent onRequestClose={handleBackdropPress}>
      <Animated.View style={styles.overlay} entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleBackdropPress} />
        <Animated.View style={styles.sheetContainer} entering={SlideInDown.duration(300).springify()} exiting={SlideOutDown.duration(250)}>
          <View style={styles.handle} />
          {title && (
            <View style={styles.header}>
              <ThemedText type="h2" style={styles.title}>
                {title}
              </ThemedText>
            </View>
          )}
          <View style={styles.content}>{children}</View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
