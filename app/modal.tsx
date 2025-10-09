import { CommonContainers } from '@/constants/common-styles';
import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import i18n from '@/i18n';

export default function ModalScreen() {
  return (
    <ThemedView style={CommonContainers.centerContent}>
      <ThemedText type="h1">{i18n.t('screens.modal.title')}</ThemedText>
      <Link href="../" style={styles.link}>
        <ThemedText type="body">{i18n.t('screens.modal.goHome')}</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
