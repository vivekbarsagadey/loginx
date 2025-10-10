import { AccessibilityHints } from '@/constants/accessibility';
import { InputField, Spacing } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import { memo, useState } from 'react';
import { StyleSheet, TextInput, type TextInputProps } from 'react-native';

export type ThemedTextInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
};

function ThemedTextInputComponent({ style, lightColor, darkColor, accessibilityLabel, accessibilityHint, placeholder, placeholderTextColor, ...rest }: ThemedTextInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'surface');
  const borderColor = useThemeColor({ light: lightColor, dark: darkColor }, 'border');
  const primaryColor = useThemeColor({}, 'primary');
  const defaultPlaceholderColor = useThemeColor({}, 'text-muted');
  const placeholderColor = placeholderTextColor || defaultPlaceholderColor;

  return (
    <TextInput
      style={[{ color, backgroundColor, borderColor: isFocused ? primaryColor : borderColor }, styles.input, isFocused && styles.inputFocused, style]}
      placeholder={placeholder}
      placeholderTextColor={placeholderColor}
      accessible={true}
      accessibilityLabel={accessibilityLabel || placeholder || 'Text input'}
      accessibilityHint={accessibilityHint || AccessibilityHints.INPUT_EDIT}
      onFocus={(e) => {
        setIsFocused(true);
        rest.onFocus?.(e);
      }}
      onBlur={(e) => {
        setIsFocused(false);
        rest.onBlur?.(e);
      }}
      {...rest}
    />
  );
}

export const ThemedTextInput = memo(ThemedTextInputComponent);

const styles = StyleSheet.create({
  input: {
    height: InputField.height,
    borderWidth: InputField.borderWidth,
    borderRadius: InputField.borderRadius,
    paddingHorizontal: InputField.paddingHorizontal,
    fontSize: InputField.fontSize,
    marginVertical: Spacing.sm,
    width: '100%',
  },
  inputFocused: {
    borderWidth: 2,
  },
});
