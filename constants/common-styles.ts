/**
 * Common Styles System
 * Centralized style definitions used across the application
 * to maintain consistency and reduce code duplication
 */

import { StyleSheet } from 'react-native';
import { BorderRadius, Spacing, Typography } from './layout';

/**
 * Common container styles used throughout the app
 */
export const CommonContainers = StyleSheet.create({
  /** Full screen centered container */
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },

  /** Full screen container with padding */
  screenContainer: {
    flex: 1,
    padding: Spacing.md,
  },

  /** Centered content container */
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.md,
  },

  /** Flex container with row direction */
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  /** Flex container with column direction */
  columnContainer: {
    flexDirection: 'column',
  },

  /** Container with standard gap between children */
  gapContainer: {
    gap: Spacing.md,
  },

  /** Container with small gap between children */
  gapSmallContainer: {
    gap: Spacing.sm,
  },

  /** Container with large gap between children */
  gapLargeContainer: {
    gap: Spacing.lg,
  },

  /** Card-like container */
  cardContainer: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },

  /** Section container with bottom margin */
  sectionContainer: {
    marginBottom: Spacing.xl,
  },

  /** Loading container - centered spinner */
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /** Button container - horizontal layout */
  buttonContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingTop: Spacing.md,
  },

  /** Form container */
  formContainer: {
    gap: Spacing.sm,
  },
});

/**
 * Common text styles for titles, subtitles, headings
 */
export const CommonText = StyleSheet.create({
  /** Page title - centered with bottom margin */
  title: {
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },

  /** Page title - left aligned with bottom margin */
  titleLeft: {
    marginBottom: Spacing.sm,
  },

  /** Subtitle - centered with bottom margin */
  subtitle: {
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },

  /** Subtitle - left aligned with bottom margin */
  subtitleLeft: {
    marginBottom: Spacing.xl,
  },

  /** Subtitle with medium bottom margin */
  subtitleMedium: {
    textAlign: 'center',
    marginBottom: Spacing.md,
  },

  /** Section title */
  sectionTitle: {
    marginBottom: Spacing.md,
    fontWeight: Typography.bodyBold.fontWeight as 'bold',
  },

  /** Section title - larger */
  sectionTitleLarge: {
    marginBottom: Spacing.md,
    fontSize: Typography.h2.fontSize,
    fontWeight: Typography.bodyBold.fontWeight as 'bold',
  },

  /** Helper text / caption */
  helperText: {
    marginTop: Spacing.sm,
    opacity: 0.7,
  },

  /** Error text */
  errorText: {
    fontSize: Typography.caption.fontSize,
    marginTop: Spacing.xs,
  },

  /** Success text */
  successText: {
    fontSize: Typography.caption.fontSize,
    marginTop: Spacing.xs,
  },

  /** Warning text */
  warningText: {
    textAlign: 'center',
    fontSize: Typography.caption.fontSize,
  },

  /** Centered text */
  centeredText: {
    textAlign: 'center',
  },

  /** Label text */
  labelText: {
    marginBottom: Spacing.xs,
    fontWeight: Typography.bodyBold.fontWeight as 'bold',
  },

  /** Description text */
  descriptionText: {
    marginBottom: Spacing.md,
    opacity: 0.7,
  },
});

/**
 * Common button styles
 */
export const CommonButtons = StyleSheet.create({
  /** Standard button with top margin */
  button: {
    marginTop: Spacing.md,
  },

  /** Button with large top margin */
  buttonLarge: {
    marginTop: Spacing.xl,
  },

  /** Full width button */
  buttonFullWidth: {
    marginTop: Spacing.md,
    width: '100%',
    alignSelf: 'center',
  },

  /** Full width button with max width constraint */
  buttonFullWidthConstrained: {
    marginTop: Spacing.xl,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },

  /** Link button (text button) */
  linkButton: {
    marginTop: Spacing.md,
    alignSelf: 'center',
  },

  /** Small link button */
  linkButtonSmall: {
    marginTop: Spacing.sm,
    alignSelf: 'center',
  },

  /** Secondary button */
  secondaryButton: {
    marginTop: Spacing.sm,
  },
});

/**
 * Common input/form field styles
 */
export const CommonInputs = StyleSheet.create({
  /** Standard input with vertical margin */
  input: {
    marginVertical: Spacing.sm,
  },

  /** Full width input with max width constraint */
  inputFullWidth: {
    marginVertical: Spacing.sm,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },

  /** Input with small vertical margin */
  inputSmall: {
    marginVertical: Spacing.xs,
  },

  /** Input label */
  inputLabel: {
    marginBottom: Spacing.xs,
    fontWeight: Typography.bodyBold.fontWeight as 'bold',
  },

  /** Input container */
  inputContainer: {
    marginBottom: Spacing.md,
  },

  /** Input with icon container */
  inputWithIcon: {
    position: 'relative',
  },
});

/**
 * Common spacing/layout styles
 */
export const CommonSpacing = StyleSheet.create({
  /** Standard horizontal padding */
  paddingHorizontal: {
    paddingHorizontal: Spacing.md,
  },

  /** Standard vertical padding */
  paddingVertical: {
    paddingVertical: Spacing.md,
  },

  /** Standard padding on all sides */
  padding: {
    padding: Spacing.md,
  },

  /** Large padding */
  paddingLarge: {
    padding: Spacing.lg,
  },

  /** Small padding */
  paddingSmall: {
    padding: Spacing.sm,
  },

  /** Bottom margin standard */
  marginBottom: {
    marginBottom: Spacing.md,
  },

  /** Bottom margin large */
  marginBottomLarge: {
    marginBottom: Spacing.xl,
  },

  /** Bottom margin small */
  marginBottomSmall: {
    marginBottom: Spacing.sm,
  },

  /** Top margin standard */
  marginTop: {
    marginTop: Spacing.md,
  },

  /** Top margin large */
  marginTopLarge: {
    marginTop: Spacing.xl,
  },

  /** Top margin small */
  marginTopSmall: {
    marginTop: Spacing.sm,
  },
});

