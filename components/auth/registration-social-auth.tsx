import { SocialSignInButtons } from '@/components/ui/social-sign-in-buttons';
import { useSocialAuth } from '@/hooks/use-social-auth';

interface RegistrationSocialAuthProps {
  visible: boolean;
}

export function RegistrationSocialAuth({ visible }: RegistrationSocialAuthProps) {
  const { signInWithGoogle, signInWithApple, loading: socialLoading } = useSocialAuth();

  if (!visible) {
    return null;
  }

  return <SocialSignInButtons onGoogleSignIn={signInWithGoogle} onAppleSignIn={signInWithApple} loading={socialLoading} mode="register" />;
}
