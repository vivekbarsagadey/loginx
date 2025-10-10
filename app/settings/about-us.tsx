import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { CommonText } from '@/constants/common-styles';
import { BorderRadius, Spacing } from '@/constants/layout';
import { getAppInfoItems, getContactItems, openURL } from '@/data';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/i18n';
import { Feather } from '@expo/vector-icons';
import Constants from 'expo-constants';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function AboutUsScreen() {
  const primaryColor = useThemeColor({}, 'primary');
  const textMutedColor = useThemeColor({}, 'text-muted');
  const borderColor = useThemeColor({}, 'border');

  // Get app information from centralized data
  const appName = Constants.expoConfig?.extra?.appName || 'LoginX';
  const appVersion = Constants.expoConfig?.version || '1.0.0';
  const infoItems = getAppInfoItems();
  const contactItems = getContactItems(openURL);

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        header: {
          alignItems: 'center',
          marginBottom: Spacing.xl,
        },
        logo: {
          width: Spacing.huge + Spacing.xl + Spacing.xs, // 100px (64+32+4)
          height: Spacing.huge + Spacing.xl + Spacing.xs, // 100px
          borderRadius: BorderRadius.xl,
          marginBottom: Spacing.md,
        },
        appName: {
          marginBottom: Spacing.xs,
        },
        tagline: {
          textAlign: 'center',
          color: textMutedColor,
          marginBottom: Spacing.sm,
        },
        badge: {
          backgroundColor: primaryColor + '20',
          paddingHorizontal: Spacing.md,
          paddingVertical: Spacing.xs,
          borderRadius: BorderRadius.full,
          marginTop: Spacing.sm,
        },
        badgeText: {
          color: primaryColor,
          fontSize: Spacing.md - Spacing.xs, // 12px
          fontWeight: '600',
        },
        section: {
          marginBottom: Spacing.lg,
        },
        infoRow: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: Spacing.md,
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
        },
        infoRowLast: {
          borderBottomWidth: 0,
        },
        infoIcon: {
          marginRight: Spacing.md,
          width: Spacing.lg, // 24px
          alignItems: 'center',
        },
        infoContent: {
          flex: 1,
        },
        infoLabel: {
          color: textMutedColor,
          fontSize: Spacing.md - Spacing.xs, // 12px
          marginBottom: Spacing.xs,
        },
        infoValue: {
          fontSize: Spacing.md, // 16px
          fontWeight: '500',
        },
        contactRow: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: Spacing.md,
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
        },
        contactRowLast: {
          borderBottomWidth: 0,
        },
        contactIcon: {
          marginRight: Spacing.md,
          width: Spacing.lg, // 24px
          alignItems: 'center',
        },
        contactContent: {
          flex: 1,
        },
        contactLabel: {
          color: textMutedColor,
          fontSize: Spacing.md - Spacing.xs, // 12px
          marginBottom: Spacing.xs,
        },
        contactValue: {
          fontSize: Spacing.md, // 16px
          fontWeight: '500',
          color: primaryColor,
        },
        description: {
          textAlign: 'center',
          color: textMutedColor,
          lineHeight: Spacing.lg - 2, // 22px
          marginBottom: Spacing.lg,
        },
        footer: {
          alignItems: 'center',
          paddingVertical: Spacing.xl,
        },
        footerText: {
          color: textMutedColor,
          fontSize: Spacing.sm + Spacing.xs + 2, // 14px
          textAlign: 'center',
        },
        companyName: {
          color: primaryColor,
          fontWeight: '600',
        },
      }),
    [primaryColor, textMutedColor, borderColor]
  );

  return (
    <ScreenContainer scrollable useSafeArea={false}>
      {/* Header with Logo */}
      <View style={styles.header}>
        <Image source={require('@/assets/images/icon.png')} style={styles.logo} />
        <ThemedText type="h2" style={styles.appName}>
          {appName}
        </ThemedText>
        <ThemedText style={styles.tagline}>{i18n.t('screens.settings.aboutUs.tagline')}</ThemedText>
        <View style={styles.badge}>
          <ThemedText style={styles.badgeText}>v{appVersion}</ThemedText>
        </View>
      </View>

      {/* Description */}
      <ThemedText style={styles.description}>{i18n.t('screens.settings.aboutUs.description')}</ThemedText>

      {/* App Information Section */}
      <View style={styles.section}>
        <ThemedText type="h3" style={CommonText.sectionTitle}>
          {i18n.t('screens.settings.aboutUs.sections.appInfo.title')}
        </ThemedText>
        <Card elevation={1} noPadding>
          {infoItems.map((item, index) => (
            <View key={item.label} style={[styles.infoRow, index === infoItems.length - 1 && styles.infoRowLast]}>
              <View style={styles.infoIcon}>
                <Feather name={item.icon as React.ComponentProps<typeof Feather>['name']} size={20} color={primaryColor} />
              </View>
              <View style={styles.infoContent}>
                <ThemedText style={styles.infoLabel}>{item.label}</ThemedText>
                <ThemedText style={styles.infoValue}>{item.value}</ThemedText>
              </View>
            </View>
          ))}
        </Card>
      </View>

      {/* Contact Information Section */}
      <View style={styles.section}>
        <ThemedText type="h3" style={CommonText.sectionTitle}>
          {i18n.t('screens.settings.aboutUs.sections.contact.title')}
        </ThemedText>
        <Card elevation={1} noPadding>
          {contactItems.map((item, index) => (
            <TouchableOpacity key={item.label} style={[styles.contactRow, index === contactItems.length - 1 && styles.contactRowLast]} onPress={item.action}>
              <View style={styles.contactIcon}>
                <Feather name={item.icon as React.ComponentProps<typeof Feather>['name']} size={20} color={primaryColor} />
              </View>
              <View style={styles.contactContent}>
                <ThemedText style={styles.contactLabel}>{item.label}</ThemedText>
                <ThemedText style={styles.contactValue}>{item.value}</ThemedText>
              </View>
              <Feather name="external-link" size={18} color={textMutedColor} />
            </TouchableOpacity>
          ))}
        </Card>
      </View>

      {/* Features Highlights */}
      <View style={styles.section}>
        <ThemedText type="h3" style={CommonText.sectionTitle}>
          {i18n.t('screens.settings.aboutUs.sections.features.title')}
        </ThemedText>
        <Card elevation={1}>
          {(i18n.t('screens.settings.aboutUs.sections.features.items', { returnObjects: true }) as string[]).map((feature, index, arr) => (
            <ThemedText key={index} style={{ marginBottom: index < arr.length - 1 ? Spacing.sm : 0 }}>
              {feature}
            </ThemedText>
          ))}
        </Card>
      </View>

      {/* Technologies Section */}
      <View style={styles.section}>
        <ThemedText type="h3" style={CommonText.sectionTitle}>
          {i18n.t('screens.settings.aboutUs.sections.builtWith.title')}
        </ThemedText>
        <Card elevation={1}>
          {(i18n.t('screens.settings.aboutUs.sections.builtWith.items', { returnObjects: true }) as string[]).map((tech, index, arr) => (
            <ThemedText key={index} style={{ marginBottom: index < arr.length - 1 ? Spacing.sm : 0 }}>
              {tech}
            </ThemedText>
          ))}
        </Card>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <ThemedText style={styles.footerText}>
          {i18n.t('screens.settings.aboutUs.footer.builtWith')}
          {'\n'}
          <ThemedText style={styles.companyName}>{i18n.t('screens.settings.aboutUs.footer.developer')}</ThemedText>
          {'\n'}
          {i18n.t('screens.settings.aboutUs.footer.at')}
          {'\n'}
          <ThemedText style={styles.companyName}>{i18n.t('screens.settings.aboutUs.footer.company')}</ThemedText>
        </ThemedText>
        <ThemedText style={[styles.footerText, { marginTop: Spacing.md }]}>{i18n.t('screens.settings.aboutUs.footer.copyright')}</ThemedText>
      </View>
    </ScreenContainer>
  );
}
