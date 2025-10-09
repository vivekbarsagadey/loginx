import { getUserProfile } from '@/actions/user.action';
import { TabHeader } from '@/components/navigation/TabHeader';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { SkeletonCard, SkeletonText } from '@/components/ui/skeleton-loader';
import { CommonSpacing } from '@/constants/common-styles';
import { Spacing } from '@/constants/layout';
import { useAuth } from '@/hooks/use-auth-provider';
import i18n from '@/i18n';
import { UserProfile } from '@/types/user';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

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
      <>
        <TabHeader title="Home" showBackButton={false} />
        <ScreenContainer scrollable useSafeArea={false}>
          <View style={CommonSpacing.marginBottomLarge}>
            <SkeletonText lines={2} shimmer />
          </View>
          <SkeletonCard shimmer />
          <View style={{ marginTop: Spacing.lg }}>
            <SkeletonCard shimmer />
          </View>
        </ScreenContainer>
      </>
    );
  }

  return (
    <>
      <TabHeader title={i18n.t('screens.home.title')} showBackButton={false} />
      <ScreenContainer scrollable useSafeArea={false}>
        {userProfile ? (
          <>
            <View style={CommonSpacing.marginBottomLarge}>
              <ThemedText type="h1">{i18n.t('screens.home.welcome', { name: userProfile.displayName })}</ThemedText>
              <ThemedText type="body" style={styles.email}>
                {userProfile.email}
              </ThemedText>
              <ThemedText type="body" style={styles.age}>
                {i18n.t('screens.home.age', { age: userProfile.age })}
              </ThemedText>
            </View>

            <Card elevation={1} style={CommonSpacing.marginBottomLarge}>
              <ThemedText type="h2" style={styles.cardTitle}>
                {i18n.t('screens.home.notificationPreferences')}
              </ThemedText>

              <View style={styles.preferenceRow}>
                <ThemedText type="body">{i18n.t('screens.home.pushNotifications')}</ThemedText>
                <ThemedText type="body" style={styles.preferenceValue}>
                  {userProfile.pushEnabled ? i18n.t('screens.home.enabled') : i18n.t('screens.home.disabled')}
                </ThemedText>
              </View>

              <View style={styles.preferenceRow}>
                <ThemedText type="body">{i18n.t('screens.home.emailUpdates')}</ThemedText>
                <ThemedText type="body" style={styles.preferenceValue}>
                  {userProfile.emailUpdates ? i18n.t('screens.home.enabled') : i18n.t('screens.home.disabled')}
                </ThemedText>
              </View>

              <View style={styles.preferenceRow}>
                <ThemedText type="body">{i18n.t('screens.home.marketingTips')}</ThemedText>
                <ThemedText type="body" style={styles.preferenceValue}>
                  {userProfile.marketingTips ? i18n.t('screens.home.enabled') : i18n.t('screens.home.disabled')}
                </ThemedText>
              </View>
            </Card>
          </>
        ) : (
          <ThemedText type="h1">{i18n.t('screens.home.welcome', { name: '' })}</ThemedText>
        )}
      </ScreenContainer>
    </>
  );
}

const styles = StyleSheet.create({
  email: {
    marginTop: Spacing.sm,
    opacity: 0.8,
  },
  age: {
    marginTop: Spacing.xs,
    opacity: 0.7,
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
