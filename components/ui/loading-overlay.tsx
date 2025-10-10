import { ThemedText } from '@/components/themed-text';
import { Overlay, Spacing } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

export interface LoadingOverlayProps {
  /** Whether the loading overlay is visible */
  visible: boolean;
  /** Optional loading message */
  message?: string;
  /** Whether overlay is transparent (shows content behind) */
  transparent?: boolean;
}

/**
 * Loading Overlay Component
 * Full-screen loading indicator with optional message
 */
export function LoadingOverlay({ visible, message, transparent = false }: LoadingOverlayProps) {
  const backgroundColor = useThemeColor({}, 'surface');
  const overlayColor = `rgba(0, 0, 0, ${Overlay.dark})`;
  const textColor = useThemeColor({}, 'text');
  const primaryColor = useThemeColor({}, 'primary');

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        overlay: {
          flex: 1,
          backgroundColor: transparent ? overlayColor : backgroundColor,
          justifyContent: 'center',
          alignItems: 'center',
        },
        content: {
          alignItems: 'center',
          gap: Spacing.lg,
        },
        message: {
          color: textColor,
          textAlign: 'center',
          lineHeight: 22,
          paddingHorizontal: Spacing.lg,
        },
      }),
    [backgroundColor, overlayColor, textColor, transparent]
  );

  if (!visible) {
    return null;
  }

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <Animated.View style={styles.overlay} entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)}>
        <View style={styles.content}>
          <ActivityIndicator size="large" color={primaryColor} />
          {message && (
            <ThemedText type="body" style={styles.message}>
              {message}
            </ThemedText>
          )}
        </View>
      </Animated.View>
    </Modal>
  );
}

/**
 * Hook to manage loading overlay state
 */
export function useLoadingOverlay() {
  const [visible, setVisible] = React.useState(false);
  const [message, setMessage] = React.useState<string | undefined>(undefined);

  const show = React.useCallback((loadingMessage?: string) => {
    setMessage(loadingMessage);
    setVisible(true);
  }, []);

  const hide = React.useCallback(() => {
    setVisible(false);
    setTimeout(() => setMessage(undefined), 300);
  }, []);

  return {
    visible,
    message,
    show,
    hide,
  };
}
