
// app/onboarding/index.tsx
import { useRef, useState } from "react";
import { View, Text, FlatList, Pressable, useColorScheme, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from '@/constants/theme';
import i18n from '@/i18n';
import { ThemeSelector } from "@/components/theme-selector";
import { LanguagePicker } from "@/components/language-picker";

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
      return (
        <View style={{ width, padding: 24, backgroundColor: theme.bg, flex: 1, justifyContent: 'center' }}>
          <Text style={{ fontSize: 28, fontWeight: "700", color: theme.text }}>{i18n.t('onb.welcome.title', { app: 'YourApp' })}</Text>
          <Text style={{ fontSize: 16, color: theme['text-muted'], marginTop: 8 }}>
            {i18n.t('onb.welcome.body')}
          </Text>
        </View>
      );
    }
    if (item.key === "features") {
      return (
        <View style={{ width, padding: 24, backgroundColor: theme.bg, flex: 1, justifyContent: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 12, color: theme.text }}>
            {i18n.t('onb.features.title')}
          </Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: theme.border, backgroundColor: theme.surface }}>
              <Text style={{ fontWeight: "600", color: theme.text }}>Secure account</Text>
              <Text style={{ color: theme['text-muted'], marginTop: 6 }}>{i18n.t('onb.features.secure')}</Text>
            </View>
            <View style={{ flex: 1, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: theme.border, backgroundColor: theme.surface }}>
              <Text style={{ fontWeight: "600", color: theme.text }}>Cloud sync</Text>
              <Text style={{ color: theme['text-muted'], marginTop: 6 }}>{i18n.t('onb.features.sync')}</Text>
            </View>
            <View style={{ flex: 1, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: theme.border, backgroundColor: theme.surface }}>
              <Text style={{ fontWeight: "600", color: theme.text }}>Fast capture</Text>
              <Text style={{ color: theme['text-muted'], marginTop: 6 }}>{i18n.t('onb.features.fast')}</Text>
            </View>
          </View>
        </View>
      );
    }
    return (
      <View style={{ width, padding: 24, gap: 16, backgroundColor: theme.bg, flex: 1, justifyContent: 'center' }}>
        <Text style={{ fontSize: 24, fontWeight: "700", color: theme.text }}>{i18n.t('onb.personalize.title')}</Text>
        <ThemeSelector />
        <LanguagePicker />
        <Text style={{ fontSize: 13, color: theme['text-muted'] }}>
          You can change this anytime in Settings.
        </Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <Pressable onPress={skip} style={{ position: "absolute", right: 16, top: 40, zIndex: 1, padding: 8 }}>
        <Text style={{ color: theme['text-muted'] }}>{i18n.t('onb.cta.skip')}</Text>
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

      <View style={{ padding: 16, paddingBottom: 40, backgroundColor: theme.bg }}>
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
                    <Text style={{ color: theme.text, fontSize: 16, fontWeight: "600" }}>
                        {i18n.t('onb.cta.back')}
                    </Text>
                </Pressable>
            }
            <Pressable onPress={next} style={{ height: 48, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: theme.primary, flex: i > 0 ? 2 : 1 }}>
              <Text style={{ color: theme['on-primary'], fontSize: 16, fontWeight: "600" }}>
                {i < SLIDES.length - 1 ? i18n.t('onb.cta.next') : i18n.t('onb.cta.start')}
              </Text>
            </Pressable>
        </View>
      </View>
    </View>
  );
}
