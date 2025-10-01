import { Colors } from '@/constants/theme';
import i18n from '@/i18n';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Dimensions, FlatList, Pressable, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Features } from '@/components/onboarding/features';
import { Personalize } from '@/components/onboarding/personalize';
import { WelcomeSlide } from '@/components/onboarding/welcome';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useOnboarding } from '@/hooks/use-onboarding-provider';

const SLIDES = [{ key: 'welcome' }, { key: 'features' }, { key: 'personalize' }];

export default function Onboarding() {
  const r = useRouter();
  const { setOnboardingCompleted } = useOnboarding();
  const [i, setI] = useState(0);
  const ref = useRef<FlatList>(null);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme || 'light'];
  const { width } = Dimensions.get('window');
  const { top, bottom } = useSafeAreaInsets();

  const next = async () => {
    if (i < SLIDES.length - 1) {
      ref.current?.scrollToIndex({ index: i + 1, animated: true });
      setI(i + 1);
    } else {
      setOnboardingCompleted(true);
      r.replace('/(auth)/login');
    }
  };

  const back = async () => {
    if (i > 0) {
      ref.current?.scrollToIndex({ index: i - 1, animated: true });
      setI(i - 1);
    }
  };

  const skip = async () => {
    setOnboardingCompleted(true);
    r.replace('/(auth)/login');
  };

  const render = ({ item }: { item: { key: string } }) => {
    if (item.key === 'welcome') {
      return <WelcomeSlide width={width} />;
    }
    if (item.key === 'features') {
      return <Features />;
    }
    if (item.key === 'personalize') {
      return <Personalize width={width} />;
    }
    return null;
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <Pressable onPress={skip} style={{ position: 'absolute', right: 16, top: top + 16, zIndex: 1, padding: 8 }}>
        <ThemedText type="muted">{i18n.t('onb.cta.skip')} </ThemedText>
      </Pressable>

      <FlatList
        ref={ref}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(s) => s.key}
        renderItem={render}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width);
          setI(idx);
        }}
        style={{ flex: 1 }}
      />

      <ThemedView style={{ paddingHorizontal: 16, paddingBottom: bottom + 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 12 }}>
          {SLIDES.map((_, idx) => (
            <View
              key={idx}
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                marginHorizontal: 4,
                backgroundColor: idx === i ? theme.primary : theme['border-strong'],
              }}
            />
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {i > 0 && (
            <Pressable onPress={back} style={{ height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.surface, flex: 1 }}>
              <ThemedText style={{ fontWeight: '600' }}>{i18n.t('onb.cta.back')}</ThemedText>
            </Pressable>
          )}
          <Pressable onPress={next} style={{ height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.primary, flex: i > 0 ? 2 : 1 }}>
            <ThemedText type="inverse" style={{ fontWeight: '600' }}>
              {i < SLIDES.length - 1 ? i18n.t('onb.cta.next') : i18n.t('onb.cta.start')}
            </ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    </ThemedView>
  );
}
