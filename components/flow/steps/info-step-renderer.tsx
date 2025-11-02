/**
 * Info Step Renderer
 *
 * Renders information/content steps (terms, privacy, scrollable content) from the flow configuration
 */

import { ThemedButton } from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme-colors';
import type { InfoStepConfig, StepRendererProps } from '@/types/flow';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

export function InfoStepRenderer({ step, data: _data, onUpdate, onNext, onBack: _onBack, onSkip: _onSkip, context: _context }: StepRendererProps<InfoStepConfig>) {
  const colors = useThemeColors();
  const [content, setContent] = useState<string | React.ReactNode>(step.content);
  const [loading, setLoading] = useState(!!step.contentUrl);
  const [error, setError] = useState<string | null>(null);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  // Load content from URL if provided
  useEffect(() => {
    async function loadContent() {
      if (!step.contentUrl) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(step.contentUrl);
        if (!response.ok) {
          throw new Error(`Failed to load content: ${response.statusText}`);
        }
        const text = await response.text();
        setContent(text);
      } catch (_error: unknown) {
        setError(_error instanceof Error ? _error.message : 'Failed to load content');
        console.error('Failed to load content:', _error);
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, [step.contentUrl]);

  const handleScroll = (event: { nativeEvent: { layoutMeasurement: { height: number }; contentOffset: { y: number }; contentSize: { height: number } } }) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    const isAtBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;

    if (isAtBottom && !scrolledToBottom) {
      setScrolledToBottom(true);
    }
  };

  const handleAcknowledge = () => {
    setAcknowledged(!acknowledged);
    onUpdate({ [`${step.id}_acknowledged`]: !acknowledged });
  };

  const handleContinue = async () => {
    if (step.requireAcknowledgment && !acknowledged) {
      return;
    }

    if (step.requireScrollToBottom && !scrolledToBottom) {
      return;
    }

    await onNext();
  };

  const canContinue = (!step.requireAcknowledgment || acknowledged) && (!step.requireScrollToBottom || scrolledToBottom);

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <ThemedText type="body" style={styles.loadingText}>
          Loading content...
        </ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={48} color={colors.error} />
        <ThemedText type="title" style={[styles.errorTitle, { color: colors.error }]}>
          Failed to Load Content
        </ThemedText>
        <ThemedText type="body" style={styles.errorMessage}>
          {error}
        </ThemedText>
        <ThemedButton title="Try Again" onPress={() => window.location.reload()} variant="secondary" leftIcon="refresh" style={styles.retryButton} />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        {step.icon && <Ionicons name={step.icon as keyof typeof Ionicons.glyphMap} size={48} color={step.iconColor || colors.primary} style={styles.headerIcon} />}
        {step.title && (
          <ThemedText type="title" style={styles.title}>
            {step.title}
          </ThemedText>
        )}
        {step.subtitle && (
          <ThemedText type="subtitle1" style={styles.subtitle}>
            {step.subtitle}
          </ThemedText>
        )}
      </ThemedView>

      <ScrollView
        style={styles.contentScroll}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
        onScroll={step.showScrollProgress || step.requireScrollToBottom ? handleScroll : undefined}
        scrollEventThrottle={16}
      >
        {typeof content === 'string' ? (
          <ThemedText type="body" style={styles.contentText}>
            {content}
          </ThemedText>
        ) : (
          content
        )}
      </ScrollView>

      {step.showScrollProgress && (
        <ThemedView style={styles.scrollProgress}>
          {scrolledToBottom ? (
            <View style={styles.scrollCompleteContainer}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <ThemedText type="caption" style={{ color: colors.success }}>
                Scrolled to bottom
              </ThemedText>
            </View>
          ) : (
            <ThemedText type="caption" style={styles.scrollHint}>
              Scroll to bottom to continue
            </ThemedText>
          )}
        </ThemedView>
      )}

      {step.requireAcknowledgment && (
        <ThemedView style={styles.acknowledgmentContainer}>
          <ThemedButton
            title={step.acknowledgmentText || 'I have read and agree'}
            onPress={handleAcknowledge}
            variant={acknowledged ? 'primary' : 'secondary'}
            leftIcon={acknowledged ? 'checkmark-circle' : 'ellipse-outline'}
            style={styles.acknowledgmentButton}
          />
        </ThemedView>
      )}

      <ThemedView style={styles.actions}>
        <ThemedButton title="Continue" onPress={handleContinue} disabled={!canContinue} leftIcon="arrow-forward" style={styles.continueButton} />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },
  loadingText: {
    marginTop: Spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },
  errorTitle: {
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  errorMessage: {
    textAlign: 'center',
    marginBottom: Spacing.lg,
    opacity: 0.8,
  },
  retryButton: {
    marginTop: Spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  headerIcon: {
    marginBottom: Spacing.md,
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  contentScroll: {
    flex: 1,
    marginBottom: Spacing.md,
  },
  contentContainer: {
    padding: Spacing.sm,
  },
  contentText: {
    lineHeight: 24,
  },
  scrollProgress: {
    marginBottom: Spacing.md,
  },
  scrollCompleteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  scrollHint: {
    textAlign: 'center',
    opacity: 0.7,
  },
  acknowledgmentContainer: {
    marginBottom: Spacing.md,
  },
  acknowledgmentButton: {
    marginBottom: Spacing.sm,
  },
  actions: {
    gap: Spacing.md,
  },
  continueButton: {
    marginBottom: Spacing.sm,
  },
});
