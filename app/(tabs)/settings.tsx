
import { StyleSheet, useColorScheme, Switch } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/Colors';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  // This is a simplified example. In a real app, you'd want to persist the theme preference.
  const isDark = colorScheme === 'dark';

  // A real implementation would require a way to set the theme preference globally.
  const toggleTheme = () => {
    // This is a placeholder for theme switching logic.
    // You might use a context provider or a state management library to manage the theme.
    alert(`Theme switching is not yet implemented. Current theme is ${colorScheme}.`);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="h1">Settings</ThemedText>
      <ThemedView style={styles.separator} />
      <ThemedView style={styles.settingRow}>
        <ThemedText>Dark Mode</ThemedText>
        <Switch
          trackColor={{ false: Colors.light.tint, true: Colors.dark.tint }}
          thumbColor={isDark ? Colors.dark.text : Colors.light.text}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleTheme}
          value={isDark}
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
    alignSelf: 'center',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
  },
});
