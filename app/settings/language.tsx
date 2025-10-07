import { TabHeader } from '@/components/navigation/TabHeader';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CommonLists } from '@/constants/common-styles';
import { Spacing } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/i18n';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { memo, useCallback } from 'react';
import { FlatList, StyleProp, StyleSheet, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'hi', name: 'हिन्दी' },
];

interface LanguageItemProps {
  item: { code: string; name: string };
  isSelected: boolean;
  onPress: (code: string) => void;
  itemStyle: StyleProp<ViewStyle>;
  itemTextStyle: StyleProp<TextStyle>;
  tintColor: string;
}

const LanguageItem = memo(({ item, isSelected, onPress, itemStyle, itemTextStyle, tintColor }: LanguageItemProps) => (
  <TouchableOpacity style={itemStyle} onPress={() => onPress(item.code)}>
    <ThemedText style={itemTextStyle}>{item.name}</ThemedText>
    {isSelected && <Feather name="check" size={24} color={tintColor} />}
  </TouchableOpacity>
));

LanguageItem.displayName = 'LanguageItem';

export default function LanguageScreen() {
  const router = useRouter();
  const borderColor = useThemeColor({}, 'border');
  const tintColor = useThemeColor({}, 'primary');

  const setLanguage = useCallback(
    (code: string) => {
      i18n.locale = code;
      router.back();
    },
    [router]
  );

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
        },
        item: {
          ...CommonLists.listItem,
          borderBottomColor: borderColor,
        },
        itemText: {
          flex: 1,
          marginLeft: Spacing.md,
        },
      }),
    [borderColor]
  );

  const renderItem = useCallback(
    ({ item }: { item: { code: string; name: string } }) => (
      <LanguageItem item={item} isSelected={i18n.locale.startsWith(item.code)} onPress={setLanguage} itemStyle={styles.item} itemTextStyle={styles.itemText} tintColor={tintColor} />
    ),
    [setLanguage, styles, tintColor]
  );

  const getItemLayout = useCallback(
    (_data: ArrayLike<{ code: string; name: string }> | null | undefined, index: number) => ({
      length: 60,
      offset: 60 * index,
      index,
    }),
    []
  );

  return (
    <>
      <TabHeader title="Language" showBackButton={true} />
      <ThemedView style={[styles.container, { paddingTop: 0 }]}>
        <FlatList
          data={languages}
          keyExtractor={(item) => item.code}
          renderItem={renderItem}
          getItemLayout={getItemLayout}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={5}
          initialNumToRender={3}
        />
      </ThemedView>
    </>
  );
}
