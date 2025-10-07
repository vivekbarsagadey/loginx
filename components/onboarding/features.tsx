import { FeaturesSlide } from '@/components/features-slide';
import { ThemedView } from '@/components/themed-view';
import i18n from '@/i18n';
import { useCallback } from 'react';
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

  const renderItem = useCallback(({ item }: { item: FeatureSlide }) => <FeaturesSlide slide={item} />, []);

  const getItemLayout = useCallback(
    (_data: ArrayLike<FeatureSlide> | null | undefined, index: number) => ({
      length: width,
      offset: width * index,
      index,
    }),
    [width]
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={features}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.title}
        style={{ width }}
        getItemLayout={getItemLayout}
        removeClippedSubviews={true}
        maxToRenderPerBatch={3}
        windowSize={5}
        initialNumToRender={2}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
