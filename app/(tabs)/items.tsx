
import { StyleSheet } from 'react-native';
import { ThemedScrollView } from '@/components/themed-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ItemsScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedScrollView style={styles.container}>
        <ThemedText type="h1">Items</ThemedText>
      </ThemedScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
