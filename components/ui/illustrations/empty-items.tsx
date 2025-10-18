import { useThemeColors } from '@/hooks/use-theme-colors';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

export function EmptyItemsIllustration({ size = 120 }: { size?: number }) {
  const colors = useThemeColors();

  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* Box */}
      <Rect
        x="30"
        y="40"
        width="60"
        height="50"
        rx="4"
        stroke={colors.primary}
        strokeWidth="2"
        fill="none"
        opacity="0.6"
      />
      <Path
        d="M30 50 L60 35 L90 50"
        stroke={colors.primary}
        strokeWidth="2"
        fill="none"
        opacity="0.6"
      />
      <Path
        d="M60 35 L60 90"
        stroke={colors.primary}
        strokeWidth="2"
        fill="none"
        opacity="0.4"
      />
      {/* Dots indicating empty */}
      <Circle cx="50" cy="65" r="2" fill={colors['text-muted']} opacity="0.4" />
      <Circle cx="60" cy="65" r="2" fill={colors['text-muted']} opacity="0.4" />
      <Circle cx="70" cy="65" r="2" fill={colors['text-muted']} opacity="0.4" />
    </Svg>
  );
}
