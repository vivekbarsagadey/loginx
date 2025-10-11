import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme-colors';
import i18n from '@/i18n';
import { Link, Stack } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function NotFoundScreen() {
  const colors = useThemeColors();

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: Spacing.lg,
        },
        link: {
          marginTop: Spacing.md,
          paddingVertical: Spacing.md,
        },
        linkText: {
          fontSize: 14,
          color: colors.primary,
        },
      }),
    [colors]
  );

  return (
    <>
      <Stack.Screen options={{ title: i18n.t('screens.notFound.title') }} />
      <ThemedView style={styles.container}>
        <ThemedText type="h2">{i18n.t('screens.notFound.message')}</ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText style={styles.linkText}>{i18n.t('screens.notFound.goHome')}</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}
