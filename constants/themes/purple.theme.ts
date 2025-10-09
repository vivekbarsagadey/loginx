/**
 * Purple Theme (Violet)
 * Royal purple theme with lavender accents
 */

import type { Theme } from './base-theme';

export const purpleTheme: Theme = {
  name: 'purple',
  displayName: 'Purple',
  icon: '💜',
  light: {
    // Design System Tokens - Purple Theme
    bg: '#FAF5FF', // Light lavender background
    'bg-elevated': '#FFFFFF',
    surface: '#FFFFFF',
    'surface-variant': '#F3E8FF',
    text: '#581C87',
    'text-muted': '#7C3AED',
    'inverse-text': '#FAF5FF',
    primary: '#9333EA', // Purple primary
    'on-primary': '#FFFFFF',
    border: '#E9D5FF',
    'border-strong': '#D8B4FE',
    success: '#16A34A',
    warning: '#F59E0B',
    error: '#DC2626',
    info: '#9333EA',

    // Legacy/Compatibility Aliases
    background: '#FFFFFF',
    tint: '#9333EA',
    icon: '#7C3AED',
    tabIconDefault: '#7C3AED',
    tabIconSelected: '#9333EA',
  },
  dark: {
    // Design System Tokens - Purple Dark Theme
    bg: '#2e1065', // Deep purple
    'bg-elevated': '#581c87',
    surface: '#6b21a8',
    'surface-variant': '#7c3aed',
    text: '#F3E8FF',
    'text-muted': '#D8B4FE',
    'inverse-text': '#2e1065',
    primary: '#A855F7', // Bright purple
    'on-primary': '#2e1065',
    border: '#6b21a8',
    'border-strong': '#7c3aed',
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    info: '#A855F7',

    // Legacy/Compatibility Aliases
    background: '#2e1065',
    tint: '#A855F7',
    icon: '#D8B4FE',
    tabIconDefault: '#D8B4FE',
    tabIconSelected: '#A855F7',
  },
};
