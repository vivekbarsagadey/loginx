import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

export function Logo() {
  return <Image style={styles.image} source={require('@/assets/images/react-logo.png')} contentFit="contain" accessible={true} accessibilityRole="image" accessibilityLabel="LoginX Logo" />;
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
});
