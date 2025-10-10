import { ScreenContainer } from '@/components/screen-container';
import { ThemedButton } from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CommonText } from '@/constants/common-styles';
import { Spacing, Typography } from '@/constants/layout';
import { useAlert } from '@/hooks/use-alert';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/i18n';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { AccessibilityInfo, Linking, StyleSheet } from 'react-native';

/**
 * Data Rights Screen - GDPR Compliance
 *
 * Provides users with information about their data rights and
 * tools to exercise those rights (access, rectification, erasure, portability)
 */
export default function DataRightsScreen() {
  const router = useRouter();
  const alert = useAlert();
  const primaryColor = useThemeColor({}, 'primary');
  const surfaceColor = useThemeColor({}, 'surface');
  const borderColor = useThemeColor({}, 'border');

  useEffect(() => {
    AccessibilityInfo.announceForAccessibility('Your Data Rights. GDPR compliance information and actions.');
  }, []);

  const handleRequestData = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    alert.show(i18n.t('screens.legal.dataRights.actions.requestData.title'), i18n.t('screens.legal.dataRights.actions.requestData.description'), [
      { text: i18n.t('common.cancel'), style: 'cancel' },
      {
        text: i18n.t('common.confirm'),
        onPress: () => {
          // TODO: Implement data export functionality
          alert.show(i18n.t('common.success'), i18n.t('screens.legal.dataRights.actions.requestData.success'), [{ text: 'OK' }], { variant: 'success' });
        },
      },
    ]);
  };

  const handleDeleteData = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    alert.show(i18n.t('screens.legal.dataRights.actions.deleteData.title'), i18n.t('screens.legal.dataRights.actions.deleteData.warning'), [
      { text: i18n.t('common.cancel'), style: 'cancel' },
      {
        text: i18n.t('screens.legal.dataRights.actions.deleteData.confirm'),
        style: 'destructive',
        onPress: () => {
          // TODO: Implement account deletion
          router.push('/support');
        },
      },
    ]);
  };

  const handleContactSupport = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const email = 'privacy@whizit.co.in';
    const subject = 'Data Rights Request';
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}`;

    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  const rights = [
    {
      icon: 'eye' as const,
      title: i18n.t('screens.legal.dataRights.rights.access.title'),
      description: i18n.t('screens.legal.dataRights.rights.access.description'),
    },
    {
      icon: 'create' as const,
      title: i18n.t('screens.legal.dataRights.rights.rectification.title'),
      description: i18n.t('screens.legal.dataRights.rights.rectification.description'),
    },
    {
      icon: 'trash' as const,
      title: i18n.t('screens.legal.dataRights.rights.erasure.title'),
      description: i18n.t('screens.legal.dataRights.rights.erasure.description'),
    },
    {
      icon: 'download' as const,
      title: i18n.t('screens.legal.dataRights.rights.portability.title'),
      description: i18n.t('screens.legal.dataRights.rights.portability.description'),
    },
    {
      icon: 'hand-left' as const,
      title: i18n.t('screens.legal.dataRights.rights.restriction.title'),
      description: i18n.t('screens.legal.dataRights.rights.restriction.description'),
    },
    {
      icon: 'close-circle' as const,
      title: i18n.t('screens.legal.dataRights.rights.objection.title'),
      description: i18n.t('screens.legal.dataRights.rights.objection.description'),
    },
  ];

  return (
    <ScreenContainer scrollable>
      <ThemedText style={CommonText.subtitle}>{i18n.t('screens.legal.dataRights.subtitle')}</ThemedText>

      {/* Your Rights Section */}
      <ThemedView style={styles.section}>
        <ThemedText type="h3" style={CommonText.sectionTitle} accessibilityRole="header">
          {i18n.t('screens.legal.dataRights.yourRightsTitle')}
        </ThemedText>

        {rights.map((right, index) => (
          <ThemedView key={index} style={[styles.rightItem, { backgroundColor: surfaceColor, borderColor }]} accessible={true} accessibilityLabel={`${right.title}. ${right.description}`}>
            <ThemedView style={[styles.iconContainer, { backgroundColor: `${primaryColor}20` }]}>
              <Ionicons name={right.icon} size={24} color={primaryColor} />
            </ThemedView>
            <ThemedView style={styles.rightContent}>
              <ThemedText type="bodyBold" style={styles.rightTitle}>
                {right.title}
              </ThemedText>
              <ThemedText style={styles.rightDescription}>{right.description}</ThemedText>
            </ThemedView>
          </ThemedView>
        ))}
      </ThemedView>

      {/* Actions Section */}
      <ThemedView style={styles.section}>
        <ThemedText type="h3" style={CommonText.sectionTitle} accessibilityRole="header">
          {i18n.t('screens.legal.dataRights.actionsTitle')}
        </ThemedText>

        <ThemedButton
          title={i18n.t('screens.legal.dataRights.actions.requestData.button')}
          onPress={handleRequestData}
          variant="secondary"
          style={styles.actionButton}
          accessibilityHint="Export a copy of your personal data"
        />

        <ThemedButton
          title={i18n.t('screens.legal.dataRights.actions.deleteData.button')}
          onPress={handleDeleteData}
          variant="secondary"
          style={styles.actionButton}
          accessibilityHint="Permanently delete your account and data"
        />

        <ThemedButton
          title={i18n.t('screens.legal.dataRights.actions.contact.button')}
          onPress={handleContactSupport}
          variant="secondary"
          style={styles.actionButton}
          accessibilityHint="Contact privacy team for data rights requests"
        />
      </ThemedView>

      {/* Response Time */}
      <ThemedView style={[styles.infoBox, { backgroundColor: surfaceColor, borderColor }]} accessible={true} accessibilityLabel={i18n.t('screens.legal.dataRights.responseTime')}>
        <Ionicons name="time" size={20} color={primaryColor} />
        <ThemedText style={styles.infoText}>{i18n.t('screens.legal.dataRights.responseTime')}</ThemedText>
      </ThemedView>
      {alert.AlertComponent}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.xl,
  },
  rightItem: {
    flexDirection: 'row',
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightContent: {
    flex: 1,
  },
  rightTitle: {
    marginBottom: Spacing.xs,
  },
  rightDescription: {
    opacity: 0.7,
    lineHeight: Typography.body.lineHeight,
  },
  actionButton: {
    marginBottom: Spacing.md,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  infoText: {
    flex: 1,
    opacity: 0.8,
  },
});
