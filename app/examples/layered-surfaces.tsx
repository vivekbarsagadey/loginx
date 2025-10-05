/**
 * Example Screen - Demonstrates Layered Surface Design System
 *
 * This is a reference implementation showing various Card elevations,
 * surface variants, and nesting patterns. Use this as a guide for
 * implementing layered surfaces in your screens.
 */

import { ScreenContainer } from '@/components/screen-container';
import { ThemedButton } from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { Card, ElevatedCard, FilledCard, OutlinedCard } from '@/components/ui/card';
import { CommonText } from '@/constants/common-styles';
import { Spacing } from '@/constants/layout';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

/**
 * Example screen demonstrating the layered surface design system
 */
export default function LayeredSurfacesExampleScreen() {
  return (
    <ScreenContainer scrollable>
      <ThemedText type="h1" style={CommonText.title}>
        Layered Surfaces
      </ThemedText>
      <ThemedText type="body" style={CommonText.subtitle}>
        Examples of elevation and surface variants
      </ThemedText>

      {/* Elevation Examples */}
      <View style={styles.section}>
        <ThemedText type="h2" style={CommonText.sectionTitle}>
          Elevation Levels
        </ThemedText>

        <Card elevation={0} style={styles.card}>
          <ThemedText type="h3">Elevation 0 - Flush</ThemedText>
          <ThemedText type="caption">No shadow, flush with background</ThemedText>
        </Card>

        <Card elevation={1} style={styles.card}>
          <ThemedText type="h3">Elevation 1 - Standard</ThemedText>
          <ThemedText type="caption">Default for content cards</ThemedText>
        </Card>

        <Card elevation={2} style={styles.card}>
          <ThemedText type="h3">Elevation 2 - Medium</ThemedText>
          <ThemedText type="caption">Active or focused elements</ThemedText>
        </Card>

        <Card elevation={3} style={styles.card}>
          <ThemedText type="h3">Elevation 3 - High</ThemedText>
          <ThemedText type="caption">Modals and dialogs</ThemedText>
        </Card>
      </View>

      {/* Surface Variants */}
      <View style={styles.section}>
        <ThemedText type="h2" style={CommonText.sectionTitle}>
          Surface Variants
        </ThemedText>

        <Card elevation={1} variant="surface" style={styles.card}>
          <ThemedText type="h3">Surface (default)</ThemedText>
          <ThemedText type="caption">Standard card background</ThemedText>
        </Card>

        <Card elevation={1} variant="surface-variant" style={styles.card}>
          <ThemedText type="h3">Surface Variant</ThemedText>
          <ThemedText type="caption">Alternative surface for contrast</ThemedText>
        </Card>
      </View>

      {/* Specialized Variants */}
      <View style={styles.section}>
        <ThemedText type="h2" style={CommonText.sectionTitle}>
          Specialized Variants
        </ThemedText>

        <ElevatedCard style={styles.card}>
          <ThemedText type="h3">ElevatedCard</ThemedText>
          <ThemedText type="caption">Elevation 1 by default</ThemedText>
        </ElevatedCard>

        <OutlinedCard style={styles.card}>
          <ThemedText type="h3">OutlinedCard</ThemedText>
          <ThemedText type="caption">Border, no shadow</ThemedText>
        </OutlinedCard>

        <FilledCard style={styles.card}>
          <ThemedText type="h3">FilledCard</ThemedText>
          <ThemedText type="caption">Surface-variant background</ThemedText>
        </FilledCard>
      </View>

      {/* Nested Cards Example */}
      <View style={styles.section}>
        <ThemedText type="h2" style={CommonText.sectionTitle}>
          Nested Cards (Layering)
        </ThemedText>

        <Card elevation={1} style={styles.card}>
          <ThemedText type="h3" style={CommonText.sectionTitle}>
            Outer Card (surface)
          </ThemedText>
          <ThemedText type="body" style={CommonText.descriptionText}>
            This demonstrates the layering concept where nested content uses a different surface variant.
          </ThemedText>

          <Card elevation={0} variant="surface-variant" style={styles.nestedCard}>
            <ThemedText type="body">Nested Card (surface-variant)</ThemedText>
            <ThemedText type="caption">Creates visual hierarchy within the parent card</ThemedText>
          </Card>

          <Card elevation={0} variant="surface-variant" style={styles.nestedCard}>
            <ThemedText type="body">Another Nested Section</ThemedText>
            <ThemedText type="caption">Maintains consistent elevation level</ThemedText>
          </Card>
        </Card>
      </View>

      {/* Card with Header and Footer */}
      <View style={styles.section}>
        <ThemedText type="h2" style={CommonText.sectionTitle}>
          Card with Header & Footer
        </ThemedText>

        <Card
          elevation={1}
          header={
            <View style={styles.cardHeader}>
              <Feather name="info" size={24} />
              <ThemedText type="h3" style={styles.headerText}>
                Card Header
              </ThemedText>
            </View>
          }
          footer={
            <View style={styles.cardFooter}>
              <ThemedButton title="Cancel" variant="secondary" style={styles.footerButton} />
              <ThemedButton title="Confirm" variant="primary" style={styles.footerButton} />
            </View>
          }
        >
          <ThemedText type="body">Card content goes here. The header and footer are automatically separated with hairline dividers.</ThemedText>
        </Card>
      </View>

      {/* Dashboard Stats Example */}
      <View style={styles.section}>
        <ThemedText type="h2" style={CommonText.sectionTitle}>
          Dashboard Stats Example
        </ThemedText>

        <View style={styles.statsGrid}>
          <Card elevation={1} style={styles.statCard}>
            <ThemedText type="h1" style={styles.statNumber}>
              125
            </ThemedText>
            <ThemedText type="caption" style={styles.statLabel}>
              Total Users
            </ThemedText>
          </Card>

          <Card elevation={1} style={styles.statCard}>
            <ThemedText type="h1" style={styles.statNumber}>
              48
            </ThemedText>
            <ThemedText type="caption" style={styles.statLabel}>
              Active Now
            </ThemedText>
          </Card>
        </View>

        <View style={styles.statsGrid}>
          <Card elevation={1} style={styles.statCard}>
            <ThemedText type="h1" style={styles.statNumber}>
              92%
            </ThemedText>
            <ThemedText type="caption" style={styles.statLabel}>
              Success Rate
            </ThemedText>
          </Card>

          <Card elevation={1} style={styles.statCard}>
            <ThemedText type="h1" style={styles.statNumber}>
              3.2k
            </ThemedText>
            <ThemedText type="caption" style={styles.statLabel}>
              Total Events
            </ThemedText>
          </Card>
        </View>
      </View>

      {/* List Example */}
      <View style={styles.section}>
        <ThemedText type="h2" style={CommonText.sectionTitle}>
          List with Cards
        </ThemedText>

        <Card elevation={1} noPadding>
          {['Item 1', 'Item 2', 'Item 3', 'Item 4'].map((item, index, array) => (
            <View key={item} style={[styles.listItem, index === array.length - 1 && styles.listItemLast]}>
              <Feather name="check-circle" size={20} />
              <ThemedText style={styles.listItemText}>{item}</ThemedText>
              <Feather name="chevron-right" size={20} />
            </View>
          ))}
        </Card>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.xl,
  },
  card: {
    marginBottom: Spacing.md,
  },
  nestedCard: {
    marginTop: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerText: {
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
  },
  footerButton: {
    marginVertical: 0,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    marginBottom: Spacing.xs,
  },
  statLabel: {
    opacity: 0.7,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  listItemLast: {
    borderBottomWidth: 0,
  },
  listItemText: {
    flex: 1,
  },
});
