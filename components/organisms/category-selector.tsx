import { SelectableButton } from '@/components/ui/selectable-button';
import { Spacing } from '@/constants/layout';
import type { Feather } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';

export interface Category {
  id: string;
  labelKey: string;
  icon: ComponentProps<typeof Feather>['name'];
}

interface CategorySelectorProps {
  /**
   * Array of categories to display
   */
  categories: Category[];
  /**
   * Currently selected category ID
   */
  selectedCategory: string;
  /**
   * Handler for category selection
   */
  onSelectCategory: (id: string) => void;
  /**
   * Whether the selector is disabled
   * @default false
   */
  disabled?: boolean;
  /**
   * Optional style overrides
   */
  style?: ViewStyle;
  /**
   * Number of columns in the grid
   * @default 2
   */
  columns?: number;
}

/**
 * CategorySelector component for displaying a grid of selectable categories.
 * Commonly used in feedback forms, filtering, and categorization screens.
 *
 * @example
 * <CategorySelector
 *   categories={[
 *     { id: 'bug', labelKey: 'feedback.categories.bug', icon: 'alert-circle' },
 *     { id: 'feature', labelKey: 'feedback.categories.feature', icon: 'star' },
 *   ]}
 *   selectedCategory="bug"
 *   onSelectCategory={(id) => setCategory(id)}
 * />
 */
export function CategorySelector({ categories, selectedCategory, onSelectCategory, disabled: _disabled = false, style, columns = 2 }: CategorySelectorProps) {
  const buttonWidth = `${Math.floor(100 / columns) - 2}%`;

  return (
    <View style={[styles.container, style]}>
      {categories.map((category) => (
        <SelectableButton
          key={category.id}
          label={category.labelKey}
          icon={category.icon}
          isSelected={selectedCategory === category.id}
          onPress={() => onSelectCategory(category.id)}
          variant="default"
          style={[styles.button, { width: buttonWidth }]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  button: {
    flex: 1,
    minWidth: '47%',
  },
});
