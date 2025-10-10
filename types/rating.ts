/**
 * Rating and app review type definitions
 */

export interface OptionButtonProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  primaryColor: string;
  borderColor: string;
  textColor: string;
}
