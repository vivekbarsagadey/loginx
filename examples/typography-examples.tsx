/**
 * Typography Usage Examples
 * Demonstrates best practices for using the typography system
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FontFamily, FontWeight, Spacing } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import { createScaledTextStyle, getResponsiveFontSize, typography, TypographyPresets } from '@/utils/typography';
import React from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';

/**
 * Example 1: Basic Typography Usage
 * Using ThemedText component with type variants
 */
export function BasicTypographyExample() {
  return (
    <ThemedView>
      {/* Hero text - 40px */}
      <ThemedText type="display">Welcome to LoginX</ThemedText>

      {/* Page title - 32px */}
      <ThemedText type="title">Getting Started</ThemedText>

      {/* Section header - 28px */}
      <ThemedText type="heading">Account Setup</ThemedText>

      {/* Subsection - 24px */}
      <ThemedText type="subheading">Personal Information</ThemedText>

      {/* Body text - 16px (default) */}
      <ThemedText type="body">
        This is the main body text. It&apos;s set at 16px which is optimal for mobile readability. The line height is 1.5 times the font size for comfortable reading.
      </ThemedText>

      {/* Emphasized body - 16px bold */}
      <ThemedText type="bodyBold">Important information stands out with bold weight.</ThemedText>

      {/* Supporting text - 12px */}
      <ThemedText type="caption">Last updated 2 hours ago</ThemedText>
    </ThemedView>
  );
}

/**
 * Example 2: Platform-Specific Fonts
 * Demonstrating how fonts automatically adapt to platform
 */
export function PlatformFontsExample() {
  const textColor = useThemeColor({}, 'text');

  return (
    <ThemedView>
      <ThemedText type="heading">Platform-Specific Typography</ThemedText>

      <ThemedText type="body" style={styles.infoText}>
        On iOS, you&apos;re seeing San Francisco font.
        {'\n'}
        On Android, you&apos;re seeing Roboto font.
        {'\n'}
        Both are optimized for their respective platforms.
      </ThemedText>

      {/* Manual font family usage */}
      <ThemedText
        type="body"
        style={{
          fontFamily: FontFamily.regular,
          color: textColor,
        }}
      >
        This text uses the platform-appropriate regular weight font.
      </ThemedText>

      <ThemedText
        type="body"
        style={{
          fontFamily: FontFamily.medium,
          color: textColor,
        }}
      >
        This text uses the platform-appropriate medium weight font.
      </ThemedText>

      <ThemedText
        type="body"
        style={{
          fontFamily: FontFamily.bold,
          color: textColor,
        }}
      >
        This text uses the platform-appropriate bold weight font.
      </ThemedText>
    </ThemedView>
  );
}

/**
 * Example 3: Dynamic Type Support (Accessibility)
 * Text that scales with user's system font size preference
 */
export function DynamicTypeExample() {
  const { fontScale } = useWindowDimensions();

  // Create scaled text style
  const scaledBodyStyle = createScaledTextStyle(16, fontScale, {
    weight: 'regular',
    maxScale: 1.3, // Limit to 130% of original size
  });

  const scaledTitleStyle = createScaledTextStyle(32, fontScale, {
    weight: 'bold',
    maxScale: 1.5,
  });

  return (
    <ThemedView>
      <ThemedText type="caption" style={styles.helperText}>
        Current font scale: {fontScale.toFixed(2)}x
      </ThemedText>

      <ThemedText type="body" style={scaledTitleStyle}>
        This title scales with accessibility settings
      </ThemedText>

      <ThemedText type="body" style={scaledBodyStyle}>
        This text respects your system font size preference. If you&apos;ve increased text size in your device settings, this text will scale accordingly (up to 130% to maintain layout integrity).
      </ThemedText>
    </ThemedView>
  );
}

/**
 * Example 4: Responsive Typography
 * Text that adapts to different screen sizes
 */
export function ResponsiveTypographyExample() {
  const { width } = useWindowDimensions();

  const titleSize = getResponsiveFontSize(32, width);
  const bodySize = getResponsiveFontSize(16, width);

  return (
    <ThemedView>
      <ThemedText type="caption" style={styles.helperText}>
        Screen width: {Math.round(width)}px
      </ThemedText>

      <ThemedText type="title" style={[styles.responsiveTitle, { fontSize: titleSize }]}>
        Responsive Title
      </ThemedText>

      <ThemedText type="body" style={{ fontSize: bodySize }}>
        This text automatically adjusts its size based on your device width. Small devices get slightly smaller text, large devices get slightly larger text.
      </ThemedText>
    </ThemedView>
  );
}

/**
 * Example 5: Typography Presets
 * Using pre-configured typography patterns
 */
export function TypographyPresetsExample() {
  return (
    <ThemedView>
      {/* Hero section */}
      <ThemedText type="display" style={TypographyPresets.hero}>
        Hero Section
      </ThemedText>

      {/* Page title with standard spacing */}
      <ThemedText type="title" style={TypographyPresets.pageTitle}>
        Page Title
      </ThemedText>

      {/* Section header with spacing */}
      <ThemedText type="heading" style={TypographyPresets.sectionHeader}>
        Section Header
      </ThemedText>

      {/* Card title */}
      <ThemedView variant="surface" style={styles.card}>
        <ThemedText type="subtitle1" style={TypographyPresets.cardTitle}>
          Card Title
        </ThemedText>
        <ThemedText type="body" style={TypographyPresets.cardDescription}>
          Card description text goes here with proper spacing.
        </ThemedText>
      </ThemedView>

      {/* Form label */}
      <ThemedText type="label" style={TypographyPresets.formLabel}>
        Email Address
      </ThemedText>

      {/* Helper text */}
      <ThemedText type="caption" style={TypographyPresets.helperText}>
        We&apos;ll send you a verification code
      </ThemedText>

      {/* Error message */}
      <ThemedText type="caption" style={[TypographyPresets.errorMessage, styles.errorText]}>
        Please enter a valid email address
      </ThemedText>

      {/* Link text */}
      <ThemedText type="body" style={[TypographyPresets.link, styles.linkText]}>
        Forgot your password?
      </ThemedText>
    </ThemedView>
  );
}

