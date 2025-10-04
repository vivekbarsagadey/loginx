import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

export function Logomark() {
  return <Image style={styles.image} source={require('@/assets/images/react-logo.png')} contentFit="contain" />;
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
});
