import { getUserProfile } from '@/actions/user.action';
import { ThemedScrollView } from '@/components/themed-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useAuth } from '@/hooks/use-auth-provider';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { UserProfile } from '@/types/user';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function IndexScreen() {
  const { user } = useAuth();
  const colorScheme = useColorScheme();
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
      <SafeAreaView style={{ flex: 1 }}>
        <ThemedView style={styles.loaderContainer}>
          <ActivityIndicator size="large" />
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedScrollView contentContainerStyle={styles.container}>
        {userProfile ? (
          <>
            <ThemedText type="h1">Welcome, {userProfile.displayName}!</ThemedText>
            <ThemedText type="body" style={styles.email}>
              {userProfile.email}
            </ThemedText>
            <ThemedText type="body">Age: {userProfile.age}</ThemedText>

            <View style={[styles.section, { borderColor: Colors[colorScheme ?? 'light'].border }]}>
              <ThemedText type="h2">Your Notification Preferences</ThemedText>
              <ThemedText>Push Notifications: {userProfile.pushEnabled ? 'Enabled' : 'Disabled'}</ThemedText>
              <ThemedText>Email Updates: {userProfile.emailUpdates ? 'Enabled' : 'Disabled'}</ThemedText>
              <ThemedText>Marketing Tips: {userProfile.marketingTips ? 'Enabled' : 'Disabled'}</ThemedText>
            </View>
          </>
        ) : (
          <ThemedText type="h1">Welcome!</ThemedText>
        )}
      </ThemedScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  email: {
    marginVertical: 16,
  },
  section: {
    marginTop: 32,
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
  },
});
