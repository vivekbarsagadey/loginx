/**
 * Permission Step Renderer
 *
 * Renders permission request steps from the flow configuration
 */

import { ThemedButton } from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme-colors';
import type { PermissionStepConfig, StepRendererProps } from '@/types/flow';
import { Ionicons } from '@expo/vector-icons';
import * as ExpoCamera from 'expo-camera';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import React, { useState } from 'react';
import { Alert, Linking, Platform, ScrollView, StyleSheet, View } from 'react-native';

export function PermissionStepRenderer({ step, data: _data, onUpdate, onNext, onBack: _onBack, onSkip: _onSkip, context: _context }: StepRendererProps<PermissionStepConfig>) {
  const colors = useThemeColors();
  const [requesting, setRequesting] = useState(false);
  const [deniedPermissions, setDeniedPermissions] = useState<string[]>([]);

  const requestPermission = async (permission: string): Promise<boolean> => {
    try {
      switch (permission) {
        case 'camera': {
          const { status } = await ExpoCamera.Camera.requestCameraPermissionsAsync();
          return status === 'granted';
        }
        case 'location': {
          const { status } = await Location.requestForegroundPermissionsAsync();
          return status === 'granted';
        }
        case 'notifications': {
          const { status } = await Notifications.requestPermissionsAsync();
          return status === 'granted';
        }
        // Add more permissions as needed
        default:
          console.warn(`Unknown permission type: ${permission}`);
          return false;
      }
    } catch (_error: unknown) {
      console.error(`Failed to request ${permission} permission:`, _error);
      return false;
    }
  };

  const handleGrantPermissions = async () => {
    setRequesting(true);
    setDeniedPermissions([]);

    const granted: string[] = [];
    const denied: string[] = [];

    for (const permission of step.permissions) {
      const isGranted = await requestPermission(permission);
      if (isGranted) {
        granted.push(permission);
      } else {
        denied.push(permission);
      }
    }

    setRequesting(false);

    // Store permission results
    onUpdate({
      [`${step.id}_granted`]: granted,
      [`${step.id}_denied`]: denied,
    });

    if (denied.length > 0) {
      setDeniedPermissions(denied);

      // Show alert about denied permissions
      Alert.alert('Permissions Required', `Some permissions were not granted: ${denied.join(', ')}. You can enable them later in Settings.`, [
        {
          text: 'Open Settings',
          onPress: () => Linking.openSettings(),
        },
        {
          text: 'Continue Anyway',
          onPress: async () => {
            if (step.onDeny) {
              await step.onDeny(denied);
            }
            await onNext();
          },
        },
      ]);
    } else {
      // All permissions granted
      if (step.onGrant) {
        await step.onGrant(granted);
      }
      await onNext();
    }
  };

  const handleSkipPermissions = async () => {
    if (step.onDeny) {
      await step.onDeny(step.permissions);
    }
    await onNext();
  };

  const getPermissionIcon = (permission: string): keyof typeof Ionicons.glyphMap => {
    switch (permission) {
      case 'camera':
        return 'camera';
      case 'location':
        return 'location';
      case 'notifications':
        return 'notifications';
      case 'photos':
        return 'images';
      case 'microphone':
        return 'mic';
      case 'contacts':
        return 'people';
      default:
        return 'shield-checkmark';
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <ThemedView style={styles.header}>
        {step.icon && <Ionicons name={step.icon as keyof typeof Ionicons.glyphMap} size={48} color={step.iconColor || colors.primary} style={styles.headerIcon} />}
        {step.title && (
          <ThemedText type="title" style={styles.title}>
            {step.title}
          </ThemedText>
        )}
        {step.subtitle && (
          <ThemedText type="subtitle1" style={styles.subtitle}>
            {step.subtitle}
          </ThemedText>
        )}
        {step.description && (
          <ThemedText type="body" style={styles.description}>
            {step.description}
          </ThemedText>
        )}
      </ThemedView>

      {step.benefits && step.benefits.length > 0 && (
        <ThemedView style={styles.benefitsContainer}>
          {step.benefits.map((benefit, index) => (
            <View key={index} style={styles.benefit}>
              <View style={[styles.benefitIcon, { backgroundColor: colors.primary + '20' }]}>
                <Ionicons name={benefit.icon as keyof typeof Ionicons.glyphMap} size={28} color={colors.primary} />
              </View>
              <View style={styles.benefitContent}>
                <ThemedText type="subtitle1" style={styles.benefitTitle}>
                  {benefit.title}
                </ThemedText>
                <ThemedText type="body" style={styles.benefitDescription}>
                  {benefit.description}
                </ThemedText>
              </View>
            </View>
          ))}
        </ThemedView>
      )}

      {step.permissions.length > 0 && (
        <ThemedView style={styles.permissionsContainer}>
          <ThemedText type="subtitle1" style={styles.permissionsTitle}>
            Required Permissions:
          </ThemedText>
          {step.permissions.map((permission, index) => (
            <View key={index} style={styles.permissionItem}>
              <Ionicons name={getPermissionIcon(permission)} size={24} color={colors.text} />
              <ThemedText type="body" style={styles.permissionName}>
                {permission.charAt(0).toUpperCase() + permission.slice(1)}
              </ThemedText>
              {deniedPermissions.includes(permission) && <Ionicons name="close-circle" size={20} color={colors.error} />}
            </View>
          ))}
        </ThemedView>
      )}

      <ThemedView style={styles.actions}>
        <ThemedButton title={requesting ? 'Requesting...' : 'Grant Permissions'} onPress={handleGrantPermissions} disabled={requesting} style={styles.grantButton} />
        {step.skippable && <ThemedButton title="Skip for Now" onPress={handleSkipPermissions} variant="secondary" disabled={requesting} style={styles.skipButton} />}
      </ThemedView>

      {Platform.OS === 'ios' && (
        <ThemedText type="caption" style={styles.note}>
          Note: You can change these permissions anytime in Settings
        </ThemedText>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  headerIcon: {
    marginBottom: Spacing.md,
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  description: {
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  benefitsContainer: {
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  benefit: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  benefitIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    marginBottom: Spacing.xs,
  },
  benefitDescription: {
    opacity: 0.8,
  },
  permissionsContainer: {
    marginBottom: Spacing.xl,
  },
  permissionsTitle: {
    marginBottom: Spacing.md,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  permissionName: {
    flex: 1,
  },
  actions: {
    gap: Spacing.md,
  },
  grantButton: {
    marginBottom: Spacing.sm,
  },
  skipButton: {
    marginBottom: Spacing.sm,
  },
  note: {
    textAlign: 'center',
    marginTop: Spacing.lg,
    opacity: 0.7,
  },
});
