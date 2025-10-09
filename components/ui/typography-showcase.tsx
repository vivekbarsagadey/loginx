/**
 * Typography Showcase Component
 * Displays all available typography styles for reference and testing
 *
 * Use this component in a settings screen or during development
 * to visualize the complete type system
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/layout';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

interface TypographyShowcaseProps {
  /**
   * Show technical details (font size, line height, etc.)
   */
  showDetails?: boolean;
}

export function TypographyShowcase({ showDetails = false }: TypographyShowcaseProps) {
  const types = [
    { type: 'display', label: 'Display', description: '40px - Hero text' },
    { type: 'title', label: 'Title (H1)', description: '32px - Page titles' },
    { type: 'heading', label: 'Heading (H2)', description: '28px - Section headers' },
    { type: 'subheading', label: 'Subheading (H3)', description: '24px - Subsection headers' },
    { type: 'subtitle1', label: 'Subtitle 1', description: '20px - Emphasized content' },
    { type: 'subtitle2', label: 'Subtitle 2', description: '18px - Secondary headers' },
    { type: 'body', label: 'Body', description: '16px - Main content' },
    { type: 'bodyBold', label: 'Body Bold', description: '16px - Emphasized body' },
    { type: 'bodySmall', label: 'Body Small', description: '14px - Dense content' },
    { type: 'button', label: 'Button', description: '14px - Button text' },
    { type: 'caption', label: 'Caption', description: '12px - Supporting text' },
    { type: 'label', label: 'Label', description: '10px - Form labels' },
    { type: 'overline', label: 'OVERLINE', description: '10px - All caps labels' },
    { type: 'small', label: 'Small', description: '12px - Small text' },
  ] as const;

  return (
    <ScrollView style={styles.container}>
      <ThemedView variant="surface" style={styles.card}>
        <ThemedText type="heading" style={styles.sectionTitle}>
          Typography System
        </ThemedText>
        <ThemedText type="body" style={styles.sectionDescription}>
          Complete type scale with platform-specific fonts
        </ThemedText>
      </ThemedView>

      {types.map(({ type, label, description }) => (
        <ThemedView key={type} variant="surface" style={styles.card}>
          <ThemedText type="caption" style={styles.typeLabel}>
            {label}
          </ThemedText>
          {showDetails && (
            <ThemedText type="small" style={styles.typeDescription}>
              {description}
            </ThemedText>
          )}
          <ThemedText
            type={type as 'display' | 'title' | 'heading' | 'subheading' | 'subtitle1' | 'subtitle2' | 'body' | 'bodyBold' | 'bodySmall' | 'button' | 'caption' | 'label' | 'overline' | 'small'}
            style={styles.sample}
          >
            {type === 'overline' ? 'The quick brown fox jumps over the lazy dog' : 'The Quick Brown Fox Jumps Over the Lazy Dog'}
          </ThemedText>
        </ThemedView>
      ))}

      <ThemedView variant="surface" style={styles.card}>
        <ThemedText type="heading" style={styles.sectionTitle}>
          Font Families
        </ThemedText>
        <ThemedText type="body" style={styles.platformInfo}>
          iOS: San Francisco (System)
        </ThemedText>
        <ThemedText type="body" style={styles.platformInfo}>
          Android: Roboto
        </ThemedText>
        <ThemedText type="caption" style={styles.note}>
          Font families automatically adapt to the platform for optimal readability
        </ThemedText>
      </ThemedView>

      <ThemedView variant="surface" style={styles.card}>
        <ThemedText type="heading" style={styles.sectionTitle}>
          Usage Examples
        </ThemedText>
        <ThemedView style={styles.exampleContainer}>
          <ThemedText type="caption" style={styles.exampleLabel}>
            Page Title
          </ThemedText>
          <ThemedText type="title" style={styles.exampleSample}>
            Welcome Back
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.exampleContainer}>
          <ThemedText type="caption" style={styles.exampleLabel}>
            Section Header
          </ThemedText>
          <ThemedText type="heading" style={styles.exampleSample}>
            Recent Activity
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.exampleContainer}>
          <ThemedText type="caption" style={styles.exampleLabel}>
            Body Paragraph
          </ThemedText>
          <ThemedText type="body" style={styles.exampleSample}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
            laboris.
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.exampleContainer}>
          <ThemedText type="caption" style={styles.exampleLabel}>
            Caption Text
          </ThemedText>
          <ThemedText type="caption" style={styles.exampleSample}>
            Last updated 2 hours ago
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView variant="surface" style={styles.card}>
        <ThemedText type="heading" style={styles.sectionTitle}>
          Accessibility
        </ThemedText>
        <ThemedText type="body" style={styles.accessibilityInfo}>
          • Minimum font size: 12px
        </ThemedText>
        <ThemedText type="body" style={styles.accessibilityInfo}>
          • Body text: 16px (optimal for mobile)
        </ThemedText>
        <ThemedText type="body" style={styles.accessibilityInfo}>
          • Line height: 1.4-1.6 ratio
        </ThemedText>
        <ThemedText type="body" style={styles.accessibilityInfo}>
          • Supports Dynamic Type (iOS)
        </ThemedText>
        <ThemedText type="body" style={styles.accessibilityInfo}>
          • Scales with system font size
        </ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    marginBottom: Spacing.sm,
  },
  sectionDescription: {
    marginBottom: Spacing.md,
    opacity: 0.7,
  },
  typeLabel: {
    marginBottom: Spacing.xs,
    opacity: 0.6,
    textTransform: 'uppercase',
  },
  typeDescription: {
    marginBottom: Spacing.xs,
    opacity: 0.5,
  },
  sample: {
    marginBottom: Spacing.sm,
  },
  platformInfo: {
    marginBottom: Spacing.xs,
  },
  note: {
    marginTop: Spacing.sm,
    opacity: 0.6,
    fontStyle: 'italic',
  },
  exampleContainer: {
    marginBottom: Spacing.md,
  },
  exampleLabel: {
    marginBottom: Spacing.xs,
    opacity: 0.6,
  },
  exampleSample: {
    // Styles applied by type
  },
  accessibilityInfo: {
    marginBottom: Spacing.xs,
  },
});
