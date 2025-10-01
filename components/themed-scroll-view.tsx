import { ScrollView, type ScrollViewProps } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedScrollViewProps = ScrollViewProps & {
  lightColor?: string;
  darkColor?: string;
  variant?: 'bg' | 'bg-elevated' | 'surface' | 'surface-variant';
};

export function ThemedScrollView({ style, lightColor, darkColor, variant = 'bg', ...otherProps }: ThemedScrollViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, variant);

  return <ScrollView style={[{ backgroundColor }, style]} {...otherProps} />;
}
