import { ScreenContainer } from '@/components/screen-container';
import { ThemedBadge } from '@/components/themed-badge';
import { ThemedInfoBox } from '@/components/themed-info-box';
import { ThemedLoadingSpinner } from '@/components/themed-loading-spinner';
import { ThemedPressable } from '@/components/themed-pressable';
import { HStack, VStack } from '@/components/themed-stack';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BorderRadius, IconSize, Spacing, Typography } from '@/constants/layout';
import { getPermissions } from '@/data';
import { useAlert } from '@/hooks/use-alert';
import { usePermissions } from '@/hooks/permissions/use-permissions-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/i18n';
import type { PermissionCardProps } from '@/types/permission';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Linking, Platform, StyleSheet, View } from 'react-native';

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

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

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
    <ThemedPressable
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
      <HStack spacing="md" align="center" style={styles.cardHeader}>
        <ThemedView style={[styles.iconContainer, { backgroundColor: `${statusColor}15` }]}>
          <Ionicons name={icon} size={IconSize.xl} color={statusColor} />
        </ThemedView>

        <VStack spacing="xs" style={styles.cardContent}>
          <ThemedText type="subtitle1" style={styles.cardTitle}>
            {title}
          </ThemedText>
          <ThemedText type="caption" style={[styles.cardDescription, { color: mutedColor }]}>
            {description}
          </ThemedText>
        </VStack>

        <View style={styles.statusContainer}>
          {loading ? <ThemedLoadingSpinner size="small" /> : <Ionicons name={granted ? 'checkmark-circle' : canAskAgain ? 'help-circle' : 'close-circle'} size={IconSize.lg} color={statusColor} />}
        </View>
      </HStack>

      <ThemedBadge variant={granted ? 'success' : canAskAgain ? 'info' : 'error'} size="md">
        {statusText}
      </ThemedBadge>
    </ThemedPressable>
  );
}

export default function PermissionsScreen() {
  // Use PermissionsContext for centralized permission management
  const { permissions: permissionsStatus, requestPermission, checkAllPermissions, isLoading } = usePermissions();
  const alert = useAlert();

  const bgColor = useThemeColor({}, 'bg');
  const primaryColor = useThemeColor({}, 'primary');
  const mutedColor = useThemeColor({}, 'text-muted');

  // Add loading state check
  if (isLoading) {
    return (
      <ScreenContainer scrollable style={{ backgroundColor: bgColor }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ThemedLoadingSpinner size="large" text="Loading permissions..." />
        </View>
      </ScreenContainer>
    );
  }

  const handleRequestPermission = async (type: 'camera' | 'mediaLibrary' | 'location' | 'notifications') => {
    try {
      await requestPermission(type);
    } catch (_error) {
      console.error('Failed to request permission:', error);
    }
  };

  const handleRefreshAll = async () => {
    await checkAllPermissions();
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const permissions = getPermissions({
    requestNotificationPermission: () => requestPermission('notifications'),
    requestCameraPermission: () => requestPermission('camera'),
    requestMediaLibraryPermission: () => requestPermission('mediaLibrary'),
    requestLocationPermission: () => requestPermission('location'),
  });

  return (
    <ScreenContainer scrollable style={{ backgroundColor: bgColor }} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedView style={[styles.headerIcon, { backgroundColor: `${primaryColor}15` }]}>
          <Ionicons name="shield-checkmark" size={IconSize.xxxl} color={primaryColor} />
        </ThemedView>

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
            onRequest={() => handleRequestPermission(permission.type)}
            loading={isLoading}
            alert={alert}
          />
        ))}
      </View>

      {/* Refresh Button */}
      <ThemedPressable
        onPress={handleRefreshAll}
        style={[styles.refreshButton, { backgroundColor: `${primaryColor}10` }]}
        accessibilityRole="button"
        accessibilityLabel={i18n.t('settings.permissions.refresh')}
      >
        <Ionicons name="refresh" size={20} color={primaryColor} />
        <ThemedText type="body" style={{ color: primaryColor }}>
          {i18n.t('settings.permissions.refresh')}
        </ThemedText>
      </ThemedPressable>

      {/* Info Note */}
      <ThemedInfoBox variant="info">
        <ThemedText>{i18n.t('settings.permissions.info')}</ThemedText>
      </ThemedInfoBox>
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
    width: Spacing.huge + Spacing.xl, // 96px (64+32)
    height: Spacing.huge + Spacing.xl, // 96px
    borderRadius: Spacing.xxxl, // 48px
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
    lineHeight: Spacing.lg - 2, // 22px
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
    width: Spacing.xxxl + Spacing.sm, // 56px (48+8)
    height: Spacing.xxxl + Spacing.sm, // 56px
    borderRadius: Spacing.lg + Spacing.xs, // 28px
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
    gap: Spacing.xs,
  },
  cardTitle: {},
  cardDescription: {
    lineHeight: Spacing.lg - Spacing.xs - 2, // 18px
  },
  statusContainer: {
    width: Spacing.xl, // 32px
    height: Spacing.xl, // 32px
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
    fontSize: Typography.label.fontSize,
    fontWeight: Typography.bodyBold.fontWeight,
    textTransform: 'uppercase' as const,
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
});
