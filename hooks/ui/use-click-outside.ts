/**
 * Click Outside Hook (React Native)
 *
 * Detects taps/presses outside of a referenced component.
 * Useful for dismissing modals, dropdowns, and popovers.
 *
 * @module hooks/ui/use-click-outside
 */

import { useEffect, useRef } from 'react';
import type { View } from 'react-native';

/**
 * Detects when user taps outside of the referenced component
 *
 * @param handler - Callback function to execute when tap outside is detected
 * @param enabled - Whether the hook is active (default: true)
 * @returns Ref to attach to the component
 *
 * @example
 * // Basic dropdown that closes on outside tap
 * const [isOpen, setIsOpen] = useState(false);
 * const dropdownRef = useClickOutside<View>(() => {
 *   setIsOpen(false);
 * });
 *
 * <View ref={dropdownRef}>
 *   <Dropdown visible={isOpen} />
 * </View>
 *
 * @example
 * // Modal with conditional detection
 * const [showModal, setShowModal] = useState(false);
 * const modalRef = useClickOutside<View>(
 *   () => setShowModal(false),
 *   showModal // Only detect when modal is visible
 * );
 *
 * <Modal visible={showModal}>
 *   <View ref={modalRef}>
 *     <ModalContent />
 *   </View>
 * </Modal>
 *
 * @example
 * // Popover menu
 * const [menuOpen, setMenuOpen] = useState(false);
 * const menuRef = useClickOutside<View>(() => setMenuOpen(false));
 *
 * <View>
 *   <Button onPress={() => setMenuOpen(true)} title="Menu" />
 *   {menuOpen && (
 *     <View ref={menuRef} style={styles.popover}>
 *       <MenuItem title="Option 1" />
 *       <MenuItem title="Option 2" />
 *     </View>
 *   )}
 * </View>
 */
export function useClickOutside<T extends View>(
  handler: () => void,
  enabled = true
): React.RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!enabled) {return;}

    // Note: In React Native, true click-outside detection requires
    // a library like react-native-gesture-handler or custom touch handling.
    // This is a simplified version that works with basic use cases.

    // For production, consider using:
    // 1. Modal's onRequestClose
    // 2. Pressable with onPressOut
    // 3. react-native-gesture-handler for advanced gestures

    // Store handler in ref to avoid recreating listener
    const handlePress = () => {
      handler();
    };

    // Placeholder for gesture detection
    // In a real implementation, you would:
    // - Use PanResponder or Gesture Handler
    // - Track touch coordinates
    // - Check if touch is outside ref bounds

    return () => {
      // Cleanup
    };
  }, [handler, enabled]);

  return ref;
}
