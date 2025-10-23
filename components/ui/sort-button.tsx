import { BorderRadius, Spacing } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import React, { memo, useState } from 'react';
import { Modal, Pressable, StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';

export interface SortOption {
  /**
   * Option value/key
   */
  value: string;
  /**
   * Display label
   */
  label: string;
  /**
   * Optional icon
   */
  icon?: keyof typeof Ionicons.glyphMap;
}

export interface SortButtonProps {
  /**
   * Current selected sort option value
   */
  selectedValue: string;
  /**
   * Available sort options
   */
  options: SortOption[];
  /**
   * Callback when sort option changes
   */
  onChange: (value: string) => void;
  /**
   * Button label text (e.g., "Sort by")
   */
  label?: string;
  /**
   * Container style override
   */
  style?: ViewStyle;
  /**
   * Whether the button is disabled
   */
  disabled?: boolean;
}

/**
 * SortButton Component
 * 
 * Dropdown button for sorting options.
 * Displays a modal with sort options when pressed.
 * 
 * @example
 * ```tsx
 * <SortButton
 *   selectedValue={sortBy}
 *   options={[
 *     { value: 'recent', label: 'Most Recent', icon: 'time-outline' },
 *     { value: 'alphabetical', label: 'A-Z', icon: 'text-outline' },
 *     { value: 'status', label: 'Status', icon: 'checkmark-circle-outline' },
 *   ]}
 *   onChange={(value) => setSortBy(value)}
 *   label="Sort by"
 * />
 * ```
 */
function SortButtonComponent({
  selectedValue,
  options,
  onChange,
  label = 'Sort',
  style,
  disabled = false,
}: SortButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const primaryColor = useThemeColor({}, 'primary');
  const surfaceColor = useThemeColor({}, 'surface');
  const textColor = useThemeColor({}, 'text');
  const mutedTextColor = useThemeColor({}, 'text-muted');
  const borderColor = useThemeColor({}, 'border');
  const overlayColor = useThemeColor({}, 'overlay');

  const selectedOption = options.find((opt) => opt.value === selectedValue);

  const handleOpen = () => {
    if (!disabled) {
      setIsOpen(true);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSelect = (value: string) => {
    onChange(value);
    handleClose();
  };

  return (
    <>
      <Pressable
        onPress={handleOpen}
        disabled={disabled}
        style={[
          styles.button,
          {
            backgroundColor: surfaceColor,
            borderColor,
            opacity: disabled ? 0.5 : 1,
          },
          style,
        ]}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${selectedOption?.label}`}
        accessibilityHint="Opens sort options menu"
      >
        <ThemedText type="body" style={[styles.buttonText, { color: mutedTextColor }]}>
          {label}:
        </ThemedText>
        <ThemedText type="body" style={[styles.selectedText, { color: textColor }]}>
          {selectedOption?.label || 'Select'}
        </ThemedText>
        <Ionicons name="chevron-down" size={20} color={mutedTextColor} />
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="none"
        onRequestClose={handleClose}
        statusBarTranslucent
      >
        <Pressable style={styles.modalOverlay} onPress={handleClose}>
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            style={[styles.modalBackground, { backgroundColor: overlayColor }]}
          />
        </Pressable>

        <View style={styles.modalContent} pointerEvents="box-none">
          <Animated.View
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
          >
            <ThemedView
              style={[
                styles.menu,
                {
                  backgroundColor: surfaceColor,
                  borderColor,
                },
              ]}
            >
              <View style={styles.menuHeader}>
                <ThemedText type="heading" style={{ color: textColor }}>
                  {label}
                </ThemedText>
                <Pressable
                  onPress={handleClose}
                  accessibilityRole="button"
                  accessibilityLabel="Close"
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="close" size={24} color={textColor} />
                </Pressable>
              </View>

              {options.map((option) => {
                const isSelected = option.value === selectedValue;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => handleSelect(option.value)}
                    style={[
                      styles.menuItem,
                      {
                        backgroundColor: isSelected
                          ? `${primaryColor}15`
                          : 'transparent',
                      },
                    ]}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                    accessibilityLabel={option.label}
                  >
                    {option.icon && (
                      <Ionicons
                        name={option.icon}
                        size={20}
                        color={isSelected ? primaryColor : mutedTextColor}
                      />
                    )}
                    <ThemedText
                      type="body"
                      style={[
                        styles.menuItemText,
                        { color: isSelected ? primaryColor : textColor },
                      ]}
                    >
                      {option.label}
                    </ThemedText>
                    {isSelected && (
                      <Ionicons
                        name="checkmark"
                        size={20}
                        color={primaryColor}
                        style={styles.checkmark}
                      />
                    )}
                  </Pressable>
                );
              })}
            </ThemedView>
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

export const SortButton = memo(SortButtonComponent);

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  buttonText: {
    fontSize: 14,
  },
  selectedText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
  },
  modalBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  menu: {
    width: '100%',
    maxWidth: 400,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#00000010',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
  },
  checkmark: {
    marginLeft: 'auto',
  },
});
