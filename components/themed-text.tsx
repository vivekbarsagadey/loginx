
import { Text, type TextProps, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'muted' | 'inverse';
};

export function ThemedText({ 
  style, 
  lightColor, 
  darkColor, 
  type = 'body', 
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const mutedColor = useThemeColor({ light: lightColor, dark: darkColor }, 'text-muted');
  const inverseColor = useThemeColor({ light: lightColor, dark: darkColor }, 'inverse-text');

  const colorForType = () => {
    switch (type) {
      case 'muted':
        return mutedColor;
      case 'inverse':
        return inverseColor;
      default:
        return color;
    }
  };

  return (
    <Text 
      style={[
        { color: colorForType() },
        styles[type],
        style,
      ]}
      {...rest} 
    />
  );
}

const styles = StyleSheet.create({
  h1: {
    fontSize: 28,
    lineHeight: 28 * 1.4,
    fontWeight: 'bold',
  },
  h2: {
    fontSize: 24,
    lineHeight: 24 * 1.4,
    fontWeight: 'bold',
  },
  h3: {
    fontSize: 20,
    lineHeight: 20 * 1.5,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
    lineHeight: 16 * 1.5,
  },
  caption: {
    fontSize: 13,
    lineHeight: 13 * 1.4,
  },
  muted: {
    fontSize: 16,
    lineHeight: 16 * 1.5,
  },
  inverse: {
    fontSize: 16,
    lineHeight: 16 * 1.5,
  },
});
