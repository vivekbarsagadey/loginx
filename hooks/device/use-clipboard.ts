import * as Clipboard from 'expo-clipboard';
import { useCallback, useState } from 'react';

/**
 * Clipboard options
 */
export interface ClipboardOptions {
  /** Success message to show */
  successMessage?: string;
  /** Error message to show */
  errorMessage?: string;
  /** Callback on successful copy */
  onSuccess?: (text: string) => void;
  /** Callback on copy error */
  onError?: (_error: Error) => void;
  /** Automatically clear copied state after this duration (ms) */
  clearAfter?: number;
}

/**
 * Return type for useClipboard hook
 */
export interface UseClipboardReturn {
  /** Copy text to clipboard */
  copy: (text: string, options?: ClipboardOptions) => Promise<boolean>;
  /** Get current clipboard content */
  paste: () => Promise<string | null>;
  /** Check if clipboard is supported */
  isSupported: boolean;
  /** Text that was last copied (or null) */
  copiedText: string | null;
  /** Whether copy operation is in progress */
  isCopying: boolean;
  /** Error from last operation */
  error: Error | null;
}

/**
 * Hook for copy-to-clipboard functionality
 *
 * @example
 * ```typescript
 * const { copy, paste, copiedText, isSupported } = useClipboard();
 *
 * // Copy text
 * const handleCopy = async () => {
 *   const success = await copy('Hello, World!', {
 *     successMessage: 'Copied to clipboard!',
 *     onSuccess: (text) => console.error('Copied:', text),
 *   });
 * };
 *
 * // Paste text
 * const handlePaste = async () => {
 *   const text = await paste();
 *   if (text) {
 *     console.error('Pasted:', text);
 *   }
 * };
 *
 * // Auto-clear copied state after 2 seconds
 * await copy('Temporary text', { clearAfter: 2000 });
 *
 * // Check if clipboard is supported
 * if (isSupported) {
 *   // Clipboard operations available
 * }
 * ```
 *
 * @returns Object with clipboard functions and state
 */
export function useClipboard(): UseClipboardReturn {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isCopying, setIsCopying] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Check if clipboard is supported
  const isSupported = true; // expo-clipboard is always available in React Native

  /**
   * Copy text to clipboard
   */
  const copy = useCallback(async (text: string, options: ClipboardOptions = {}): Promise<boolean> => {
    const { onSuccess, onError, clearAfter } = options;

    setIsCopying(true);
    setError(null);

    try {
      await Clipboard.setStringAsync(text);

      setCopiedText(text);

      if (onSuccess) {
        onSuccess(text);
      }

      // Auto-clear copied state after specified duration
      if (clearAfter && clearAfter > 0) {
        setTimeout(() => {
          setCopiedText(null);
        }, clearAfter);
      }

      setIsCopying(false);
      return true;
    } catch (_error) {
      const errorObj = _error instanceof Error ? _error : new Error('Failed to copy to clipboard');
      setError(_errorObj);

      if (onError) {
        onError(_errorObj);
      }

      setIsCopying(false);
      return false;
    }
  }, []);

  /**
   * Get current clipboard content
   */
  const paste = useCallback(async (): Promise<string | null> => {
    setError(null);

    try {
      const hasString = await Clipboard.hasStringAsync();

      if (!hasString) {
        return null;
      }

      const text = await Clipboard.getStringAsync();
      return text || null;
    } catch (_error) {
      const errorObj = _error instanceof Error ? _error : new Error('Failed to read from clipboard');
      setError(_errorObj);
      return null;
    }
  }, []);

  return {
    copy,
    paste,
    isSupported,
    copiedText,
    isCopying,
    error,
  };
}
