import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/layout';
import { useAlert } from '@/hooks/use-alert';
import { usePermissions } from '@/hooks/use-permissions';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/i18n';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { ActivityIndicator, Linking, Platform, Pressable, StyleSheet, View } from 'react-native';

interface PermissionCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  granted: boolean;
  canAskAgain: boolean;
  onRequest: () => Promise<void>;
  loading: boolean;
  alert: ReturnType<typeof useAlert>;
}

function PermissionCard({ icon, title, description, granted, canAskAgain, onRequest, loading, alert }: PermissionCardProps) {
  const primaryColor = useThemeColor({}, 'primary');
  const successColor = useThemeColor({}, 'success');
  const errorColor = useThemeColor({}, 'error');
  const mutedColor = useThemeColor({}, 'text-muted');
  const surfaceColor = useThemeColor({}, 'surface');
  const borderColor = useThemeColor({}, 'border');

  const handlePress = async () => {
    if (loading) {
      return;
    }

    if (Platform.OS === 'ios') {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (granted) {
      // Show info that permission is already granted
      alert.show(i18n.t('settings.permissions.alreadyGranted.title'), i18n.t('settings.permissions.alreadyGranted.message', { permission: title }));
    } else if (!canAskAgain) {
      // Show instructions to open settings
      alert.show(i18n.t('settings.permissions.openSettings.title'), i18n.t('settings.permissions.openSettings.message', { permission: title }), [
        { text: i18n.t('common.cancel'), style: 'cancel' },
        {
          text: i18n.t('settings.permissions.openSettings.button'),
          onPress: async () => {
            if (Platform.OS === 'ios') {
              await Linking.openURL('app-settings:');
            } else {
              await Linking.openSettings();
            }
          },
        },
      ]);
    } else {
      await onRequest();
    }
  };

  const statusColor = granted ? successColor : canAskAgain ? primaryColor : errorColor;
  const statusText = granted ? i18n.t('settings.permissions.status.granted') : canAskAgain ? i18n.t('settings.permissions.status.notGranted') : i18n.t('settings.permissions.status.denied');

  return (
    <Pressable
      onPress={handlePress}
      style={[
        styles.card,
        {
          backgroundColor: surfaceColor,
          borderColor: granted ? successColor : borderColor,
          borderWidth: 1,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${title} permission`}
      accessibilityHint={granted ? 'Permission granted' : 'Tap to manage permission'}
      accessibilityState={{ disabled: loading }}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, { backgroundColor: `${statusColor}15` }]}>
          <Ionicons name={icon} size={28} color={statusColor} />
        </View>

        <View style={styles.cardContent}>
          <ThemedText type="subtitle1" style={styles.cardTitle}>
            {title}
          </ThemedText>
          <ThemedText type="caption" style={[styles.cardDescription, { color: mutedColor }]}>
            {description}
          </ThemedText>
        </View>

        <View style={styles.statusContainer}>
          {loading ? (
            <ActivityIndicator size="small" color={primaryColor} />
          ) : (
            <Ionicons name={granted ? 'checkmark-circle' : canAskAgain ? 'help-circle' : 'close-circle'} size={24} color={statusColor} />
          )}
        </View>
      </View>

      <View style={[styles.statusBadge, { backgroundColor: `${statusColor}10` }]}>
        <ThemedText type="caption" style={[styles.statusText, { color: statusColor }]}>
          {statusText}
        </ThemedText>
      </View>
    </Pressable>
  );
}

export default function PermissionsScreen() {
  const { permissionsStatus, requestCameraPermission, requestMediaLibraryPermission, requestLocationPermission, requestNotificationPermission, checkAllPermissions } = usePermissions();
  const alert = useAlert();

  const [loading, setLoading] = React.useState<Record<string, boolean>>({
    camera: false,
    mediaLibrary: false,
    location: false,
    notifications: false,
  });

  const bgColor = useThemeColor({}, 'bg');
  const primaryColor = useThemeColor({}, 'primary');
  const mutedColor = useThemeColor({}, 'text-muted');

  // Add loading state check
  if (!permissionsStatus) {
    return (
      <ScreenContainer scrollable style={{ backgroundColor: bgColor }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={primaryColor} />
          <ThemedText style={{ marginTop: Spacing.md }}>Loading permissions...</ThemedText>
        </View>
      </ScreenContainer>
    );
  }

  const handleRequestPermission = async (type: 'camera' | 'mediaLibrary' | 'location' | 'notifications', requestFn: () => Promise<boolean>) => {
    setLoading((prev) => ({ ...prev, [type]: true }));
    try {
      await requestFn();
      await checkAllPermissions();
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleRefreshAll = async () => {
    await checkAllPermissions();
    if (Platform.OS === 'ios') {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const permissions = [
    {
      type: 'notifications' as const,
      icon: 'notifications' as const,
      title: i18n.t('permissions.notifications.title'),
      description: i18n.t('permissions.notifications.description'),
      requestFn: requestNotificationPermission,
    },
    {
      type: 'camera' as const,
      icon: 'camera' as const,
      title: i18n.t('permissions.camera.title'),
      description: i18n.t('permissions.camera.description'),
      requestFn: requestCameraPermission,
    },
    {
      type: 'mediaLibrary' as const,
      icon: 'images' as const,
      title: i18n.t('permissions.mediaLibrary.title'),
      description: i18n.t('permissions.mediaLibrary.description'),
      requestFn: requestMediaLibraryPermission,
    },
    {
      type: 'location' as const,
      icon: 'location' as const,
      title: i18n.t('permissions.location.title'),
      description: i18n.t('permissions.location.description'),
      requestFn: requestLocationPermission,
    },
  ];

  return (
    <ScreenContainer scrollable style={{ backgroundColor: bgColor }} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.headerIcon, { backgroundColor: `${primaryColor}15` }]}>
          <Ionicons name="shield-checkmark" size={48} color={primaryColor} />
        </View>

        <ThemedText type="h3" style={styles.headerTitle}>
          {i18n.t('settings.permissions.header.title')}
        </ThemedText>

        <ThemedText type="body" style={[styles.headerDescription, { color: mutedColor }]}>
          {i18n.t('settings.permissions.header.description')}
        </ThemedText>
      </View>

      {/* Permission Cards */}
      <View style={styles.permissionsList}>
        {permissions.map((permission) => (
          <PermissionCard
            key={permission.type}
            icon={permission.icon}
            title={permission.title}
            description={permission.description}
            granted={permissionsStatus[permission.type].granted}
            canAskAgain={permissionsStatus[permission.type].canAskAgain}
            onRequest={() => handleRequestPermission(permission.type, permission.requestFn)}
            loading={loading[permission.type]}
            alert={alert}
          />
        ))}
      </View>

      {/* Refresh Button */}
      <Pressable
        onPress={handleRefreshAll}
        style={[styles.refreshButton, { backgroundColor: `${primaryColor}10` }]}
        accessibilityRole="button"
        accessibilityLabel={i18n.t('settings.permissions.refresh')}
      >
        <Ionicons name="refresh" size={20} color={primaryColor} />
        <ThemedText type="body" style={{ color: primaryColor }}>
          {i18n.t('settings.permissions.refresh')}
        </ThemedText>
      </Pressable>

      {/* Info Note */}
      <View style={[styles.infoBox, { backgroundColor: `${primaryColor}10`, borderColor: `${primaryColor}30` }]}>
        <Ionicons name="information-circle" size={20} color={primaryColor} />
        <ThemedText type="caption" style={[styles.infoText, { color: mutedColor }]}>
          {i18n.t('settings.permissions.info')}
        </ThemedText>
      </View>
      {alert.AlertComponent}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: Spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  headerIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  headerTitle: {
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  headerDescription: {
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: Spacing.md,
  },
  permissionsList: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  card: {
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  cardTitle: {},
  cardDescription: {
    lineHeight: 18,
  },
  statusContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.lg,
  },
  infoBox: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.sm,
    borderWidth: 1,
  },
  infoText: {
    flex: 1,
    lineHeight: 18,
  },
});
