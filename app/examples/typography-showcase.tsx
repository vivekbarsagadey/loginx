/**
 * Typography Showcase
 *
 * This file demonstrates all 13 typography levels available in LoginX.
 * Use this as a reference for choosing the right typography for your UI.
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CommonText } from '@/constants/common-styles';
import { Spacing } from '@/constants/layout';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

export default function TypographyShowcase() {
  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.section}>
        <ThemedText type="h2" style={CommonText.sectionTitle}>
          Typography System - 13 Levels
        </ThemedText>
        <ThemedText type="caption" style={CommonText.subtitle}>
          All available typography levels in LoginX
        </ThemedText>
      </ThemedView>

      {/* Display */}
      <ThemedView style={styles.item}>
        <ThemedText type="label" style={styles.label}>
          DISPLAY (32px, Bold)
        </ThemedText>
        <ThemedText type="display">Display Typography</ThemedText>
        <ThemedText type="caption" style={styles.usage}>
          Use for: Hero sections, landing pages, large titles
        </ThemedText>
      </ThemedView>

      {/* H1 */}
      <ThemedView style={styles.item}>
        <ThemedText type="label" style={styles.label}>
          H1 (28px, Bold)
        </ThemedText>
        <ThemedText type="h1">Page Title Typography</ThemedText>
        <ThemedText type="caption" style={styles.usage}>
          Use for: Main page titles, primary headings
        </ThemedText>
      </ThemedView>

      {/* H2 */}
      <ThemedView style={styles.item}>
        <ThemedText type="label" style={styles.label}>
          H2 (24px, SemiBold)
        </ThemedText>
        <ThemedText type="h2">Section Heading Typography</ThemedText>
        <ThemedText type="caption" style={styles.usage}>
          Use for: Section headers, secondary headings
        </ThemedText>
      </ThemedView>

      {/* H3 */}
      <ThemedView style={styles.item}>
        <ThemedText type="label" style={styles.label}>
          H3 (20px, SemiBold)
        </ThemedText>
        <ThemedText type="h3">Subsection Heading Typography</ThemedText>
        <ThemedText type="caption" style={styles.usage}>
          Use for: Subsection headers, card titles
        </ThemedText>
      </ThemedView>

      {/* Subtitle1 - NEW */}
      <ThemedView style={styles.item}>
        <ThemedText type="label" style={styles.label}>
          SUBTITLE1 (18px, Medium) ✨ NEW
        </ThemedText>
        <ThemedText type="subtitle1">Subtitle Typography Level 1</ThemedText>
        <ThemedText type="caption" style={styles.usage}>
          Use for: Section subtitles, prominent secondary text
        </ThemedText>
      </ThemedView>

      {/* Subtitle2 - NEW */}
      <ThemedView style={styles.item}>
        <ThemedText type="label" style={styles.label}>
          SUBTITLE2 (16px, Medium) ✨ NEW
        </ThemedText>
        <ThemedText type="subtitle2">Subtitle Typography Level 2</ThemedText>
        <ThemedText type="caption" style={styles.usage}>
          Use for: Smaller subtitles, list headers, emphasized text
        </ThemedText>
      </ThemedView>

      {/* Body */}
      <ThemedView style={styles.item}>
        <ThemedText type="label" style={styles.label}>
          BODY (16px, Regular)
        </ThemedText>
        <ThemedText type="body">Body typography for main content. This is the default text style used throughout the application for readable, comfortable content.</ThemedText>
        <ThemedText type="caption" style={styles.usage}>
          Use for: Main content, paragraphs, descriptions
        </ThemedText>
      </ThemedView>

      {/* Body Bold */}
      <ThemedView style={styles.item}>
        <ThemedText type="label" style={styles.label}>
          BODY BOLD (16px, SemiBold)
        </ThemedText>
        <ThemedText type="bodyBold">Body typography with bold weight for emphasis and important information.</ThemedText>
        <ThemedText type="caption" style={styles.usage}>
          Use for: Emphasized body text, important information
        </ThemedText>
      </ThemedView>

      {/* Button - NEW */}
      <ThemedView style={styles.item}>
        <ThemedText type="label" style={styles.label}>
          BUTTON (14px, Medium, Letter Spacing) ✨ NEW
        </ThemedText>
        <ThemedText type="button">BUTTON TEXT TYPOGRAPHY</ThemedText>
        <ThemedText type="caption" style={styles.usage}>
          Use for: Button labels, action text, CTAs
        </ThemedText>
      </ThemedView>

      {/* Caption */}
      <ThemedView style={styles.item}>
        <ThemedText type="label" style={styles.label}>
          CAPTION (14px, Regular)
        </ThemedText>
        <ThemedText type="caption">Caption typography for supporting text and secondary information.</ThemedText>
        <ThemedText type="caption" style={styles.usage}>
          Use for: Image captions, hints, helper text
        </ThemedText>
      </ThemedView>

      {/* Label - NEW */}
      <ThemedView style={styles.item}>
        <ThemedText type="label" style={styles.label}>
          LABEL (12px, Medium) ✨ NEW
        </ThemedText>
        <ThemedText type="label">Label Typography Text</ThemedText>
        <ThemedText type="caption" style={styles.usage}>
          Use for: Form labels, metadata, tags
        </ThemedText>
      </ThemedView>

      {/* Overline - NEW */}
      <ThemedView style={styles.item}>
        <ThemedText type="label" style={styles.label}>
          OVERLINE (10px, Medium, Uppercase, Letter Spacing) ✨ NEW
        </ThemedText>
        <ThemedText type="overline">Overline Typography</ThemedText>
        <ThemedText type="caption" style={styles.usage}>
          Use for: Category labels, eyebrows, section identifiers
        </ThemedText>
      </ThemedView>

      {/* Small */}
      <ThemedView style={styles.item}>
        <ThemedText type="label" style={styles.label}>
          SMALL (12px, Regular)
        </ThemedText>
        <ThemedText type="small">Small typography for fine print and legal text.</ThemedText>
        <ThemedText type="caption" style={styles.usage}>
          Use for: Fine print, legal text, footnotes
        </ThemedText>
      </ThemedView>

      {/* Special Types */}
      <ThemedView style={styles.section}>
        <ThemedText type="h3" style={CommonText.sectionTitle}>
          Special Typography Types
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.item}>
        <ThemedText type="label" style={styles.label}>
          MUTED (Same as body with muted color)
        </ThemedText>
        <ThemedText type="muted">Muted typography for de-emphasized content.</ThemedText>
        <ThemedText type="caption" style={styles.usage}>
          Use for: De-emphasized text, disabled states
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.item}>
        <ThemedText type="label" style={styles.label}>
          INVERSE (Same as body with inverse color)
        </ThemedText>
        <ThemedText type="inverse">Inverse typography for contrast.</ThemedText>
        <ThemedText type="caption" style={styles.usage}>
          Use for: Text on colored backgrounds, dark buttons
        </ThemedText>
      </ThemedView>

      {/* Usage Examples */}
      <ThemedView style={styles.section}>
        <ThemedText type="h3" style={CommonText.sectionTitle}>
          Common Usage Patterns
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.example}>
        <ThemedText type="overline">NEW FEATURE</ThemedText>
        <ThemedText type="h2">Typography Enhancement</ThemedText>
        <ThemedText type="subtitle1">13 Levels of Typography</ThemedText>
        <ThemedText type="body" style={styles.exampleBody}>
          We&apos;ve added 5 new typography levels (subtitle1, subtitle2, overline, button, label) to provide more flexibility and match industry standards like Material Design.
        </ThemedText>
        <ThemedText type="caption">Last updated: October 5, 2025</ThemedText>
      </ThemedView>

      <ThemedView style={styles.footer}>
        <ThemedText type="small" style={styles.footerText}>
          Total Typography Levels: 13 (8 original + 5 new)
        </ThemedText>
        <ThemedText type="small" style={styles.footerText}>
          Now matches Material Design&apos;s 13 typography levels ✅
        </ThemedText>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    padding: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  item: {
    padding: Spacing.md,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    // borderBottomColor: Use borderColor inline
  },
  label: {
    marginBottom: Spacing.xs,
    opacity: 0.6,
  },
  usage: {
    marginTop: Spacing.sm,
    opacity: 0.7,
    fontStyle: 'italic',
  },
  example: {
    padding: Spacing.lg,
    margin: Spacing.md,
    borderRadius: 12,
    // backgroundColor: Use surface color inline
    opacity: 0.95,
  },
  exampleBody: {
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  footer: {
    padding: Spacing.lg,
    alignItems: 'center',
  },
  footerText: {
    marginVertical: Spacing.xs,
    opacity: 0.6,
  },
});
