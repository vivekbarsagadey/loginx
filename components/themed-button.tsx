
import {
  TouchableOpacity,
  TouchableOpacityProps,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/constants/theme';

export type ThemedButtonProps = TouchableOpacityProps & {
  title: string;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'link';
  loading?: boolean;
};

export function ThemedButton({
  title,
  style,
  variant = 'primary',
  disabled,
  loading,
  ...rest
}: ThemedButtonProps) {
  const primaryColor = useThemeColor({}, 'primary');
  const onPrimaryColor = useThemeColor({}, 'on-primary');
  const textColor = useThemeColor({}, 'text');
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
      backgroundColor: 'transparent',
    },
    link: {
      backgroundColor: 'transparent',
      height: 'auto',
      paddingHorizontal: 0,
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

  const buttonStyle = buttonStyles[variant];
  const textStyle = textStyles[variant];
  const disabledStyle: ViewStyle = disabled || loading ? { opacity: 0.5 } : {};

  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle, disabledStyle, style]}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? onPrimaryColor : primaryColor} />
      ) : (
        <Text style={[styles.text, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48, // Meets >= 44px tap target
    borderRadius: 12, // New radius spec
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 8, // From spacing scale
  },
  text: {
    fontSize: 16, // Body
    fontWeight: '600', // A bit bolder for buttons
    lineHeight: 16 * 1.4,
  },
});
