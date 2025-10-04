import { AccessibilityHints } from '@/constants/accessibility';
import { InputField, Spacing } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

export type ThemedTextInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
};

export function ThemedTextInput({ style, lightColor, darkColor, accessibilityLabel, accessibilityHint, placeholder, placeholderTextColor, ...rest }: ThemedTextInputProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'surface');
  const borderColor = useThemeColor({ light: lightColor, dark: darkColor }, 'border');
  const defaultPlaceholderColor = useThemeColor({}, 'text-muted');
  const placeholderColor = placeholderTextColor || defaultPlaceholderColor;

  return (
    <TextInput
      style={[{ color, backgroundColor, borderColor }, styles.input, style]}
      placeholder={placeholder}
      placeholderTextColor={placeholderColor}
      accessible={true}
      accessibilityLabel={accessibilityLabel || placeholder || 'Text input'}
      accessibilityHint={accessibilityHint || AccessibilityHints.INPUT_EDIT}
      {...rest}
    />
  );
}

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
});
