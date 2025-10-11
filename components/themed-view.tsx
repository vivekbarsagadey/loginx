import { useThemeColors } from '@/hooks/use-theme-colors';
import { useThemeContext } from '@/hooks/use-theme-context';
import { memo } from 'react';
import { View, type ViewProps } from 'react-native';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  variant?: 'bg' | 'bg-elevated' | 'surface' | 'surface-variant';
};

function ThemedViewComponent({ style, lightColor, darkColor, variant = 'bg', ...otherProps }: ThemedViewProps) {
  const colors = useThemeColors();
  const { resolvedTheme } = useThemeContext();

  // Use custom colors if provided, otherwise use theme colors
  let backgroundColor: string;
  if (lightColor && resolvedTheme.includes('light')) {
    backgroundColor = lightColor;
  } else if (darkColor && resolvedTheme.includes('dark')) {
    backgroundColor = darkColor;
  } else {
    backgroundColor = colors[variant];
  }

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}

export const ThemedView = memo(ThemedViewComponent);
