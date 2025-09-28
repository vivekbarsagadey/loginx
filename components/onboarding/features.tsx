import { FeaturesSlide } from '@/components/features-slide';
import { ThemedView } from '@/components/themed-view';
import i18n from '@/i18n';
import { FlatList, useWindowDimensions } from 'react-native';

const features = i18n.t('onb.features.slides', { returnObjects: true }) as any[];

export const Features = () => {
  const { width } = useWindowDimensions();

  return (
    <ThemedView style={{ flex: 1 }}>
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
}
