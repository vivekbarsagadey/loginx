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
    primary: '#F97316', // Orange primary
    'on-primary': '#FFFFFF',
    border: '#FED7AA',
    'border-strong': '#FDBA74',
    success: '#16A34A',
    warning: '#EAB308',
    error: '#DC2626',
    info: '#F97316',

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
    text: '#FFEDD5',
    'text-muted': '#FDBA74',
    'inverse-text': '#431407',
    primary: '#FB923C', // Soft orange
    'on-primary': '#431407',
    border: '#9a3412',
    'border-strong': '#c2410c',
    success: '#34D399',
    warning: '#FBBF24',
    error: '#FCA5A5',
    info: '#FB923C',

    // Legacy/Compatibility Aliases
    background: '#431407',
    tint: '#FB923C',
    icon: '#FDBA74',
    tabIconDefault: '#FDBA74',
    tabIconSelected: '#FB923C',
  },
};
