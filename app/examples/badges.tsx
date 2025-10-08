/**
 * Badge Components Examples
 * Demonstrates all badge variations and use cases
 */

import { TabHeader } from '@/components/navigation/TabHeader';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Badge } from '@/components/ui/data-display/badge';
import { BorderRadius, Spacing } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Feather, Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function BadgeExamplesScreen() {
  const surfaceColor = useThemeColor({}, 'surface');
  const borderColor = useThemeColor({}, 'border');
  const iconColor = useThemeColor({}, 'text');

  const styles = StyleSheet.create({
    section: {
      marginBottom: Spacing.xl,
    },
    sectionTitle: {
      marginBottom: Spacing.md,
    },
    sectionDescription: {
      marginBottom: Spacing.md,
      opacity: 0.7,
    },
    examplesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.lg,
    },
    exampleItem: {
      alignItems: 'center',
      minWidth: 80,
    },
    exampleLabel: {
      marginTop: Spacing.sm,
      fontSize: 12,
      opacity: 0.7,
      textAlign: 'center',
    },
    card: {
      backgroundColor: surfaceColor,
      borderRadius: BorderRadius.md,
      padding: Spacing.lg,
      borderWidth: 1,
      borderColor: borderColor,
      marginBottom: Spacing.md,
    },
    codeBlock: {
      backgroundColor: 'rgba(0,0,0,0.05)',
      borderRadius: BorderRadius.sm,
      padding: Spacing.sm,
      marginTop: Spacing.sm,
      fontFamily: 'monospace',
      fontSize: 12,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
      marginBottom: Spacing.md,
    },
  });

  return (
    <>
      <TabHeader title="Badge Examples" showBackButton={true} />
      <ScreenContainer useSafeArea={false}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Notification Badges */}
          <View style={styles.section}>
            <ThemedText type="h2" style={styles.sectionTitle}>
              Notification Badges
            </ThemedText>
            <ThemedText style={styles.sectionDescription}>Show unread counts with maximum value caps</ThemedText>

            <View style={styles.card}>
              <View style={styles.examplesGrid}>
                <View style={styles.exampleItem}>
                  <Badge content={5}>
                    <Feather name="bell" size={24} color={iconColor} />
                  </Badge>
                  <ThemedText style={styles.exampleLabel}>5 unread</ThemedText>
                </View>

                <View style={styles.exampleItem}>
                  <Badge content={25}>
                    <Ionicons name="mail-outline" size={24} color={iconColor} />
                  </Badge>
                  <ThemedText style={styles.exampleLabel}>25 messages</ThemedText>
                </View>

                <View style={styles.exampleItem}>
                  <Badge content={100} max={99}>
                    <Feather name="message-circle" size={24} color={iconColor} />
                  </Badge>
                  <ThemedText style={styles.exampleLabel}>99+ chats</ThemedText>
                </View>

                <View style={styles.exampleItem}>
                  <Badge content={0} invisible={true}>
                    <Feather name="bell" size={24} color={iconColor} />
                  </Badge>
                  <ThemedText style={styles.exampleLabel}>No unread</ThemedText>
                </View>
              </View>
            </View>
          </View>

          {/* Variant Colors */}
          <View style={styles.section}>
            <ThemedText type="h2" style={styles.sectionTitle}>
              Color Variants
            </ThemedText>
            <ThemedText style={styles.sectionDescription}>Different badge colors for various contexts</ThemedText>

            <View style={styles.card}>
              <View style={styles.examplesGrid}>
                <View style={styles.exampleItem}>
                  <Badge content={3} variant="default">
                    <Feather name="bell" size={24} color={iconColor} />
                  </Badge>
                  <ThemedText style={styles.exampleLabel}>Default</ThemedText>
                </View>

                <View style={styles.exampleItem}>
                  <Badge content={5} variant="primary">
                    <Feather name="star" size={24} color={iconColor} />
                  </Badge>
                  <ThemedText style={styles.exampleLabel}>Primary</ThemedText>
                </View>

                <View style={styles.exampleItem}>
                  <Badge content={8} variant="success">
                    <Feather name="check-circle" size={24} color={iconColor} />
                  </Badge>
                  <ThemedText style={styles.exampleLabel}>Success</ThemedText>
                </View>

                <View style={styles.exampleItem}>
                  <Badge content={2} variant="error">
                    <Feather name="alert-circle" size={24} color={iconColor} />
                  </Badge>
                  <ThemedText style={styles.exampleLabel}>Error</ThemedText>
                </View>

                <View style={styles.exampleItem}>
                  <Badge content={7} variant="warning">
                    <Feather name="alert-triangle" size={24} color={iconColor} />
                  </Badge>
                  <ThemedText style={styles.exampleLabel}>Warning</ThemedText>
                </View>
              </View>
            </View>
          </View>

          {/* Size Variants */}
          <View style={styles.section}>
            <ThemedText type="h2" style={styles.sectionTitle}>
              Size Variants
            </ThemedText>
            <ThemedText style={styles.sectionDescription}>Small, medium, and large badge sizes</ThemedText>

            <View style={styles.card}>
              <View style={styles.examplesGrid}>
                <View style={styles.exampleItem}>
                  <Badge content={9} size="small">
                    <Feather name="bell" size={20} color={iconColor} />
                  </Badge>
                  <ThemedText style={styles.exampleLabel}>Small</ThemedText>
                </View>

                <View style={styles.exampleItem}>
                  <Badge content={9} size="medium">
                    <Feather name="bell" size={24} color={iconColor} />
                  </Badge>
                  <ThemedText style={styles.exampleLabel}>Medium</ThemedText>
                </View>

                <View style={styles.exampleItem}>
                  <Badge content={9} size="large">
                    <Feather name="bell" size={28} color={iconColor} />
                  </Badge>
                  <ThemedText style={styles.exampleLabel}>Large</ThemedText>
                </View>
              </View>
            </View>
          </View>

          {/* Dot Badges */}
          <View style={styles.section}>
            <ThemedText type="h2" style={styles.sectionTitle}>
              Dot Badges (Status Indicators)
            </ThemedText>
            <ThemedText style={styles.sectionDescription}>Simple dot indicators without numbers</ThemedText>

            <View style={styles.card}>
              <View style={styles.examplesGrid}>
                <View style={styles.exampleItem}>
                  <Badge dot variant="success">
                    <Ionicons name="person-circle-outline" size={32} color={iconColor} />
                  </Badge>
                  <ThemedText style={styles.exampleLabel}>Online</ThemedText>
                </View>

                <View style={styles.exampleItem}>
                  <Badge dot variant="error">
                    <Ionicons name="person-circle-outline" size={32} color={iconColor} />
                  </Badge>
                  <ThemedText style={styles.exampleLabel}>Busy</ThemedText>
                </View>

                <View style={styles.exampleItem}>
                  <Badge dot variant="warning">
                    <Ionicons name="person-circle-outline" size={32} color={iconColor} />
                  </Badge>
                  <ThemedText style={styles.exampleLabel}>Away</ThemedText>
                </View>

                <View style={styles.exampleItem}>
                  <Badge dot variant="default">
                    <Ionicons name="person-circle-outline" size={32} color={iconColor} />
                  </Badge>
                  <ThemedText style={styles.exampleLabel}>Offline</ThemedText>
                </View>
              </View>
            </View>
          </View>

          {/* Anchor Positions */}
          <View style={styles.section}>
            <ThemedText type="h2" style={styles.sectionTitle}>
              Anchor Positions
            </ThemedText>
            <ThemedText style={styles.sectionDescription}>Badge placement around the target element</ThemedText>

            <View style={styles.card}>
              <View style={styles.examplesGrid}>
                <View style={styles.exampleItem}>
                  <Badge content={1} anchorPosition="top-right">
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        backgroundColor: surfaceColor,
                        borderRadius: BorderRadius.sm,
                        borderWidth: 1,
                        borderColor: borderColor,
                      }}
                    />
                  </Badge>
                  <ThemedText style={styles.exampleLabel}>Top Right</ThemedText>
                </View>

                <View style={styles.exampleItem}>
                  <Badge content={2} anchorPosition="top-left">
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        backgroundColor: surfaceColor,
                        borderRadius: BorderRadius.sm,
                        borderWidth: 1,
                        borderColor: borderColor,
                      }}
                    />
                  </Badge>
                  <ThemedText style={styles.exampleLabel}>Top Left</ThemedText>
                </View>

                <View style={styles.exampleItem}>
                  <Badge content={3} anchorPosition="bottom-right">
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        backgroundColor: surfaceColor,
                        borderRadius: BorderRadius.sm,
                        borderWidth: 1,
                        borderColor: borderColor,
                      }}
                    />
                  </Badge>
                  <ThemedText style={styles.exampleLabel}>Bottom Right</ThemedText>
                </View>

                <View style={styles.exampleItem}>
                  <Badge content={4} anchorPosition="bottom-left">
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        backgroundColor: surfaceColor,
                        borderRadius: BorderRadius.sm,
                        borderWidth: 1,
                        borderColor: borderColor,
                      }}
                    />
                  </Badge>
                  <ThemedText style={styles.exampleLabel}>Bottom Left</ThemedText>
                </View>
              </View>
            </View>
          </View>

          {/* Standalone Badges */}
          <View style={styles.section}>
            <ThemedText type="h2" style={styles.sectionTitle}>
              Standalone Badges
            </ThemedText>
            <ThemedText style={styles.sectionDescription}>Badges without children, used as labels or tags</ThemedText>

            <View style={styles.card}>
              <View style={styles.row}>
                <Badge content="New" variant="primary" />
                <Badge content="Sale" variant="error" />
                <Badge content="Pro" variant="success" />
                <Badge content="Beta" variant="warning" />
              </View>

              <View style={styles.row}>
                <Badge content={42} variant="default" />
                <Badge content="99+" variant="primary" />
                <Badge content="Live" variant="error" dot={false} />
              </View>
            </View>
          </View>

          {/* Real-World Examples */}
          <View style={styles.section}>
            <ThemedText type="h2" style={styles.sectionTitle}>
              Real-World Use Cases
            </ThemedText>
            <ThemedText style={styles.sectionDescription}>Common badge implementations in apps</ThemedText>

            <View style={styles.card}>
              <ThemedText type="h3" style={{ marginBottom: Spacing.md }}>
                Navigation Icons
              </ThemedText>
              <View style={styles.examplesGrid}>
                <View style={styles.exampleItem}>
                  <Badge content={12} variant="error" size="small">
                    <Feather name="bell" size={24} color={iconColor} />
                  </Badge>
                  <ThemedText style={styles.exampleLabel}>Notifications</ThemedText>
                </View>

                <View style={styles.exampleItem}>
                  <Badge content={3} variant="primary" size="small">
                    <Feather name="message-square" size={24} color={iconColor} />
                  </Badge>
                  <ThemedText style={styles.exampleLabel}>Messages</ThemedText>
                </View>

                <View style={styles.exampleItem}>
                  <Badge content={7} variant="success" size="small">
                    <Feather name="shopping-cart" size={24} color={iconColor} />
                  </Badge>
                  <ThemedText style={styles.exampleLabel}>Cart</ThemedText>
                </View>
              </View>
            </View>

            <View style={styles.card}>
              <ThemedText type="h3" style={{ marginBottom: Spacing.md }}>
                User Status
              </ThemedText>
              <View style={styles.examplesGrid}>
                <View style={styles.exampleItem}>
                  <Badge dot variant="success" anchorPosition="bottom-right">
                    <Ionicons name="person-circle" size={48} color={iconColor} />
                  </Badge>
                  <ThemedText style={styles.exampleLabel}>Online</ThemedText>
                </View>

                <View style={styles.exampleItem}>
                  <Badge dot variant="warning" anchorPosition="bottom-right">
                    <Ionicons name="person-circle" size={48} color={iconColor} />
                  </Badge>
                  <ThemedText style={styles.exampleLabel}>Away</ThemedText>
                </View>

                <View style={styles.exampleItem}>
                  <Badge dot variant="error" anchorPosition="bottom-right">
                    <Ionicons name="person-circle" size={48} color={iconColor} />
                  </Badge>
                  <ThemedText style={styles.exampleLabel}>Do Not Disturb</ThemedText>
                </View>
              </View>
            </View>
          </View>

          {/* Code Examples */}
          <View style={styles.section}>
            <ThemedText type="h2" style={styles.sectionTitle}>
              Usage Examples
            </ThemedText>

            <ThemedView style={styles.card}>
              <ThemedText type="h3" style={{ marginBottom: Spacing.sm }}>
                Basic Notification Badge
              </ThemedText>
              <ThemedText style={styles.codeBlock}>
                {`<Badge content={5} variant="error">
  <Icon name="bell" />
</Badge>`}
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.card}>
              <ThemedText type="h3" style={{ marginBottom: Spacing.sm }}>
                Max Value Badge
              </ThemedText>
              <ThemedText style={styles.codeBlock}>
                {`<Badge content={150} max={99}>
  <Icon name="mail" />
</Badge>
// Displays "99+"`}
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.card}>
              <ThemedText type="h3" style={{ marginBottom: Spacing.sm }}>
                Status Dot
              </ThemedText>
              <ThemedText style={styles.codeBlock}>
                {`<Badge dot variant="success">
  <Avatar src={user.avatar} />
</Badge>`}
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.card}>
              <ThemedText type="h3" style={{ marginBottom: Spacing.sm }}>
                Standalone Label
              </ThemedText>
              <ThemedText style={styles.codeBlock}>{`<Badge content="New" variant="primary" />`}</ThemedText>
            </ThemedView>

            <ThemedView style={styles.card}>
              <ThemedText type="h3" style={{ marginBottom: Spacing.sm }}>
                Conditional Badge
              </ThemedText>
              <ThemedText style={styles.codeBlock}>
                {`<Badge 
  content={unreadCount} 
  invisible={unreadCount === 0}
>
  <Icon name="bell" />
</Badge>`}
              </ThemedText>
            </ThemedView>
          </View>
        </ScrollView>
      </ScreenContainer>
    </>
  );
}
