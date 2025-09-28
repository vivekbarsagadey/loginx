
// app/onboarding/index.tsx
import { LanguagePicker } from "@/components/language-picker";
import { ThemeSelector } from "@/components/theme-selector";
import { Colors } from '@/constants/theme';
import i18n from '@/i18n';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Dimensions, FlatList, Pressable, Text, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WelcomeSlide } from "@/components/onboarding/welcome";
import { FeaturesSlide } from "@/components/onboarding/features";
import { ThemedView } from "@/components/themed-view";
import { ThemedText } from "@/components/themed-text";

const SLIDES = [
  { key: "welcome" },
  { key: "features" },
  { key: "personalize" },
];

export default function Onboarding() {
  const r = useRouter();
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
      await AsyncStorage.setItem("onboardingCompleted", "true");
      r.replace("/(auth)/login");
    }
  };

  const back = async () => {
    if (i > 0) {
      ref.current?.scrollToIndex({ index: i - 1, animated: true });
      setI(i - 1);
    }
  };

  const skip = async () => {
    await AsyncStorage.setItem("onboardingCompleted", "true");
    r.replace("/(auth)/login");
  };

  const render = ({ item }: any) => {
    if (item.key === "welcome") {
      return <WelcomeSlide width={width} />;
    }
    if (item.key === "features") {
      return <FeaturesSlide width={width} />;
    }
    return (
      <ThemedView style={{ width, padding: 24, gap: 16, flex: 1, justifyContent: 'center' }}>
        <ThemedText type="h2">{i18n.t('onb.personalize.title')}</ThemedText>
        <ThemeSelector />
        <LanguagePicker />
        <ThemedText type="muted" style={{ fontSize: 13 }}>
          You can change this anytime in Settings.
        </ThemedText>
      </ThemedView>
    );
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <Pressable onPress={skip} style={{ position: "absolute", right: 16, top: top + 16, zIndex: 1, padding: 8  }}>
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
        <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 12 }}>
          {SLIDES.map((_, idx) => (
            <View
              key={idx}
              style={{
                width: 8, height: 8, borderRadius: 4, marginHorizontal: 4,
                backgroundColor: idx === i ? theme.primary : theme['border-strong'],
              }}
            />
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: 12 }}>
            {i > 0 &&
                <Pressable onPress={back} style={{ height: 48, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: theme.surface, flex: 1 }}>
                    <ThemedText style={{ fontWeight: "600" }}>
                        {i18n.t('onb.cta.back')}
                    </ThemedText>
                </Pressable>
            }
            <Pressable onPress={next} style={{ height: 48, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: theme.primary, flex: i > 0 ? 2 : 1 }}>
              <ThemedText type="inverse" style={{ fontWeight: "600" }}>
                {i < SLIDES.length - 1 ? i18n.t('onb.cta.next') : i18n.t('onb.cta.start')}
              </ThemedText>
            </Pressable>
        </View>
      </ThemedView>
    </ThemedView>
  );
}
