import { useThemeColors } from '@/hooks/use-theme-colors';
import { View, type ViewStyle } from 'react-native';

interface DividerProps {
  /**
   * Thickness of the divider line
   * @default 1
   */
  thickness?: number;
  /**
   * Whether the divider is horizontal (default) or vertical
   * @default true
   */
  horizontal?: boolean;
  /**
   * Custom color for the divider. If not provided, uses theme border color
   */
  color?: string;
  /**
   * Optional style overrides
   */
  style?: ViewStyle;
  /**
   * Accessibility label for the divider
   */
  accessibilityLabel?: string;
}

/**
 * Divider component for visual separation of content.
 * Automatically uses theme colors and supports both horizontal and vertical orientations.
 *
 * @example
 * <Divider />
 * <Divider thickness={2} color="red" />
 * <Divider horizontal={false} style={{ height: 100 }} />
 */
export function Divider({ thickness = 1, horizontal = true, color, style, accessibilityLabel = 'Divider' }: DividerProps) {
  const colors = useThemeColors();
  const dividerColor = color || colors.border;

  const dividerStyle: ViewStyle = horizontal
    ? {
        height: thickness,
        width: '100%',
        backgroundColor: dividerColor,
      }
    : {
        width: thickness,
        height: '100%',
        backgroundColor: dividerColor,
      };

  return <View style={[dividerStyle, style]} accessible accessibilityRole="none" accessibilityLabel={accessibilityLabel} />;
}
