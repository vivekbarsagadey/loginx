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
    primary: '#1E5A73', // Dark blue for WCAG AA compliance (contrast: 6.51:1 with white)
    'on-primary': '#FFFFFF',
    border: '#2B697F', // Darker blue-gray for 3:1 contrast
    'border-strong': '#2C7A9C',
    success: '#39C39A', // Teal accent
    warning: '#F97316',
    error: '#EF4444',
    info: '#3B82F6',
    shadow: '#000000',

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
    text: '#E5E7EB', // Neutral gray, softer than pure white
    'text-muted': '#9CA3AF',
    'inverse-text': '#0B1220',
    primary: '#74B8D4', // Lighter Mariner Blue
    'on-primary': '#0B2530',
    border: '#6B7280', // Lighter gray for 3:1 contrast
    'border-strong': '#9CA3AF',
    success: '#66D6B1',
    warning: '#FB923C',
    error: '#F87171',
    info: '#60A5FA',
    shadow: 'rgba(255, 255, 255, 0.1)', // Lighter shadow for dark mode

    // Legacy/Compatibility Aliases
    background: '#0B1220',
    tint: '#74B8D4',
    icon: '#9CA3AF',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: '#74B8D4',
  },
};
