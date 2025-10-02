import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, TextStyle, View, ViewStyle } from 'react-native';

export type ThemedInputProps = TextInputProps & {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  containerStyle?: ViewStyle;
};

export function ThemedInput({ label, helperText, errorMessage, style, containerStyle, ...rest }: ThemedInputProps) {
  const textColor = useThemeColor({}, 'text');
  const mutedColor = useThemeColor({}, 'text-muted');
  const errorColor = useThemeColor({}, 'error');
  const borderColor = useThemeColor({}, 'border');
  const primaryColor = useThemeColor({}, 'primary');
  const backgroundColor = useThemeColor({}, 'surface');

  const [isFocused, setIsFocused] = React.useState(false);

  const dynamicStyle: TextStyle = {};
  if (errorMessage) {
    dynamicStyle.borderColor = errorColor;
    dynamicStyle.borderWidth = 2;
  } else if (isFocused) {
    dynamicStyle.borderColor = primaryColor;
    dynamicStyle.borderWidth = 2;
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, { color: textColor, backgroundColor, borderColor }, dynamicStyle, style]}
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
      {errorMessage && <Text style={[styles.helperText, { color: errorColor }]}>{errorMessage}</Text>}
      {helperText && !errorMessage && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  helperText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 8,
  },
});
