/**
 * Alert Replacement Hook
 * Use this hook in components that previously used Alert.alert
 * Provides a simpler API for basic alerts and confirmations
 */

import { ConfirmationDialog, ThemedAlert } from '@/components/ui/dialog';
import React from 'react';
import { useConfirmation, useDialog } from './use-dialog';

interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

/**
 * Hook that mimics Alert.alert but uses themed dialogs
 */
export function useAlert() {
  const alert = useDialog();
  const confirmation = useConfirmation();
  const [alertConfig, setAlertConfig] = React.useState<{
    title: string;
    message: string;
    variant: 'default' | 'success' | 'warning' | 'error';
    onPress?: () => void;
  }>({
    title: '',
    message: '',
    variant: 'default',
  });

  /**
   * Show an alert dialog
   * @param title - Alert title
   * @param message - Alert message
   * @param buttons - Array of buttons (1-2 buttons supported)
   * @param options - Additional options (variant for styling)
   */
  const show = React.useCallback(
    (title: string, message: string, buttons: AlertButton[] = [{ text: 'OK' }], options?: { variant?: 'default' | 'success' | 'warning' | 'error' }) => {
      if (buttons.length === 1) {
        // Single button - use ThemedAlert
        setAlertConfig({
          title,
          message,
          variant: options?.variant || 'default',
          onPress: buttons[0].onPress,
        });
        alert.show();
      } else if (buttons.length === 2) {
        // Two buttons - use ConfirmationDialog
        const cancelButton = buttons.find((b) => b.style === 'cancel') || buttons[0];
        const confirmButton = buttons.find((b) => b.style !== 'cancel') || buttons[1];

        confirmation.show({
          title,
          message,
          destructive: confirmButton.style === 'destructive',
          onConfirm: async () => {
            if (confirmButton.onPress) {
              confirmButton.onPress();
            }
          },
          onCancel: cancelButton.onPress,
        });
      }
    },
    [alert, confirmation]
  );

  const AlertComponent = React.useMemo(() => {
    return (
      <>
        {/* Single button alert */}
        <ThemedAlert
          visible={alert.visible}
          onClose={() => {
            alert.hide();
            if (alertConfig.onPress) {
              alertConfig.onPress();
            }
          }}
          title={alertConfig.title}
          message={alertConfig.message}
          variant={alertConfig.variant}
          buttonText="OK"
        />

        {/* Two button confirmation */}
        {confirmation.config && (
          <ConfirmationDialog
            visible={confirmation.visible}
            onClose={confirmation.hide}
            title={confirmation.config.title}
            message={confirmation.config.message}
            onConfirm={confirmation.config.onConfirm}
            onCancel={confirmation.config.onCancel}
            destructive={confirmation.config.destructive}
          />
        )}
      </>
    );
  }, [alert, alertConfig, confirmation]);

  return {
    show,
    AlertComponent,
  };
}
