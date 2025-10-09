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
      <ThemedView style={styles.content}>
        <Image source={{ uri: slide.icon }} style={styles.image} accessible={true} accessibilityRole="image" accessibilityLabel={`Feature: ${slide.title}`} />
        <ThemedText type="h1" style={styles.title} numberOfLines={2}>
          {slide.title}
        </ThemedText>
        <ThemedText type="h3" style={styles.subtitle} numberOfLines={2}>
          {slide.subtitle}
        </ThemedText>
        <ThemedText type="body" style={styles.description} numberOfLines={5}>
          {slide.description}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  content: {
    width: '100%',
    maxWidth: 600,
    alignItems: 'center',
  },
  image: {
    width: 120,
    height: 120,
    marginBottom: 24,
    resizeMode: 'contain',
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
    paddingHorizontal: 16,
    lineHeight: 32,
  },
  subtitle: {
    marginBottom: 12,
    textAlign: 'center',
    paddingHorizontal: 16,
    opacity: 0.9,
    lineHeight: 26,
  },
  description: {
    textAlign: 'center',
    paddingHorizontal: 16,
    opacity: 0.8,
    lineHeight: 24,
  },
});
