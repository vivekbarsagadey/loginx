import { getUserProfile } from '@/actions/user.action';
import { TabHeader } from '@/components/navigation/TabHeader';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { SkeletonCard, SkeletonText } from '@/components/ui/skeleton-loader';
import { CommonSpacing } from '@/constants/common-styles';
import { Spacing } from '@/constants/layout';
import { useAlert } from '@/hooks/use-alert';
import { useAuth } from '@/hooks/use-auth-provider';
import i18n from '@/i18n';
import { UserProfile } from '@/types/user';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function IndexScreen() {
  const { user } = useAuth();
  const alert = useAlert();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [, forceUpdate] = useState(0);

  // Force re-render when screen comes into focus (handles language changes)
  useFocusEffect(
    useCallback(() => {
      forceUpdate((n) => n + 1);
    }, [])
  );

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          console.warn('[Home] Fetching profile for user:', user.uid);
          const profile = await getUserProfile(user.uid);
          console.warn('[Home] Profile fetched:', profile);
          console.warn('[Home] DisplayName:', profile?.displayName);
          console.warn('[Home] Age:', profile?.age);

          if (profile) {
            setUserProfile(profile);
          } else {
            console.warn('[Home] User profile is null');
            alert.show('Error', 'User profile not found. Please complete your registration.', [{ text: 'OK' }], { variant: 'error' });
          }
        } catch (error) {
          console.error('[Home] Error fetching user profile:', error);
          alert.show('Error', 'Failed to fetch user profile.', [{ text: 'OK' }], { variant: 'error' });
        } finally {
          setLoading(false);
        }
      } else {
        console.warn('[Home] No user logged in');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  if (loading) {
    return (
      <>
        <TabHeader title={i18n.t('screens.home.title')} showBackButton={false} />
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
              <ThemedText type="h1">
                {i18n.t('screens.home.welcome', {
                  name: userProfile.displayName || user?.email?.split('@')[0] || 'User',
                })}
              </ThemedText>
              <ThemedText type="body" style={styles.email}>
                {userProfile.email}
              </ThemedText>
              {userProfile.age && userProfile.age > 0 && (
                <ThemedText type="body" style={styles.age}>
                  {i18n.t('screens.home.age', { age: userProfile.age })}
                </ThemedText>
              )}
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
      {alert.AlertComponent}
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
