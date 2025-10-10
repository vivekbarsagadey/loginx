/**
 * Feedback categories data and configuration
 */

import type { CategoryOption } from '@/types/feedback-category';

/**
 * Get all available feedback categories
 */
export function getFeedbackCategories(): CategoryOption[] {
  return [
    { id: 'bug', icon: 'alert-circle', labelKey: 'screens.feedback.categories.bug' },
    { id: 'feature', icon: 'zap', labelKey: 'screens.feedback.categories.feature' },
    { id: 'improvement', icon: 'trending-up', labelKey: 'screens.feedback.categories.improvement' },
    { id: 'other', icon: 'message-circle', labelKey: 'screens.feedback.categories.other' },
  ];
}
