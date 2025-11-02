/**
 * Display Step Renderer
 *
 * Renders display/informational steps from the flow configuration
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/layout';
import type { DisplayStepConfig, StepRendererProps } from '@/types/flow';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';

export function DisplayStepRenderer({ step }: StepRendererProps<DisplayStepConfig>) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <ThemedView style={styles.header}>
        {step.icon && <Ionicons name={step.icon as keyof typeof Ionicons.glyphMap} size={48} color={step.iconColor || '#007AFF'} style={styles.headerIcon} />}
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
        {step.description && (
          <ThemedText type="body" style={styles.description}>
            {step.description}
          </ThemedText>
        )}
      </ThemedView>

      {step.image && (
        <View style={styles.imageContainer}>
          <Image source={step.image} style={styles.image} resizeMode="contain" />
        </View>
      )}

      {step.content && step.content.length > 0 && (
        <ThemedView style={styles.contentList}>
          {step.content.map((item, index) => (
            <View key={index} style={styles.contentItem}>
              {item.icon && (
                <View style={styles.iconContainer}>
                  <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={32} color={item.iconColor || '#007AFF'} />
                </View>
              )}
              {item.image && <Image source={item.image} style={styles.contentImage} resizeMode="contain" />}
              <View style={styles.contentText}>
                <ThemedText type="subtitle1" style={styles.contentTitle}>
                  {item.title}
                </ThemedText>
                {item.description && (
                  <ThemedText type="body" style={styles.contentDescription}>
                    {item.description}
                  </ThemedText>
                )}
              </View>
            </View>
          ))}
        </ThemedView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.md,
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
  description: {
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  image: {
    width: '100%',
    height: 200,
  },
  contentList: {
    gap: Spacing.lg,
  },
  contentItem: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentImage: {
    width: 48,
    height: 48,
  },
  contentText: {
    flex: 1,
  },
  contentTitle: {
    marginBottom: Spacing.xs,
  },
  contentDescription: {
    opacity: 0.7,
  },
});
