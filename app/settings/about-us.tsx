import { TabHeader } from '@/components/navigation/TabHeader';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { CommonText } from '@/constants/common-styles';
import { BorderRadius, Spacing } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Feather } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import React from 'react';
import { Image, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function AboutUsScreen() {
  const primaryColor = useThemeColor({}, 'primary');
  const textMutedColor = useThemeColor({}, 'text-muted');
  const borderColor = useThemeColor({}, 'border');

  // Get app information from app.config.ts via Constants
  const appName = Constants.expoConfig?.extra?.appName || 'LoginX';
  const appVersion = Constants.expoConfig?.version || '1.0.0';
  const appBuildNumber = Platform.select({
    ios: Constants.expoConfig?.ios?.buildNumber || '100',
    android: Constants.expoConfig?.android?.versionCode?.toString() || '100',
    default: '100',
  });

  const handleLinkPress = (url: string) => {
    Linking.openURL(url);
  };

  const infoItems = [
    { icon: 'smartphone', label: 'App Name', value: appName },
    { icon: 'tag', label: 'Version', value: appVersion },
    { icon: 'hash', label: 'Build Number', value: appBuildNumber },
    { icon: 'code', label: 'Platform', value: Platform.OS === 'ios' ? 'iOS' : Platform.OS === 'android' ? 'Android' : 'Web' },
  ];

  const contactItems = [
    { icon: 'mail', label: 'Email', value: 'vivek@whizit.co.in', action: () => handleLinkPress('mailto:vivek@whizit.co.in') },
    { icon: 'globe', label: 'Website', value: 'whizit.co.in', action: () => handleLinkPress('https://whizit.co.in') },
    { icon: 'github', label: 'GitHub', value: 'vivekbarsagadey/loginx', action: () => handleLinkPress('https://github.com/vivekbarsagadey/loginx') },
  ];

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        header: {
          alignItems: 'center',
          marginBottom: Spacing.xl,
        },
        logo: {
          width: 100,
          height: 100,
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
          fontSize: 12,
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
          width: 24,
          alignItems: 'center',
        },
        infoContent: {
          flex: 1,
        },
        infoLabel: {
          color: textMutedColor,
          fontSize: 12,
          marginBottom: Spacing.xs,
        },
        infoValue: {
          fontSize: 16,
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
          width: 24,
          alignItems: 'center',
        },
        contactContent: {
          flex: 1,
        },
        contactLabel: {
          color: textMutedColor,
          fontSize: 12,
          marginBottom: Spacing.xs,
        },
        contactValue: {
          fontSize: 16,
          fontWeight: '500',
          color: primaryColor,
        },
        description: {
          textAlign: 'center',
          color: textMutedColor,
          lineHeight: 22,
          marginBottom: Spacing.lg,
        },
        footer: {
          alignItems: 'center',
          paddingVertical: Spacing.xl,
        },
        footerText: {
          color: textMutedColor,
          fontSize: 14,
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
    <>
      <TabHeader title="About Us" showBackButton={true} />
      <ScreenContainer scrollable useSafeArea={false}>
        {/* Header with Logo */}
        <View style={styles.header}>
          <Image source={require('@/assets/images/icon.png')} style={styles.logo} />
          <ThemedText type="h1" style={styles.appName}>
            {appName}
          </ThemedText>
          <ThemedText style={styles.tagline}>A modern, secure authentication solution</ThemedText>
          <View style={styles.badge}>
            <ThemedText style={styles.badgeText}>v{appVersion}</ThemedText>
          </View>
        </View>

        {/* Description */}
        <ThemedText style={styles.description}>
          LoginX is an enterprise-grade, cross-platform mobile authentication application built with React Native and Expo. It provides a seamless, secure, and accessible user authentication
          experience with comprehensive profile management.
        </ThemedText>

        {/* App Information Section */}
        <View style={styles.section}>
          <ThemedText type="h2" style={CommonText.sectionTitle}>
            App Information
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
          <ThemedText type="h2" style={CommonText.sectionTitle}>
            Contact Information
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
          <ThemedText type="h2" style={CommonText.sectionTitle}>
            Key Features
          </ThemedText>
          <Card elevation={1}>
            <ThemedText style={{ marginBottom: Spacing.sm }}>✅ Firebase Authentication</ThemedText>
            <ThemedText style={{ marginBottom: Spacing.sm }}>✅ Biometric Authentication (Face ID, Touch ID)</ThemedText>
            <ThemedText style={{ marginBottom: Spacing.sm }}>✅ Two-Factor Authentication (2FA)</ThemedText>
            <ThemedText style={{ marginBottom: Spacing.sm }}>✅ Multi-Language Support (EN, ES, HI)</ThemedText>
            <ThemedText style={{ marginBottom: Spacing.sm }}>✅ Light & Dark Mode</ThemedText>
            <ThemedText style={{ marginBottom: Spacing.sm }}>✅ Secure Storage & Encryption</ThemedText>
            <ThemedText>✅ WCAG 2.1 AA Accessibility Compliance</ThemedText>
          </Card>
        </View>

        {/* Technologies Section */}
        <View style={styles.section}>
          <ThemedText type="h2" style={CommonText.sectionTitle}>
            Built With
          </ThemedText>
          <Card elevation={1}>
            <ThemedText style={{ marginBottom: Spacing.sm }}>• React Native 0.81.4</ThemedText>
            <ThemedText style={{ marginBottom: Spacing.sm }}>• Expo SDK 54</ThemedText>
            <ThemedText style={{ marginBottom: Spacing.sm }}>• TypeScript</ThemedText>
            <ThemedText style={{ marginBottom: Spacing.sm }}>• Firebase</ThemedText>
            <ThemedText>• Expo Router</ThemedText>
          </Card>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            Built with ❤️ by{'\n'}
            <ThemedText style={styles.companyName}>Vivek Barsagadey</ThemedText>
            {'\n'}at{'\n'}
            <ThemedText style={styles.companyName}>Whiz IT</ThemedText>
          </ThemedText>
          <ThemedText style={[styles.footerText, { marginTop: Spacing.md }]}>© 2025 Whiz IT. All rights reserved.</ThemedText>
        </View>
      </ScreenContainer>
    </>
  );
}