/**
 * Common status/feedback containers
 */
export const CommonStatus = StyleSheet.create({
  /** Warning container */
  warningContainer: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },

  /** Error container */
  errorContainer: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },

  /** Success container */
  successContainer: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },

  /** Info container */
  infoContainer: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },

  /** Status icon */
  statusIcon: {
    position: 'absolute',
    right: Spacing.md,
    top: Spacing.md,
    zIndex: 10,
  },
});

/**
 * Common divider styles
 */
export const CommonDividers = StyleSheet.create({
  /** Horizontal divider container */
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.md,
  },

  /** Horizontal divider line */
  divider: {
    flex: 1,
    height: 1,
  },

  /** Divider text */
  dividerText: {
    marginHorizontal: Spacing.md,
    opacity: 0.6,
  },
});

/**
 * Common card/surface styles
 */
export const CommonSurfaces = StyleSheet.create({
  /** Basic card */
  card: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },

  /** Card with border */
  cardBordered: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
  },

  /** Elevated card (with shadow) */
  cardElevated: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  /** Card title */
  cardTitle: {
    marginBottom: Spacing.sm,
    fontWeight: Typography.bodyBold.fontWeight as 'bold',
  },

  /** Card content */
  cardContent: {
    gap: Spacing.sm,
  },
});

/**
 * Common icon/avatar containers
 */
export const CommonIcons = StyleSheet.create({
  /** Icon container - circular */
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /** Icon container - small */
  iconContainerSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /** Icon container - large */
  iconContainerLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /** Avatar container */
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  /** Avatar image */
  avatar: {
    width: '100%',
    height: '100%',
  },
});

/**
 * Common list/item styles
 */
export const CommonLists = StyleSheet.create({
  /** List item container */
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
  },

  /** List item content */
  listItemContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },

  /** List item title */
  listItemTitle: {
    fontWeight: Typography.bodyBold.fontWeight as 'bold',
    marginBottom: Spacing.xs,
  },

  /** List item description */
  listItemDescription: {
    opacity: 0.7,
    fontSize: Typography.caption.fontSize,
  },

  /** List section header */
  listSectionHeader: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontWeight: Typography.bodyBold.fontWeight as 'bold',
  },

  /** Info/Contact row container */
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },

  /** Last info row (no bottom border) */
  infoRowLast: {
    borderBottomWidth: 0,
  },

  /** Info icon container */
  infoIconContainer: {
    marginRight: Spacing.md,
    width: Spacing.lg,
    alignItems: 'center',
  },

  /** Info content container */
  infoContent: {
    flex: 1,
  },

  /** Info label text */
  infoLabel: {
    fontSize: Typography.caption.fontSize,
    marginBottom: Spacing.xs,
  },

  /** Info value text */
  infoValue: {
    fontSize: Typography.body.fontSize,
    fontWeight: Typography.bodyBold.fontWeight as 'bold',
  },
});

/**
 * Common selection card styles (for theme, language, etc.)
 */
export const CommonSelectionCards = StyleSheet.create({
  /** Selection options container */
  optionsContainer: {
    gap: Spacing.lg,
    marginTop: Spacing.lg,
  },

  /** Base selection card */
  selectionCard: {
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
    minHeight: 68,
  },

  /** Selection card content */
  selectionCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
  },

  /** Icon/Flag container for selection cards */
  selectionIconContainer: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
  },

  /** Icon/Flag emoji style */
  selectionIconEmoji: {
    fontSize: 30,
    textAlign: 'center',
  },

  /** Selection card text container */
  selectionTextContainer: {
    flex: 1,
    gap: Spacing.xs / 2,
  },

  /** Selection card title */
  selectionCardTitle: {
    fontWeight: Typography.bodyBold.fontWeight as 'bold',
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight,
  },

  /** Selection card description */
  selectionCardDescription: {
    fontSize: Typography.caption.fontSize,
    lineHeight: Typography.caption.lineHeight,
    opacity: 0.65,
    marginTop: 2,
  },

  /** Checkmark container */
  checkmarkContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  /** Checkmark circle badge */
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /** Checkmark text */
  checkmarkText: {
    fontSize: 16,
    fontWeight: '900' as const,
    textAlign: 'center',
    lineHeight: 24,
  },
});

/**
 * Export all common styles as a single object for convenience
 */
export const CommonStyles = {
  containers: CommonContainers,
  text: CommonText,
  buttons: CommonButtons,
  inputs: CommonInputs,
  spacing: CommonSpacing,
  status: CommonStatus,
  dividers: CommonDividers,
  surfaces: CommonSurfaces,
  icons: CommonIcons,
  lists: CommonLists,
  selectionCards: CommonSelectionCards,
};

/**
 * Note: For combining styles, use the `combine()` function from style-utils
 * @see constants/style-utils.ts
 * @example
 * import { combine, padding, rounded } from '@/constants/style-utils';
 * const styles = StyleSheet.create({
 *   container: combine(padding.md, rounded.lg),
 * });
 */
