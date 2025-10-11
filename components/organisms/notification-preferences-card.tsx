import { PreferenceRow } from '@/components/molecules/preference-row';
import { SectionHeader } from '@/components/molecules/section-header';
import { Card } from '@/components/ui/card';
import { Spacing } from '@/constants/layout';
import i18n from '@/i18n';
import { StyleSheet, View, type ViewStyle } from 'react-native';

interface NotificationPreferencesCardProps {
  /**
   * Whether push notifications are enabled
   */
  pushEnabled: boolean;
  /**
   * Whether email updates are enabled
   */
  emailUpdates: boolean;
  /**
   * Whether marketing tips are enabled
   */
  marketingTips: boolean;
  /**
   * Optional handler for press events on the entire card
   */
  onPress?: () => void;
  /**
   * Optional style overrides
   */
  style?: ViewStyle;
  /**
   * Elevation of the card
   * @default 1
   */
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  /**
   * Whether to show the section header
   * @default true
   */
  showHeader?: boolean;
}

/**
 * NotificationPreferencesCard component for displaying notification preferences.
 * Shows the current state of push notifications, email updates, and marketing tips.
 *
 * @example
 * <NotificationPreferencesCard
 *   pushEnabled={true}
 *   emailUpdates={false}
 *   marketingTips={true}
 *   onPress={() => navigate('/settings/notifications')}
 * />
 */
export function NotificationPreferencesCard({ pushEnabled, emailUpdates, marketingTips, onPress, style, elevation = 1, showHeader = true }: NotificationPreferencesCardProps) {
  const getStatusText = (enabled: boolean) => (enabled ? i18n.t('screens.home.enabled') : i18n.t('screens.home.disabled'));

  return (
    <View style={style}>
      {showHeader && <SectionHeader title={i18n.t('screens.home.notificationPreferences')} style={styles.header} />}
      <Card elevation={elevation} noPadding>
        <View style={styles.content}>
          <PreferenceRow icon="bell" label={i18n.t('screens.home.pushNotifications')} value={getStatusText(pushEnabled)} onPress={onPress} />
          <View style={styles.divider} />
          <PreferenceRow icon="mail" label={i18n.t('screens.home.emailUpdates')} value={getStatusText(emailUpdates)} onPress={onPress} />
          <View style={styles.divider} />
          <PreferenceRow icon="message-circle" label={i18n.t('screens.home.marketingTips')} value={getStatusText(marketingTips)} onPress={onPress} />
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: Spacing.sm,
  },
  content: {
    padding: Spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
    marginVertical: Spacing.xs,
  },
});
