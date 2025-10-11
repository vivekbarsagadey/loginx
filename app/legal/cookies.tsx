import { ScreenContainer } from '@/components/screen-container';
import { ThemedInfoBox } from '@/components/themed-info-box';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { Spacing, Typography } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme-colors';
import i18n from '@/i18n';
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { AccessibilityInfo, StyleSheet } from 'react-native';

/**
 * Cookie Policy Screen
 *
 * Explains cookie usage, types of cookies, and user controls.
 * GDPR and ePrivacy Directive compliance.
 */
export default function CookiesScreen() {
  const colors = useThemeColors();

  useEffect(() => {
    AccessibilityInfo.announceForAccessibility('Cookie Policy. Information about cookies and tracking technologies.');
  }, []);

  const cookieTypes = [
    {
      icon: 'shield-checkmark' as const,
      title: i18n.t('screens.legal.cookies.types.essential.title'),
      description: i18n.t('screens.legal.cookies.types.essential.description'),
      required: true,
    },
    {
      icon: 'bar-chart' as const,
      title: i18n.t('screens.legal.cookies.types.analytics.title'),
      description: i18n.t('screens.legal.cookies.types.analytics.description'),
      required: false,
    },
    {
      icon: 'megaphone' as const,
      title: i18n.t('screens.legal.cookies.types.marketing.title'),
      description: i18n.t('screens.legal.cookies.types.marketing.description'),
      required: false,
    },
    {
      icon: 'people' as const,
      title: i18n.t('screens.legal.cookies.types.social.title'),
      description: i18n.t('screens.legal.cookies.types.social.description'),
      required: false,
    },
  ];

  return (
    <ScreenContainer scrollable>
      <ThemedText style={styles.lastUpdated} accessibilityLabel={`Last updated: ${i18n.t('screens.legal.cookies.lastUpdated')}`}>
        {i18n.t('screens.legal.cookies.lastUpdated')}
      </ThemedText>

      {/* What are Cookies */}
      <ThemedView style={styles.section}>
        <ThemedText type="h3" style={styles.sectionTitle} accessibilityRole="header">
          {i18n.t('screens.legal.cookies.whatAreCookies.title')}
        </ThemedText>
        <ThemedText style={styles.sectionContent}>{i18n.t('screens.legal.cookies.whatAreCookies.content')}</ThemedText>
      </ThemedView>

      {/* Types of Cookies */}
      <ThemedView style={styles.section}>
        <ThemedText type="h3" style={styles.sectionTitle} accessibilityRole="header">
          {i18n.t('screens.legal.cookies.typesTitle')}
        </ThemedText>

        {cookieTypes.map((cookie, index) => (
          <ThemedView
            key={index}
            style={[styles.cookieItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
            accessible={true}
            accessibilityLabel={`${cookie.title}. ${cookie.required ? 'Required' : 'Optional'}. ${cookie.description}`}
          >
            <ThemedView style={styles.cookieHeader}>
              <ThemedView style={styles.cookieHeaderLeft}>
                <ThemedView style={[styles.iconContainer, { backgroundColor: `${colors.primary}20` }]}>
                  <Ionicons name={cookie.icon} size={24} color={colors.primary} />
                </ThemedView>
                <ThemedText type="bodyBold" style={styles.cookieTitle}>
                  {cookie.title}
                </ThemedText>
              </ThemedView>
              {cookie.required && (
                <ThemedView style={[styles.badge, { backgroundColor: colors.primary }]}>
                  <ThemedText style={[styles.badgeText, { color: colors['on-primary'] }]}>{i18n.t('screens.legal.cookies.required')}</ThemedText>
                </ThemedView>
              )}
            </ThemedView>
            <ThemedText style={styles.cookieDescription}>{cookie.description}</ThemedText>
          </ThemedView>
        ))}
      </ThemedView>

      {/* How We Use Cookies */}
      <ThemedView style={styles.section}>
        <ThemedText type="h3" style={styles.sectionTitle} accessibilityRole="header">
          {i18n.t('screens.legal.cookies.howWeUse.title')}
        </ThemedText>

        <Collapsible title={i18n.t('screens.legal.cookies.howWeUse.authentication.title')}>
          <ThemedText style={styles.answer}>{i18n.t('screens.legal.cookies.howWeUse.authentication.content')}</ThemedText>
        </Collapsible>

        <Collapsible title={i18n.t('screens.legal.cookies.howWeUse.preferences.title')}>
          <ThemedText style={styles.answer}>{i18n.t('screens.legal.cookies.howWeUse.preferences.content')}</ThemedText>
        </Collapsible>

        <Collapsible title={i18n.t('screens.legal.cookies.howWeUse.security.title')}>
          <ThemedText style={styles.answer}>{i18n.t('screens.legal.cookies.howWeUse.security.content')}</ThemedText>
        </Collapsible>
      </ThemedView>

      {/* Your Choices */}
      <ThemedView style={styles.section}>
        <ThemedText type="h3" style={styles.sectionTitle} accessibilityRole="header">
          {i18n.t('screens.legal.cookies.yourChoices.title')}
        </ThemedText>
        <ThemedText style={styles.sectionContent}>{i18n.t('screens.legal.cookies.yourChoices.content')}</ThemedText>
      </ThemedView>

      {/* Third-Party Cookies */}
      <ThemedView style={styles.section}>
        <ThemedText type="h3" style={styles.sectionTitle} accessibilityRole="header">
          {i18n.t('screens.legal.cookies.thirdParty.title')}
        </ThemedText>
        <ThemedText style={styles.sectionContent}>{i18n.t('screens.legal.cookies.thirdParty.content')}</ThemedText>
      </ThemedView>

      {/* Contact */}
      <ThemedInfoBox variant="info" style={{ marginTop: Spacing.lg }}>
        <ThemedText>Last updated: January 2025</ThemedText>
      </ThemedInfoBox>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  lastUpdated: {
    textAlign: 'center',
    marginBottom: Spacing.lg,
    opacity: 0.7,
    fontStyle: 'italic',
  },
  sectionTitle: {
    marginBottom: Spacing.md,
    fontWeight: Typography.bodyBold.fontWeight,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionContent: {
    lineHeight: Typography.body.lineHeight,
    opacity: 0.9,
    marginBottom: Spacing.md,
  },
  cookieItem: {
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: Spacing.md,
  },
  cookieHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  cookieHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cookieTitle: {
    flex: 1,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  cookieDescription: {
    opacity: 0.7,
    lineHeight: Typography.body.lineHeight,
  },
  answer: {
    lineHeight: Typography.body.lineHeight,
    opacity: 0.9,
  },
});
