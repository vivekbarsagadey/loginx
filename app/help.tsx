import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { CommonText } from '@/constants/common-styles';
import { Spacing } from '@/constants/layout';
import { useLanguage } from '@/hooks/use-language-provider';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/i18n';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { Linking, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

interface QuickActionProps {
  icon: React.ComponentProps<typeof Feather>['name'];
  title: string;
  description: string;
  onPress: () => void;
}

function QuickAction({ icon, title, description, onPress }: QuickActionProps) {
  const borderColor = useThemeColor({}, 'border');
  const iconColor = useThemeColor({}, 'primary');

  return (
    <TouchableOpacity style={[styles.quickAction, { borderColor }]} onPress={onPress} activeOpacity={0.7} accessibilityRole="button" accessibilityLabel={title} accessibilityHint={description}>
      <View style={styles.quickActionIcon}>
        <Feather name={icon} size={24} color={iconColor} />
      </View>
      <View style={styles.quickActionContent}>
        <ThemedText type="h3" style={styles.quickActionTitle}>
          {title}
        </ThemedText>
        <ThemedText style={styles.quickActionDescription}>{description}</ThemedText>
      </View>
      <Feather name="chevron-right" size={20} color={iconColor} />
    </TouchableOpacity>
  );
}

export default function HelpScreen() {
  const router = useRouter();
  const { language: _language } = useLanguage();
  const primaryColor = useThemeColor({}, 'primary');

  const handleContactSupport = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/support');
  };

  const handleSendFeedback = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/feedback');
  };

  const handleVisitWebsite = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const url = 'https://github.com/vivekbarsagadey/loginx';
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.error('Error opening website:', error);
    }
  };

  const handleViewPrivacy = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/privacy');
  };

  const platformNote = Platform.OS === 'ios' ? i18n.t('screens.help.platformNotes.ios') : i18n.t('screens.help.platformNotes.android');

  return (
    <ScreenContainer scrollable>
      {/* Quick Actions */}
      <ThemedView style={styles.section}>
        <ThemedText type="h3" style={CommonText.sectionTitle}>
          {i18n.t('screens.help.quickActions.title')}
        </ThemedText>
        <QuickAction
          icon="message-circle"
          title={i18n.t('screens.help.quickActions.contactSupport.title')}
          description={i18n.t('screens.help.quickActions.contactSupport.description')}
          onPress={handleContactSupport}
        />
        <QuickAction
          icon="send"
          title={i18n.t('screens.help.quickActions.sendFeedback.title')}
          description={i18n.t('screens.help.quickActions.sendFeedback.description')}
          onPress={handleSendFeedback}
        />
        <QuickAction
          icon="globe"
          title={i18n.t('screens.help.quickActions.visitWebsite.title')}
          description={i18n.t('screens.help.quickActions.visitWebsite.description')}
          onPress={handleVisitWebsite}
        />
        <QuickAction
          icon="shield"
          title={i18n.t('screens.help.quickActions.privacySecurity.title')}
          description={i18n.t('screens.help.quickActions.privacySecurity.description')}
          onPress={handleViewPrivacy}
        />
      </ThemedView>

      {/* Getting Started */}
      <ThemedView style={styles.section}>
        <ThemedText type="h3" style={CommonText.sectionTitle}>
          {i18n.t('screens.help.gettingStarted.title')}
        </ThemedText>
        <Collapsible title={i18n.t('screens.help.gettingStarted.createAccount.question')}>
          <ThemedText style={styles.answer}>{i18n.t('screens.help.gettingStarted.createAccount.answer')}</ThemedText>
        </Collapsible>

        <Collapsible title={i18n.t('screens.help.gettingStarted.enableBiometric.question')}>
          <ThemedText style={styles.answer}>{i18n.t('screens.help.gettingStarted.enableBiometric.answer')}</ThemedText>
        </Collapsible>

        <Collapsible title={i18n.t('screens.help.gettingStarted.resetPassword.question')}>
          <ThemedText style={styles.answer}>{i18n.t('screens.help.gettingStarted.resetPassword.answer')}</ThemedText>
        </Collapsible>
      </ThemedView>

      {/* Account & Security */}
      <ThemedView style={styles.section}>
        <ThemedText type="h3" style={CommonText.sectionTitle}>
          {i18n.t('screens.help.accountSecurity.title')}
        </ThemedText>
        <Collapsible title={i18n.t('screens.help.accountSecurity.changeEmail.question')}>
          <ThemedText style={styles.answer}>{i18n.t('screens.help.accountSecurity.changeEmail.answer')}</ThemedText>
        </Collapsible>

        <Collapsible title={i18n.t('screens.help.accountSecurity.twoFactor.question')}>
          <ThemedText style={styles.answer}>{i18n.t('screens.help.accountSecurity.twoFactor.answer')}</ThemedText>
        </Collapsible>

        <Collapsible title={i18n.t('screens.help.accountSecurity.dataSecure.question')}>
          <ThemedText style={styles.answer}>{i18n.t('screens.help.accountSecurity.dataSecure.answer')}</ThemedText>
        </Collapsible>

        <Collapsible title={i18n.t('screens.help.accountSecurity.deleteAccount.question')}>
          <ThemedText style={styles.answer}>{i18n.t('screens.help.accountSecurity.deleteAccount.answer')}</ThemedText>
        </Collapsible>
      </ThemedView>

      {/* Troubleshooting */}
      <ThemedView style={styles.section}>
        <ThemedText type="h3" style={CommonText.sectionTitle}>
          {i18n.t('screens.help.troubleshooting.title')}
        </ThemedText>
        <Collapsible title={i18n.t('screens.help.troubleshooting.appCrashing.question')}>
          <ThemedText style={styles.answer}>{i18n.t('screens.help.troubleshooting.appCrashing.answer')}</ThemedText>
        </Collapsible>

        <Collapsible title={i18n.t('screens.help.troubleshooting.biometricNotWorking.question')}>
          <ThemedText style={styles.answer}>{i18n.t('screens.help.troubleshooting.biometricNotWorking.answer')}</ThemedText>
        </Collapsible>

        <Collapsible title={i18n.t('screens.help.troubleshooting.noNotifications.question')}>
          <ThemedText style={styles.answer}>{i18n.t('screens.help.troubleshooting.noNotifications.answer', { platformNote })}</ThemedText>
        </Collapsible>

        <Collapsible title={i18n.t('screens.help.troubleshooting.syncIssues.question')}>
          <ThemedText style={styles.answer}>{i18n.t('screens.help.troubleshooting.syncIssues.answer')}</ThemedText>
        </Collapsible>

        <Collapsible title={i18n.t('screens.help.troubleshooting.emailVerification.question')}>
          <ThemedText style={styles.answer}>{i18n.t('screens.help.troubleshooting.emailVerification.answer')}</ThemedText>
        </Collapsible>
      </ThemedView>

      {/* Features & Settings */}
      <ThemedView style={styles.section}>
        <ThemedText type="h3" style={CommonText.sectionTitle}>
          {i18n.t('screens.help.features.title')}
        </ThemedText>
        <Collapsible title={i18n.t('screens.help.features.changeTheme.question')}>
          <ThemedText style={styles.answer}>{i18n.t('screens.help.features.changeTheme.answer')}</ThemedText>
        </Collapsible>

        <Collapsible title={i18n.t('screens.help.features.changeLanguage.question')}>
          <ThemedText style={styles.answer}>{i18n.t('screens.help.features.changeLanguage.answer')}</ThemedText>
        </Collapsible>

        <Collapsible title={i18n.t('screens.help.features.offlineData.question')}>
          <ThemedText style={styles.answer}>{i18n.t('screens.help.features.offlineData.answer')}</ThemedText>
        </Collapsible>

        <Collapsible title={i18n.t('screens.help.features.clearCache.question')}>
          <ThemedText style={styles.answer}>{i18n.t('screens.help.features.clearCache.answer')}</ThemedText>
        </Collapsible>
      </ThemedView>

      {/* Privacy & Legal */}
      <ThemedView style={styles.section}>
        <ThemedText type="h3" style={CommonText.sectionTitle}>
          {i18n.t('screens.help.privacy.title')}
        </ThemedText>
        <Collapsible title={i18n.t('screens.help.privacy.dataUsage.question')}>
          <ThemedText style={styles.answer}>{i18n.t('screens.help.privacy.dataUsage.answer')}</ThemedText>
        </Collapsible>

        <Collapsible title={i18n.t('screens.help.privacy.exportData.question')}>
          <ThemedText style={styles.answer}>{i18n.t('screens.help.privacy.exportData.answer')}</ThemedText>
        </Collapsible>

        <Collapsible title={i18n.t('screens.help.privacy.termsOfService.question')}>
          <ThemedText style={styles.answer}>{i18n.t('screens.help.privacy.termsOfService.answer')}</ThemedText>
        </Collapsible>
      </ThemedView>

      {/* Need More Help? */}
      <ThemedView style={[styles.section, styles.helpSection]}>
        <Feather name="help-circle" size={48} color={primaryColor} style={styles.helpIcon} />
        <ThemedText type="h3" style={styles.helpTitle}>
          {i18n.t('screens.help.needMoreHelp.title')}
        </ThemedText>
        <ThemedText style={styles.helpDescription}>{i18n.t('screens.help.needMoreHelp.description')}</ThemedText>
      </ThemedView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.xl,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    marginBottom: 2,
    fontWeight: '600',
  },
  quickActionDescription: {
    fontSize: 13,
    opacity: 0.7,
  },
  answer: {
    lineHeight: 22,
    opacity: 0.9,
    marginTop: Spacing.sm,
  },
  helpSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  helpIcon: {
    marginBottom: Spacing.md,
  },
  helpTitle: {
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  helpDescription: {
    textAlign: 'center',
    marginBottom: Spacing.lg,
    opacity: 0.8,
  },
  supportButton: {
    minWidth: 200,
  },
});
