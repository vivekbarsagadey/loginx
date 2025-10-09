import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { CommonText } from '@/constants/common-styles';
import { Spacing } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/i18n';
import { Feather } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

export default function PrivacyScreen() {
  const textMuted = useThemeColor({}, 'text-muted');

  return (
    <ScreenContainer scrollable>
      <ThemedText style={[styles.lastUpdated, { color: textMuted }]}>{i18n.t('screens.privacy.lastUpdated')}</ThemedText>

      {/* Introduction */}
      <ThemedView style={styles.section}>
        <ThemedText style={styles.description}>{i18n.t('screens.privacy.introduction')}</ThemedText>
      </ThemedView>

      {/* Information We Collect */}
      <ThemedView style={styles.section}>
        <ThemedText type="h3" style={CommonText.sectionTitle}>
          {i18n.t('screens.privacy.informationWeCollect.title')}
        </ThemedText>
        <Collapsible title={i18n.t('screens.privacy.informationWeCollect.accountInfo.title')}>
          <ThemedText style={styles.answer}>{i18n.t('screens.privacy.informationWeCollect.accountInfo.content')}</ThemedText>
        </Collapsible>

        <Collapsible title={i18n.t('screens.privacy.informationWeCollect.usageData.title')}>
          <ThemedText style={styles.answer}>{i18n.t('screens.privacy.informationWeCollect.usageData.content')}</ThemedText>
        </Collapsible>

        <Collapsible title={i18n.t('screens.privacy.informationWeCollect.deviceInfo.title')}>
          <ThemedText style={styles.answer}>{i18n.t('screens.privacy.informationWeCollect.deviceInfo.content')}</ThemedText>
        </Collapsible>
      </ThemedView>

      {/* How We Use Your Information */}
      <ThemedView style={styles.section}>
        <ThemedText type="h3" style={CommonText.sectionTitle}>
          {i18n.t('screens.privacy.howWeUse.title')}
        </ThemedText>
        <Collapsible title={i18n.t('screens.privacy.howWeUse.provideServices.title')}>
          <ThemedText style={styles.answer}>{i18n.t('screens.privacy.howWeUse.provideServices.content')}</ThemedText>
        </Collapsible>

        <Collapsible title={i18n.t('screens.privacy.howWeUse.improveSecurity.title')}>
          <ThemedText style={styles.answer}>{i18n.t('screens.privacy.howWeUse.improveSecurity.content')}</ThemedText>
        </Collapsible>

        <Collapsible title={i18n.t('screens.privacy.howWeUse.communicate.title')}>
          <ThemedText style={styles.answer}>{i18n.t('screens.privacy.howWeUse.communicate.content')}</ThemedText>
        </Collapsible>
      </ThemedView>

      {/* Data Security */}
      <ThemedView style={styles.section}>
        <ThemedText type="h3" style={CommonText.sectionTitle}>
          {i18n.t('screens.privacy.dataSecurity.title')}
        </ThemedText>
        <ThemedText style={styles.description}>{i18n.t('screens.privacy.dataSecurity.description')}</ThemedText>
      </ThemedView>

      {/* Data Sharing */}
      <ThemedView style={styles.section}>
        <ThemedText type="h3" style={CommonText.sectionTitle}>
          {i18n.t('screens.privacy.dataSharing.title')}
        </ThemedText>
        <Collapsible title={i18n.t('screens.privacy.dataSharing.noSelling.title')}>
          <ThemedText style={styles.answer}>{i18n.t('screens.privacy.dataSharing.noSelling.content')}</ThemedText>
        </Collapsible>

        <Collapsible title={i18n.t('screens.privacy.dataSharing.serviceProviders.title')}>
          <ThemedText style={styles.answer}>{i18n.t('screens.privacy.dataSharing.serviceProviders.content')}</ThemedText>
        </Collapsible>

        <Collapsible title={i18n.t('screens.privacy.dataSharing.legalRequirements.title')}>
          <ThemedText style={styles.answer}>{i18n.t('screens.privacy.dataSharing.legalRequirements.content')}</ThemedText>
        </Collapsible>
      </ThemedView>

      {/* Your Rights */}
      <ThemedView style={styles.section}>
        <ThemedText type="h3" style={CommonText.sectionTitle}>
          {i18n.t('screens.privacy.yourRights.title')}
        </ThemedText>
        <Collapsible title={i18n.t('screens.privacy.yourRights.accessData.title')}>
          <ThemedText style={styles.answer}>{i18n.t('screens.privacy.yourRights.accessData.content')}</ThemedText>
        </Collapsible>

        <Collapsible title={i18n.t('screens.privacy.yourRights.correctData.title')}>
          <ThemedText style={styles.answer}>{i18n.t('screens.privacy.yourRights.correctData.content')}</ThemedText>
        </Collapsible>

        <Collapsible title={i18n.t('screens.privacy.yourRights.deleteData.title')}>
          <ThemedText style={styles.answer}>{i18n.t('screens.privacy.yourRights.deleteData.content')}</ThemedText>
        </Collapsible>

        <Collapsible title={i18n.t('screens.privacy.yourRights.exportData.title')}>
          <ThemedText style={styles.answer}>{i18n.t('screens.privacy.yourRights.exportData.content')}</ThemedText>
        </Collapsible>
      </ThemedView>

      {/* Children's Privacy */}
      <ThemedView style={styles.section}>
        <ThemedText type="h3" style={CommonText.sectionTitle}>
          {i18n.t('screens.privacy.childrenPrivacy.title')}
        </ThemedText>
        <ThemedText style={styles.description}>{i18n.t('screens.privacy.childrenPrivacy.content')}</ThemedText>
      </ThemedView>

      {/* Changes to Policy */}
      <ThemedView style={styles.section}>
        <ThemedText type="h3" style={CommonText.sectionTitle}>
          {i18n.t('screens.privacy.changes.title')}
        </ThemedText>
        <ThemedText style={styles.description}>{i18n.t('screens.privacy.changes.content')}</ThemedText>
      </ThemedView>

      {/* Contact */}
      <ThemedView style={[styles.section, styles.contactSection]}>
        <Feather name="mail" size={32} color={textMuted} style={styles.contactIcon} />
        <ThemedText type="h3" style={styles.contactTitle}>
          {i18n.t('screens.privacy.contact.title')}
        </ThemedText>
        <ThemedText style={styles.contactDescription}>{i18n.t('screens.privacy.contact.content')}</ThemedText>
      </ThemedView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  lastUpdated: {
    fontSize: 14,
    marginBottom: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  description: {
    lineHeight: 24,
    opacity: 0.9,
  },
  answer: {
    lineHeight: 24,
    opacity: 0.9,
  },
  contactSection: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  contactIcon: {
    marginBottom: Spacing.md,
  },
  contactTitle: {
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  contactDescription: {
    textAlign: 'center',
    opacity: 0.8,
  },
});
