import { View, type ViewProps } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  variant?: 'bg' | 'bg-elevated' | 'surface' | 'surface-variant';
};

export function ThemedView({ style, lightColor, darkColor, variant = 'bg', ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, variant);

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
