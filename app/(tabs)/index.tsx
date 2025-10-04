import { getUserProfile } from '@/actions/user.action';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Spacing } from '@/constants/layout';
import { useAuth } from '@/hooks/use-auth-provider';
import { UserProfile } from '@/types/user';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';

export default function IndexScreen() {
  const { user } = useAuth();
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
          <View style={styles.welcomeSection}>
            <ThemedText type="h1">Welcome, {userProfile.displayName}!</ThemedText>
            <ThemedText type="body" style={styles.email}>
              {userProfile.email}
            </ThemedText>
            <ThemedText type="body" style={styles.age}>
              Age: {userProfile.age}
            </ThemedText>
          </View>

          <Card elevation={1} style={styles.card}>
            <ThemedText type="h2" style={styles.cardTitle}>
              Your Notification Preferences
            </ThemedText>

            <View style={styles.preferenceRow}>
              <ThemedText type="body">Push Notifications</ThemedText>
              <ThemedText type="body" style={styles.preferenceValue}>
                {userProfile.pushEnabled ? '✓ Enabled' : '✗ Disabled'}
              </ThemedText>
            </View>

            <View style={styles.preferenceRow}>
              <ThemedText type="body">Email Updates</ThemedText>
              <ThemedText type="body" style={styles.preferenceValue}>
                {userProfile.emailUpdates ? '✓ Enabled' : '✗ Disabled'}
              </ThemedText>
            </View>

            <View style={styles.preferenceRow}>
              <ThemedText type="body">Marketing Tips</ThemedText>
              <ThemedText type="body" style={styles.preferenceValue}>
                {userProfile.marketingTips ? '✓ Enabled' : '✗ Disabled'}
              </ThemedText>
            </View>
          </Card>
        </>
      ) : (
        <ThemedText type="h1">Welcome!</ThemedText>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  welcomeSection: {
    marginBottom: Spacing.lg,
  },
  email: {
    marginTop: Spacing.sm,
    opacity: 0.8,
  },
  age: {
    marginTop: Spacing.xs,
    opacity: 0.7,
  },
  card: {
    marginBottom: Spacing.lg,
  },
  cardTitle: {
    marginBottom: Spacing.md,
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  preferenceValue: {
    opacity: 0.8,
  },
});
