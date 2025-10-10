/**
 * Help and support type definitions
 */

import type { Feather } from '@expo/vector-icons';

export interface QuickActionProps {
  icon: React.ComponentProps<typeof Feather>['name'];
  titleKey: string;
  descriptionKey: string;
  onPress: () => void;
  borderColor: string;
  textColor: string;
  textMutedColor: string;
}
