import { useThemeColors } from '@/hooks/use-theme-colors';
import Svg, { Circle, Path } from 'react-native-svg';

export function EmptyNotificationsIllustration({ size = 120 }: { size?: number }) {
  const colors = useThemeColors();

  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* Bell */}
      <Path
        d="M60 30 C60 30, 50 32, 50 45 L50 60 C50 60, 45 70, 40 75 L80 75 C80 75, 75 70, 70 60 L70 45 C70 45, 70 32, 60 30 Z"
        stroke={colors.primary}
        strokeWidth="2"
        fill="none"
        opacity="0.6"
      />
      {/* Bell clapper */}
      <Circle cx="60" cy="78" r="3" fill={colors.primary} opacity="0.6" />
      {/* Muted slash */}
      <Path
        d="M35 35 L85 85"
        stroke={colors['text-muted']}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.5"
      />
    </Svg>
  );
}
