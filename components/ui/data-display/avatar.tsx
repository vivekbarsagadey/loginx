import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { Image, type ImageSourcePropType, Pressable, StyleSheet, View } from 'react-native';

export interface AvatarProps {
  /** Image source for the avatar */
  source?: ImageSourcePropType;
  /** Fallback initials when no image is provided */
  initials?: string;
  /** Size variant */
  size?: 'small' | 'medium' | 'large';
  /** Status indicator */
  status?: 'online' | 'offline' | 'busy' | 'away';
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Called when avatar is pressed */
  onPress?: () => void;
}

const SIZES = {
  small: 32,
  medium: 40,
  large: 56,
};

const STATUS_COLORS = {
  online: '#4CAF50',
  offline: '#9E9E9E',
  busy: '#F44336',
  away: '#FF9800',
};

export function Avatar({ source, initials, size = 'medium', status, accessibilityLabel, onPress }: AvatarProps) {
  const primaryColor = useThemeColor({}, 'primary');
  const backgroundColor = useThemeColor({}, 'background');
  const avatarSize = SIZES[size];
  const statusSize = size === 'small' ? 8 : size === 'medium' ? 10 : 12;

  const getInitials = () => {
    if (!initials) {
      return '?';
    }
    return initials.slice(0, 2).toUpperCase();
  };

  const content = (
    <View
      style={[styles.container, { width: avatarSize, height: avatarSize }]}
      accessible={true}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel || `Avatar${initials ? ` for ${initials}` : ''}`}
    >
      {source ? (
        <Image source={source} style={[styles.image, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }]} resizeMode="cover" />
      ) : (
        <View
          style={[
            styles.fallback,
            {
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
              backgroundColor: primaryColor,
            },
          ]}
        >
          <ThemedText
            style={[
              styles.initials,
              {
                fontSize: size === 'small' ? 12 : size === 'medium' ? 16 : 20,
                color: backgroundColor,
              },
            ]}
          >
            {getInitials()}
          </ThemedText>
        </View>
      )}

      {status && (
        <View
          style={[
            styles.statusIndicator,
            {
              width: statusSize,
              height: statusSize,
              borderRadius: statusSize / 2,
              backgroundColor: STATUS_COLORS[status],
              borderWidth: 2,
              borderColor: backgroundColor,
            },
          ]}
          accessible={true}
          accessibilityLabel={`Status: ${status}`}
        />
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} accessible={true} accessibilityRole="button">
        {content}
      </Pressable>
    );
  }

  return content;
}

/**
 * Group of avatars displayed with overlap
 */
export interface AvatarGroupProps {
  /** Array of avatar sources or initials */
  avatars: { source?: ImageSourcePropType; initials?: string }[];
  /** Maximum number of avatars to display before showing +N */
  max?: number;
  /** Size variant */
  size?: 'small' | 'medium' | 'large';
  /** Accessibility label */
  accessibilityLabel?: string;
}

export function AvatarGroup({ avatars, max = 4, size = 'medium', accessibilityLabel }: AvatarGroupProps) {
  const primaryColor = useThemeColor({}, 'primary');
  const backgroundColor = useThemeColor({}, 'background');
  const avatarSize = SIZES[size];
  const displayAvatars = avatars.slice(0, max);
  const remainingCount = Math.max(0, avatars.length - max);
  const overlap = size === 'small' ? 8 : size === 'medium' ? 12 : 16;

  return (
    <View style={styles.groupContainer} accessible={true} accessibilityLabel={accessibilityLabel || `Group of ${avatars.length} users`}>
      {displayAvatars.map((avatar, index) => (
        <View
          key={index}
          style={[
            styles.groupAvatar,
            {
              marginLeft: index > 0 ? -overlap : 0,
              zIndex: displayAvatars.length - index,
            },
          ]}
        >
          <Avatar source={avatar.source} initials={avatar.initials} size={size} />
        </View>
      ))}

      {remainingCount > 0 && (
        <View style={[styles.groupAvatar, { marginLeft: -overlap, zIndex: 0 }]}>
          <View
            style={[
              styles.fallback,
              {
                width: avatarSize,
                height: avatarSize,
                borderRadius: avatarSize / 2,
                backgroundColor: primaryColor,
              },
            ]}
          >
            <ThemedText
              style={[
                styles.initials,
                {
                  fontSize: size === 'small' ? 12 : size === 'medium' ? 16 : 20,
                  color: backgroundColor,
                },
              ]}
            >
              +{remainingCount}
            </ThemedText>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    // Dynamic styles applied inline
  },
  fallback: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontWeight: '600',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  groupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupAvatar: {
    // Dynamic styles applied inline
  },
});
