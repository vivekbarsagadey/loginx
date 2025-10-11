/**
 * Ocean Theme (Blue-Teal)
 * Cool ocean-inspired colors with cyan and teal accents
 */

import type { Theme } from './base-theme';

export const oceanTheme: Theme = {
  name: 'ocean',
  displayName: 'Ocean',
  icon: '🌊',
  light: {
    // Design System Tokens - Ocean Theme (Blue-Teal)
    bg: '#F0F9FF', // Light blue background
    'bg-elevated': '#FFFFFF',
    surface: '#FFFFFF',
    'surface-variant': '#E0F2FE',
    text: '#0C4A6E',
    'text-muted': '#0369A1',
    'inverse-text': '#F0F9FF',
    primary: '#0A5568', // Dark cyan for WCAG AA compliance (contrast: 6.24:1 with white)
    'on-primary': '#FFFFFF',
    border: '#0891B2', // Dark cyan for 3:1 contrast
    'border-strong': '#0E7490',
    success: '#14B8A6', // Teal
    warning: '#F59E0B',
    error: '#DC2626',
    info: '#0891B2',
    shadow: '#000000',

    // Legacy/Compatibility Aliases
    background: '#FFFFFF',
    tint: '#0891B2',
    icon: '#0369A1',
    tabIconDefault: '#0369A1',
    tabIconSelected: '#0891B2',
  },
  dark: {
    // Design System Tokens - Ocean Dark Theme
    bg: '#082f49', // Deep ocean blue
    'bg-elevated': '#0c4a6e',
    surface: '#075985',
    'surface-variant': '#0369a1',
    text: '#E0F2FE', // Light cyan tint, softer than pure white
    'text-muted': '#7DD3FC',
    'inverse-text': '#082f49',
    primary: '#22D3EE', // Bright cyan
    'on-primary': '#082f49',
    border: '#0891B2', // Light cyan for 3:1 contrast
    'border-strong': '#0E7490',
    success: '#2DD4BF',
    warning: '#FBBF24',
    error: '#F87171',
    info: '#22D3EE',
    shadow: 'rgba(255, 255, 255, 0.1)', // Lighter shadow for dark mode

    // Legacy/Compatibility Aliases
    background: '#082f49',
    tint: '#22D3EE',
    icon: '#7DD3FC',
    tabIconDefault: '#7DD3FC',
    tabIconSelected: '#22D3EE',
  },
};
