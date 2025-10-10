/**
 * Auto-focus hook for text inputs
 * Automatically focuses a TextInput after component mounts
 */

import { RefObject, useEffect } from 'react';
import { TextInput } from 'react-native';

/**
 * Auto-focus a text input after component mounts
 * @param ref - TextInput ref to focus
 * @param delay - Delay before focusing in milliseconds (default 100ms)
 * @param enabled - Whether to enable auto-focus (default true)
 *
 * @example
 * const inputRef = useRef<TextInput>(null);
 * useAutoFocus(inputRef);
 *
 * @example With custom delay
 * const inputRef = useRef<TextInput>(null);
 * useAutoFocus(inputRef, 200);
 *
 * @example Conditional focus
 * const inputRef = useRef<TextInput>(null);
 * useAutoFocus(inputRef, 100, shouldFocus);
 */
export function useAutoFocus(ref: RefObject<TextInput | null>, delay: number = 100, enabled: boolean = true): void {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const timer = setTimeout(() => {
      ref.current?.focus();
    }, delay);

    return () => clearTimeout(timer);
  }, [ref, delay, enabled]);
}
