/**
 * Default Theme (Blue)
 * Classic blue theme with neutral grays
 */

import type { Theme } from './base-theme';

export const defaultTheme: Theme = {
  name: 'default',
  displayName: 'Default',
  icon: '🎨',
  light: {
    // Design System Tokens - Layered Surface System
    bg: '#F9FAFB', // Base background (lowest layer)
    'bg-elevated': '#FFFFFF', // Elevated background (slightly raised)
    surface: '#FFFFFF', // Card surfaces (floating above bg)
    'surface-variant': '#F3F4F6', // Alternative surface for nested content
    text: '#111827',
    'text-muted': '#6B7280',
    'inverse-text': '#F9FAFB',
    primary: '#2563EB',
    'on-primary': '#FFFFFF',
    border: '#E5E7EB',
    'border-strong': '#9CA3AF', // A slightly darker border
    success: '#16A34A',
    warning: '#D97706',
    error: '#DC2626',
    info: '#2563EB', // Using primary for info
    shadow: '#000000', // Black shadow for light mode

    // Legacy/Compatibility Aliases
    background: '#FFFFFF',
    tint: '#2563EB',
    icon: '#6B7280',
    tabIconDefault: '#6B7280',
    tabIconSelected: '#2563EB',
  },
  dark: {
    // Design System Tokens - Layered Surface System
    bg: '#0B1220', // Base background (lowest layer)
    'bg-elevated': '#111827', // Elevated background (slightly lighter)
    surface: '#1F2937', // Card surfaces (more elevated, lighter)
    'surface-variant': '#374151', // Alternative surface (highest, lightest)
    text: '#F9FAFB',
    'text-muted': '#94A3B8',
    'inverse-text': '#111827',
    primary: '#60A5FA',
    'on-primary': '#0B1220',
    border: '#1F2937',
    'border-strong': '#4B5563', // A slightly darker border
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    info: '#60A5FA', // Using primary for info
    shadow: '#000000', // Black shadow for dark mode

    // Legacy/Compatibility Aliases
    background: '#0B1220',
    tint: '#60A5FA',
    icon: '#94A3B8',
    tabIconDefault: '#94A3B8',
    tabIconSelected: '#60A5FA',
  },
};
