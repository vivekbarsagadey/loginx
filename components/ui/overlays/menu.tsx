import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Overlay, Spacing } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';

export interface MenuItem {
  /** Menu item label */
  label: string;
  /** Menu item value/key */
  value: string;
  /** Optional icon */
  icon?: React.ReactNode;
  /** Disabled state */
  disabled?: boolean;
  /** Is this a divider */
  divider?: boolean;
}

export interface MenuProps {
  /** Array of menu items */
  items: MenuItem[];
  /** Menu visibility */
  visible: boolean;
  /** Called when item is selected */
  onSelect: (value: string) => void;
  /** Called when menu should close */
  onClose: () => void;
  /** Trigger element (renders above menu) */
  trigger?: React.ReactNode;
  /** Accessibility label */
  accessibilityLabel?: string;
}

export function Menu({ items, visible, onSelect, onClose, trigger, accessibilityLabel }: MenuProps) {
  const surfaceColor = useThemeColor({}, 'surface');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  const primaryColor = useThemeColor({}, 'primary');
  const shadowColor = useThemeColor({}, 'shadow');

  return (
    <View>
      {trigger}
      <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} accessible={true} accessibilityLabel={accessibilityLabel || 'Menu'}>
        <Pressable style={styles.backdrop} onPress={onClose}>
          <View style={styles.menuContainer} onStartShouldSetResponder={() => true}>
            <View
              style={[
                styles.menu,
                {
                  backgroundColor: surfaceColor,
                  borderColor,
                  shadowColor,
                },
              ]}
            >
              <ScrollView style={styles.scrollView}>
                {items.map((item, index) => {
                  if (item.divider) {
                    return <View key={`divider-${index}`} style={[styles.divider, { backgroundColor: borderColor }]} />;
                  }

                  return (
                    <Pressable
                      key={item.value}
                      onPress={() => {
                        if (!item.disabled) {
                          onSelect(item.value);
                          onClose();
                        }
                      }}
                      disabled={item.disabled}
                      style={({ pressed }) => [
                        styles.item,
                        {
                          backgroundColor: pressed ? primaryColor + '10' : 'transparent',
                          opacity: item.disabled ? 0.4 : 1,
                        },
                      ]}
                      accessible={true}
                      accessibilityRole="menuitem"
                      accessibilityState={{ disabled: item.disabled }}
                      accessibilityLabel={item.label}
                    >
                      {item.icon && <View style={styles.icon}>{item.icon}</View>}
                      <ThemedText style={[styles.label, { color: textColor }]}>{item.label}</ThemedText>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: `rgba(0, 0, 0, ${Overlay.medium})`,
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  divider: {
    height: 1,
    marginVertical: Spacing.xs,
  },
  icon: {
    marginRight: Spacing.sm,
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 48,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  label: {
    flex: 1,
  },
  menu: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    maxHeight: 400,
    minWidth: 200,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  menuContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    maxHeight: 400,
  },
});
