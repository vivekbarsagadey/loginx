import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Overlay, Spacing } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';

export interface BottomSheetProps {
  /** Bottom sheet visibility */
  visible: boolean;
  /** Called when sheet should close */
  onClose: () => void;
  /** Sheet title */
  title?: string;
  /** Sheet content */
  children: React.ReactNode;
  /** Snap points (percentages of screen height) */
  snapPoints?: number[];
  /** Show drag handle */
  showHandle?: boolean;
  /** Show backdrop */
  showBackdrop?: boolean;
  /** Close on backdrop press */
  closeOnBackdrop?: boolean;
  /** Accessibility label */
  accessibilityLabel?: string;
}

export function BottomSheet({
  visible,
  onClose,
  title,
  children,
  snapPoints: _snapPoints = [50, 90],
  showHandle = true,
  showBackdrop = true,
  closeOnBackdrop = true,
  accessibilityLabel,
}: BottomSheetProps) {
  const surfaceColor = useThemeColor({}, 'surface');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} accessible={true} accessibilityLabel={accessibilityLabel || title || 'Bottom sheet'}>
      {showBackdrop && <Pressable style={styles.backdrop} onPress={closeOnBackdrop ? onClose : undefined} />}
      <View style={styles.container}>
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: surfaceColor,
              borderColor,
            },
          ]}
        >
          {showHandle && (
            <View style={styles.handleContainer}>
              <View style={[styles.handle, { backgroundColor: borderColor }]} />
            </View>
          )}

          {title && (
            <View style={[styles.header, { borderBottomColor: borderColor }]}>
              <ThemedText type="h3" style={[styles.title, { color: textColor }]}>
                {title}
              </ThemedText>
              <Pressable onPress={onClose} style={styles.closeButton} accessible={true} accessibilityRole="button" accessibilityLabel="Close">
                <ThemedText style={[styles.closeText, { color: textColor }]}>✕</ThemedText>
              </Pressable>
            </View>
          )}

          <ScrollView style={styles.content}>{children}</ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: `rgba(0, 0, 0, ${Overlay.medium})`,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  closeButton: {
    padding: Spacing.sm,
  },
  closeText: {
    fontSize: 24,
    lineHeight: 24,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  handle: {
    borderRadius: 2,
    height: 4,
    width: 40,
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  header: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  sheet: {
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    borderTopWidth: 1,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { height: -2, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
  },
  title: {
    flex: 1,
  },
});
