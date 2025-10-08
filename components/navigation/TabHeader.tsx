import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/ui/data-display/badge';
import { Spacing, TouchTarget } from '@/constants/layout';
import { useNotificationCount } from '@/hooks/use-notification-count';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { usePathname, useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TabHeaderProps {
  title: string;
  showBackButton?: boolean;
}

export function TabHeader({ title, showBackButton = false }: TabHeaderProps) {
  const router = useRouter();
  const _pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { unreadCount } = useNotificationCount();

  const backgroundColor = useThemeColor({}, 'bg');
  const borderColor = useThemeColor({}, 'border');
  const iconColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'primary');

  const handleBack = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleNotifications = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    router.push('/notifications' as any);
  };

  const handleSettings = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/settings');
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor,
      borderBottomWidth: 1,
      borderBottomColor: borderColor,
      paddingTop: insets.top + Spacing.xs,
      paddingBottom: Spacing.sm,
      paddingHorizontal: Spacing.md,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: TouchTarget.large,
    },
    leftSection: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    logo: {
      width: 32,
      height: 32,
      borderRadius: 8,
      marginRight: Spacing.sm,
    },
    titleContainer: {
      flex: 1,
    },
    rightSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
    },
    iconButton: {
      width: TouchTarget.large,
      height: TouchTarget.large,
      borderRadius: TouchTarget.large / 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    backButton: {
      marginRight: Spacing.xs,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.leftSection}>
          {showBackButton ? (
            <Pressable onPress={handleBack} style={[styles.iconButton, styles.backButton]} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} accessibilityRole="button" accessibilityLabel="Go back">
              {({ pressed }) => <Feather name="arrow-left" size={24} color={pressed ? primaryColor : iconColor} />}
            </Pressable>
          ) : (
            <Image source={require('@/assets/images/icon.png')} style={styles.logo} accessibilityLabel="App logo" />
          )}
          <View style={styles.titleContainer}>
            <ThemedText type="h2" numberOfLines={1}>
              {title}
            </ThemedText>
          </View>
        </View>

        <View style={styles.rightSection}>
          <Pressable
            onPress={handleNotifications}
            style={styles.iconButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
          >
            {({ pressed }) => (
              <Badge content={unreadCount} variant="error" size="small" max={99} invisible={unreadCount === 0}>
                <Feather name="bell" size={22} color={pressed ? primaryColor : iconColor} />
              </Badge>
            )}
          </Pressable>

          <Pressable onPress={handleSettings} style={styles.iconButton} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} accessibilityRole="button" accessibilityLabel="Settings">
            {({ pressed }) => <Feather name="settings" size={22} color={pressed ? primaryColor : iconColor} />}
          </Pressable>
        </View>
      </View>
    </View>
  );
}
