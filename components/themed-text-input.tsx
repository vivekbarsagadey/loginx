import { AccessibilityHints } from '@/constants/accessibility';
import { InputField, Spacing } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useThemeContext } from '@/hooks/use-theme-context';
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
  const colors = useThemeColors();
  const { resolvedTheme } = useThemeContext();

  const isLightTheme = !resolvedTheme.includes('dark');
  const color = (isLightTheme && lightColor) || (!isLightTheme && darkColor) || colors.text;
  const backgroundColor = (isLightTheme && lightColor) || (!isLightTheme && darkColor) || colors.surface;
  const borderColor = (isLightTheme && lightColor) || (!isLightTheme && darkColor) || colors.border;
  const placeholderColor = placeholderTextColor || colors['text-muted'];

  return (
    <TextInput
      style={[{ color, backgroundColor, borderColor: isFocused ? colors.primary : borderColor }, styles.input, isFocused && styles.inputFocused, style]}
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
