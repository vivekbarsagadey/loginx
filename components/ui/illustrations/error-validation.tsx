import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme-context';
import React from 'react';
import { useColorScheme } from 'react-native';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';

interface ErrorValidationIllustrationProps {
  size?: number;
}

/**
 * Validation error illustration
 * Shows a form with error indicators
 */
export function ErrorValidationIllustration({ size = 120 }: ErrorValidationIllustrationProps) {
  const { theme } = useTheme();
  const systemTheme = useColorScheme();
  const colors = Colors[theme === 'system' ? systemTheme || 'light' : theme];

  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* Background circle */}
      <Circle cx="60" cy="60" r="55" fill={colors.error} opacity="0.1" />

      {/* Form document */}
      <Rect
        x="35"
        y="30"
        width="50"
        height="60"
        rx="4"
        fill="none"
        stroke={colors.error}
        strokeWidth="2.5"
      />

      {/* Form lines - some with errors */}
      <Line
        x1="42"
        y1="42"
        x2="78"
        y2="42"
        stroke={colors.error}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Circle cx="82" cy="42" r="3" fill={colors.error} />

      <Line
        x1="42"
        y1="52"
        x2="78"
        y2="52"
        stroke={colors['text-muted']}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.3"
      />

      <Line
        x1="42"
        y1="62"
        x2="78"
        y2="62"
        stroke={colors.error}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Circle cx="82" cy="62" r="3" fill={colors.error} />

      <Line
        x1="42"
        y1="72"
        x2="78"
        y2="72"
        stroke={colors['text-muted']}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.3"
      />

      {/* Large X overlay */}
      <Circle cx="60" cy="65" r="18" fill={colors.error} opacity="0.9" />
      <Path
        d="M52 57 L68 73 M68 57 L52 73"
        stroke={colors['on-primary']}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </Svg>
  );
}
