import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { forwardRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, type TextInputProps, type TextStyle, View, type ViewStyle } from 'react-native';

export type ThemedInputProps = TextInputProps & {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  containerStyle?: ViewStyle;
  /** Whether this is a password field that should show a toggle icon */
  showPasswordToggle?: boolean;
};

export const ThemedInput = forwardRef<TextInput, ThemedInputProps>(({ label, helperText, errorMessage, style, containerStyle, showPasswordToggle, secureTextEntry, ...rest }, ref) => {
  const textColor = useThemeColor({}, 'text');
  const mutedColor = useThemeColor({}, 'text-muted');
  const errorColor = useThemeColor({}, 'error');
  const borderColor = useThemeColor({}, 'border');
  const primaryColor = useThemeColor({}, 'primary');
  const backgroundColor = useThemeColor({}, 'surface');

  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Determine if we should show the password toggle icon
  const shouldShowToggle = showPasswordToggle ?? secureTextEntry;

  // Determine the actual secureTextEntry value
  const actualSecureTextEntry = shouldShowToggle ? !isPasswordVisible : secureTextEntry;

  const dynamicStyle: TextStyle = {};
  if (errorMessage) {
    dynamicStyle.borderColor = errorColor;
    dynamicStyle.borderWidth = 2;
  } else if (isFocused) {
    dynamicStyle.borderColor = primaryColor;
    dynamicStyle.borderWidth = 2;
  }

  const togglePasswordVisibility = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, { color: mutedColor }]}>{label}</Text>}
      <View style={styles.inputContainer}>
        <TextInput
          ref={ref}
          style={[styles.input, { color: textColor, backgroundColor, borderColor }, dynamicStyle, shouldShowToggle && styles.inputWithIcon, style]}
          placeholderTextColor={mutedColor}
          secureTextEntry={actualSecureTextEntry}
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
        {shouldShowToggle && (
          <Pressable
            onPress={togglePasswordVisibility}
            style={styles.iconButton}
            accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
            accessibilityRole="button"
            accessibilityHint="Toggle password visibility"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'} size={24} color={mutedColor} />
          </Pressable>
        )}
      </View>
      {errorMessage && <Text style={[styles.helperText, { color: errorColor }]}>{errorMessage}</Text>}
      {helperText && !errorMessage && <Text style={[styles.helperText, { color: mutedColor }]}>{helperText}</Text>}
    </View>
  );
});

ThemedInput.displayName = 'ThemedInput';

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    lineHeight: 22,
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    lineHeight: 22,
  },
  inputWithIcon: {
    paddingRight: 52, // Make room for the icon
  },
  iconButton: {
    position: 'absolute',
    right: 8,
    top: '50%',
    transform: [{ translateY: -22 }], // Half of button height (44/2)
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 44,
  },
  helperText: {
    fontSize: 13,
    marginTop: 8,
    lineHeight: 18,
  },
});
