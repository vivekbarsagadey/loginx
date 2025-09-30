
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { StyleSheet } from 'react-native';

export default function NotificationsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="h1">Notifications</ThemedText>
      <ThemedText>Manage your notification settings here.</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
