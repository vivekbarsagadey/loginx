/**
 * Color utility functions
 * Helper functions for color manipulation and conversion
 */

/**
 * Converts a hex color to rgba with specified opacity
 * Supports both 3-digit and 6-digit hex colors with or without #
 *
 * @param hex - Hex color string (e.g., '#FF0000', 'FF0000', '#F00', 'F00')
 * @param opacity - Opacity value between 0 and 1
 * @returns RGBA color string (e.g., 'rgba(255, 0, 0, 0.5)')
 *
 * @example
 * hexToRgba('#FF0000', 0.5) // 'rgba(255, 0, 0, 0.5)'
 * hexToRgba('#F00', 0.3) // 'rgba(255, 0, 0, 0.3)'
 * hexToRgba('007AFF', 0.1) // 'rgba(0, 122, 255, 0.1)'
 */
export function hexToRgba(hex: string, opacity: number): string {
  // Remove # if present
  const cleanHex = hex.replace('#', '');

  // Expand 3-digit hex to 6-digit
  const fullHex =
    cleanHex.length === 3
      ? cleanHex
          .split('')
          .map((char) => char + char)
          .join('')
      : cleanHex;

  // Parse hex to RGB
  const r = Number.parseInt(fullHex.substring(0, 2), 16);
  const g = Number.parseInt(fullHex.substring(2, 4), 16);
  const b = Number.parseInt(fullHex.substring(4, 6), 16);

  // Clamp opacity between 0 and 1
  const alpha = Math.max(0, Math.min(1, opacity));

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Adds opacity to unknown color (hex or named color)
 * For hex colors, converts to rgba
 * For other colors, wraps in a View with opacity style
 *
 * @param color - Color string (hex or named)
 * @param opacity - Opacity value between 0 and 1
 * @returns Color string with opacity
 *
 * @example
 * addOpacity('#FF0000', 0.5) // 'rgba(255, 0, 0, 0.5)'
 * addOpacity('red', 0.5) // 'red' (use opacity style prop instead)
 */
export function addOpacity(color: string, opacity: number): string {
  // If it's a hex color, convert to rgba
  if (color.startsWith('#') || /^[0-9A-Fa-f]{3,6}$/.test(color)) {
    return hexToRgba(color, opacity);
  }

  // For named colors or rgba, return as-is
  // Note: For named colors, you should use the opacity style prop instead
  return color;
}

/**
 * Standard opacity values for consistent use across the app
 */
export const Opacity = {
  transparent: 0,
  faint: 0.05,
  subtle: 0.1,
  light: 0.2,
  medium: 0.3,
  moderate: 0.5,
  strong: 0.7,
  heavy: 0.85,
  opaque: 1,
} as const;

/**
 * Common overlay opacity values
 */
export const OverlayOpacity = {
  light: 0.3,
  medium: 0.5,
  dark: 0.7,
  black: 0.85,
} as const;
