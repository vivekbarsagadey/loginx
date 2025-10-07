import { Typography } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import { memo } from 'react';
import { StyleSheet, Text, type TextProps } from 'react-native';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'display' | 'h1' | 'h2' | 'h3' | 'subtitle1' | 'subtitle2' | 'body' | 'bodyBold' | 'button' | 'caption' | 'overline' | 'label' | 'small' | 'muted' | 'inverse';
};

function ThemedTextComponent({ style, lightColor, darkColor, type = 'body', ...rest }: ThemedTextProps) {
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

  return <Text style={[{ color: colorForType() }, styles[type], style]} {...rest} />;
}

export const ThemedText = memo(ThemedTextComponent);

const styles = StyleSheet.create({
  display: {
    fontSize: Typography.display.fontSize,
    lineHeight: Typography.display.lineHeight,
    fontWeight: Typography.display.fontWeight,
  },
  h1: {
    fontSize: Typography.h1.fontSize,
    lineHeight: Typography.h1.lineHeight,
    fontWeight: Typography.h1.fontWeight,
  },
  h2: {
    fontSize: Typography.h2.fontSize,
    lineHeight: Typography.h2.lineHeight,
    fontWeight: Typography.h2.fontWeight,
  },
  h3: {
    fontSize: Typography.h3.fontSize,
    lineHeight: Typography.h3.lineHeight,
    fontWeight: Typography.h3.fontWeight,
  },
  subtitle1: {
    fontSize: Typography.subtitle1.fontSize,
    lineHeight: Typography.subtitle1.lineHeight,
    fontWeight: Typography.subtitle1.fontWeight,
  },
  subtitle2: {
    fontSize: Typography.subtitle2.fontSize,
    lineHeight: Typography.subtitle2.lineHeight,
    fontWeight: Typography.subtitle2.fontWeight,
  },
  body: {
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight,
    fontWeight: Typography.body.fontWeight,
  },
  bodyBold: {
    fontSize: Typography.bodyBold.fontSize,
    lineHeight: Typography.bodyBold.lineHeight,
    fontWeight: Typography.bodyBold.fontWeight,
  },
  button: {
    fontSize: Typography.button.fontSize,
    lineHeight: Typography.button.lineHeight,
    fontWeight: Typography.button.fontWeight,
    letterSpacing: Typography.button.letterSpacing,
  },
  caption: {
    fontSize: Typography.caption.fontSize,
    lineHeight: Typography.caption.lineHeight,
    fontWeight: Typography.caption.fontWeight,
  },
  overline: {
    fontSize: Typography.overline.fontSize,
    lineHeight: Typography.overline.lineHeight,
    fontWeight: Typography.overline.fontWeight,
    letterSpacing: Typography.overline.letterSpacing,
    textTransform: Typography.overline.textTransform,
  },
  label: {
    fontSize: Typography.label.fontSize,
    lineHeight: Typography.label.lineHeight,
    fontWeight: Typography.label.fontWeight,
  },
  small: {
    fontSize: Typography.small.fontSize,
    lineHeight: Typography.small.lineHeight,
    fontWeight: Typography.small.fontWeight,
  },
  muted: {
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight,
    fontWeight: Typography.body.fontWeight,
  },
  inverse: {
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight,
    fontWeight: Typography.body.fontWeight,
  },
});
