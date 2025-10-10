/**
 * Feedback category type definitions
 */

import type { Feather } from '@expo/vector-icons';
import type { FeedbackCategory } from './feedback';

export interface CategoryOption {
  id: FeedbackCategory;
  icon: React.ComponentProps<typeof Feather>['name'];
  labelKey: string;
}

export interface CategoryButtonProps {
  category: CategoryOption;
  isSelected: boolean;
  onSelect: (category: FeedbackCategory) => void;
  textColor: string;
  primaryColor: string;
  borderColor: string;
}
