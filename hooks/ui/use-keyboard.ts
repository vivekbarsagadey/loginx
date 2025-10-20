/**
 * Keyboard Hook (React Native)
 *
 * Tracks keyboard visibility and height for React Native applications.
 * Useful for adjusting UI when keyboard appears/disappears.
 *
 * @module hooks/ui/use-keyboard
 */

import { useEffect, useState } from 'react';
import { Keyboard, type KeyboardEvent, Platform } from 'react-native';

/**
 * Keyboard state and metrics
 */
export interface KeyboardState {
  /** Whether the keyboard is currently visible */
  isVisible: boolean;
  /** Current keyboard height in pixels */
  height: number;
  /** Duration of keyboard animation in milliseconds */
  duration: number;
  /** Easing function name for keyboard animation */
  easing: string;
}

/**
 * Tracks React Native keyboard state
 *
 * @returns Object containing keyboard visibility state and height
 *
 * @example
 * // Adjust view when keyboard appears
 * const { isVisible, height } = useKeyboard();
 *
 * <View style={{ paddingBottom: isVisible ? height : 0 }}>
 *   <TextInput placeholder="Type something..." />
 * </View>
 *
 * @example
 * // Show/hide footer based on keyboard
 * const { isVisible } = useKeyboard();
 *
 * <View>
 *   <Content />
 *   {!isVisible && <Footer />}
 * </View>
 *
 * @example
 * // Animated keyboard handling
 * const { isVisible, height, duration } = useKeyboard();
 *
 * useEffect(() => {
 *   Animated.timing(paddingAnim, {
 *     toValue: isVisible ? height : 0,
 *     duration: duration,
 *     useNativeDriver: false,
 *   }).start();
 * }, [isVisible, height, duration]);
 *
 * <Animated.View style={{ paddingBottom: paddingAnim }}>
 *   <Form />
 * </Animated.View>
 *
 * @example
 * // Scroll to input when keyboard appears
 * const { isVisible, height } = useKeyboard();
 * const scrollViewRef = useRef<ScrollView>(null);
 *
 * useEffect(() => {
 *   if (isVisible) {
 *     scrollViewRef.current?.scrollToEnd({ animated: true });
 *   }
 * }, [isVisible]);
 *
 * @example
 * // Dismiss keyboard on scroll
 * const { isVisible } = useKeyboard();
 *
 * <ScrollView
 *   keyboardShouldPersistTaps="handled"
 *   onScroll={() => {
 *     if (isVisible) {
 *       Keyboard.dismiss();
 *     }
 *   }}
 * >
 *   <Content />
 * </ScrollView>
 */
export function useKeyboard(): KeyboardState {
  const [keyboardState, setKeyboardState] = useState<KeyboardState>({
    isVisible: false,
    height: 0,
    duration: 0,
    easing: 'keyboard',
  });

  useEffect(() => {
    // Platform-specific event names
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const handleKeyboardShow = (event: KeyboardEvent) => {
      setKeyboardState({
        isVisible: true,
        height: event.endCoordinates.height,
        duration: event.duration,
        easing: event.easing || 'keyboard',
      });
    };

    const handleKeyboardHide = (event: KeyboardEvent) => {
      setKeyboardState({
        isVisible: false,
        height: 0,
        duration: event.duration,
        easing: event.easing || 'keyboard',
      });
    };

    // Subscribe to keyboard events
    const showSubscription = Keyboard.addListener(showEvent, handleKeyboardShow);
    const hideSubscription = Keyboard.addListener(hideEvent, handleKeyboardHide);

    // Cleanup subscriptions
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return keyboardState;
}

/**
 * Keyboard utility functions
 */
export const KeyboardUtils = {
  /**
   * Programmatically dismiss the keyboard
   */
  dismiss: () => {
    Keyboard.dismiss();
  },

  /**
   * Check if keyboard is currently visible
   * Note: This is a synchronous check, use useKeyboard hook for reactive updates
   */
  isVisible: () => {
    // React Native doesn't provide a synchronous way to check keyboard state
    // Always use the useKeyboard hook for reactive keyboard state
    return false;
  },
};
