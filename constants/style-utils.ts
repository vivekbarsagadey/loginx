/**
 * Style utilities for consistent UI development
 * Helper functions and shortcuts for common style patterns
 */

import { type ColorSchemeName, type ImageStyle, type TextStyle, type ViewStyle } from 'react-native';
import { BorderRadius, Shadow, Spacing, TouchTarget, ZIndex } from './layout';
import { Colors } from './theme';

/**
 * Get theme-aware shadow styles
 * Use this instead of Shadow constants directly to ensure proper shadow colors
 *
 * @param level - Shadow level: 'none' | 'sm' | 'md' | 'lg' | 'xl'
 * @param colorScheme - Current color scheme ('light' | 'dark')
 * @returns ViewStyle with shadow properties including shadowColor
 *
 * @example
 * const styles = StyleSheet.create({
 *   card: getShadow('md', colorScheme),
 * });
 */
export function getShadow(level: keyof typeof Shadow, colorScheme: ColorSchemeName = 'light'): ViewStyle {
  const shadowBase = Shadow[level];

  // In dark mode, shadows should be more subtle and use a lighter shadow color
  // In light mode, shadows are darker (black)
  const shadowColor =
    colorScheme === 'dark'
      ? Colors.dark.text // Use text color (lighter) for shadows in dark mode
      : '#000000'; // Pure black for shadows in light mode

  return {
    ...shadowBase,
    shadowColor,
  };
}

/**
 * Pre-configured shadow presets with theme awareness
 * These functions return shadow getters that can be used in StyleSheet.create
 *
 * @example
 * const colorScheme = useColorScheme();
 * const styles = StyleSheet.create({
 *   card: shadow.card(colorScheme),
 *   button: shadow.button(colorScheme),
 * });
 */
export const shadow = {
  /** No shadow */
  none: (colorScheme: ColorSchemeName = 'light') => getShadow('none', colorScheme),
  /** Small shadow - for small cards, chips */
  sm: (colorScheme: ColorSchemeName = 'light') => getShadow('sm', colorScheme),
  /** Medium shadow - for cards, modals */
  md: (colorScheme: ColorSchemeName = 'light') => getShadow('md', colorScheme),
  /** Large shadow - for floating action buttons, drawers */
  lg: (colorScheme: ColorSchemeName = 'light') => getShadow('lg', colorScheme),
  /** Extra large shadow - for dialogs, prominent overlays */
  xl: (colorScheme: ColorSchemeName = 'light') => getShadow('xl', colorScheme),

  // Semantic shadow presets
  /** Shadow for card components */
  card: (colorScheme: ColorSchemeName = 'light') => getShadow('md', colorScheme),
  /** Shadow for button components */
  button: (colorScheme: ColorSchemeName = 'light') => getShadow('sm', colorScheme),
  /** Shadow for modal/dialog components */
  modal: (colorScheme: ColorSchemeName = 'light') => getShadow('xl', colorScheme),
  /** Shadow for floating action button */
  fab: (colorScheme: ColorSchemeName = 'light') => getShadow('lg', colorScheme),
};

/**
 * Create consistent padding styles
 */
export const padding = {
  /** padding: Spacing.xs (4px) */
  xs: { padding: Spacing.xs } as ViewStyle,
  /** padding: Spacing.sm (8px) */
  sm: { padding: Spacing.sm } as ViewStyle,
  /** padding: Spacing.md (16px) - most common */
  md: { padding: Spacing.md } as ViewStyle,
  /** padding: Spacing.lg (24px) */
  lg: { padding: Spacing.lg } as ViewStyle,
  /** padding: Spacing.xl (32px) */
  xl: { padding: Spacing.xl } as ViewStyle,
};

/**
 * Create consistent margin styles
 */
export const margin = {
  /** margin: Spacing.xs (4px) */
  xs: { margin: Spacing.xs } as ViewStyle,
  /** margin: Spacing.sm (8px) */
  sm: { margin: Spacing.sm } as ViewStyle,
  /** margin: Spacing.md (16px) - most common */
  md: { margin: Spacing.md } as ViewStyle,
  /** margin: Spacing.lg (24px) */
  lg: { margin: Spacing.lg } as ViewStyle,
  /** margin: Spacing.xl (32px) */
  xl: { margin: Spacing.xl } as ViewStyle,
};

/**
 * Common flex layouts
 */
export const flex = {
  /** flex: 1 */
  fill: { flex: 1 } as ViewStyle,
  /** flexDirection: 'row' */
  row: { flexDirection: 'row' } as ViewStyle,
  /** flexDirection: 'column' */
  column: { flexDirection: 'column' } as ViewStyle,
  /** justifyContent: 'center', alignItems: 'center' */
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  /** justifyContent: 'space-between' */
  spaceBetween: { justifyContent: 'space-between' } as ViewStyle,
  /** justifyContent: 'space-around' */
  spaceAround: { justifyContent: 'space-around' } as ViewStyle,
  /** alignItems: 'center' */
  alignCenter: { alignItems: 'center' } as ViewStyle,
  /** alignItems: 'flex-start' */
  alignStart: { alignItems: 'flex-start' } as ViewStyle,
  /** alignItems: 'flex-end' */
  alignEnd: { alignItems: 'flex-end' } as ViewStyle,
};

/**
 * Common rounded corners
 */
