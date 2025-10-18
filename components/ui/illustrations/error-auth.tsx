import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme-context';
import React from 'react';
import { useColorScheme } from 'react-native';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';

interface ErrorAuthIllustrationProps {
  size?: number;
}

/**
 * Authentication error illustration
 * Shows a lock with an X or warning symbol
 */
export function ErrorAuthIllustration({ size = 120 }: ErrorAuthIllustrationProps) {
  const { theme } = useTheme();
  const systemTheme = useColorScheme();
  const colors = Colors[theme === 'system' ? systemTheme || 'light' : theme];

  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* Background circle */}
      <Circle cx="60" cy="60" r="55" fill={colors.error} opacity="0.1" />

      {/* Lock body */}
      <Rect
        x="40"
        y="55"
        width="40"
        height="30"
        rx="4"
        fill="none"
        stroke={colors.error}
        strokeWidth="3"
      />

      {/* Lock shackle - broken */}
      <Path
        d="M45 55 V45 Q45 35 55 35"
        stroke={colors.error}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M65 35 Q75 35 75 45 V50"
        stroke={colors.error}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="3 3"
        fill="none"
      />

      {/* Exclamation mark inside lock */}
      <Line
        x1="60"
        y1="62"
        x2="60"
        y2="72"
        stroke={colors.error}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <Circle cx="60" cy="78" r="2" fill={colors.error} />

      {/* Warning triangle overlay (top right) */}
      <Circle cx="82" cy="38" r="14" fill={colors['bg-elevated']} />
      <Path
        d="M82 30 L90 45 L74 45 Z"
        fill={colors.error}
      />
      <Line
        x1="82"
        y1="35"
        x2="82"
        y2="40"
        stroke={colors['on-primary']}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Circle cx="82" cy="43" r="0.8" fill={colors['on-primary']} />
    </Svg>
  );
}
