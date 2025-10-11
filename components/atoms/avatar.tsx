import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Image, StyleSheet, View, type ViewStyle } from 'react-native';

interface AvatarProps {
  /**
   * URL of the avatar image
   */
  uri?: string;
  /**
   * Fallback initials to display when no image is provided
   */
  initials?: string;
  /**
   * Size of the avatar
   * @default 'md'
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  /**
   * Shape of the avatar
   * @default 'circle'
   */
  shape?: 'circle' | 'rounded' | 'square';
  /**
   * Optional style overrides
   */
  style?: ViewStyle;
  /**
   * Accessibility label for the avatar
   */
  accessibilityLabel?: string;
}

const SIZE_MAP = {
  xs: 24,
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
};

const BORDER_RADIUS_MAP = {
  circle: 999,
  rounded: 8,
  square: 0,
};

/**
 * Avatar component for displaying user profile pictures or initials.
 * Supports multiple sizes, shapes, and automatic fallback to initials.
 *
 * @example
 * <Avatar uri="https://example.com/avatar.jpg" size="lg" />
 * <Avatar initials="JD" size="md" shape="rounded" />
 * <Avatar uri="https://example.com/avatar.jpg" initials="AB" />
 */
export function Avatar({ uri, initials, size = 'md', shape = 'circle', style, accessibilityLabel = 'User avatar' }: AvatarProps) {
  const surfaceColor = useThemeColor({}, 'surface');
  const primaryColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'on-primary');

  const avatarSize = typeof size === 'number' ? size : SIZE_MAP[size];
  const borderRadius = BORDER_RADIUS_MAP[shape];

  const containerStyle: ViewStyle = {
    width: avatarSize,
    height: avatarSize,
    borderRadius: shape === 'circle' ? avatarSize / 2 : borderRadius,
    backgroundColor: uri ? surfaceColor : primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  };

  const fontSize = Math.floor(avatarSize / 2.5);

  return (
    <View style={[containerStyle, style]} accessible accessibilityRole="image" accessibilityLabel={accessibilityLabel}>
      {uri ? (
        <Image source={{ uri }} style={styles.image} defaultSource={require('@/assets/images/icon.png')} accessibilityIgnoresInvertColors />
      ) : initials ? (
        <ThemedText
          style={[
            styles.initials,
            {
              fontSize,
              color: textColor,
            },
          ]}
        >
          {initials.substring(0, 2).toUpperCase()}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
  initials: {
    fontWeight: '600',
    textAlign: 'center',
  },
});
