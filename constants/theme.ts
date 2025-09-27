
/**
 * This file contains the color palette for the app, supporting light and dark modes.
 * It's based on the new design system specification.
 */

export const Colors = {
  light: {
    // Design System Tokens
    bg: '#FFFFFF',
    'bg-elevated': '#FFFFFF',
    surface: '#FFFFFF',
    'surface-variant': '#F6F7FA',
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

    // Legacy/Compatibility Aliases
    background: '#FFFFFF',
    tint: '#2563EB',
    icon: '#6B7280',
    tabIconDefault: '#6B7280',
    tabIconSelected: '#2563EB',
  },
  dark: {
    // Design System Tokens
    bg: '#0B1220',
    'bg-elevated': '#111827',
    surface: '#111827',
    'surface-variant': '#0F172A',
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

    // Legacy/Compatibility Aliases
    background: '#0B1220',
    tint: '#60A5FA',
    icon: '#94A3B8',
    tabIconDefault: '#94A3B8',
    tabIconSelected: '#60A5FA',
  },
};
