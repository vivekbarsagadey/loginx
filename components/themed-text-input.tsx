import { AccessibilityHints } from '@/constants/accessibility';
import { useThemeColor } from '@/hooks/use-theme-color';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

export type ThemedTextInputProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
};

export function ThemedTextInput({ style, lightColor, darkColor, accessibilityLabel, accessibilityHint, placeholder, ...rest }: ThemedTextInputProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return (
    <TextInput
      style={[{ color, backgroundColor }, styles.input, style]}
      placeholder={placeholder}
      accessible={true}
      accessibilityLabel={accessibilityLabel || placeholder || 'Text input'}
      accessibilityHint={accessibilityHint || AccessibilityHints.INPUT_EDIT}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
  },
});
