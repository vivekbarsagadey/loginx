/**
 * Base theme type definition
 * All themes must follow this structure
 */

export interface ThemeColors {
  // Design System Tokens - Layered Surface System
  bg: string; // Base background (lowest layer)
  'bg-elevated': string; // Elevated background (slightly raised)
  surface: string; // Card surfaces (floating above bg)
  'surface-variant': string; // Alternative surface for nested content
  text: string;
  'text-muted': string;
  'inverse-text': string;
  primary: string;
  'on-primary': string;
  border: string;
  'border-strong': string; // A slightly darker border
  success: string;
  warning: string;
  error: string;
  info: string;

  // Legacy/Compatibility Aliases
  background: string;
  tint: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
}

export interface Theme {
  name: string;
  displayName: string;
  icon: string;
  light: ThemeColors;
  dark: ThemeColors;
}
