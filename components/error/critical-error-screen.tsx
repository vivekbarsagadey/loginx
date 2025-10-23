/**
 * TASK-042: Critical Error Screen
 * Displays unrecoverable initialization failures with recovery options
 */

import { ThemedButton } from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme-colors';
import i18n from '@/i18n';
import { classifyError } from '@/utils/error-classifier';
import { Ionicons } from '@expo/vector-icons';
import * as Updates from 'expo-updates';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

interface CriticalErrorScreenProps {
  _error: Error | unknown;
  onRetry?: () => void;
  onRestart?: () => void;
}

/**
 * Critical error screen shown when app initialization fails
 * Provides user-friendly error messages and recovery options
 */
export function CriticalErrorScreen({ _error: _error, onRetry, onRestart }: CriticalErrorScreenProps) {
  const colors = useThemeColors();
  const classified = classifyError(_error);

  const handleRestart = async () => {
    if (onRestart) {
      onRestart();
    } else {
      // Attempt to reload the app
      try {
        await Updates.reloadAsync();
      } catch (reloadError) {
        // Fallback: suggest manual restart
        console.error('Failed to reload app:', reloadError);
      }
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Error Icon */}
        <View style={[styles.iconContainer, { backgroundColor: colors.error + '20' }]}>
          <Ionicons name="alert-circle" size={64} color={colors.error} />
        </View>

        {/* Error Title */}
        <ThemedText type="title" style={styles.title}>
          {i18n.t('errors.generic.title')}
        </ThemedText>

        {/* Error Message */}
        <ThemedText type="body" style={styles.message}>
          {classified.userMessage}
        </ThemedText>

        {/* Recovery Suggestions */}
        {classified.recoverySuggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <ThemedText type="subtitle1" style={styles.suggestionsTitle}>
              {i18n.t('common.suggestions') || 'What you can do:'}
            </ThemedText>
            {classified.recoverySuggestions.map((suggestion, index) => (
              <View key={index} style={styles.suggestionItem}>
                <Ionicons name="checkmark-circle-outline" size={20} color={colors.primary} style={styles.suggestionIcon} />
                <ThemedText type="body" style={styles.suggestionText}>
                  {suggestion}
                </ThemedText>
              </View>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {classified.retryable && onRetry && <ThemedButton title={i18n.t('common.retry')} onPress={onRetry} variant="primary" style={styles.button} />}
          <ThemedButton title={i18n.t('common.restart') || 'Restart App'} onPress={handleRestart} variant={classified.retryable ? 'secondary' : 'primary'} style={styles.button} />
        </View>

        {/* Developer Info (dev mode only) */}
        {__DEV__ && (
          <View style={[styles.devInfo, { backgroundColor: colors['bg-elevated'] }]}>
            <ThemedText type="caption" style={styles.devInfoTitle}>
              Debug Information:
            </ThemedText>
            <ThemedText type="caption" style={styles.devInfoText}>
              Category: {classified.category}
            </ThemedText>
            <ThemedText type="caption" style={styles.devInfoText}>
              Severity: {classified.severity}
            </ThemedText>
            <ThemedText type="caption" style={styles.devInfoText}>
              Message: {classified.message}
            </ThemedText>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  message: {
    textAlign: 'center',
    marginBottom: Spacing.xl,
    opacity: 0.8,
    paddingHorizontal: Spacing.md,
  },
  suggestionsContainer: {
    width: '100%',
    marginBottom: Spacing.xl,
  },
  suggestionsTitle: {
    marginBottom: Spacing.md,
    fontWeight: '600',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  suggestionIcon: {
    marginRight: Spacing.sm,
    marginTop: 2,
  },
  suggestionText: {
    flex: 1,
  },
  buttonContainer: {
    width: '100%',
    gap: Spacing.md,
  },
  button: {
    width: '100%',
  },
  devInfo: {
    marginTop: Spacing.xl,
    padding: Spacing.md,
    borderRadius: 8,
    width: '100%',
  },
  devInfoTitle: {
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  devInfoText: {
    fontSize: 12,
    lineHeight: 16,
    opacity: 0.8,
  },
});