/**
 * Example 6: Text Utilities
 * Using typography utility functions
 */
export function TextUtilitiesExample() {
  const primaryColor = useThemeColor({}, 'primary');

  return (
    <ThemedView>
      {/* Text alignment */}
      <ThemedText type="body" style={typography.align.left}>
        Left aligned text
      </ThemedText>
      <ThemedText type="body" style={typography.align.center}>
        Center aligned text
      </ThemedText>
      <ThemedText type="body" style={typography.align.right}>
        Right aligned text
      </ThemedText>

      {/* Text decoration */}
      <ThemedText type="body" style={[typography.decoration.underline, { color: primaryColor }]}>
        Underlined link text
      </ThemedText>
      <ThemedText type="body" style={typography.decoration.lineThrough}>
        Strikethrough text
      </ThemedText>

      {/* Text transform */}
      <ThemedText type="body" style={typography.transform.uppercase}>
        Uppercase Text
      </ThemedText>
      <ThemedText type="body" style={typography.transform.lowercase}>
        LOWERCASE TEXT
      </ThemedText>
      <ThemedText type="body" style={typography.transform.capitalize}>
        capitalize each word
      </ThemedText>

      {/* Text truncation */}
      <ThemedText type="body" style={typography.truncate(2)}>
        This is a very long text that will be truncated after two lines. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      </ThemedText>

      {/* Code/Monospace text */}
      <ThemedText type="body" style={typography.code(14)}>
        const code = &apos;monospace font&apos;;
      </ThemedText>

      {/* Numbers in monospace */}
      <ThemedText type="body" style={typography.code(16)}>
        1234567890
      </ThemedText>
    </ThemedView>
  );
}

/**
 * Example 7: Custom Typography Combinations
 * Creating custom text styles by combining presets
 */
export function CustomTypographyExample() {
  const primaryColor = useThemeColor({}, 'primary');
  const errorColor = useThemeColor({}, 'error');

  return (
    <ThemedView>
      {/* Custom title with color and alignment */}
      <ThemedText type="title" style={[styles.customTitle, typography.align.center, { color: primaryColor }]}>
        Custom Styled Title
      </ThemedText>

      {/* Body text with custom spacing */}
      <ThemedText
        type="body"
        style={[
          styles.customBody,
          {
            marginBottom: Spacing.lg,
            lineHeight: 28, // Custom line height
          },
        ]}
      >
        Body text with custom line height for extra readability.
      </ThemedText>

      {/* Emphasized caption with color */}
      <ThemedText
        type="caption"
        style={{
          fontFamily: FontFamily.medium,
          fontWeight: FontWeight.medium,
          color: errorColor,
          letterSpacing: 0.5,
        }}
      >
        CUSTOM EMPHASIZED CAPTION
      </ThemedText>

      {/* Mixed weights in single line */}
      <ThemedText type="body">
        This is <ThemedText type="bodyBold">bold text</ThemedText> within regular text, and <ThemedText type="caption">smaller text</ThemedText> too.
      </ThemedText>
    </ThemedView>
  );
}

/**
 * Example 8: Form Typography
 * Best practices for form labels, inputs, and validation
 */
export function FormTypographyExample() {
  const errorColor = useThemeColor({}, 'error');

  return (
    <ThemedView>
      {/* Form label */}
      <ThemedText type="label" style={styles.formLabel}>
        EMAIL ADDRESS *
      </ThemedText>

      {/* Helper text */}
      <ThemedText type="caption" style={styles.formHelper}>
        We&apos;ll send you a verification code
      </ThemedText>

      {/* Input placeholder would go here */}

      {/* Error message */}
      <ThemedText type="caption" style={[styles.formError, { color: errorColor }]}>
        Please enter a valid email address
      </ThemedText>

      {/* Character count */}
      <ThemedText type="small" style={styles.characterCount}>
        0 / 100
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  // Basic styles
  infoText: {
    marginBottom: Spacing.md,
  },
  helperText: {
    marginBottom: Spacing.sm,
    opacity: 0.7,
  },

  // Card
  card: {
    padding: Spacing.md,
    marginVertical: Spacing.md,
  },

  // Error text
  errorText: {
    // Color applied inline via theme
  },

  // Link text
  linkText: {
    // Color applied inline via theme
  },

  // Responsive
  responsiveTitle: {
    marginBottom: Spacing.md,
  },

  // Custom styles
  customTitle: {
    marginBottom: Spacing.lg,
  },
  customBody: {
    // Styles applied inline
  },

  // Form styles
  formLabel: {
    marginBottom: Spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  formHelper: {
    marginBottom: Spacing.sm,
    opacity: 0.6,
  },
  formError: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  characterCount: {
    textAlign: 'right',
    opacity: 0.5,
  },
});

// Export all examples
export const TypographyExamples = {
  Basic: BasicTypographyExample,
  PlatformFonts: PlatformFontsExample,
  DynamicType: DynamicTypeExample,
  Responsive: ResponsiveTypographyExample,
  Presets: TypographyPresetsExample,
  Utilities: TextUtilitiesExample,
  Custom: CustomTypographyExample,
  Forms: FormTypographyExample,
};
