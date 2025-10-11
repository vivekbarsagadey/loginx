import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing, TouchTarget, Typography } from '@/constants/layout';
import { gap, rounded } from '@/constants/style-utils';
import { usePermissions } from '@/hooks/use-permissions';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/i18n';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';

interface PermissionsSlideProps {
  width: number;
  onNext: () => void;
  onSkip: () => void;
}

interface PermissionItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  granted: boolean;
  optional: boolean;
  onRequest: () => Promise<void>;
  loading: boolean;
}

function PermissionItem({ icon, title, description, granted, optional, onRequest, loading }: PermissionItemProps) {
  const primaryColor = useThemeColor({}, 'primary');
  const successColor = useThemeColor({}, 'success');
  const mutedColor = useThemeColor({}, 'text-muted');
  const surfaceColor = useThemeColor({}, 'surface');
  const borderColor = useThemeColor({}, 'border');

  const handlePress = async () => {
    if (!granted && !loading) {
      if (Platform.OS === 'ios') {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
      await onRequest();
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={granted || loading}
      style={[
        styles.permissionItem,
        {
          backgroundColor: surfaceColor,
          borderColor: granted ? successColor : borderColor,
          borderWidth: 1,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${title} permission`}
      accessibilityHint={granted ? 'Permission granted' : 'Tap to request permission'}
      accessibilityState={{ disabled: granted }}
    >
      <View style={styles.permissionIcon}>
        <Ionicons name={icon} size={32} color={granted ? successColor : primaryColor} />
      </View>

      <View style={styles.permissionContent}>
        <View style={styles.permissionHeader}>
          <ThemedText type="subtitle1" style={styles.permissionTitle}>
            {title}
          </ThemedText>
          {optional && (
            <ThemedText type="caption" style={[styles.optionalBadge, { color: mutedColor }]}>
              {i18n.t('permissions.optional')}
            </ThemedText>
          )}
        </View>

        <ThemedText type="caption" style={[styles.permissionDescription, { color: mutedColor }]}>
          {description}
        </ThemedText>
      </View>

      <View style={styles.permissionStatus}>
        {loading ? (
          <ActivityIndicator size="small" color={primaryColor} />
        ) : granted ? (
          <Ionicons name="checkmark-circle" size={28} color={successColor} />
        ) : (
          <Ionicons name="chevron-forward" size={24} color={mutedColor} />
        )}
      </View>
    </Pressable>
  );
}

export function PermissionsSlide({ width, onNext, onSkip }: PermissionsSlideProps) {
  const { permissionsStatus, requestCameraPermission, requestMediaLibraryPermission, requestLocationPermission, requestNotificationPermission, areAllCriticalPermissionsGranted } = usePermissions();

  const [loadingPermissions, setLoadingPermissions] = useState({
    camera: false,
    mediaLibrary: false,
    location: false,
    notifications: false,
  });

  const primaryColor = useThemeColor({}, 'primary');
  const onPrimaryColor = useThemeColor({}, 'on-primary');
  const mutedColor = useThemeColor({}, 'text-muted');

  const handleRequestPermission = useCallback(async (type: 'camera' | 'mediaLibrary' | 'location' | 'notifications', requestFn: () => Promise<boolean>) => {
    setLoadingPermissions((prev) => ({ ...prev, [type]: true }));
    try {
      await requestFn();
    } finally {
      setLoadingPermissions((prev) => ({ ...prev, [type]: false }));
    }
  }, []);

  const canContinue = areAllCriticalPermissionsGranted();

  const permissions = [
    {
      type: 'notifications' as const,
      icon: 'notifications' as const,
      title: i18n.t('permissions.notifications.title'),
      description: i18n.t('permissions.notifications.description'),
      optional: false,
      requestFn: requestNotificationPermission,
    },
    {
      type: 'camera' as const,
      icon: 'camera' as const,
      title: i18n.t('permissions.camera.title'),
      description: i18n.t('permissions.camera.description'),
      optional: true,
      requestFn: requestCameraPermission,
    },
    {
      type: 'mediaLibrary' as const,
      icon: 'images' as const,
      title: i18n.t('permissions.mediaLibrary.title'),
      description: i18n.t('permissions.mediaLibrary.description'),
      optional: true,
      requestFn: requestMediaLibraryPermission,
    },
    {
      type: 'location' as const,
      icon: 'location' as const,
      title: i18n.t('permissions.location.title'),
      description: i18n.t('permissions.location.description'),
      optional: true,
      requestFn: requestLocationPermission,
    },
  ];

  return (
    <ThemedView style={[styles.container, { width }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedView style={[styles.iconCircle, { backgroundColor: `${primaryColor}15` }]}>
            <Ionicons name="shield-checkmark" size={64} color={primaryColor} />
          </ThemedView>

          <ThemedText type="h2" style={styles.title}>
            {i18n.t('permissions.title')}
          </ThemedText>

          <ThemedText type="body" style={[styles.subtitle, { color: mutedColor }]}>
            {i18n.t('permissions.subtitle')}
          </ThemedText>
        </View>

        {/* Permission Items */}
        <View style={styles.permissionsList}>
          {permissions.map((permission) => (
            <PermissionItem
              key={permission.type}
              icon={permission.icon}
              title={permission.title}
              description={permission.description}
              granted={permissionsStatus[permission.type].granted}
              optional={permission.optional}
              onRequest={() => handleRequestPermission(permission.type, permission.requestFn)}
              loading={loadingPermissions[permission.type]}
            />
          ))}
        </View>

        {/* Info Box */}
        <ThemedView style={[styles.infoBox, { backgroundColor: `${primaryColor}10`, borderColor: `${primaryColor}30` }]}>
          <Ionicons name="information-circle" size={20} color={primaryColor} />
          <ThemedText type="caption" style={[styles.infoText, { color: mutedColor }]}>
            {i18n.t('permissions.infoText')}
          </ThemedText>
        </ThemedView>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        {!canContinue && (
          <Pressable onPress={onSkip} style={styles.skipButton} accessibilityRole="button" accessibilityLabel={i18n.t('permissions.skipButton')}>
            <ThemedText type="body" style={{ color: mutedColor }}>
              {i18n.t('permissions.skipButton')}
            </ThemedText>
          </Pressable>
        )}

        <Pressable
          onPress={onNext}
          disabled={!canContinue}
          style={[
            styles.continueButton,
            {
              backgroundColor: canContinue ? primaryColor : mutedColor,
              opacity: canContinue ? 1 : 0.5,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel={i18n.t('permissions.continueButton')}
          accessibilityState={{ disabled: !canContinue }}
        >
          <ThemedText type="bodyBold" style={{ color: onPrimaryColor }}>
            {i18n.t('permissions.continueButton')}
          </ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginTop: Spacing.xxl,
    marginBottom: Spacing.xl,
  },
  iconCircle: {
    width: 120,
    height: 120,
    ...rounded.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Spacing.md,
  },
  permissionsList: {
    ...gap.md,
    marginBottom: Spacing.lg,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    ...rounded.lg,
    ...gap.md,
  },
  permissionIcon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionContent: {
    flex: 1,
    ...gap.xs,
  },
  permissionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    ...gap.sm,
  },
  permissionTitle: {
    flex: 1,
  },
  optionalBadge: {
    fontSize: 11,
    textTransform: 'uppercase',
    fontWeight: Typography.caption.fontWeight,
  },
  permissionDescription: {
    lineHeight: 18,
  },
  permissionStatus: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    padding: Spacing.md,
    ...rounded.md,
    ...gap.sm,
    borderWidth: 1,
  },
  infoText: {
    flex: 1,
    lineHeight: 18,
  },
  buttonContainer: {
    ...gap.md,
    paddingBottom: Spacing.lg,
  },
  skipButton: {
    height: TouchTarget.comfortable,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButton: {
    height: TouchTarget.comfortable,
    ...rounded.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
