/**
 * Forest Theme (Green)
 * Nature-inspired green theme with earthy tones
 */

import type { Theme } from './base-theme';

export const forestTheme: Theme = {
  name: 'forest',
  displayName: 'Forest',
  icon: '🌲',
  light: {
    // Design System Tokens - Forest Theme
    bg: '#F0FDF4', // Light mint background
    'bg-elevated': '#FFFFFF',
    surface: '#FFFFFF',
    'surface-variant': '#DCFCE7',
    text: '#14532D',
    'text-muted': '#15803D',
    'inverse-text': '#F0FDF4',
    primary: '#14532D', // Dark green for WCAG AA compliance (contrast: 7.59:1 with white)
    'on-primary': '#FFFFFF',
    border: '#16A34A', // Darker green for 3:1 contrast
    'border-strong': '#15803D',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#DC2626',
    info: '#16A34A',
    shadow: '#000000',

    // Legacy/Compatibility Aliases
    background: '#FFFFFF',
    tint: '#16A34A',
    icon: '#15803D',
    tabIconDefault: '#15803D',
    tabIconSelected: '#16A34A',
  },
  dark: {
    // Design System Tokens - Forest Dark Theme
    bg: '#052e16', // Deep forest green
    'bg-elevated': '#14532d',
    surface: '#166534',
    'surface-variant': '#15803d',
    text: '#DCFCE7', // Light green tint, softer than pure white
    'text-muted': '#86EFAC',
    'inverse-text': '#052e16',
    primary: '#4ADE80', // Bright green
    'on-primary': '#052e16',
    border: '#22C55E', // Light green for 3:1 contrast
    'border-strong': '#16A34A',
    success: '#22C55E',
    warning: '#FBBF24',
    error: '#F87171',
    info: '#4ADE80',
    shadow: 'rgba(255, 255, 255, 0.1)', // Lighter shadow for dark mode

    // Legacy/Compatibility Aliases
    background: '#052e16',
    tint: '#4ADE80',
    icon: '#86EFAC',
    tabIconDefault: '#86EFAC',
    tabIconSelected: '#4ADE80',
  },
};
