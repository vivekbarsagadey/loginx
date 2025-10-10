/**
 * Haptic action hook
 * Wraps actions with haptic feedback
 */

import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';

export type HapticStyle = 'light' | 'medium' | 'heavy';

/**
 * Wraps an action with haptic feedback
 * Provides tactile feedback before executing the action
 *
 * @param action - Action to perform (sync or async)
 * @param style - Haptic feedback style (default: 'light')
 * @returns Wrapped action with haptic feedback
 *
 * @example Basic usage
 * const handlePress = useHapticAction(() => {
 *   router.push('/settings');
 * });
 *
 * @example With medium haptic
 * const handleToggle = useHapticAction(() => {
 *   setEnabled(!enabled);
 * }, 'medium');
 *
 * @example With heavy haptic for destructive actions
 * const handleDelete = useHapticAction(async () => {
 *   await deleteItem();
 * }, 'heavy');
 */
export function useHapticAction<T extends unknown[]>(action: (...args: T) => void | Promise<void>, style: HapticStyle = 'light'): (...args: T) => Promise<void> {
  return useCallback(
    async (...args: T) => {
      try {
        // Provide haptic feedback
        const impactStyle = style === 'light' ? Haptics.ImpactFeedbackStyle.Light : style === 'medium' ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Heavy;

        await Haptics.impactAsync(impactStyle);

        // Execute the action
        await action(...args);
      } catch (error) {
        // Silently fail haptics - not critical
        if (__DEV__) {
          console.warn('[useHapticAction] Haptic feedback failed:', error);
        }
      }
    },
    [action, style]
  );
}
