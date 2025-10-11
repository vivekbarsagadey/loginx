/**
 * Data Examples Screen
 * Demonstrates how to use data from the /data folder
 */

import { ScreenContainer } from '@/components/screen-container';
import { ThemedDot } from '@/components/themed-dot';
import { ThemedPressable } from '@/components/themed-pressable';
import { HStack } from '@/components/themed-stack';
import { ThemedSurface } from '@/components/themed-surface';
import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/layout';
import { appFeatures, faqData, getRandomTip, getSampleNotifications, settingsMenu } from '@/data';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function DataExamplesScreen() {
  const colors = useThemeColors();

  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const styles = StyleSheet.create({
    section: {
      marginBottom: Spacing.lg,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: colors.border,
      padding: Spacing.md,
      marginBottom: Spacing.sm,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: colors.border,
      padding: Spacing.md,
      marginBottom: Spacing.sm,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
      marginBottom: Spacing.xs,
    },
    badge: {
      backgroundColor: colors.primary + '20',
      paddingHorizontal: Spacing.sm,
      paddingVertical: 2,
      borderRadius: BorderRadius.sm,
    },
    badgeText: {
      color: colors.primary,
      fontSize: 12,
      fontWeight: '600',
    },
  });

  // Example 1: Using sample notifications
  const notifications = getSampleNotifications();

  // Example 2: Using app features
  const securityFeatures = appFeatures.filter((f) => f.category === 'security');

  // Example 3: Using FAQ data
  const securityFAQs = faqData.filter((f) => f.category === 'security').slice(0, 3);

  // Example 4: Using random tip
  const randomTip = getRandomTip();

  // Example 5: Using menu structure
  const firstMenuSection = settingsMenu[0];

  return (
    <ScreenContainer scrollable useSafeArea={false}>
      <ThemedText type="h2" style={{ marginBottom: Spacing.md }}>
        Data Examples
      </ThemedText>
      <ThemedText type="body" style={{ color: colors['text-muted'], marginBottom: Spacing.lg }}>
        Demonstrating how to use data from the /data folder
      </ThemedText>

      {/* Section 1: Notifications */}
      <View style={styles.section}>
        <ThemedPressable style={styles.sectionHeader} onPress={() => toggleSection('notifications')}>
          <ThemedText type="h3">📬 Sample Notifications ({notifications.length})</ThemedText>
          <Ionicons name={expandedSection === 'notifications' ? 'chevron-up' : 'chevron-down'} size={20} color={colors.text} />
        </ThemedPressable>
        {expandedSection === 'notifications' && (
          <View>
            {notifications.slice(0, 3).map((notif) => (
              <ThemedSurface key={notif.id} elevation={1} style={styles.card}>
                <HStack spacing="sm" align="center">
                  <View style={styles.badge}>
                    <ThemedText style={styles.badgeText}>{notif.type}</ThemedText>
                  </View>
                  {!notif.read && <ThemedDot size="sm" variant="primary" accessibilityLabel="Unread notification" />}
                </HStack>
                <ThemedText type="subtitle1" style={{ marginBottom: Spacing.xs }}>
                  {notif.title}
                </ThemedText>
                <ThemedText type="caption" style={{ color: colors['text-muted'] }}>
                  {notif.message}
                </ThemedText>
              </ThemedSurface>
            ))}
            <ThemedText type="caption" style={{ color: colors['text-muted'], textAlign: 'center' }}>
              + {notifications.length - 3} more notifications
            </ThemedText>
          </View>
        )}
      </View>

      {/* Section 2: Features */}
      <View style={styles.section}>
        <ThemedPressable style={styles.sectionHeader} onPress={() => toggleSection('features')}>
          <ThemedText type="h3">⭐ Security Features ({securityFeatures.length})</ThemedText>
          <Ionicons name={expandedSection === 'features' ? 'chevron-up' : 'chevron-down'} size={20} color={colors.text} />
        </ThemedPressable>
        {expandedSection === 'features' && (
          <View>
            {securityFeatures.map((feature) => (
              <ThemedSurface key={feature.id} elevation={1} style={styles.card}>
                <HStack spacing="md" align="center">
                  <ThemedText type="h3">{feature.icon}</ThemedText>
                  <ThemedText type="subtitle1">{feature.title}</ThemedText>
                </HStack>
                <ThemedText type="body" style={{ color: colors['text-muted'], marginTop: Spacing.xs }}>
                  {feature.description}
                </ThemedText>
              </ThemedSurface>
            ))}
          </View>
        )}
      </View>

      {/* Section 3: FAQs */}
      <View style={styles.section}>
        <ThemedPressable style={styles.sectionHeader} onPress={() => toggleSection('faqs')}>
          <ThemedText type="h3">❓ Security FAQs ({securityFAQs.length})</ThemedText>
          <Ionicons name={expandedSection === 'faqs' ? 'chevron-up' : 'chevron-down'} size={20} color={colors.text} />
        </ThemedPressable>
        {expandedSection === 'faqs' && (
          <View>
            {securityFAQs.map((faq) => (
              <View key={faq.id} style={styles.card}>
                <ThemedText type="subtitle1" style={{ marginBottom: Spacing.sm }}>
                  Q: {faq.question}
                </ThemedText>
                <ThemedText type="body" style={{ color: colors['text-muted'] }}>
                  A: {faq.answer}
                </ThemedText>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Section 4: Random Tip */}
      <View style={styles.section}>
        <ThemedPressable style={styles.sectionHeader} onPress={() => toggleSection('tip')}>
          <ThemedText type="h3">💡 Random Tip</ThemedText>
          <Ionicons name={expandedSection === 'tip' ? 'chevron-up' : 'chevron-down'} size={20} color={colors.text} />
        </ThemedPressable>
        {expandedSection === 'tip' && (
          <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.badge}>
                <ThemedText style={styles.badgeText}>{randomTip.category}</ThemedText>
              </View>
              {randomTip.priority === 'high' && (
                <View style={[styles.badge, { backgroundColor: '#FF6B6B20' }]}>
                  <ThemedText style={[styles.badgeText, { color: '#FF6B6B' }]}>Priority</ThemedText>
                </View>
              )}
            </View>
            <ThemedText type="subtitle1" style={{ marginTop: Spacing.xs, marginBottom: Spacing.sm }}>
              {randomTip.title}
            </ThemedText>
            <ThemedText type="body" style={{ color: colors['text-muted'] }}>
              {randomTip.description}
            </ThemedText>
          </View>
        )}
      </View>

      {/* Section 5: Menu Items */}
      <View style={styles.section}>
        <ThemedPressable style={styles.sectionHeader} onPress={() => toggleSection('menu')}>
          <ThemedText type="h3">
            🗂️ Menu: {firstMenuSection.title} ({firstMenuSection.items.length})
          </ThemedText>
          <Ionicons name={expandedSection === 'menu' ? 'chevron-up' : 'chevron-down'} size={20} color={colors.text} />
        </ThemedPressable>
        {expandedSection === 'menu' && (
          <View>
            {firstMenuSection.items.map((item) => (
              <View key={item.id} style={styles.card}>
                <View style={styles.row}>
                  <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={20} color={colors.primary} />
                  <ThemedText type="subtitle1">{item.title}</ThemedText>
                </View>
                {item.subtitle && (
                  <ThemedText type="caption" style={{ color: colors['text-muted'], marginTop: Spacing.xs }}>
                    {item.subtitle}
                  </ThemedText>
                )}
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Usage Instructions */}
      <View style={[styles.card, { marginTop: Spacing.lg }]}>
        <ThemedText type="h3" style={{ marginBottom: Spacing.md }}>
          📚 How to Use
        </ThemedText>
        <ThemedText type="body" style={{ color: colors['text-muted'], marginBottom: Spacing.sm }}>
          Import data from the /data folder:
        </ThemedText>
        <View style={{ padding: Spacing.md, borderRadius: BorderRadius.sm, opacity: 0.95 }}>
          <ThemedText type="caption" style={{ fontFamily: 'monospace', opacity: 0.8 }}>
            {`import { getSampleNotifications, appFeatures } from '@/data';`}
          </ThemedText>
        </View>
      </View>
    </ScreenContainer>
  );
}
