import { getUserProfile } from '@/actions/user.action';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/layout';
import { useAuth } from '@/hooks/use-auth-provider';
import { useThemeColor } from '@/hooks/use-theme-color';
import { UserProfile } from '@/types/user';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';

export default function IndexScreen() {
  const { user } = useAuth();
  const borderColor = useThemeColor({}, 'border');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          if (profile) {
            setUserProfile(profile);
          } else {
            Alert.alert('Error', 'User profile not found.');
          }
        } catch (error) {
          console.error('Error fetching user profile: ', error);
          Alert.alert('Error', 'Failed to fetch user profile.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserProfile();
  }, [user]);

  if (loading) {
    return (
      <ScreenContainer centerContent>
        <ActivityIndicator size="large" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable>
      {userProfile ? (
        <>
          <ThemedText type="h1">Welcome, {userProfile.displayName}!</ThemedText>
          <ThemedText type="body" style={styles.email}>
            {userProfile.email}
          </ThemedText>
          <ThemedText type="body">Age: {userProfile.age}</ThemedText>

          <View style={[styles.section, { borderColor: borderColor }]}>
            <ThemedText type="h2">Your Notification Preferences</ThemedText>
            <ThemedText>Push Notifications: {userProfile.pushEnabled ? 'Enabled' : 'Disabled'}</ThemedText>
            <ThemedText>Email Updates: {userProfile.emailUpdates ? 'Enabled' : 'Disabled'}</ThemedText>
            <ThemedText>Marketing Tips: {userProfile.marketingTips ? 'Enabled' : 'Disabled'}</ThemedText>
          </View>
        </>
      ) : (
        <ThemedText type="h1">Welcome!</ThemedText>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  email: {
    marginVertical: Spacing.md,
  },
  section: {
    marginTop: Spacing.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
  },
});
