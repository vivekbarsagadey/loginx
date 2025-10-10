/**
 * Issue reporting type definitions
 */

import type { Feather } from '@expo/vector-icons';
import type { IssueType } from './feedback';

export interface IssueOption {
  id: IssueType;
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
  description: string;
}

export interface IssueTypeButtonProps {
  option: IssueOption;
  isSelected: boolean;
  onSelect: (issueType: IssueType) => void;
  textColor: string;
  primaryColor: string;
  borderColor: string;
}
