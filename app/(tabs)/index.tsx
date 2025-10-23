import { getUserProfile } from '@/actions/user.action';
import { TabHeader } from '@/components/navigation/TabHeader';
import { NotificationPreferencesCard } from '@/components/organisms/notification-preferences-card';
import { UserWelcomeSection } from '@/components/organisms/user-welcome-section';
import { ScreenContainer } from '@/components/screen-container';
import { SkeletonCard, SkeletonText } from '@/components/ui/skeleton-loader';
import { CommonSpacing } from '@/constants/common-styles';
import { Spacing } from '@/constants/layout';
import { Routes } from '@/constants/routes';
import { useAlert } from '@/hooks/use-alert';
import { useAuth } from '@/hooks/use-auth-provider';
import { useHapticNavigation } from '@/hooks/use-haptic-navigation';
import { useThemeColors } from '@/hooks/use-theme-colors';
import i18n from '@/i18n';
import { type UserProfile } from '@/types/user';
import { createLogger } from '@/utils/debug';
import { useFocusEffect } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useState } from 'react';
import { RefreshControl, View } from 'react-native';

const logger = createLogger('HomeScreen');

export default function IndexScreen() {
  const { user } = useAuth();
  const alert = useAlert();
  const { push } = useHapticNavigation();
  const colors = useThemeColors();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [, forceUpdate] = useState(0);

  // Force re-render when screen comes into focus (handles language changes)
  useFocusEffect(
    useCallback(() => {
      forceUpdate((n) => n + 1);
    }, [])
  );

  const fetchUserProfile = useCallback(async () => {
    if (user) {
      try {
        const profile = await getUserProfile(user.uid);

        if (profile) {
          setUserProfile(profile);
        } else {
          alert.show('Error', 'User profile not found. Please complete your registration.', [{ text: 'OK' }], { variant: 'error' });
        }
      } catch (_error: unknown) {
        logger.error('Error fetching user profile:', _error);
        alert.show('Error', 'Failed to fetch user profile.', [{ text: 'OK' }], { variant: '_error' });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    } else {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, alert]);

  const onRefresh = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setRefreshing(true);
    await fetchUserProfile();
  }, [fetchUserProfile]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

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
      <ScreenContainer
        scrollable
        useSafeArea={false}
        scrollViewProps={{
          refreshControl: <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />,
        }}
      >
        {userProfile ? (
          <>
            <UserWelcomeSection displayName={userProfile.displayName || user?.email?.split('@')[0] || 'User'} email={userProfile.email} age={userProfile.age} style={CommonSpacing.marginBottomLarge} />

            <NotificationPreferencesCard
              pushEnabled={userProfile.pushEnabled}
              emailUpdates={userProfile.emailUpdates}
              marketingTips={userProfile.marketingTips}
              onPress={() => push(Routes.SETTINGS.NOTIFICATIONS)}
              style={CommonSpacing.marginBottomLarge}
            />
          </>
        ) : (
          <UserWelcomeSection displayName={user?.email?.split('@')[0] || 'User'} email={user?.email || ''} />
        )}
      </ScreenContainer>
      {alert.AlertComponent}
    </>
  );
}
