import { useThemeColors } from '@/hooks/use-theme-colors';
import Svg, { Circle, Path } from 'react-native-svg';

export function EmptyHistoryIllustration({ size = 120 }: { size?: number }) {
  const colors = useThemeColors();

  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* Clock face */}
      <Circle
        cx="60"
        cy="60"
        r="25"
        stroke={colors.primary}
        strokeWidth="2"
        fill="none"
        opacity="0.6"
      />
      {/* Clock hands */}
      <Path
        d="M60 60 L60 45"
        stroke={colors.primary}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
      <Path
        d="M60 60 L70 60"
        stroke={colors.primary}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
      {/* Arrow indicating no history */}
      <Path
        d="M50 35 C50 35, 45 30, 40 30"
        stroke={colors['text-muted']}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.5"
      />
      <Path
        d="M40 30 L42 27 M40 30 L37 28"
        stroke={colors['text-muted']}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
    </Svg>
  );
}
