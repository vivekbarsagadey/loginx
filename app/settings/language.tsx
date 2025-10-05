import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CommonLists } from '@/constants/common-styles';
import { Spacing } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/i18n';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'hi', name: 'हिन्दी' },
];

export default function LanguageScreen() {
  const router = useRouter();
  const borderColor = useThemeColor({}, 'border');
  const tintColor = useThemeColor({}, 'primary');

  const setLanguage = (code: string) => {
    i18n.locale = code;
    router.back();
  };

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

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={languages}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => setLanguage(item.code)}>
            <ThemedText style={styles.itemText}>{item.name}</ThemedText>
            {i18n.locale.startsWith(item.code) && <Feather name="check" size={24} color={tintColor} />}
          </TouchableOpacity>
        )}
      />
    </ThemedView>
  );
}
