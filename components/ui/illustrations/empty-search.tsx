import { useThemeColors } from '@/hooks/use-theme-colors';
import Svg, { Circle, Line, Path } from 'react-native-svg';

export function EmptySearchIllustration({ size = 120 }: { size?: number }) {
  const colors = useThemeColors();

  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* Magnifying glass */}
      <Circle
        cx="50"
        cy="50"
        r="20"
        stroke={colors.primary}
        strokeWidth="2"
        fill="none"
        opacity="0.6"
      />
      <Line
        x1="65"
        y1="65"
        x2="80"
        y2="80"
        stroke={colors.primary}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
      {/* Question mark inside */}
      <Path
        d="M48 43 C48 43, 50 40, 52 40 C54 40, 56 42, 56 45 C56 48, 52 49, 52 52"
        stroke={colors['text-muted']}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.5"
      />
      <Circle cx="52" cy="56" r="1" fill={colors['text-muted']} opacity="0.5" />
    </Svg>
  );
}
