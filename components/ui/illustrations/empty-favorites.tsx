import { useThemeColors } from '@/hooks/use-theme-colors';
import Svg, { Path } from 'react-native-svg';

export function EmptyFavoritesIllustration({ size = 120 }: { size?: number }) {
  const colors = useThemeColors();

  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      {/* Heart outline */}
      <Path
        d="M60 85 C60 85, 40 70, 35 55 C30 40, 35 30, 45 30 C52 30, 57 35, 60 40 C63 35, 68 30, 75 30 C85 30, 90 40, 85 55 C80 70, 60 85, 60 85 Z"
        stroke={colors.primary}
        strokeWidth="2"
        fill="none"
        opacity="0.6"
      />
      {/* Dashed lines indicating empty */}
      <Path d="M55 50 L55 65" stroke={colors['text-muted']} strokeWidth="1.5" strokeDasharray="3 3" strokeLinecap="round" opacity="0.4" />
      <Path d="M65 50 L65 65" stroke={colors['text-muted']} strokeWidth="1.5" strokeDasharray="3 3" strokeLinecap="round" opacity="0.4" />
    </Svg>
  );
}
