import { getFirestoreError, getFirestoreStatus, initializeFirestore, isFirestoreReady } from '@/firebase-config';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { debugLog } from '@/utils/debug';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { ThemedText } from '../themed-text';

/**
 * TASK-063: Dev mode Firestore status indicator
 * Shows Firestore initialization state, connection status, and emulator info
 * Only renders in __DEV__ mode
 */
export function FirestoreStatusIndicator() {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'timeout'>('loading');
  const [statusInfo, setStatusInfo] = useState<string>('');
  const colors = useThemeColors();

  useEffect(() => {
    if (!__DEV__) {
      return;
    }

    const checkStatus = async () => {
      try {
        if (isFirestoreReady()) {
          setStatus('ready');
          const info = getFirestoreStatus();
          const icon = info.emulatorEnabled ? 'Emulator' : 'Cloud';
          setStatusInfo(`${icon} | ${info.platform}`);
          debugLog('[FirestoreStatus] Firestore is ready');
          return;
        }

        // Wait for initialization
        await initializeFirestore();

        if (isFirestoreReady()) {
          setStatus('ready');
          const info = getFirestoreStatus();
          const icon = info.emulatorEnabled ? 'Emulator' : 'Cloud';
          setStatusInfo(`${icon} | ${info.platform}`);
        } else {
          const _error = getFirestoreError();
          if (_error?.message.includes('timeout')) {
            setStatus('timeout');
            setStatusInfo('Init timeout');
          } else {
            setStatus('error');
            setStatusInfo(_error?.message.slice(0, 30) || 'Unknown error');
          }
        }
      } catch (_error: unknown) {
        setStatus('error');
        setStatusInfo(_error instanceof Error ? _error.message.slice(0, 30) : 'Init failed');
        debugLog('[FirestoreStatus] Error checking status:', _error);
      }
    };

    checkStatus();

    // Check status every 5 seconds
    const interval = setInterval(checkStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  // Only render in development mode
  if (!__DEV__) {
    return null;
  }

  // Color coding based on status
  const getStatusColor = () => {
    switch (status) {
      case 'ready':
        return colors.success;
      case 'loading':
        return colors.warning;
      case 'error':
      case 'timeout':
        return colors.error;
      default:
        return colors['text-muted'];
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'ready':
        return String.fromCharCode(10003); // ?
      case 'loading':
        return String.fromCharCode(9203); // ?
      case 'error':
        return String.fromCharCode(10007); // ?
      case 'timeout':
        return String.fromCharCode(8987); // ?
      default:
        return '?';
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors['bg-elevated'],
          borderColor: getStatusColor(),
        },
      ]}
    >
      <ThemedText style={[styles.statusIcon, { color: getStatusColor() }]} numberOfLines={1}>
        {getStatusIcon()}
      </ThemedText>
      <View style={styles.infoContainer}>
        <ThemedText style={[styles.statusText, { color: getStatusColor() }]}>Firestore</ThemedText>
        <ThemedText style={styles.detailText} numberOfLines={1}>
          {statusInfo}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.select({ ios: 100, android: 80, default: 80 }),
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxWidth: 200,
  },
  statusIcon: {
    fontSize: 16,
    marginRight: 8,
    fontWeight: 'bold',
  },
  infoContainer: {
    flex: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailText: {
    fontSize: 10,
    opacity: 0.7,
  },
});
