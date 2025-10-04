import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

export interface TooltipProps {
  /** Tooltip content */
  content: string;
  /** Trigger element */
  children: React.ReactNode;
  /** Position relative to trigger */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** Show delay in ms */
  delay?: number;
  /** Accessibility label */
  accessibilityLabel?: string;
}

export function Tooltip({ content, children, position = 'top', delay = 500, accessibilityLabel }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const surfaceColor = useThemeColor({}, 'surface');
  const textColor = useThemeColor({}, 'text');

  let timeout: ReturnType<typeof setTimeout>;

  const showTooltip = () => {
    timeout = setTimeout(() => {
      setVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    clearTimeout(timeout);
    setVisible(false);
  };

  return (
    <View>
      <Pressable onPressIn={showTooltip} onPressOut={hideTooltip} accessible={true} accessibilityLabel={accessibilityLabel} accessibilityHint={content}>
        {children}
      </Pressable>

      {visible && (
        <View style={[styles.tooltip, { backgroundColor: surfaceColor }, styles[position]]}>
          <ThemedText type="caption" style={[styles.text, { color: textColor }]}>
            {content}
          </ThemedText>
        </View>
      )}
    </View>
  );
}

/**
 * Popover - Similar to Tooltip but with more content
 */
export interface PopoverProps {
  /** Popover content */
  children: React.ReactNode;
  /** Trigger element */
  trigger: React.ReactNode;
  /** Popover visibility */
  visible: boolean;
  /** Called when popover should close */
  onClose: () => void;
  /** Position relative to trigger */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** Accessibility label */
  accessibilityLabel?: string;
}

export function Popover({ children, trigger, visible, onClose, position = 'bottom', accessibilityLabel }: PopoverProps) {
  const surfaceColor = useThemeColor({}, 'surface');
  const borderColor = useThemeColor({}, 'border');

  return (
    <View>
      {trigger}
      <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} accessible={true} accessibilityLabel={accessibilityLabel || 'Popover'}>
        <Pressable style={styles.backdrop} onPress={onClose}>
          <View
            style={[
              styles.popover,
              {
                backgroundColor: surfaceColor,
                borderColor,
              },
              styles[`popover-${position}`],
            ]}
            onStartShouldSetResponder={() => true}
          >
            {children}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  bottom: {
    bottom: -40,
    left: '50%',
    marginLeft: -75,
  },
  left: {
    left: -160,
    top: '50%',
  },
  popover: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    maxWidth: 300,
    padding: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  'popover-bottom': {
    alignSelf: 'center',
  },
  'popover-left': {
    alignSelf: 'flex-start',
  },
  'popover-right': {
    alignSelf: 'flex-end',
  },
  'popover-top': {
    alignSelf: 'center',
  },
  right: {
    right: -160,
    top: '50%',
  },
  text: {
    textAlign: 'center',
  },
  tooltip: {
    borderRadius: BorderRadius.sm,
    maxWidth: 150,
    padding: Spacing.sm,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 9999,
  },
  top: {
    bottom: '100%',
    left: '50%',
    marginBottom: 8,
    marginLeft: -75,
  },
});
