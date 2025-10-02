import { ThemedButton } from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform, StyleSheet, View } from 'react-native';

interface SocialSignInButtonsProps {
  onGoogleSignIn: () => void;
  onAppleSignIn: () => void;
  loading?: boolean;
  mode?: 'register' | 'login';
}

/**
 * Social Sign-In Buttons Component
 * Displays Google and Apple sign-in buttons with proper platform handling
 */
export function SocialSignInButtons({ onGoogleSignIn, onAppleSignIn, loading = false, mode = 'register' }: SocialSignInButtonsProps) {
  const borderColor = useThemeColor({}, 'border');

  const actionText = mode === 'register' ? 'Sign up' : 'Sign in';

  return (
    <ThemedView style={styles.container}>
      {/* Divider with "OR" text */}
      <View style={styles.dividerContainer}>
        <View style={[styles.divider, { backgroundColor: borderColor }]} />
        <ThemedText type="caption" style={styles.dividerText}>
          OR
        </ThemedText>
        <View style={[styles.divider, { backgroundColor: borderColor }]} />
      </View>

      {/* Social Sign-In Buttons */}
      <View style={styles.buttonsContainer}>
        {/* Google Sign-In Button */}
        <ThemedButton
          title={`${actionText} with Google`}
          onPress={onGoogleSignIn}
          variant="secondary"
          disabled={loading}
          style={styles.socialButton}
          accessibilityLabel={`${actionText} with Google`}
          accessibilityHint="Sign in using your Google account"
        />

        {/* Apple Sign-In Button - iOS only */}
        {Platform.OS === 'ios' && (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={mode === 'register' ? AppleAuthentication.AppleAuthenticationButtonType.SIGN_UP : AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={8}
            style={styles.appleButton}
            onPress={onAppleSignIn}
          />
        )}

        {/* Apple Sign-In Button - Android/Web fallback */}
        {Platform.OS !== 'ios' && (
          <ThemedButton
            title={`${actionText} with Apple`}
            onPress={onAppleSignIn}
            variant="secondary"
            disabled={loading}
            style={styles.socialButton}
            accessibilityLabel={`${actionText} with Apple`}
            accessibilityHint="Sign in using your Apple ID"
          />
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    opacity: 0.6,
  },
  buttonsContainer: {
    gap: 12,
  },
  socialButton: {
    width: '100%',
  },
  appleButton: {
    width: '100%',
    height: 48,
  },
});
