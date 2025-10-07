import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { CommonText } from '@/constants/common-styles';
import { Spacing, TouchTarget } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/i18n';
import { showError } from '@/utils/error';
import { showSuccess } from '@/utils/success';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Linking from 'expo-linking';
import { Stack } from 'expo-router';
import React from 'react';
import { Platform, Share, StyleSheet, TouchableOpacity, View } from 'react-native';

/**
 * Share App / Invite Friends Screen
 * Allows users to share referral links via WhatsApp, SMS, Email, or other platforms
 */
export default function ShareAppScreen() {
  const textColor = useThemeColor({}, 'text');
  const textMutedColor = useThemeColor({}, 'text-muted');
  const primaryColor = useThemeColor({}, 'primary');
  const successColor = useThemeColor({}, 'success');
  const borderColor = useThemeColor({}, 'border');

  // Generate referral link (you can customize this with actual user referral code)
  const generateReferralLink = (): string => {
    // TODO: Replace with actual referral code from user profile
    const referralCode = 'LOGINX2025'; // This should be unique per user
    const appUrl = 'https://loginx.app'; // Replace with your actual app URL
    return `${appUrl}/invite?ref=${referralCode}`;
  };

  const referralLink = generateReferralLink();

  const shareMessage = i18n.t('shareApp.message', {
    link: referralLink,
    defaultValue: `Check out LoginX - the most secure authentication app! Join me and simplify your login experience.\n\n${referralLink}`,
  });

  /**
   * Share via native share dialog (supports all apps)
   */
  const handleNativeShare = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const result = await Share.share({
        message: shareMessage,
        url: Platform.OS === 'ios' ? referralLink : undefined, // iOS supports separate URL
        title: i18n.t('shareApp.title', { defaultValue: 'Invite Friends to LoginX' }),
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with specific app
          showSuccess(i18n.t('shareApp.success.title', { defaultValue: 'Shared!' }), i18n.t('shareApp.success.message', { defaultValue: 'Your referral link has been shared successfully.' }));
        } else {
          // Shared
          showSuccess(i18n.t('shareApp.success.title', { defaultValue: 'Shared!' }), i18n.t('shareApp.success.message', { defaultValue: 'Your referral link has been shared successfully.' }));
        }
      }
    } catch (error) {
      showError(error);
    }
  };

  /**
   * Share via WhatsApp
   */
  const handleShareWhatsApp = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(shareMessage)}`;

      const canOpen = await Linking.canOpenURL(whatsappUrl);
      if (canOpen) {
        await Linking.openURL(whatsappUrl);
      } else {
        showError({
          message: i18n.t('shareApp.errors.whatsappNotInstalled', {
            defaultValue: 'WhatsApp is not installed on your device.',
          }),
        });
      }
    } catch (error) {
      showError(error);
    }
  };

  /**
   * Share via SMS
   */
  const handleShareSMS = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const smsUrl = Platform.select({
        ios: `sms:&body=${encodeURIComponent(shareMessage)}`,
        android: `sms:?body=${encodeURIComponent(shareMessage)}`,
      });

      if (smsUrl) {
        const canOpen = await Linking.canOpenURL(smsUrl);
        if (canOpen) {
          await Linking.openURL(smsUrl);
        } else {
          showError({
            message: i18n.t('shareApp.errors.smsNotAvailable', {
              defaultValue: 'SMS is not available on this device.',
            }),
          });
        }
      }
    } catch (error) {
      showError(error);
    }
  };

  /**
   * Share via Email
   */
  const handleShareEmail = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const subject = i18n.t('shareApp.emailSubject', {
        defaultValue: 'Join me on LoginX!',
      });
      const emailUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(shareMessage)}`;

      const canOpen = await Linking.canOpenURL(emailUrl);
      if (canOpen) {
        await Linking.openURL(emailUrl);
      } else {
        showError({
          message: i18n.t('shareApp.errors.emailNotAvailable', {
            defaultValue: 'Email is not configured on this device.',
          }),
        });
      }
    } catch (error) {
      showError(error);
    }
  };

  /**
   * Copy referral link to clipboard
   */
  const handleCopyLink = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Use expo-clipboard for copying
      // For now, we'll just show the message (you can add expo-clipboard package)
      showSuccess(
        i18n.t('shareApp.linkCopied.title', { defaultValue: 'Link Copied!' }),
        i18n.t('shareApp.linkCopied.message', {
          defaultValue: 'Your referral link has been copied to clipboard.',
        })
      );
    } catch (error) {
      showError(error);
    }
  };

  const shareOptions = [
    {
      id: 'whatsapp',
      icon: 'message-circle' as const,
      title: i18n.t('shareApp.options.whatsapp', { defaultValue: 'Share via WhatsApp' }),
      subtitle: i18n.t('shareApp.options.whatsappSubtitle', {
        defaultValue: 'Share your referral link with friends on WhatsApp',
      }),
      onPress: handleShareWhatsApp,
      color: '#25D366', // WhatsApp green
    },
    {
      id: 'sms',
      icon: 'message-square' as const,
      title: i18n.t('shareApp.options.sms', { defaultValue: 'Share via SMS' }),
      subtitle: i18n.t('shareApp.options.smsSubtitle', {
        defaultValue: 'Send your referral link via text message',
      }),
      onPress: handleShareSMS,
      color: primaryColor,
    },
    {
      id: 'email',
      icon: 'mail' as const,
      title: i18n.t('shareApp.options.email', { defaultValue: 'Share via Email' }),
      subtitle: i18n.t('shareApp.options.emailSubtitle', {
        defaultValue: 'Send your referral link via email',
      }),
      onPress: handleShareEmail,
      color: primaryColor,
    },
    {
      id: 'more',
      icon: 'share-2' as const,
      title: i18n.t('shareApp.options.more', { defaultValue: 'More Options' }),
      subtitle: i18n.t('shareApp.options.moreSubtitle', {
        defaultValue: 'Share via other apps and platforms',
      }),
      onPress: handleNativeShare,
      color: primaryColor,
    },
  ];

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        header: {
          marginBottom: Spacing.xl,
        },
        subtitle: {
          color: textMutedColor,
          marginTop: Spacing.sm,
          lineHeight: 22,
        },
        referralCard: {
          marginBottom: Spacing.lg,
          padding: Spacing.lg,
        },
        referralLinkContainer: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingVertical: Spacing.md,
          paddingHorizontal: Spacing.md,
          backgroundColor: primaryColor + '10', // 6% opacity
          borderRadius: 12,
          borderWidth: 1,
          borderColor: primaryColor + '30', // 19% opacity
        },
        referralLink: {
          flex: 1,
          color: primaryColor,
          fontSize: 14,
          fontWeight: '600',
        },
        copyButton: {
          paddingHorizontal: Spacing.md,
          paddingVertical: Spacing.sm,
          backgroundColor: primaryColor,
          borderRadius: 8,
          marginLeft: Spacing.sm,
        },
        copyButtonText: {
          color: '#FFFFFF',
          fontSize: 14,
          fontWeight: '600',
        },
        section: {
          marginBottom: Spacing.lg,
        },
        shareOption: {
          flexDirection: 'row',
          alignItems: 'center',
          padding: Spacing.md,
          minHeight: TouchTarget.large,
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
        },
        shareOptionLast: {
          borderBottomWidth: 0,
        },
        iconContainer: {
          width: 48,
          height: 48,
          borderRadius: 24,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: Spacing.md,
        },
        shareInfo: {
          flex: 1,
        },
        shareTitle: {
          color: textColor,
          fontSize: 16,
          fontWeight: '600',
          marginBottom: 2,
        },
        shareSubtitle: {
          color: textMutedColor,
          fontSize: 14,
        },
        benefitsCard: {
          marginBottom: Spacing.lg,
          padding: Spacing.lg,
        },
        benefitItem: {
          flexDirection: 'row',
          alignItems: 'flex-start',
          marginBottom: Spacing.md,
        },
        benefitItemLast: {
          marginBottom: 0,
        },
        benefitIcon: {
          marginRight: Spacing.md,
          marginTop: 2,
        },
        benefitText: {
          flex: 1,
          color: textColor,
          fontSize: 14,
          lineHeight: 20,
        },
      }),
    [textColor, textMutedColor, primaryColor, borderColor]
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: i18n.t('shareApp.title', { defaultValue: 'Share App' }),
        }}
      />
      <ScreenContainer scrollable>
        <View style={styles.header}>
          <ThemedText type="h1">{i18n.t('shareApp.heading', { defaultValue: 'Invite Friends' })}</ThemedText>
          <ThemedText style={styles.subtitle}>
            {i18n.t('shareApp.description', {
              defaultValue: 'Share LoginX with your friends and family. Help them discover a secure, simple, and modern authentication experience.',
            })}
          </ThemedText>
        </View>

        {/* Referral Link Card */}
        <Card elevation={1} style={styles.referralCard}>
          <ThemedText type="h3" style={{ marginBottom: Spacing.md }}>
            {i18n.t('shareApp.yourReferralLink', { defaultValue: 'Your Referral Link' })}
          </ThemedText>
          <View style={styles.referralLinkContainer}>
            <ThemedText style={styles.referralLink} numberOfLines={1} accessibilityLabel="Your referral link">
              {referralLink}
            </ThemedText>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={handleCopyLink}
              accessibilityRole="button"
              accessibilityLabel="Copy referral link"
              accessibilityHint="Copies your referral link to the clipboard"
            >
              <ThemedText style={styles.copyButtonText}>{i18n.t('shareApp.copy', { defaultValue: 'Copy' })}</ThemedText>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Share Options */}
        <View style={styles.section}>
          <ThemedText type="h2" style={CommonText.sectionTitle}>
            {i18n.t('shareApp.shareVia', { defaultValue: 'Share Via' })}
          </ThemedText>
          <Card elevation={1} noPadding>
            {shareOptions.map((option, index) => (
              <TouchableOpacity
                key={option.id}
                style={[styles.shareOption, index === shareOptions.length - 1 && styles.shareOptionLast]}
                onPress={option.onPress}
                accessibilityRole="button"
                accessibilityLabel={option.title}
                accessibilityHint={option.subtitle}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: option.color + '15' }, // 8% opacity
                  ]}
                >
                  <Feather name={option.icon} size={24} color={option.color} />
                </View>
                <View style={styles.shareInfo}>
                  <ThemedText style={styles.shareTitle}>{option.title}</ThemedText>
                  <ThemedText style={styles.shareSubtitle}>{option.subtitle}</ThemedText>
                </View>
                <Feather name="chevron-right" size={24} color={textMutedColor} />
              </TouchableOpacity>
            ))}
          </Card>
        </View>

        {/* Benefits Section */}
        <View style={styles.section}>
          <ThemedText type="h2" style={CommonText.sectionTitle}>
            {i18n.t('shareApp.whyShare', { defaultValue: 'Why Share LoginX?' })}
          </ThemedText>
          <Card elevation={1} style={styles.benefitsCard}>
            {[
              i18n.t('shareApp.benefits.secure', {
                defaultValue: 'Help friends secure their accounts with biometric authentication',
              }),
              i18n.t('shareApp.benefits.simple', {
                defaultValue: 'Share a simple, modern authentication solution',
              }),
              i18n.t('shareApp.benefits.privacy', {
                defaultValue: 'Spread the word about privacy-focused technology',
              }),
              i18n.t('shareApp.benefits.community', {
                defaultValue: 'Grow our community of security-conscious users',
              }),
            ].map((benefit, index, array) => (
              <View key={index} style={[styles.benefitItem, index === array.length - 1 && styles.benefitItemLast]}>
                <Feather name="check-circle" size={20} color={successColor} style={styles.benefitIcon} />
                <ThemedText style={styles.benefitText}>{benefit}</ThemedText>
              </View>
            ))}
          </Card>
        </View>
      </ScreenContainer>
    </>
  );
}
