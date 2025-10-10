/**
 * Responsive Image Component
 *
 * An image component that automatically scales based on screen size
 * and maintains aspect ratio.
 *
 * Features:
 * - Automatic size scaling based on device category
 * - Maintains aspect ratio
 * - Loading state
 * - Error handling
 * - Accessibility support
 *
 * @example
 * ```tsx
 * <ResponsiveImage
 *   source={{ uri: 'https://example.com/image.jpg' }}
 *   aspectRatio={16/9}
 *   baseWidth={300}
 * />
 * ```
 */

import { ThemedText } from '@/components/themed-text';
import { useResponsive } from '@/hooks/use-responsive';
import { useThemeColor } from '@/hooks/use-theme-color';
import React, { useState } from 'react';
import { ActivityIndicator, Image, type ImageProps, type ImageSourcePropType, StyleSheet, View, type ViewStyle } from 'react-native';

export interface ResponsiveImageProps extends Omit<ImageProps, 'style'> {
  /** Image source (same as Image component) */
  source: ImageSourcePropType;

  /** Base width for phone screens (will scale up/down for other devices) */
  baseWidth?: number;

  /** Base height for phone screens (will scale up/down for other devices) */
  baseHeight?: number;

  /** Aspect ratio (width / height) - if provided, height is calculated automatically */
  aspectRatio?: number;

  /** Image resize mode */
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';

  /** Border radius */
  borderRadius?: number;

  /** Show loading indicator while image loads */
  showLoading?: boolean;

  /** Placeholder content while loading */
  placeholder?: React.ReactNode;

  /** Show error message if image fails to load */
  showError?: boolean;

  /** Additional styles for container */
  containerStyle?: ViewStyle;

  /** Additional styles for image (ImageStyle only) */
  style?: ImageProps['style'];

  /** Accessibility label */
  accessibilityLabel?: string;

  /** Test ID */
  testID?: string;
}

/**
 * Image component that automatically scales based on screen size
 */
export function ResponsiveImage({
  source,
  baseWidth = 300,
  baseHeight,
  aspectRatio,
  resizeMode = 'cover',
  borderRadius = 0,
  showLoading = true,
  placeholder,
  showError = true,
  containerStyle,
  style,
  accessibilityLabel,
  testID,
  ...imageProps
}: ResponsiveImageProps) {
  const { getResponsiveSize } = useResponsive();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const surfaceColor = useThemeColor({}, 'surface-variant');
  const textColor = useThemeColor({}, 'text-muted');

  // Calculate responsive dimensions
  const responsiveWidth = getResponsiveSize(baseWidth);
  const responsiveHeight = aspectRatio ? responsiveWidth / aspectRatio : baseHeight ? getResponsiveSize(baseHeight) : undefined;

  const handleLoadStart = () => {
    setLoading(true);
    setError(false);
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <View
      style={[
        styles.container,
        {
          width: responsiveWidth,
          height: responsiveHeight,
          backgroundColor: surfaceColor,
          borderRadius,
        },
        containerStyle,
      ]}
      testID={testID}
    >
      {/* Loading state */}
      {loading && showLoading && <View style={styles.overlay}>{placeholder || <ActivityIndicator size="large" />}</View>}

      {/* Error state */}
      {error && showError && (
        <View style={styles.overlay}>
          <ThemedText type="caption" style={{ color: textColor }}>
            Failed to load image
          </ThemedText>
        </View>
      )}

      {/* Image */}
      {!error && (
        <Image
          source={source}
          style={[
            styles.image,
            {
              width: responsiveWidth,
              height: responsiveHeight,
              borderRadius,
            },
            style,
          ]}
          resizeMode={resizeMode}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          onError={handleError}
          accessibilityLabel={accessibilityLabel}
          {...imageProps}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});

/**
 * Avatar component with responsive sizing
 */
export interface ResponsiveAvatarProps {
  /** Avatar image source */
  source?: ImageSourcePropType;

  /** Size variant */
  size?: 'small' | 'medium' | 'large' | 'xlarge';

  /** Fallback text (usually initials) */
  fallbackText?: string;

  /** Additional styles */
  style?: ViewStyle;

  /** Accessibility label */
  accessibilityLabel?: string;
}

export function ResponsiveAvatar({ source, size = 'medium', fallbackText, style, accessibilityLabel }: ResponsiveAvatarProps) {
  const { getResponsiveSize } = useResponsive();
  const [imageError, setImageError] = useState(false);
  const surfaceColor = useThemeColor({}, 'surface-variant');
  const textColor = useThemeColor({}, 'text');

  // Base sizes for phone
  const baseSizes = {
    small: 32,
    medium: 48,
    large: 64,
    xlarge: 96,
  };

  const avatarSize = getResponsiveSize(baseSizes[size]);
  const fontSize = avatarSize * 0.4; // Font size is 40% of avatar size

  return (
    <View
      style={[
        styles.container,
        {
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarSize / 2,
          backgroundColor: surfaceColor,
        },
        style,
      ]}
    >
      {source && !imageError ? (
        <Image
          source={source}
          style={{
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarSize / 2,
          }}
          onError={() => setImageError(true)}
          accessibilityLabel={accessibilityLabel}
        />
      ) : fallbackText ? (
        <ThemedText
          style={{
            fontSize,
            fontWeight: '600',
            color: textColor,
          }}
        >
          {fallbackText}
        </ThemedText>
      ) : null}
    </View>
  );
}
