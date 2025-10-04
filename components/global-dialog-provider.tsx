/**
 * Global Dialog Provider
 * Provides global error and success dialog handling for the entire app
 */

import { ThemedAlert } from '@/components/ui/dialog';
import { useDialog } from '@/hooks/use-dialog';
import i18n from '@/i18n';
import { setGlobalErrorHandler } from '@/utils/error';
import { setGlobalSuccessHandler } from '@/utils/success';
import React, { PropsWithChildren, useCallback, useEffect, useState } from 'react';

interface DialogConfig {
  title: string;
  message: string;
  variant: 'default' | 'success' | 'warning' | 'error';
  onOk?: () => void;
}

export function GlobalDialogProvider({ children }: PropsWithChildren) {
  const dialog = useDialog();
  const [config, setConfig] = useState<DialogConfig>({
    title: '',
    message: '',
    variant: 'default',
  });

  const showErrorDialog = useCallback(
    (title: string, message: string) => {
      setConfig({ title, message, variant: 'error' });
      dialog.show();
    },
    [dialog]
  );

  const showSuccessDialog = useCallback(
    (title: string, message: string, onOk?: () => void) => {
      setConfig({ title, message, variant: 'success', onOk });
      dialog.show();
    },
    [dialog]
  );

  const handleClose = useCallback(() => {
    const callback = config.onOk;
    dialog.hide();
    if (callback) {
      callback();
    }
  }, [dialog, config]);

  useEffect(() => {
    // Register global handlers
    setGlobalErrorHandler(showErrorDialog);
    setGlobalSuccessHandler(showSuccessDialog);

    // Cleanup
    return () => {
      setGlobalErrorHandler(() => {});
      setGlobalSuccessHandler(() => {});
    };
  }, [showErrorDialog, showSuccessDialog]);

  return (
    <>
      {children}
      <ThemedAlert visible={dialog.visible} onClose={handleClose} title={config.title} message={config.message} variant={config.variant} buttonText={i18n.t('dialogs.buttons.ok')} />
    </>
  );
}
