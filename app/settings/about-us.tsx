import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { CommonLists, CommonText } from '@/constants/common-styles';
import { BorderRadius, FontWeight, IconSize, Spacing, Typography } from '@/constants/layout';
import { getAppInfoItems, getContactItems, openURL } from '@/data';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/i18n';
import { Feather } from '@expo/vector-icons';
import Constants from 'expo-constants';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

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
          fontSize: Typography.caption.fontSize,
          fontWeight: FontWeight.semibold,
        },
        section: {
          marginBottom: Spacing.lg,
        },
        infoRow: {
          ...CommonLists.infoRow,
          borderBottomColor: borderColor,
        },
        infoRowLast: CommonLists.infoRowLast,
        infoIcon: CommonLists.infoIconContainer,
        infoContent: CommonLists.infoContent,
        infoLabel: {
          ...CommonLists.infoLabel,
          color: textMutedColor,
        },
        infoValue: CommonLists.infoValue,
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
          fontSize: Typography.bodySmall.fontSize,
          textAlign: 'center',
        },
        companyName: {
          color: primaryColor,
          fontWeight: FontWeight.semibold,
        },
        listItem: {
          marginBottom: Spacing.sm,
        },
        copyrightText: {
          marginTop: Spacing.md,
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
                <Feather name={item.icon} size={IconSize.md} color={primaryColor} />
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
            <ThemedListItem
              key={item.label}
              title={item.label}
              description={item.value}
              icon={item.icon}
              rightIcon="external-link"
              onPress={item.action}
              showDivider={index < contactItems.length - 1}
            />
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
            <ThemedText key={index} style={index < arr.length - 1 ? styles.listItem : undefined}>
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
            <ThemedText key={index} style={index < arr.length - 1 ? styles.listItem : undefined}>
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
        <ThemedText style={[styles.footerText, styles.copyrightText]}>{i18n.t('screens.settings.aboutUs.footer.copyright')}</ThemedText>
      </View>
    </ScreenContainer>
  );
}
