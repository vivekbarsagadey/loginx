/**
 * Long Press Hook
 *
 * Enhanced long press detection with configurable duration and haptic feedback.
 * Perfect for context menus, item deletion, and interactive gestures.
 *
 * @module hooks/ui/use-long-press
 */

import { useCallback, useRef } from 'react';
import * as Haptics from 'expo-haptics';

/**
 * Configuration options for useLongPress
 */
export interface UseLongPressOptions {
  /**
   * Duration in milliseconds to trigger long press
   * @default 500
   */
  delay?: number;

  /**
   * Callback when long press is triggered
   */
  onLongPress?: () => void;

  /**
   * Callback when press starts
   */
  onPressIn?: () => void;

  /**
   * Callback when press is released (before long press completes)
   */
  onPressOut?: () => void;

  /**
   * Enable haptic feedback on long press
   * @default true
   */
  hapticFeedback?: boolean;

  /**
   * Type of haptic feedback
   * @default 'medium'
   */
  hapticType?: 'light' | 'medium' | 'heavy';

  /**
   * Enable the hook
   * @default true
   */
  enabled?: boolean;
}

/**
 * Return type for useLongPress hook
 */
export interface UseLongPressHandlers {
  /** Handler for press in event */
  onPressIn: () => void;
  /** Handler for press out event */
  onPressOut: () => void;
}

/**
 * Creates handlers for long press detection with haptic feedback
 *
 * @param options - Configuration options
 * @returns Object with onPressIn and onPressOut handlers
 *
 * @example
 * // Basic long press with haptic feedback
 * const longPressHandlers = useLongPress({
 *   onLongPress: () => {
 *     showContextMenu();
 *   },
 *   delay: 500,
 * });
 *
 * <Pressable {...longPressHandlers}>
 *   <Text>Long press me!</Text>
 * </Pressable>
 *
 * @example
 * // Delete item on long press
 * const longPressHandlers = useLongPress({
 *   onLongPress: () => {
 *     Alert.alert(
 *       'Delete Item',
 *       'Are you sure?',
 *       [
 *         { text: 'Cancel', style: 'cancel' },
 *         { text: 'Delete', onPress: () => deleteItem(id), style: 'destructive' }
 *       ]
 *     );
 *   },
 *   delay: 800,
 *   hapticType: 'heavy',
 * });
 *
 * <Pressable {...longPressHandlers}>
 *   <ItemCard item={item} />
 * </Pressable>
 *
 * @example
 * // Custom press feedback
 * const [isPressed, setIsPressed] = useState(false);
 * const longPressHandlers = useLongPress({
 *   onPressIn: () => setIsPressed(true),
 *   onPressOut: () => setIsPressed(false),
 *   onLongPress: () => {
 *     setShowOptions(true);
 *   },
 *   delay: 600,
 * });
 *
 * <Pressable {...longPressHandlers}>
 *   <View style={{ opacity: isPressed ? 0.6 : 1 }}>
 *     <Content />
 *   </View>
 * </Pressable>
 */
export function useLongPress(
  options: UseLongPressOptions = {}
): UseLongPressHandlers {
  const {
    delay = 500,
    onLongPress,
    onPressIn: onPressInCallback,
    onPressOut: onPressOutCallback,
    hapticFeedback = true,
    hapticType = 'medium',
    enabled = true,
  } = options;

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPressRef = useRef(false);

  const triggerHaptic = useCallback(async () => {
    if (!hapticFeedback) {return;}

    try {
      switch (hapticType) {
        case 'light':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'heavy':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case 'medium':
        default:
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
      }
    } catch (error) {
      // Haptics not available on this device
    }
  }, [hapticFeedback, hapticType]);

  const handlePressIn = useCallback(() => {
    if (!enabled) {return;}

    isLongPressRef.current = false;
    onPressInCallback?.();

    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Start long press timer
    timerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      triggerHaptic();
      onLongPress?.();
    }, delay);
  }, [enabled, delay, onLongPress, onPressInCallback, triggerHaptic]);

  const handlePressOut = useCallback(() => {
    if (!enabled) {return;}

    // Clear timer if press is released before long press completes
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Only call onPressOut if it wasn't a long press
    if (!isLongPressRef.current) {
      onPressOutCallback?.();
    }

    isLongPressRef.current = false;
  }, [enabled, onPressOutCallback]);

  return {
    onPressIn: handlePressIn,
    onPressOut: handlePressOut,
  };
}
