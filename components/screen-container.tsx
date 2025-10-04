/**
 * Unified screen container component for consistent layout across all screens
 * Handles safe areas, keyboard avoidance, and scrolling automatically
 */

import { KeyboardOffset, Spacing } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import { PropsWithChildren, ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, ScrollViewProps, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export type ScreenContainerProps = PropsWithChildren<{
  /**
   * Whether to use ScrollView for scrollable content
   * @default false
   */
  scrollable?: boolean;

  /**
   * Whether to enable keyboard avoiding behavior
   * @default true
   */
  keyboardAvoiding?: boolean;

  /**
   * Whether to use safe area insets
   * @default true
   */
  useSafeArea?: boolean;

  /**
   * Custom padding override
   * @default Spacing.md (16)
   */
  padding?: number;

  /**
   * Disable default padding
   * @default false
   */
  noPadding?: boolean;

  /**
   * Center content vertically
   * @default false
   */
  centerContent?: boolean;

  /**
   * Background variant
   * @default 'bg'
   */
  variant?: 'bg' | 'bg-elevated' | 'surface' | 'surface-variant';

  /**
   * Additional styles for container
   */
  style?: ViewStyle;

  /**
   * Additional styles for content wrapper
   */
  contentContainerStyle?: ViewStyle;

  /**
   * ScrollView props (only applies when scrollable=true)
   */
  scrollViewProps?: Omit<ScrollViewProps, 'style' | 'contentContainerStyle'>;

  /**
   * Header component (rendered above content, inside safe area)
   */
  header?: ReactNode;

  /**
   * Footer component (rendered below content, inside safe area)
   */
  footer?: ReactNode;

  /**
   * Test ID for testing
   */
  testID?: string;
}>;

/**
 * Unified screen container that provides:
 * - Safe area handling for notches and home indicators
 * - Keyboard avoidance (platform-specific)
 * - Optional scrolling
 * - Consistent padding and spacing
 * - Theme-aware background colors
 * - Flexible layout options
 */
export function ScreenContainer({
  children,
  scrollable = false,
  keyboardAvoiding = true,
  useSafeArea = true,
  padding,
  noPadding = false,
  centerContent = false,
  variant = 'bg',
  style,
  contentContainerStyle,
  scrollViewProps,
  header,
  footer,
  testID,
}: ScreenContainerProps) {
  const backgroundColor = useThemeColor({}, variant);

  const containerPadding = noPadding ? 0 : (padding ?? Spacing.md);

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor,
  };

  const contentStyle: ViewStyle = {
    flex: centerContent ? 1 : undefined,
    padding: containerPadding,
    justifyContent: centerContent ? 'center' : undefined,
  };

  // Render content based on scrollable prop
  const renderContent = () => {
    if (scrollable) {
      return (
        <ScrollView
          style={[styles.scrollView, style]}
          contentContainerStyle={[
            contentStyle,
            contentContainerStyle,
            // Override flex when scrollable to allow content to determine height
            { flex: undefined },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          {...scrollViewProps}
        >
          {children}
        </ScrollView>
      );
    }

    return <View style={[contentStyle, style, contentContainerStyle]}>{children}</View>;
  };

  // Build the component tree from inside out
  let content = (
    <>
      {header}
      {renderContent()}
      {footer}
    </>
  );

  // Wrap with KeyboardAvoidingView if needed
  if (keyboardAvoiding) {
    content = (
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? KeyboardOffset.ios : KeyboardOffset.android}
      >
        {content}
      </KeyboardAvoidingView>
    );
  }

  // Wrap with SafeAreaView if needed
  if (useSafeArea) {
    return (
      <SafeAreaView style={[containerStyle]} edges={['top', 'left', 'right', 'bottom']} testID={testID}>
        {content}
      </SafeAreaView>
    );
  }

  return (
    <View style={[containerStyle]} testID={testID}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
});
