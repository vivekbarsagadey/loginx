/**
 * Text Size Types
 * Type definitions for text size preferences
 */

export type TextSizeOption = 'small' | 'default' | 'large' | 'extraLarge';

export interface TextSize {
  key: TextSizeOption;
  title: string;
  multiplier: number;
}
