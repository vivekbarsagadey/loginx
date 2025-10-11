import { AccessibilityHints, AccessibilityRoles } from '@/constants/accessibility';
import { Button as ButtonConstants, Spacing, TouchTarget } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme-colors';
import * as Haptics from 'expo-haptics';
import { memo } from 'react';
import { ActivityIndicator, type GestureResponderEvent, StyleSheet, type TextStyle, TouchableOpacity, type TouchableOpacityProps, type ViewStyle } from 'react-native';
import { ThemedText } from './themed-text';

export type ThemedButtonProps = TouchableOpacityProps & {
  title: string;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'link' | 'destructive';
  loading?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  /**
   * Button size
   * @default 'comfortable'
   */
  size?: 'minimum' | 'comfortable' | 'large';
};

function ThemedButtonComponent({ title, style, variant = 'primary', disabled, loading, accessibilityLabel, accessibilityHint, size = 'comfortable', ...rest }: ThemedButtonProps) {
  const colors = useThemeColors();

  const handlePress = (e: GestureResponderEvent) => {
    if (disabled || loading) {
      return;
    }

    // Fire haptic feedback without blocking the press handler
    // Use heavy haptic for destructive actions to warn users
    const hapticStyle = variant === 'destructive' ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Light;

    Haptics.impactAsync(hapticStyle).catch((hapticError: unknown) => {
      // Device may not support haptics - log but don't interrupt user experience
      if (__DEV__ && hapticError instanceof Error) {
        console.warn('[ThemedButton] Haptic feedback unavailable:', hapticError.message);
      }
    });

    rest.onPress?.(e);
  };

  const buttonStyles: { [key: string]: ViewStyle } = {
    primary: {
      backgroundColor: colors.primary,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    secondary: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.primary,
    },
    tertiary: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    link: {
      backgroundColor: 'transparent',
      height: 'auto',
      paddingHorizontal: 0,
      minHeight: TouchTarget.minimum,
    },
    destructive: {
      backgroundColor: colors.error,
      borderWidth: 1,
      borderColor: 'transparent',
    },
  };

  const textStyles: { [key: string]: TextStyle } = {
    primary: {
      color: colors['on-primary'],
    },
    secondary: {
      color: colors.primary,
    },
    tertiary: {
      color: colors.primary,
    },
    link: {
      color: colors.primary,
      textDecorationLine: 'underline',
    },
    destructive: {
      color: colors['on-primary'],
    },
  };

  const sizeStyles: { [key: string]: ViewStyle } = {
    minimum: { height: TouchTarget.minimum },
    comfortable: { height: TouchTarget.comfortable },
    large: { height: TouchTarget.large },
  };

  const buttonStyle = buttonStyles[variant];
  const textStyle = textStyles[variant];
  const sizeStyle = sizeStyles[size];
  const disabledStyle: ViewStyle = disabled || loading ? { opacity: 0.5 } : {};

  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle, sizeStyle, disabledStyle, style]}
      disabled={disabled || loading}
      accessible={true}
      accessibilityRole={variant === 'link' ? AccessibilityRoles.LINK : AccessibilityRoles.BUTTON}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint || (loading ? 'Loading' : AccessibilityHints.BUTTON_TAP)}
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      activeOpacity={0.7}
      {...rest}
      onPress={handlePress}
    >
      {loading ? <ActivityIndicator color={variant === 'primary' ? colors['on-primary'] : colors.primary} /> : <ThemedText style={[styles.text, textStyle]}>{title}</ThemedText>}
    </TouchableOpacity>
  );
}

export const ThemedButton = memo(ThemedButtonComponent);

const styles = StyleSheet.create({
  button: {
    height: ButtonConstants.height,
    borderRadius: ButtonConstants.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ButtonConstants.paddingHorizontal,
    minWidth: ButtonConstants.minWidth,
    marginVertical: Spacing.sm,
  },
  text: {
    fontSize: ButtonConstants.fontSize,
    fontWeight: '600',
    lineHeight: ButtonConstants.fontSize * 1.4,
  },
});
