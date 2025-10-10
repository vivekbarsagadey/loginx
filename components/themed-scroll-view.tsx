import { useThemeColor } from '@/hooks/use-theme-color';
import { memo, useMemo } from 'react';
import { ScrollView, type ScrollViewProps } from 'react-native';

export type ThemedScrollViewProps = ScrollViewProps & {
  lightColor?: string;
  darkColor?: string;
  variant?: 'bg' | 'bg-elevated' | 'surface' | 'surface-variant';
};

function ThemedScrollViewComponent({ style, lightColor, darkColor, variant = 'bg', ...otherProps }: ThemedScrollViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, variant);

  // Memoize style
  const scrollViewStyle = useMemo(() => [{ backgroundColor }, style], [backgroundColor, style]);

  return <ScrollView style={scrollViewStyle} {...otherProps} />;
}

// Memoized export
export const ThemedScrollView = memo(ThemedScrollViewComponent);
ThemedScrollView.displayName = 'ThemedScrollView';
