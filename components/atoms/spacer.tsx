import { Spacing } from '@/constants/layout';
import { View, type ViewStyle } from 'react-native';

interface SpacerProps {
  /**
   * Size of the spacer. Can be a preset size key or a custom number.
   * @default 'md'
   */
  size?: keyof typeof Spacing | number;
  /**
   * Whether the spacer is horizontal (width) instead of vertical (height)
   * @default false
   */
  horizontal?: boolean;
  /**
   * Optional style overrides
   */
  style?: ViewStyle;
}

/**
 * Spacer component for consistent spacing throughout the app.
 * Uses spacing constants from layout or allows custom values.
 *
 * @example
 * <Spacer size="lg" />
 * <Spacer size={24} horizontal />
 */
export function Spacer({ size = 'md', horizontal = false, style }: SpacerProps) {
  const spacingValue = typeof size === 'number' ? size : Spacing[size];

  const spacerStyle: ViewStyle = {
    [horizontal ? 'width' : 'height']: spacingValue,
  };

  return <View style={[spacerStyle, style]} />;
}
