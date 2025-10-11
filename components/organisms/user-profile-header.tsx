import { Avatar } from '@/components/atoms/avatar';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { Spacing } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/i18n';
import type React from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View, type ViewStyle } from 'react-native';

interface UserProfileHeaderProps {
  /**
   * URL of the user's avatar image
   */
  avatarUrl?: string;
  /**
   * User's display name
   */
  displayName: string;
  /**
   * User's email address
   */
  email: string;
  /**
   * Optional handler for edit profile action
   */
  onEditPress?: () => void;
  /**
   * Additional information to display below the email
   */
  additionalInfo?: React.ReactNode;
  /**
   * Whether the component is in a loading state
   * @default false
   */
  loading?: boolean;
  /**
   * Optional style overrides
   */
  style?: ViewStyle;
  /**
   * Size of the avatar
   * @default 'lg'
   */
  avatarSize?: 'md' | 'lg' | 'xl';
  /**
   * Elevation of the card
   * @default 1
   */
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
}

/**
 * UserProfileHeader component for displaying user profile information in a card.
 * Commonly used at the top of settings or profile screens.
 *
 * @example
 * <UserProfileHeader
 *   avatarUrl={user.photoURL}
 *   displayName={user.displayName}
 *   email={user.email}
 *   onEditPress={() => navigate('/profile/edit')}
 * />
 */
export function UserProfileHeader({ avatarUrl, displayName, email, onEditPress, additionalInfo, loading = false, style, avatarSize = 'lg', elevation = 1 }: UserProfileHeaderProps) {
  const tintColor = useThemeColor({}, 'primary');
  const textMutedColor = useThemeColor({}, 'text-muted');

  if (loading) {
    return (
      <Card elevation={elevation} style={[styles.container, style]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={tintColor} />
        </View>
      </Card>
    );
  }

  // Generate initials from display name
  const initials = displayName
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <Card elevation={elevation} style={[styles.container, style]}>
      <View style={styles.content}>
        <Avatar uri={avatarUrl} initials={initials} size={avatarSize} />
        <View style={styles.info}>
          <ThemedText type="h2" style={styles.displayName}>
            {displayName}
          </ThemedText>
          <ThemedText type="body" style={[styles.email, { color: textMutedColor }]}>
            {email}
          </ThemedText>
          {additionalInfo && <View style={styles.additionalInfo}>{additionalInfo}</View>}
          {onEditPress && (
            <TouchableOpacity
              onPress={onEditPress}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={styles.editButton}
              accessible
              accessibilityRole="button"
              accessibilityLabel={i18n.t('settings.editProfile')}
              accessibilityHint="Opens the profile editing screen"
            >
              <ThemedText style={[styles.editText, { color: tintColor }]}>{i18n.t('settings.editProfile')} ›</ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  loadingContainer: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  displayName: {
    marginBottom: Spacing.xs,
  },
  email: {
    marginTop: Spacing.xs,
    opacity: 0.8,
  },
  additionalInfo: {
    marginTop: Spacing.sm,
  },
  editButton: {
    marginTop: Spacing.sm,
    alignSelf: 'flex-start',
  },
  editText: {
    fontWeight: '500',
    fontSize: 14,
  },
});
