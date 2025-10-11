/**
 * Sunset Theme (Warm Orange-Pink)
 * Warm sunset colors with orange and amber accents
 */

import type { Theme } from './base-theme';

export const sunsetTheme: Theme = {
  name: 'sunset',
  displayName: 'Sunset',
  icon: '🌅',
  light: {
    // Design System Tokens - Sunset Theme (Warm Orange-Pink)
    bg: '#FFF7ED', // Warm cream background
    'bg-elevated': '#FFFFFF',
    surface: '#FFFFFF',
    'surface-variant': '#FFEDD5',
    text: '#7C2D12',
    'text-muted': '#C2410C',
    'inverse-text': '#FFF7ED',
    primary: '#991B1B', // Dark red for WCAG AAA compliance (contrast: 7.51:1 with white)
    'on-primary': '#FFFFFF',
    border: '#EA580C', // Darker orange for 3:1 contrast
    'border-strong': '#DC2626',
    success: '#16A34A',
    warning: '#EAB308',
    error: '#DC2626',
    info: '#F97316',
    shadow: '#000000',

    // Legacy/Compatibility Aliases
    background: '#FFFFFF',
    tint: '#F97316',
    icon: '#C2410C',
    tabIconDefault: '#C2410C',
    tabIconSelected: '#F97316',
  },
  dark: {
    // Design System Tokens - Sunset Dark Theme
    bg: '#431407', // Deep burnt orange
    'bg-elevated': '#7c2d12',
    surface: '#9a3412',
    'surface-variant': '#c2410c',
    text: '#FEF3C7', // Warm off-white, softer than pure white
    'text-muted': '#FDBA74',
    'inverse-text': '#431407',
    primary: '#9A3412', // Dark burnt orange for WCAG AAA compliance (7.31:1 with white text)
    'on-primary': '#FFFFFF',
    border: '#C2410C', // Light orange for 3:1 contrast
    'border-strong': '#EA580C',
    success: '#34D399',
    warning: '#FBBF24',
    error: '#FCA5A5',
    info: '#FB923C',
    shadow: 'rgba(255, 255, 255, 0.1)', // Lighter shadow for dark mode

    // Legacy/Compatibility Aliases
    background: '#431407',
    tint: '#FB923C',
    icon: '#FDBA74',
    tabIconDefault: '#FDBA74',
    tabIconSelected: '#FB923C',
  },
};
