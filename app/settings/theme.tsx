
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet } from 'react-native';

export default function ThemeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="h1">Theme Screen</ThemedText>
      <ThemedText>Coming Soon!</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
