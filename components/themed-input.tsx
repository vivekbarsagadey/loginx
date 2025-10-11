import { BorderRadius, Typography } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme-colors';
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
  const colors = useThemeColors();

  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Determine if we should show the password toggle icon
  const shouldShowToggle = showPasswordToggle ?? secureTextEntry;

  // Determine the actual secureTextEntry value
  const actualSecureTextEntry = shouldShowToggle ? !isPasswordVisible : secureTextEntry;

  const dynamicStyle: TextStyle = {};
  if (errorMessage) {
    dynamicStyle.borderColor = colors.error;
    dynamicStyle.borderWidth = 2;
  } else if (isFocused) {
    dynamicStyle.borderColor = colors.primary;
    dynamicStyle.borderWidth = 2;
  }

  const togglePasswordVisibility = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, { color: colors['text-muted'] }]}>{label}</Text>}
      <View style={styles.inputContainer}>
        <TextInput
          ref={ref}
          style={[styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }, dynamicStyle, shouldShowToggle && styles.inputWithIcon, style]}
          placeholderTextColor={colors['text-muted']}
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
            <Ionicons name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'} size={24} color={colors['text-muted']} />
          </Pressable>
        )}
      </View>
      {errorMessage && <Text style={[styles.helperText, { color: colors.error }]}>{errorMessage}</Text>}
      {helperText && !errorMessage && <Text style={[styles.helperText, { color: colors['text-muted'] }]}>{helperText}</Text>}
    </View>
  );
});

ThemedInput.displayName = 'ThemedInput';

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  label: {
    fontSize: Typography.body.fontSize,
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
    borderRadius: BorderRadius.md,
    paddingHorizontal: 16,
    fontSize: Typography.body.fontSize,
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
    fontSize: Typography.caption.fontSize,
    marginTop: 8,
    lineHeight: 18,
  },
});
