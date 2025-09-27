import { useAuth } from '@/hooks/use-auth-provider';
import { Redirect } from 'expo-router';

export default function WelcomeScreen() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(tabs)" />;
}
