import { FeaturesSlide } from '@/components/features-slide';
import { ThemedView } from '@/components/themed-view';
import i18n from '@/i18n';
import { FlatList, StyleSheet, useWindowDimensions } from 'react-native';

interface FeatureSlide {
  icon: string;
  title: string;
  subtitle: string;
  description: string;
}

const features = i18n.t('onb.features.slides', { returnObjects: true }) as FeatureSlide[];

export const Features = () => {
  const { width } = useWindowDimensions();

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={features}
        renderItem={({ item }) => <FeaturesSlide slide={item} />}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.title}
        style={{ width }}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
