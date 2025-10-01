import { Image, StyleSheet } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface SlideProps {
  icon: string;
  title: string;
  subtitle: string;
  description: string;
}

export const FeaturesSlide = ({ slide }: { slide: SlideProps }) => {
  return (
    <ThemedView style={styles.container}>
      <Image source={{ uri: slide.icon }} style={styles.image} />
      <ThemedText type="h1" style={styles.title}>
        {slide.title}
      </ThemedText>
      <ThemedText type="h3" style={styles.subtitle}>
        {slide.subtitle}
      </ThemedText>
      <ThemedText type="body" style={styles.description}>
        {slide.description}
      </ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
  },
});
