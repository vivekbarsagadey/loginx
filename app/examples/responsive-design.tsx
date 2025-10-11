/**
 * Responsive Design Demo Screen
 *
 * This screen demonstrates all responsive design features:
 * - Reactive window dimensions
 * - Device category detection
 * - Orientation handling
 * - Responsive grids
 * - Responsive images
 * - Adaptive layouts
 */

import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Card } from '@/components/ui/card';
import { ResponsiveGrid, ResponsiveTwoColumn } from '@/components/ui/layout/responsive-grid';
import { ResponsiveAvatar, ResponsiveImage } from '@/components/ui/layout/responsive-image';
import { CommonText } from '@/constants/common-styles';
import { BorderRadius, Spacing } from '@/constants/layout';
import { useBreakpoint, useOrientation, useResponsive } from '@/hooks/use-responsive';
import { useThemeColors } from '@/hooks/use-theme-colors';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function ResponsiveDesignDemo() {
  const { width, height, deviceCategory, padding, maxContentWidth, gridColumns, fontScaleMultiplier, minTouchTarget } = useResponsive();

  const { isLandscape, isPortrait } = useOrientation();
  const { isPhone, isTablet, isDesktop } = useBreakpoint();
  const colors = useThemeColors();

  // Sample data for grid demo
  const gridItems = [
    { id: 1, title: 'Item 1', color: '#FF6B6B' },
    { id: 2, title: 'Item 2', color: '#4ECDC4' },
    { id: 3, title: 'Item 3', color: '#45B7D1' },
    { id: 4, title: 'Item 4', color: '#96CEB4' },
    { id: 5, title: 'Item 5', color: '#FFEAA7' },
    { id: 6, title: 'Item 6', color: '#DFE6E9' },
  ];

  return (
    <ScreenContainer scrollable>
      {/* Header */}
      <ThemedText type="h1" style={CommonText.title}>
        Responsive Design Demo
      </ThemedText>
      <ThemedText type="body" style={CommonText.subtitle}>
        This screen demonstrates responsive design features that adapt to device size and orientation
      </ThemedText>

      {/* Device Info Card */}
      <Card elevation={1} style={styles.infoCard}>
        <ThemedText type="h3" style={styles.cardTitle}>
          Current Device Info
        </ThemedText>

        <View style={styles.infoRow}>
          <ThemedText type="bodyBold">Device Category:</ThemedText>
          <ThemedText type="body" style={{ color: colors.primary }}>
            {deviceCategory.toUpperCase()}
          </ThemedText>
        </View>

        <View style={styles.infoRow}>
          <ThemedText type="bodyBold">Orientation:</ThemedText>
          <ThemedText type="body" style={{ color: colors.primary }}>
            {isLandscape ? 'LANDSCAPE' : 'PORTRAIT'}
          </ThemedText>
        </View>

        <View style={styles.infoRow}>
          <ThemedText type="bodyBold">Screen Size:</ThemedText>
          <ThemedText type="body">
            {Math.round(width)} × {Math.round(height)}px
          </ThemedText>
        </View>

        <View style={styles.infoRow}>
          <ThemedText type="bodyBold">Max Content Width:</ThemedText>
          <ThemedText type="body">{Math.round(maxContentWidth)}px</ThemedText>
        </View>

        <View style={styles.infoRow}>
          <ThemedText type="bodyBold">Grid Columns:</ThemedText>
          <ThemedText type="body">{gridColumns}</ThemedText>
        </View>

        <View style={styles.infoRow}>
          <ThemedText type="bodyBold">Responsive Padding:</ThemedText>
          <ThemedText type="body">{padding.responsive}px</ThemedText>
        </View>

        <View style={styles.infoRow}>
          <ThemedText type="bodyBold">Font Scale:</ThemedText>
          <ThemedText type="body">{fontScaleMultiplier.toFixed(1)}x</ThemedText>
        </View>

        <View style={styles.infoRow}>
          <ThemedText type="bodyBold">Min Touch Target:</ThemedText>
          <ThemedText type="body">{minTouchTarget}px</ThemedText>
        </View>
      </Card>

      {/* Breakpoint Status */}
      <Card elevation={1} style={styles.infoCard}>
        <ThemedText type="h3" style={styles.cardTitle}>
          Active Breakpoints
        </ThemedText>

        <View style={styles.breakpointRow}>
          <View style={[styles.breakpointBadge, isPhone && styles.activeBadge]}>
            <ThemedText type="caption" style={isPhone && styles.activeText}>
              📱 Phone {isPhone && '✓'}
            </ThemedText>
          </View>

          <View style={[styles.breakpointBadge, isTablet && styles.activeBadge]}>
            <ThemedText type="caption" style={isTablet && styles.activeText}>
              📟 Tablet {isTablet && '✓'}
            </ThemedText>
          </View>

          <View style={[styles.breakpointBadge, isDesktop && styles.activeBadge]}>
            <ThemedText type="caption" style={isDesktop && styles.activeText}>
              💻 Desktop {isDesktop && '✓'}
            </ThemedText>
          </View>
        </View>
      </Card>

      {/* Responsive Grid Demo */}
      <ThemedView style={styles.section}>
        <ThemedText type="h2" style={styles.sectionTitle}>
          Responsive Grid
        </ThemedText>
        <ThemedText type="caption" style={styles.sectionDesc}>
          Grid adapts columns based on screen size: {gridColumns} columns active
        </ThemedText>

        <ResponsiveGrid gap="md">
          {gridItems.map((item) => (
            <View key={item.id} style={[styles.gridItem, { backgroundColor: item.color }]}>
              <ThemedText type="body" style={{ fontWeight: '600' }}>
                {item.title}
              </ThemedText>
            </View>
          ))}
        </ResponsiveGrid>
      </ThemedView>

      {/* Responsive Two Column Demo */}
      <ThemedView style={styles.section}>
        <ThemedText type="h2" style={styles.sectionTitle}>
          Adaptive Two-Column Layout
        </ThemedText>
        <ThemedText type="caption" style={styles.sectionDesc}>
          {isPortrait && deviceCategory === 'phone' ? 'Stacked vertically on portrait phone' : 'Side-by-side layout on wider screens'}
        </ThemedText>

        <ResponsiveTwoColumn
          left={
            <Card elevation={1}>
              <ThemedText type="h3">Column 1</ThemedText>
              <ThemedText type="body" style={{ marginTop: Spacing.sm }}>
                This column stacks on phones in portrait mode and displays side-by-side on tablets and landscape.
              </ThemedText>
            </Card>
          }
          right={
            <Card elevation={1}>
              <ThemedText type="h3">Column 2</ThemedText>
              <ThemedText type="body" style={{ marginTop: Spacing.sm }}>
                The layout adapts automatically based on the device category and orientation.
              </ThemedText>
            </Card>
          }
          breakpoint="medium"
          gap="md"
        />
      </ThemedView>

      {/* Responsive Images Demo */}
      <ThemedView style={styles.section}>
        <ThemedText type="h2" style={styles.sectionTitle}>
          Responsive Images
        </ThemedText>
        <ThemedText type="caption" style={styles.sectionDesc}>
          Images scale automatically based on device size
        </ThemedText>

        <View style={styles.imageRow}>
          <ResponsiveImage
            source={{ uri: 'https://picsum.photos/400/300' }}
            baseWidth={280}
            aspectRatio={4 / 3}
            borderRadius={BorderRadius.md}
            showLoading
            accessibilityLabel="Sample responsive image"
          />
        </View>
      </ThemedView>

      {/* Responsive Avatars Demo */}
      <ThemedView style={styles.section}>
        <ThemedText type="h2" style={styles.sectionTitle}>
          Responsive Avatars
        </ThemedText>
        <ThemedText type="caption" style={styles.sectionDesc}>
          Avatar sizes scale based on device category
        </ThemedText>

        <View style={styles.avatarRow}>
          <View style={styles.avatarItem}>
            <ResponsiveAvatar source={{ uri: 'https://i.pravatar.cc/150?img=1' }} size="small" accessibilityLabel="Small avatar" />
            <ThemedText type="caption" style={styles.avatarLabel}>
              Small
            </ThemedText>
          </View>

          <View style={styles.avatarItem}>
            <ResponsiveAvatar source={{ uri: 'https://i.pravatar.cc/150?img=2' }} size="medium" accessibilityLabel="Medium avatar" />
            <ThemedText type="caption" style={styles.avatarLabel}>
              Medium
            </ThemedText>
          </View>

          <View style={styles.avatarItem}>
            <ResponsiveAvatar source={{ uri: 'https://i.pravatar.cc/150?img=3' }} size="large" accessibilityLabel="Large avatar" />
            <ThemedText type="caption" style={styles.avatarLabel}>
              Large
            </ThemedText>
          </View>

          <View style={styles.avatarItem}>
            <ResponsiveAvatar fallbackText="XL" size="xlarge" accessibilityLabel="Extra large avatar" />
            <ThemedText type="caption" style={styles.avatarLabel}>
              XLarge
            </ThemedText>
          </View>
        </View>
      </ThemedView>

      {/* Tips Card */}
      <Card elevation={1} style={styles.tipsCard}>
        <ThemedText type="h3" style={styles.cardTitle}>
          💡 Try This
        </ThemedText>
        <ThemedText type="body" style={{ lineHeight: 24 }}>
          • Rotate your device to see the layout adapt{'\n'}• Test on different device sizes{'\n'}• Enable Large Text in accessibility settings{'\n'}• Try split-screen mode on supported devices{'\n'}•
          All values update automatically!
        </ThemedText>
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  infoCard: {
    marginBottom: Spacing.lg,
    padding: Spacing.md,
  },
  cardTitle: {
    marginBottom: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  breakpointRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flexWrap: 'wrap',
  },
  breakpointBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    // backgroundColor: Use bgElevated or surface with opacity inline
  },
  activeBadge: {
    // backgroundColor: Use primaryColor + '1A' inline
  },
  activeText: {
    fontWeight: '600',
    // color: Use primaryColor inline
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.xs,
  },
  sectionDesc: {
    marginBottom: Spacing.md,
    opacity: 0.7,
  },
  gridItem: {
    aspectRatio: 1,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.sm,
  },
  imageRow: {
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  avatarRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: Spacing.md,
  },
  avatarItem: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  avatarLabel: {
    marginTop: Spacing.xs,
    opacity: 0.7,
  },
  tipsCard: {
    marginBottom: Spacing.xl,
    padding: Spacing.md,
    backgroundColor: 'rgba(37, 99, 235, 0.05)',
  },
});
