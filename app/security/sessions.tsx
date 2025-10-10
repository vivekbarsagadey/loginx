import { ScreenContainer } from '@/components/screen-container';
import { ThemedButton } from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CommonText } from '@/constants/common-styles';
import { BorderRadius, Spacing } from '@/constants/layout';
import { useAlert } from '@/hooks/use-alert';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/i18n';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

interface Session {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  ipAddress: string;
  isCurrent: boolean;
}

export default function SessionsScreen() {
  const alert = useAlert();
  const _primaryColor = useThemeColor({}, 'primary');
  const _surfaceColor = useThemeColor({}, 'surface');
  const _borderColor = useThemeColor({}, 'border');
  const _errorColor = useThemeColor({}, 'error');
  const successColor = useThemeColor({}, 'success');
  const onSuccessColor = useThemeColor({}, 'on-primary'); // White text on success color

  const [sessions, setSessions] = useState<Session[]>([
    {
      id: '1',
      device: 'iPhone 15 Pro',
      location: 'San Francisco, CA',
      lastActive: 'Active now',
      ipAddress: '192.168.1.1',
      isCurrent: true,
    },
    {
      id: '2',
      device: 'MacBook Pro',
      location: 'New York, NY',
      lastActive: '1 hour ago',
      ipAddress: '192.168.1.101',
      isCurrent: false,
    },
    {
      id: '3',
      device: 'Chrome on Windows',
      location: 'Los Angeles, CA',
      lastActive: '2 days ago',
      ipAddress: '203.45.67.89',
      isCurrent: false,
    },
  ]);

  const currentSessions = sessions.filter((s) => s.isCurrent);
  const otherSessions = sessions.filter((s) => !s.isCurrent);

  const handleEndSession = (sessionId: string) => {
    setSessions((prevSessions) => prevSessions.filter((s) => s.id !== sessionId));
  };

  const handleEndAllSessions = () => {
    alert.show(i18n.t('screens.security.sessions.confirmEndAll.title'), i18n.t('screens.security.sessions.confirmEndAll.message'), [
      {
        text: i18n.t('screens.security.sessions.confirmEndAll.cancel'),
        style: 'cancel',
      },
      {
        text: i18n.t('screens.security.sessions.confirmEndAll.confirm'),
        style: 'destructive',
        onPress: () => {
          setSessions((prevSessions) => prevSessions.filter((s) => s.isCurrent));
        },
      },
    ]);
  };

  const renderSession = (session: Session) => (
    <ThemedView key={session.id} style={styles.sessionItem}>
      <ThemedView style={styles.sessionHeader}>
        <ThemedText type="body" style={styles.deviceName}>
          {session.device}
        </ThemedText>
        {session.isCurrent && (
          <ThemedView style={[styles.currentBadge, { backgroundColor: successColor }]}>
            <ThemedText style={[styles.currentBadgeText, { color: onSuccessColor }]}>{i18n.t('screens.security.sessions.currentBadge')}</ThemedText>
          </ThemedView>
        )}
      </ThemedView>

      <ThemedText style={styles.sessionInfo}>{i18n.t('screens.security.sessions.sessionInfo.device', { device: session.device })}</ThemedText>
      <ThemedText style={styles.sessionInfo}>{i18n.t('screens.security.sessions.sessionInfo.location', { location: session.location })}</ThemedText>
      <ThemedText style={styles.sessionInfo}>{i18n.t('screens.security.sessions.sessionInfo.lastActive', { time: session.lastActive })}</ThemedText>
      <ThemedText style={styles.sessionInfo}>{i18n.t('screens.security.sessions.sessionInfo.ipAddress', { ip: session.ipAddress })}</ThemedText>

      {!session.isCurrent && (
        <ThemedButton title={i18n.t('screens.security.sessions.actions.endSession')} variant="link" onPress={() => handleEndSession(session.id)} style={styles.endSessionButton} />
      )}
    </ThemedView>
  );

  return (
    <>
      <ScreenContainer scrollable useSafeArea={false}>
        <ThemedText style={CommonText.subtitle}>{i18n.t('screens.security.sessions.subtitle')}</ThemedText>

        <ThemedView style={styles.section}>
          <ThemedText type="h3" style={CommonText.sectionTitle}>
            {i18n.t('screens.security.sessions.currentSession')}
          </ThemedText>
          {currentSessions.map(renderSession)}
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="h3" style={CommonText.sectionTitle}>
            {i18n.t('screens.security.sessions.otherSessions')}
          </ThemedText>
          {otherSessions.length > 0 ? (
            <>
              {otherSessions.map(renderSession)}
              <ThemedButton title={i18n.t('screens.security.sessions.actions.endAll')} variant="secondary" onPress={handleEndAllSessions} style={styles.endAllButton} />
            </>
          ) : (
            <ThemedText style={styles.noSessionsText}>{i18n.t('screens.security.sessions.noOtherSessions')}</ThemedText>
          )}
        </ThemedView>
      </ScreenContainer>
      {alert.AlertComponent}
    </>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.lg,
  },
  sessionItem: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    // Background handled by theme
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  deviceName: {
    fontWeight: 'bold',
    flex: 1,
  },
  currentBadge: {
    // Use theme success color in component
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  currentBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  sessionInfo: {
    marginBottom: Spacing.xs,
    opacity: 0.8,
    fontSize: 14,
  },
  endSessionButton: {
    alignSelf: 'flex-start',
    marginTop: Spacing.sm,
  },
  endAllButton: {
    marginTop: Spacing.md,
  },
  noSessionsText: {
    textAlign: 'center',
    opacity: 0.6,
    fontStyle: 'italic',
    padding: Spacing.lg,
  },
});
