
import { Image } from 'expo-image';

export function Logomark() {
  return (
    <Image
      style={{ width: '100%', height: '100%' }}
      source={require('@/assets/images/react-logo.png')}
      contentFit="contain"
    />
  );
}
