/**
 * Data Examples Screen
 * Demonstrates how to use data from the /data folder
 */

import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/layout';
import { appFeatures, faqData, getRandomTip, getSampleNotifications, settingsMenu } from '@/data';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

export default function DataExamplesScreen() {
  const surfaceColor = useThemeColor({}, 'surface');
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const textMutedColor = useThemeColor({}, 'text-muted');
  const primaryColor = useThemeColor({}, 'primary');

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
      backgroundColor: surfaceColor,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: borderColor,
      padding: Spacing.md,
      marginBottom: Spacing.sm,
    },
    card: {
      backgroundColor: surfaceColor,
      borderRadius: BorderRadius.md,
      borderWidth: 1,
      borderColor: borderColor,
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
      backgroundColor: primaryColor + '20',
      paddingHorizontal: Spacing.sm,
      paddingVertical: 2,
      borderRadius: BorderRadius.sm,
    },
    badgeText: {
      color: primaryColor,
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
    <ScreenContainer useSafeArea={false}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ThemedText type="h2" style={{ marginBottom: Spacing.md }}>
          Data Examples
        </ThemedText>
        <ThemedText type="body" style={{ color: textMutedColor, marginBottom: Spacing.lg }}>
          Demonstrating how to use data from the /data folder
        </ThemedText>

        {/* Section 1: Notifications */}
        <View style={styles.section}>
          <Pressable style={styles.sectionHeader} onPress={() => toggleSection('notifications')}>
            <ThemedText type="h3">📬 Sample Notifications ({notifications.length})</ThemedText>
            <Ionicons name={expandedSection === 'notifications' ? 'chevron-up' : 'chevron-down'} size={20} color={textColor} />
          </Pressable>
          {expandedSection === 'notifications' && (
            <View>
              {notifications.slice(0, 3).map((notif) => (
                <View key={notif.id} style={styles.card}>
                  <View style={styles.row}>
                    <View style={styles.badge}>
                      <ThemedText style={styles.badgeText}>{notif.type}</ThemedText>
                    </View>
                    {!notif.read && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: primaryColor }} />}
                  </View>
                  <ThemedText type="subtitle1" style={{ marginBottom: Spacing.xs }}>
                    {notif.title}
                  </ThemedText>
                  <ThemedText type="caption" style={{ color: textMutedColor }}>
                    {notif.message}
                  </ThemedText>
                </View>
              ))}
              <ThemedText type="caption" style={{ color: textMutedColor, textAlign: 'center' }}>
                + {notifications.length - 3} more notifications
              </ThemedText>
            </View>
          )}
        </View>

        {/* Section 2: Features */}
        <View style={styles.section}>
          <Pressable style={styles.sectionHeader} onPress={() => toggleSection('features')}>
            <ThemedText type="h3">⭐ Security Features ({securityFeatures.length})</ThemedText>
            <Ionicons name={expandedSection === 'features' ? 'chevron-up' : 'chevron-down'} size={20} color={textColor} />
          </Pressable>
          {expandedSection === 'features' && (
            <View>
              {securityFeatures.map((feature) => (
                <View key={feature.id} style={styles.card}>
                  <View style={styles.row}>
                    <ThemedText type="h3">{feature.icon}</ThemedText>
                    <ThemedText type="subtitle1">{feature.title}</ThemedText>
                  </View>
                  <ThemedText type="body" style={{ color: textMutedColor, marginTop: Spacing.xs }}>
                    {feature.description}
                  </ThemedText>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Section 3: FAQs */}
        <View style={styles.section}>
          <Pressable style={styles.sectionHeader} onPress={() => toggleSection('faqs')}>
            <ThemedText type="h3">❓ Security FAQs ({securityFAQs.length})</ThemedText>
            <Ionicons name={expandedSection === 'faqs' ? 'chevron-up' : 'chevron-down'} size={20} color={textColor} />
          </Pressable>
          {expandedSection === 'faqs' && (
            <View>
              {securityFAQs.map((faq) => (
                <View key={faq.id} style={styles.card}>
                  <ThemedText type="subtitle1" style={{ marginBottom: Spacing.sm }}>
                    Q: {faq.question}
                  </ThemedText>
                  <ThemedText type="body" style={{ color: textMutedColor }}>
                    A: {faq.answer}
                  </ThemedText>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Section 4: Random Tip */}
        <View style={styles.section}>
          <Pressable style={styles.sectionHeader} onPress={() => toggleSection('tip')}>
            <ThemedText type="h3">💡 Random Tip</ThemedText>
            <Ionicons name={expandedSection === 'tip' ? 'chevron-up' : 'chevron-down'} size={20} color={textColor} />
          </Pressable>
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
              <ThemedText type="body" style={{ color: textMutedColor }}>
                {randomTip.description}
              </ThemedText>
            </View>
          )}
        </View>

        {/* Section 5: Menu Items */}
        <View style={styles.section}>
          <Pressable style={styles.sectionHeader} onPress={() => toggleSection('menu')}>
            <ThemedText type="h3">
              🗂️ Menu: {firstMenuSection.title} ({firstMenuSection.items.length})
            </ThemedText>
            <Ionicons name={expandedSection === 'menu' ? 'chevron-up' : 'chevron-down'} size={20} color={textColor} />
          </Pressable>
          {expandedSection === 'menu' && (
            <View>
              {firstMenuSection.items.map((item) => (
                <View key={item.id} style={styles.card}>
                  <View style={styles.row}>
                    <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={20} color={primaryColor} />
                    <ThemedText type="subtitle1">{item.title}</ThemedText>
                  </View>
                  {item.subtitle && (
                    <ThemedText type="caption" style={{ color: textMutedColor, marginTop: Spacing.xs }}>
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
          <ThemedText type="body" style={{ color: textMutedColor, marginBottom: Spacing.sm }}>
            Import data from the /data folder:
          </ThemedText>
          <View style={{ backgroundColor: '#1E1E1E', padding: Spacing.md, borderRadius: BorderRadius.sm }}>
            <ThemedText type="caption" style={{ color: '#D4D4D4', fontFamily: 'monospace' }}>
              {`import { getSampleNotifications, appFeatures } from '@/data';`}
            </ThemedText>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
