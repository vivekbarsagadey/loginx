import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme-context';
import React from 'react';
import Svg, { Circle, Line, Rect } from 'react-native-svg';

interface ErrorServerIllustrationProps {
  size?: number;
}

/**
 * Server error illustration (500, 503, etc.)
 * Shows a server rack with error indicators
 */
export function ErrorServerIllustration({ size = 120 }: ErrorServerIllustrationProps) {
  const { resolvedTheme } = useTheme();
  const colors = Colors[resolvedTheme];

  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* Background circle */}
      <Circle cx="60" cy="60" r="55" fill={colors.error} opacity="0.1" />

      {/* Server stack */}
      <Rect x="35" y="35" width="50" height="15" rx="2" fill="none" stroke={colors.error} strokeWidth="2.5" />
      <Rect x="35" y="53" width="50" height="15" rx="2" fill="none" stroke={colors.error} strokeWidth="2.5" />
      <Rect x="35" y="71" width="50" height="15" rx="2" fill="none" stroke={colors.error} strokeWidth="2.5" />

      {/* Server lights - red (errors) */}
      <Circle cx="42" cy="42.5" r="2" fill={colors.error} />
      <Circle cx="49" cy="42.5" r="2" fill={colors.error} opacity="0.3" />
      <Circle cx="56" cy="42.5" r="2" fill={colors.error} opacity="0.3" />

      <Circle cx="42" cy="60.5" r="2" fill={colors.error} />
      <Circle cx="49" cy="60.5" r="2" fill={colors.error} />
      <Circle cx="56" cy="60.5" r="2" fill={colors.error} opacity="0.3" />

      <Circle cx="42" cy="78.5" r="2" fill={colors.error} opacity="0.3" />
      <Circle cx="49" cy="78.5" r="2" fill={colors.error} />
      <Circle cx="56" cy="78.5" r="2" fill={colors.error} />

      {/* Error symbol overlay */}
      <Circle cx="75" cy="75" r="12" fill={colors['bg-elevated']} />
      <Line x1="75" y1="68" x2="75" y2="76" stroke={colors.error} strokeWidth="2.5" strokeLinecap="round" />
      <Circle cx="75" cy="80" r="1.5" fill={colors.error} />
    </Svg>
  );
}
