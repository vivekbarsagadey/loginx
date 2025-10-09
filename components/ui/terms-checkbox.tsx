import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

interface TermsCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
}

/**
 * Terms & Privacy Checkbox Component
 * Required checkbox for accepting terms of service and privacy policy
 */
export function TermsCheckbox({ checked, onChange, error }: TermsCheckboxProps) {
  const primaryColor = useThemeColor({}, 'primary');
  const errorColor = useThemeColor({}, 'error');
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const onPrimaryColor = useThemeColor({}, 'on-primary');

  const [isPressed, setIsPressed] = useState(false);

  const handlePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChange(!checked);
  };

  const checkboxBorderColor = error ? errorColor : checked ? primaryColor : borderColor;

  return (
    <ThemedView style={styles.container}>
      <Pressable
        onPress={handlePress}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        style={[
          styles.checkbox,
          {
            borderColor: checkboxBorderColor,
            backgroundColor: checked ? primaryColor : 'transparent',
            opacity: isPressed ? 0.7 : 1,
          },
        ]}
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
        accessibilityLabel="Accept terms and conditions"
        accessibilityHint="Required to create an account"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        {checked ? <Ionicons name="checkmark" size={18} color={onPrimaryColor} /> : null}
      </Pressable>

      <ThemedView style={styles.textContainer}>
        <ThemedText style={[styles.text, { color: textColor }]}>
          I agree to the{' '}
          <Link href="/legal/terms" asChild>
            <ThemedText style={[styles.link, { color: primaryColor }]}>Terms of Service</ThemedText>
          </Link>{' '}
          and{' '}
          <Link href="/legal/privacy" asChild>
            <ThemedText style={[styles.link, { color: primaryColor }]}>Privacy Policy</ThemedText>
          </Link>
        </ThemedText>

        {error ? <ThemedText style={[styles.errorText, { color: errorColor }]}>{error}</ThemedText> : null}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 16,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    minHeight: 24,
    minWidth: 24,
  },
  textContainer: {
    flex: 1,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
  },
  link: {
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  errorText: {
    fontSize: 13,
    marginTop: 6,
    lineHeight: 18,
  },
});
