import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Overlay, Spacing } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';

export interface ModalEnhancedProps {
  /** Modal visibility */
  visible: boolean;
  /** Called when modal should close */
  onClose: () => void;
  /** Modal title */
  title?: string;
  /** Modal content */
  children: React.ReactNode;
  /** Size variant */
  size?: 'small' | 'medium' | 'large' | 'fullscreen';
  /** Show close button */
  showClose?: boolean;
  /** Footer content (usually buttons) */
  footer?: React.ReactNode;
  /** Close on backdrop press */
  closeOnBackdrop?: boolean;
  /** Accessibility label */
  accessibilityLabel?: string;
}

export function ModalEnhanced({ visible, onClose, title, children, size = 'medium', showClose = true, footer, closeOnBackdrop = true, accessibilityLabel }: ModalEnhancedProps) {
  const surfaceColor = useThemeColor({}, 'surface');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  const shadowColor = useThemeColor({}, 'shadow');

  const sizes = {
    fullscreen: '100%' as const,
    large: '90%' as const,
    medium: '70%' as const,
    small: '50%' as const,
  };

  return (
    <Modal visible={visible} transparent={size !== 'fullscreen'} animationType="slide" onRequestClose={onClose} accessible={true} accessibilityLabel={accessibilityLabel || title || 'Modal'}>
      <View style={[styles.backdrop, size === 'fullscreen' && { backgroundColor: surfaceColor }]}>
        <Pressable style={styles.backdropPress} onPress={closeOnBackdrop ? onClose : undefined}>
          <View
            style={[
              styles.modal,
              {
                backgroundColor: surfaceColor,
                borderColor,
                width: sizes[size],
                shadowColor,
              },
              size === 'fullscreen' && styles.fullscreen,
            ]}
            onStartShouldSetResponder={() => true}
          >
            {(title || showClose) && (
              <View style={[styles.header, { borderBottomColor: borderColor }]}>
                {title && (
                  <ThemedText type="h3" style={[styles.title, { color: textColor }]}>
                    {title}
                  </ThemedText>
                )}
                {showClose && (
                  <Pressable onPress={onClose} style={styles.closeButton} accessible={true} accessibilityRole="button" accessibilityLabel="Close modal">
                    <ThemedText style={[styles.closeText, { color: textColor }]}>✕</ThemedText>
                  </Pressable>
                )}
              </View>
            )}

            <ScrollView style={styles.content}>{children}</ScrollView>

            {footer && <View style={[styles.footer, { borderTopColor: borderColor }]}>{footer}</View>}
          </View>
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    alignItems: 'center',
    backgroundColor: `rgba(0, 0, 0, ${Overlay.medium})`,
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  backdropPress: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  closeButton: {
    padding: Spacing.sm,
    minHeight: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 24,
    lineHeight: 24,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  footer: {
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    gap: Spacing.md,
    justifyContent: 'flex-end',
    padding: Spacing.md,
    flexWrap: 'wrap',
  },
  fullscreen: {
    borderRadius: 0,
    borderWidth: 0,
    height: '100%',
  },
  header: {
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.md,
    minHeight: 56,
  },
  modal: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    maxHeight: '90%',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  title: {
    flex: 1,
  },
});