export const rounded = {
  /** borderRadius: BorderRadius.xs (4px) */
  xs: { borderRadius: BorderRadius.xs } as ViewStyle,
  /** borderRadius: BorderRadius.sm (8px) */
  sm: { borderRadius: BorderRadius.sm } as ViewStyle,
  /** borderRadius: BorderRadius.md (12px) - most common */
  md: { borderRadius: BorderRadius.md } as ViewStyle,
  /** borderRadius: BorderRadius.lg (16px) */
  lg: { borderRadius: BorderRadius.lg } as ViewStyle,
  /** borderRadius: BorderRadius.xl (24px) */
  xl: { borderRadius: BorderRadius.xl } as ViewStyle,
  /** borderRadius: BorderRadius.full (9999px) - pills, avatars */
  full: { borderRadius: BorderRadius.full } as ViewStyle,
};

/**
 * Text alignment utilities
 */
export const textAlign = {
  left: { textAlign: 'left' } as TextStyle,
  center: { textAlign: 'center' } as TextStyle,
  right: { textAlign: 'right' } as TextStyle,
  justify: { textAlign: 'justify' } as TextStyle,
};

/**
 * Common container styles
 *
 * NOTE: The card style doesn't include shadows. Use getShadow() or shadow utilities
 * to add theme-aware shadows to your containers.
 *
 * @example
 * const colorScheme = useColorScheme();
 * const styles = StyleSheet.create({
 *   myCard: {
 *     ...container.card,
 *     ...getShadow('md', colorScheme),
 *   },
 * });
 */
export const container = {
  /** Full screen container */
  screen: {
    flex: 1,
  } as ViewStyle,
  /** Card container (add shadow separately with getShadow) */
  card: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  } as ViewStyle,
  /** Row with items */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  } as ViewStyle,
  /** Section with spacing */
  section: {
    marginBottom: Spacing.lg,
  } as ViewStyle,
};

/**
 * Common button styles (use with ThemedButton)
 */
export const button = {
  /** Full width button */
  fullWidth: {
    width: '100%',
  } as ViewStyle,
  /** Minimum width button */
  minWidth: {
    minWidth: 120,
  } as ViewStyle,
};

/**
 * Common image styles
 */
export const image = {
  /** Square avatar (64x64) */
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  } as ImageStyle,
  /** Small avatar (40x40) */
  avatarSm: {
    width: 40,
    height: 40,
    borderRadius: 20,
  } as ImageStyle,
  /** Large avatar (96x96) */
  avatarLg: {
    width: 96,
    height: 96,
    borderRadius: 48,
  } as ImageStyle,
  /** Thumbnail (80x80) */
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.sm,
  } as ImageStyle,
};

/**
 * Accessibility helpers
 */
export const a11y = {
  /** Minimum touch target (44x44) */
  touchTarget: {
    minHeight: TouchTarget.minimum,
    minWidth: TouchTarget.minimum,
  } as ViewStyle,
  /** Comfortable touch target (48x48) */
  touchTargetComfortable: {
    minHeight: TouchTarget.comfortable,
    minWidth: TouchTarget.comfortable,
  } as ViewStyle,
  /** Hide from screen readers but keep visible */
  visualOnly: {
    accessible: false,
  },
};

/**
 * Z-index layers for proper stacking
 */
export const zIndex = {
  background: { zIndex: ZIndex.background },
  base: { zIndex: ZIndex.base },
  dropdown: { zIndex: ZIndex.dropdown },
  sticky: { zIndex: ZIndex.sticky },
  overlay: { zIndex: ZIndex.overlay },
  modal: { zIndex: ZIndex.modal },
  popover: { zIndex: ZIndex.popover },
  toast: { zIndex: ZIndex.toast },
  tooltip: { zIndex: ZIndex.tooltip },
};

/**
 * Combine multiple style objects safely
 * @example
 * const styles = combine(padding.md, rounded.md, shadow.sm);
 */
export function combine<T>(...styles: (T | undefined | false | null)[]): T {
  return Object.assign({}, ...styles.filter(Boolean)) as T;
}

/**
 * Create responsive spacing based on screen size
 * @param small - Value for small screens
 * @param medium - Value for medium screens
 * @param _large - Value for large screens (reserved for future use)
 */
export function responsiveSpacing(small: number, medium: number, _large: number): number {
  // This is a simplified version - you can enhance with actual screen detection
  return medium;
}

/**
 * Common gap styles for flex containers
 */
export const gap = {
  xs: { gap: Spacing.xs } as ViewStyle,
  sm: { gap: Spacing.sm } as ViewStyle,
  md: { gap: Spacing.md } as ViewStyle,
  lg: { gap: Spacing.lg } as ViewStyle,
  xl: { gap: Spacing.xl } as ViewStyle,
};

/**
 * Position utilities
 */
export const position = {
  absolute: { position: 'absolute' } as ViewStyle,
  relative: { position: 'relative' } as ViewStyle,
  absoluteFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  } as ViewStyle,
  absoluteCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
  } as ViewStyle,
};

/**
 * Overflow utilities
 */
export const overflow = {
  hidden: { overflow: 'hidden' } as ViewStyle,
  visible: { overflow: 'visible' } as ViewStyle,
  scroll: { overflow: 'scroll' } as ViewStyle,
};

/**
 * Opacity utilities
 */
export const opacity = {
  transparent: { opacity: 0 } as ViewStyle,
  low: { opacity: 0.3 } as ViewStyle,
  medium: { opacity: 0.5 } as ViewStyle,
  high: { opacity: 0.7 } as ViewStyle,
  opaque: { opacity: 1 } as ViewStyle,
};
