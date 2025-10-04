import { useCallback, useState } from 'react';

/**
 * Dialog state management hook
 * Simplifies showing/hiding dialogs with data
 */
export function useDialog<T = void>() {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState<T | null>(null);

  const show = useCallback((dialogData?: T) => {
    if (dialogData !== undefined) {
      setData(dialogData as T);
    }
    setVisible(true);
  }, []);

  const hide = useCallback(() => {
    setVisible(false);
    // Clear data after animation completes
    setTimeout(() => setData(null), 300);
  }, []);

  const toggle = useCallback(() => {
    setVisible((prev) => !prev);
  }, []);

  return {
    visible,
    data,
    show,
    hide,
    toggle,
  };
}

/**
 * Confirmation dialog state with result handling
 */
export function useConfirmation() {
  const [visible, setVisible] = useState(false);
  const [config, setConfig] = useState<{
    title: string;
    message: string;
    onConfirm: () => void | Promise<void>;
    onCancel?: () => void;
    destructive?: boolean;
  } | null>(null);

  const show = useCallback((options: { title: string; message: string; onConfirm: () => void | Promise<void>; onCancel?: () => void; destructive?: boolean }) => {
    setConfig(options);
    setVisible(true);
  }, []);

  const hide = useCallback(() => {
    setVisible(false);
    setTimeout(() => setConfig(null), 300);
  }, []);

  return {
    visible,
    config,
    show,
    hide,
  };
}
