
import React from 'react';
import {
  TextInput,
  TextInputProps,
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedInputProps = TextInputProps & {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  containerStyle?: ViewStyle;
};

export function ThemedInput({
  label,
  helperText,
  errorMessage,
  style,
  containerStyle,
  ...rest
}: ThemedInputProps) {
  const textColor = useThemeColor({}, 'text');
  const mutedColor = useThemeColor({}, 'text-muted');
  const errorColor = useThemeColor({}, 'error');
  const borderColor = useThemeColor({}, 'border');
  const primaryColor = useThemeColor({}, 'primary');
  const backgroundColor = useThemeColor({}, 'surface');

  const [isFocused, setIsFocused] = React.useState(false);

  const focusStyle: ViewStyle = isFocused ? { borderColor: primaryColor, borderWidth: 2 } : {};
  const errorStyle: ViewStyle = errorMessage ? { borderColor: errorColor, borderWidth: 2 } : {};

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          { color: textColor, backgroundColor, borderColor },
          focusStyle,
          errorStyle,
          style,
        ]}
        placeholderTextColor={mutedColor}
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
      {errorMessage && (
        <Text style={[styles.helperText, { color: errorColor }]}>{errorMessage}</Text>
      )}
      {helperText && !errorMessage && (
        <Text style={styles.helperText}>{helperText}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8, // Spacing scale
  },
  label: {
    fontSize: 16, // Body
    color: '#6B7280', // text-muted
    marginBottom: 8, // Spacing scale
  },
  input: {
    height: 48, // Meets >= 44px tap target
    borderWidth: 1,
    borderRadius: 12, // New radius spec
    paddingHorizontal: 16, // Spacing scale
    fontSize: 16,
  },
  helperText: {
    fontSize: 13, // Caption
    color: '#6B7280', // text-muted
    marginTop: 8, // Spacing scale
  },
});
