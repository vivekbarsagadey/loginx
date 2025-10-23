import { AnimationDurations } from '@/constants/animation';
import { BorderRadius, Spacing } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { memo, type ReactNode } from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { ThemedText } from '../themed-text';

export interface SwipeAction {
  /**
   * Action icon (Ionicons name)
   */
  icon: keyof typeof Ionicons.glyphMap;
  /**
   * Action label
   */
  label: string;
  /**
   * Action background color (hex)
   */
  backgroundColor: string;
  /**
   * Action handler
   */
  onPress: () => void;
  /**
   * Whether this is a destructive action
   */
  destructive?: boolean;
}

export interface SwipeableRowProps {
  /**
   * Row content
   */
  children: ReactNode;
  /**
   * Left swipe actions
   */
  leftActions?: SwipeAction[];
  /**
   * Right swipe actions
   */
  rightActions?: SwipeAction[];
  /**
   * Threshold distance (in pixels) to trigger action
   * @default 80
   */
  swipeThreshold?: number;
  /**
   * Whether to enable haptic feedback
   * @default true
   */
  enableHaptics?: boolean;
  /**
   * Container style override
   */
  style?: ViewStyle;
}

/**
 * SwipeableRow Component
 * 
 * List item with swipeable actions on left and right sides.
 * Commonly used for delete, archive, favorite, and other quick actions.
 * 
 * @example Delete action on right swipe
 * ```tsx
 * <SwipeableRow
 *   rightActions={[
 *     {
 *       icon: 'trash',
 *       label: 'Delete',
 *       backgroundColor: '#FF3B30',
 *       onPress: () => handleDelete(item.id),
 *       destructive: true,
 *     },
 *   ]}
 * >
 *   <ItemCard item={item} />
 * </SwipeableRow>
 * ```
 * 
 * @example Multiple actions
 * ```tsx
 * <SwipeableRow
 *   leftActions={[
 *     {
 *       icon: 'heart',
 *       label: 'Favorite',
 *       backgroundColor: '#FF9500',
 *       onPress: () => toggleFavorite(item.id),
 *     },
 *   ]}
 *   rightActions={[
 *     {
 *       icon: 'archive',
 *       label: 'Archive',
 *       backgroundColor: '#5856D6',
 *       onPress: () => handleArchive(item.id),
 *     },
 *     {
 *       icon: 'trash',
 *       label: 'Delete',
 *       backgroundColor: '#FF3B30',
 *       onPress: () => handleDelete(item.id),
 *       destructive: true,
 *     },
 *   ]}
 * >
 *   <ItemCard item={item} />
 * </SwipeableRow>
 * ```
 */
function SwipeableRowComponent({
  children,
  leftActions = [],
  rightActions = [],
  swipeThreshold = 80,
  enableHaptics = true,
  style,
}: SwipeableRowProps) {
  const translateX = useSharedValue(0);
  const hasTriggeredHaptic = useSharedValue(false);

  const triggerHaptic = () => {
    if (enableHaptics && !hasTriggeredHaptic.value) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      hasTriggeredHaptic.value = true;
    }
  };

  const resetHaptic = () => {
    hasTriggeredHaptic.value = false;
  };

  const executeAction = (action: SwipeAction) => {
    if (enableHaptics && action.destructive) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
    action.onPress();
  };

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const translation = event.translationX;
      
      // Limit swipe distance based on available actions
      const maxLeft = leftActions.length > 0 ? swipeThreshold * leftActions.length : 0;
      const maxRight = rightActions.length > 0 ? swipeThreshold * rightActions.length : 0;

      if (translation > 0 && leftActions.length === 0) {
        // No left actions, prevent swipe
        translateX.value = 0;
      } else if (translation < 0 && rightActions.length === 0) {
        // No right actions, prevent swipe
        translateX.value = 0;
      } else {
        // Allow swipe with limits
        translateX.value = Math.max(
          -maxRight,
          Math.min(maxLeft, translation)
        );

        // Trigger haptic at threshold
        const absTranslation = Math.abs(translation);
        if (absTranslation >= swipeThreshold) {
          runOnJS(triggerHaptic)();
        } else {
          runOnJS(resetHaptic)();
        }
      }
    })
    .onEnd((event) => {
      const translation = event.translationX;
      const absTranslation = Math.abs(translation);

      // Check if threshold reached
      if (absTranslation >= swipeThreshold) {
        // Snap to action position
        if (translation > 0 && leftActions.length > 0) {
          translateX.value = withSpring(swipeThreshold);
        } else if (translation < 0 && rightActions.length > 0) {
          translateX.value = withSpring(-swipeThreshold);
        }
      } else {
        // Reset to center
        translateX.value = withSpring(0);
      }

      runOnJS(resetHaptic)();
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleActionPress = (action: SwipeAction) => {
    // Close swipe with animation
    translateX.value = withTiming(0, { duration: AnimationDurations.QUICK });
    executeAction(action);
  };

  const closeSwipe = () => {
    translateX.value = withSpring(0);
  };

  return (
    <View style={[styles.container, style]}>
      {/* Left Actions */}
      {leftActions.length > 0 && (
        <View style={styles.actionsContainer}>
          {leftActions.map((action, index) => (
            <Pressable
              key={index}
              onPress={() => handleActionPress(action)}
              style={[
                styles.action,
                { backgroundColor: action.backgroundColor },
              ]}
              accessibilityRole="button"
              accessibilityLabel={action.label}
            >
              <Ionicons name={action.icon} size={24} color="#FFFFFF" />
              <ThemedText type="caption" style={styles.actionLabel}>
                {action.label}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      )}

      {/* Right Actions */}
      {rightActions.length > 0 && (
        <View style={[styles.actionsContainer, styles.rightActions]}>
          {rightActions.map((action, index) => (
            <Pressable
              key={index}
              onPress={() => handleActionPress(action)}
              style={[
                styles.action,
                { backgroundColor: action.backgroundColor },
              ]}
              accessibilityRole="button"
              accessibilityLabel={action.label}
            >
              <Ionicons name={action.icon} size={24} color="#FFFFFF" />
              <ThemedText type="caption" style={styles.actionLabel}>
                {action.label}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      )}

      {/* Swipeable Content */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.content, animatedStyle]}>
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

export const SwipeableRow = memo(SwipeableRowComponent);

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  actionsContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    flexDirection: 'row',
  },
  rightActions: {
    right: 0,
    left: 'auto',
  },
  action: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    minWidth: 80,
  },
  actionLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: Spacing.xs,
  },
  content: {
    backgroundColor: 'transparent',
  },
});
