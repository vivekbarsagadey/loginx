
import { TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

export function ThemedButton({title, onPress}: {title: string, onPress: () => void}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <ThemedView style={styles.button}>
        <ThemedText style={styles.buttonText}>{title}</ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
  },
});
