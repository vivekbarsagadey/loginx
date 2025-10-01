import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import i18n from '@/i18n';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'hi', name: 'हिन्दी' },
];

export default function LanguageScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  const setLanguage = (code: string) => {
    i18n.locale = code;
    router.back();
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: Colors[colorScheme ?? 'light'].border,
    },
    itemText: {
      flex: 1,
      marginLeft: 16,
    },
  });

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={languages}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => setLanguage(item.code)}>
            <ThemedText style={styles.itemText}>{item.name}</ThemedText>
            {i18n.locale.startsWith(item.code) && <Feather name="check" size={24} color={Colors[colorScheme ?? 'light'].tint} />}
          </TouchableOpacity>
        )}
      />
    </ThemedView>
  );
}
