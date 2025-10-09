import { Typography } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import { memo } from 'react';
import { StyleSheet, Text, type TextProps } from 'react-native';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  /**
   * Typography variant
   * - display: 40px - Hero text
   * - title/h1: 32px - Page titles
   * - heading/h2: 28px - Section headers
   * - subheading/h3: 24px - Subsection headers
   * - subtitle1: 20px - Emphasized content
   * - subtitle2: 18px - Secondary headers
   * - body: 16px - Main content (default)
   * - bodyBold: 16px - Emphasized body
   * - bodySmall: 14px - Dense content
   * - button: 14px - Button text
   * - caption: 12px - Supporting text
   * - label: 10px - Labels, tiny text
   * - overline: 10px - All caps labels
   * - small: 12px - Small text
   * - muted: Body text with muted color
   * - inverse: Body text with inverse color
   */
  type?:
    | 'display'
    | 'title'
    | 'heading'
    | 'subheading'
    | 'subtitle1'
    | 'subtitle2'
    | 'body'
    | 'bodyBold'
    | 'bodySmall'
    | 'button'
    | 'caption'
    | 'label'
    | 'overline'
    | 'small'
    | 'h1' // Alias for title
    | 'h2' // Alias for heading
    | 'h3' // Alias for subheading
    | 'muted'
    | 'inverse';
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
    fontFamily: Typography.display.fontFamily,
    letterSpacing: Typography.display.letterSpacing,
  },
  title: {
    fontSize: Typography.title.fontSize,
    lineHeight: Typography.title.lineHeight,
    fontWeight: Typography.title.fontWeight,
    fontFamily: Typography.title.fontFamily,
    letterSpacing: Typography.title.letterSpacing,
  },
  heading: {
    fontSize: Typography.heading.fontSize,
    lineHeight: Typography.heading.lineHeight,
    fontWeight: Typography.heading.fontWeight,
    fontFamily: Typography.heading.fontFamily,
    letterSpacing: Typography.heading.letterSpacing,
  },
  subheading: {
    fontSize: Typography.subheading.fontSize,
    lineHeight: Typography.subheading.lineHeight,
    fontWeight: Typography.subheading.fontWeight,
    fontFamily: Typography.subheading.fontFamily,
    letterSpacing: Typography.subheading.letterSpacing,
  },
  h1: {
    fontSize: Typography.h1.fontSize,
    lineHeight: Typography.h1.lineHeight,
    fontWeight: Typography.h1.fontWeight,
    fontFamily: Typography.h1.fontFamily,
  },
  h2: {
    fontSize: Typography.h2.fontSize,
    lineHeight: Typography.h2.lineHeight,
    fontWeight: Typography.h2.fontWeight,
    fontFamily: Typography.h2.fontFamily,
  },
  h3: {
    fontSize: Typography.h3.fontSize,
    lineHeight: Typography.h3.lineHeight,
    fontWeight: Typography.h3.fontWeight,
    fontFamily: Typography.h3.fontFamily,
  },
  subtitle1: {
    fontSize: Typography.subtitle1.fontSize,
    lineHeight: Typography.subtitle1.lineHeight,
    fontWeight: Typography.subtitle1.fontWeight,
    fontFamily: Typography.subtitle1.fontFamily,
    letterSpacing: Typography.subtitle1.letterSpacing,
  },
  subtitle2: {
    fontSize: Typography.subtitle2.fontSize,
    lineHeight: Typography.subtitle2.lineHeight,
    fontWeight: Typography.subtitle2.fontWeight,
    fontFamily: Typography.subtitle2.fontFamily,
    letterSpacing: Typography.subtitle2.letterSpacing,
  },
  body: {
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight,
    fontWeight: Typography.body.fontWeight,
    fontFamily: Typography.body.fontFamily,
    letterSpacing: Typography.body.letterSpacing,
  },
  bodyBold: {
    fontSize: Typography.bodyBold.fontSize,
    lineHeight: Typography.bodyBold.lineHeight,
    fontWeight: Typography.bodyBold.fontWeight,
    fontFamily: Typography.bodyBold.fontFamily,
    letterSpacing: Typography.bodyBold.letterSpacing,
  },
  bodySmall: {
    fontSize: Typography.bodySmall.fontSize,
    lineHeight: Typography.bodySmall.lineHeight,
    fontWeight: Typography.bodySmall.fontWeight,
    fontFamily: Typography.bodySmall.fontFamily,
    letterSpacing: Typography.bodySmall.letterSpacing,
  },
  button: {
    fontSize: Typography.button.fontSize,
    lineHeight: Typography.button.lineHeight,
    fontWeight: Typography.button.fontWeight,
    fontFamily: Typography.button.fontFamily,
    letterSpacing: Typography.button.letterSpacing,
  },
  caption: {
    fontSize: Typography.caption.fontSize,
    lineHeight: Typography.caption.lineHeight,
    fontWeight: Typography.caption.fontWeight,
    fontFamily: Typography.caption.fontFamily,
    letterSpacing: Typography.caption.letterSpacing,
  },
  overline: {
    fontSize: Typography.overline.fontSize,
    lineHeight: Typography.overline.lineHeight,
    fontWeight: Typography.overline.fontWeight,
    fontFamily: Typography.overline.fontFamily,
    letterSpacing: Typography.overline.letterSpacing,
    textTransform: Typography.overline.textTransform,
  },
  label: {
    fontSize: Typography.label.fontSize,
    lineHeight: Typography.label.lineHeight,
    fontWeight: Typography.label.fontWeight,
    fontFamily: Typography.label.fontFamily,
    letterSpacing: Typography.label.letterSpacing,
  },
  small: {
    fontSize: Typography.small.fontSize,
    lineHeight: Typography.small.lineHeight,
    fontWeight: Typography.small.fontWeight,
    fontFamily: Typography.small.fontFamily,
  },
  muted: {
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight,
    fontWeight: Typography.body.fontWeight,
    fontFamily: Typography.body.fontFamily,
    letterSpacing: Typography.body.letterSpacing,
  },
  inverse: {
    fontSize: Typography.body.fontSize,
    lineHeight: Typography.body.lineHeight,
    fontWeight: Typography.body.fontWeight,
    fontFamily: Typography.body.fontFamily,
    letterSpacing: Typography.body.letterSpacing,
  },
});
