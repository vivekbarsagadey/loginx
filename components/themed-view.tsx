import { useThemeColor } from '@/hooks/use-theme-color';
import { memo } from 'react';
import { View, type ViewProps } from 'react-native';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  variant?: 'bg' | 'bg-elevated' | 'surface' | 'surface-variant';
};

function ThemedViewComponent({ style, lightColor, darkColor, variant = 'bg', ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, variant);

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}

export const ThemedView = memo(ThemedViewComponent);
