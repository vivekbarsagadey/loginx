import { ScreenContainer } from '@/components/screen-container';
import { ThemedButton } from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/i18n';
import { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';

interface Session {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  ipAddress: string;
  isCurrent: boolean;
}

export default function SessionsScreen() {
  const successColor = useThemeColor({}, 'success');
  const onSuccessColor = useThemeColor({}, 'on-primary'); // Using on-primary for contrast

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
    Alert.alert(i18n.t('screens.security.sessions.confirmEndAll.title'), i18n.t('screens.security.sessions.confirmEndAll.message'), [
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
            <ThemedText style={[styles.currentBadgeText, { color: onSuccessColor }]}>Current</ThemedText>
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
    <ScreenContainer scrollable>
      <ThemedText type="h1" style={styles.title}>
        {i18n.t('screens.security.sessions.title')}
      </ThemedText>
      <ThemedText style={styles.subtitle}>{i18n.t('screens.security.sessions.subtitle')}</ThemedText>

      <ThemedView style={styles.section}>
        <ThemedText type="h3" style={styles.sectionTitle}>
          {i18n.t('screens.security.sessions.currentSession')}
        </ThemedText>
        {currentSessions.map(renderSession)}
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="h3" style={styles.sectionTitle}>
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
  );
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.7,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  sessionItem: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    // Background handled by theme
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  deviceName: {
    fontWeight: 'bold',
    flex: 1,
  },
  currentBadge: {
    // Use theme success color in component
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  currentBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  sessionInfo: {
    marginBottom: 4,
    opacity: 0.8,
    fontSize: 14,
  },
  endSessionButton: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  endAllButton: {
    marginTop: 16,
  },
  noSessionsText: {
    textAlign: 'center',
    opacity: 0.6,
    fontStyle: 'italic',
    padding: 20,
  },
});
