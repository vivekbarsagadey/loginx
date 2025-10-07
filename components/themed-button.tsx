import { AccessibilityHints, AccessibilityRoles } from '@/constants/accessibility';
import { Button as ButtonConstants, Spacing, TouchTarget } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import { memo } from 'react';
import { ActivityIndicator, StyleSheet, TextStyle, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native';
import { ThemedText } from './themed-text';

export type ThemedButtonProps = TouchableOpacityProps & {
  title: string;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'link';
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
  const primaryColor = useThemeColor({}, 'primary');
  const onPrimaryColor = useThemeColor({}, 'on-primary');
  const surfaceColor = useThemeColor({}, 'surface');
  const borderColor = useThemeColor({}, 'border');

  const buttonStyles: { [key: string]: ViewStyle } = {
    primary: {
      backgroundColor: primaryColor,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    secondary: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: primaryColor,
    },
    tertiary: {
      backgroundColor: surfaceColor,
      borderWidth: 1,
      borderColor: borderColor,
    },
    link: {
      backgroundColor: 'transparent',
      height: 'auto',
      paddingHorizontal: 0,
      minHeight: TouchTarget.minimum,
    },
  };

  const textStyles: { [key: string]: TextStyle } = {
    primary: {
      color: onPrimaryColor,
    },
    secondary: {
      color: primaryColor,
    },
    tertiary: {
      color: primaryColor,
    },
    link: {
      color: primaryColor,
      textDecorationLine: 'underline',
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
      {...rest}
    >
      {loading ? <ActivityIndicator color={variant === 'primary' ? onPrimaryColor : primaryColor} /> : <ThemedText style={[styles.text, textStyle]}>{title}</ThemedText>}
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
