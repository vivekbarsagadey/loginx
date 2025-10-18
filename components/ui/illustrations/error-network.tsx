import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme-context';
import React from 'react';
import { useColorScheme } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';

interface ErrorNetworkIllustrationProps {
  size?: number;
}

/**
 * Network error illustration
 * Shows a broken network/wifi icon with an X
 */
export function ErrorNetworkIllustration({ size = 120 }: ErrorNetworkIllustrationProps) {
  const { theme } = useTheme();
  const systemTheme = useColorScheme();
  const colors = Colors[theme === 'system' ? systemTheme || 'light' : theme];

  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* Background circle */}
      <Circle cx="60" cy="60" r="55" fill={colors.error} opacity="0.1" />

      {/* Wifi waves - broken */}
      <Path
        d="M30 70 Q45 55 60 55"
        stroke={colors.error}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M60 55 Q75 55 90 70"
        stroke={colors.error}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="4 4"
        fill="none"
      />

      <Path
        d="M40 60 Q50 50 60 50"
        stroke={colors.error}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <Path
        d="M60 50 Q70 50 80 60"
        stroke={colors.error}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="3 3"
        fill="none"
      />

      {/* Router/device */}
      <Circle cx="60" cy="75" r="6" fill={colors.error} />

      {/* X mark overlay */}
      <Line
        x1="40"
        y1="40"
        x2="80"
        y2="80"
        stroke={colors.error}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <Line
        x1="80"
        y1="40"
        x2="40"
        y2="80"
        stroke={colors.error}
        strokeWidth="4"
        strokeLinecap="round"
      />
    </Svg>
  );
}
