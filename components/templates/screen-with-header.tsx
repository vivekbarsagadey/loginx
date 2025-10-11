import { ThemedScrollView } from '@/components/themed-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BorderRadius, Spacing } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Feather } from '@expo/vector-icons';
import type { ComponentProps, ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ScreenWithHeaderProps {
  /**
   * Screen title displayed in header
   */
  title: string;
  /**
   * Optional subtitle below title
   */
  subtitle?: string;
  /**
   * Whether to show back button
   * @default false
   */
  showBackButton?: boolean;
  /**
   * Handler for back button press
   */
  onBackPress?: () => void;
  /**
   * Optional right header action button
   */
  rightAction?: {
    icon: ComponentProps<typeof Feather>['name'];
    onPress: () => void;
    accessibilityLabel: string;
  };
  /**
   * Screen content
   */
  children: ReactNode;
  /**
   * Whether content should scroll
   * @default true
   */
  scrollable?: boolean;
  /**
   * Whether to use safe area insets
   * @default true
   */
  useSafeArea?: boolean;
  /**
   * Background color variant
   * @default 'bg'
   */
  backgroundVariant?: 'bg' | 'bg-elevated' | 'surface';
}

/**
 * ScreenWithHeader template provides consistent layout for screens with a header.
 * Handles safe areas, scrolling, and common header actions.
 *
 * @example
 * <ScreenWithHeader
 *   title="Profile"
 *   subtitle="Manage your account"
 *   showBackButton
 *   onBackPress={router.back}
 *   rightAction={{
 *     icon: 'edit',
 *     onPress: handleEdit,
 *     accessibilityLabel: 'Edit profile'
 *   }}
 * >
 *   <YourContent />
 * </ScreenWithHeader>
 */
export function ScreenWithHeader({
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
  rightAction,
  children,
  scrollable = true,
  useSafeArea = true,
  backgroundVariant = 'bg',
}: ScreenWithHeaderProps) {
  const insets = useSafeAreaInsets();
  const backgroundColor = useThemeColor({}, backgroundVariant);
  const surfaceColor = useThemeColor({}, 'surface');
  const textColor = useThemeColor({}, 'text');
  const textMutedColor = useThemeColor({}, 'text-muted');
  const borderColor = useThemeColor({}, 'border');

  const header = (
    <View
      style={[
        styles.header,
        {
          paddingTop: useSafeArea ? insets.top + Spacing.sm : Spacing.md,
          backgroundColor: surfaceColor,
          borderBottomColor: borderColor,
        },
      ]}
    >
      <View style={styles.headerContent}>
        {/* Left Action (Back Button) */}
        <View style={styles.headerLeft}>
          {showBackButton && onBackPress && (
            <Pressable onPress={onBackPress} style={styles.headerButton} accessibilityRole="button" accessibilityLabel="Go back">
              <Feather name="arrow-left" size={24} color={textColor} />
            </Pressable>
          )}
        </View>

        {/* Title */}
        <View style={styles.headerCenter}>
          <ThemedText type="title" style={styles.headerTitle}>
            {title}
          </ThemedText>
          {subtitle && (
            <ThemedText type="caption" style={[styles.headerSubtitle, { color: textMutedColor }]}>
              {subtitle}
            </ThemedText>
          )}
        </View>

        {/* Right Action */}
        <View style={styles.headerRight}>
          {rightAction && (
            <Pressable onPress={rightAction.onPress} style={styles.headerButton} accessibilityRole="button" accessibilityLabel={rightAction.accessibilityLabel}>
              <Feather name={rightAction.icon} size={24} color={textColor} />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );

  const content = (
    <View
      style={[
        styles.content,
        {
          paddingBottom: useSafeArea ? insets.bottom : Spacing.md,
        },
      ]}
    >
      {children}
    </View>
  );

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      {header}
      {scrollable ? (
        <ThemedScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {content}
        </ThemedScrollView>
      ) : (
        content
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: Platform.select({ ios: 0.5, android: 1 }),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  headerLeft: {
    width: 44,
    alignItems: 'flex-start',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  headerRight: {
    width: 44,
    alignItems: 'flex-end',
  },
  headerButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
  },
  headerTitle: {
    textAlign: 'center',
  },
  headerSubtitle: {
    textAlign: 'center',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
});
