import { ThemedButton } from '@/components/themed-button';
import { ThemedDivider } from '@/components/themed-divider';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/layout';
import { gap } from '@/constants/style-utils';
import * as AppleAuthentication from 'expo-apple-authentication';
import Constants from 'expo-constants';
import { Platform, StyleSheet, View } from 'react-native';

interface SocialSignInButtonsProps {
  onGoogleSignIn?: () => void;
  onAppleSignIn?: () => void;
  onFacebookSignIn?: () => void;
  loading?: boolean;
  mode?: 'register' | 'login';
}

/**
 * Social Sign-In Buttons Component
 * Displays Google, Apple, and Facebook sign-in buttons with proper platform handling
 */
export function SocialSignInButtons({ onGoogleSignIn, onAppleSignIn, onFacebookSignIn, loading = false, mode = 'register' }: SocialSignInButtonsProps) {
  const actionText = mode === 'register' ? 'Sign up' : 'Sign in';

  // Check if running in Expo Go (Google Sign-In not available)
  const isExpoGo = Constants.appOwnership === 'expo';

  return (
    <ThemedView style={styles.container}>
      {/* Divider with "OR" text */}
      <ThemedDivider text="OR" spacing="lg" />

      {/* Social Sign-In Buttons */}
      <View style={styles.buttonsContainer}>
        {/* Google Sign-In Button - Disabled in Expo Go */}
        {onGoogleSignIn && (
          <ThemedButton
            title={`${actionText} with Google`}
            onPress={onGoogleSignIn}
            variant="secondary"
            disabled={loading || isExpoGo}
            style={styles.socialButton}
            accessibilityLabel={`${actionText} with Google`}
            accessibilityHint={isExpoGo ? 'Not available in Expo Go' : 'Sign in using your Google account'}
          />
        )}

        {/* Apple Sign-In Button - iOS only */}
        {onAppleSignIn && Platform.OS === 'ios' && (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={mode === 'register' ? AppleAuthentication.AppleAuthenticationButtonType.SIGN_UP : AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={8}
            style={styles.appleButton}
            onPress={() => onAppleSignIn()}
          />
        )}

        {/* Apple Sign-In Button - Android/Web fallback */}
        {onAppleSignIn && Platform.OS !== 'ios' && (
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

        {/* Facebook Sign-In Button */}
        {onFacebookSignIn && (
          <ThemedButton
            title={`${actionText} with Facebook`}
            onPress={onFacebookSignIn}
            variant="secondary"
            disabled={loading}
            style={styles.socialButton}
            accessibilityLabel={`${actionText} with Facebook`}
            accessibilityHint="Sign in using your Facebook account"
          />
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    ...gap.lg,
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  buttonsContainer: {
    ...gap.md,
  },
  socialButton: {
    width: '100%',
  },
  appleButton: {
    width: '100%',
    height: 52,
  },
});
