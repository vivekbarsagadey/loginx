/**
 * Mariner Theme (Professional Blue)
 * Cool, professional theme centered on Mariner Blue (#4C9FC1) with warm coral secondary
 */

import type { Theme } from './base-theme';

export const marinerTheme: Theme = {
  name: 'mariner',
  displayName: 'Mariner',
  icon: '⚓',
  light: {
    // Design System Tokens - Mariner Theme (Professional Blue)
    bg: '#F2F8FB', // Light blue background
    'bg-elevated': '#FFFFFF',
    surface: '#FFFFFF',
    'surface-variant': '#DFF0F7',
    text: '#0B2530',
    'text-muted': '#2B697F',
    'inverse-text': '#F2F8FB',
    primary: '#4C9FC1', // Mariner Blue primary
    'on-primary': '#FFFFFF',
    border: '#BFE0EE',
    'border-strong': '#9FCFE5',
    success: '#39C39A', // Teal accent
    warning: '#F97316',
    error: '#EF4444',
    info: '#3B82F6',

    // Legacy/Compatibility Aliases
    background: '#FFFFFF',
    tint: '#4C9FC1',
    icon: '#2B697F',
    tabIconDefault: '#2B697F',
    tabIconSelected: '#4C9FC1',
  },
  dark: {
    // Design System Tokens - Mariner Dark Theme
    bg: '#0B1220', // Deep navy blue
    'bg-elevated': '#0F172A',
    surface: '#111827',
    'surface-variant': '#1F2937',
    text: '#E5E7EB',
    'text-muted': '#9CA3AF',
    'inverse-text': '#0B1220',
    primary: '#74B8D4', // Lighter Mariner Blue
    'on-primary': '#0B2530',
    border: '#1F2A3C',
    'border-strong': '#334155',
    success: '#66D6B1',
    warning: '#FB923C',
    error: '#F87171',
    info: '#60A5FA',

    // Legacy/Compatibility Aliases
    background: '#0B1220',
    tint: '#74B8D4',
    icon: '#9CA3AF',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: '#74B8D4',
  },
};
