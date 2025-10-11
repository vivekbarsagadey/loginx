import { useThemeColors } from '@/hooks/use-theme-colors';
import { useThemeContext } from '@/hooks/use-theme-context';
import { memo, useMemo } from 'react';
import { ScrollView, type ScrollViewProps } from 'react-native';

export type ThemedScrollViewProps = ScrollViewProps & {
  lightColor?: string;
  darkColor?: string;
  variant?: 'bg' | 'bg-elevated' | 'surface' | 'surface-variant';
};

function ThemedScrollViewComponent({ style, lightColor, darkColor, variant = 'bg', ...otherProps }: ThemedScrollViewProps) {
  const colors = useThemeColors();
  const { resolvedTheme } = useThemeContext();

  // Use custom colors if provided, otherwise use theme colors
  const isLightTheme = !resolvedTheme.includes('dark');
  const backgroundColor = (isLightTheme && lightColor) || (!isLightTheme && darkColor) || colors[variant];

  // Memoize style
  const scrollViewStyle = useMemo(() => [{ backgroundColor }, style], [backgroundColor, style]);

  return <ScrollView style={scrollViewStyle} {...otherProps} />;
}

// Memoized export
export const ThemedScrollView = memo(ThemedScrollViewComponent);
ThemedScrollView.displayName = 'ThemedScrollView';
