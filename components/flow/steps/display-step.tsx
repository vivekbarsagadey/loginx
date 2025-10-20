/**
 * Display Step Component
 * Shows information, images, features
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { type DisplayStepConfig } from '@/types/flow';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import type { FlowData } from '../flow-step-wrapper';

interface DisplayStepProps {
  step: DisplayStepConfig;
  data: FlowData;
  onUpdate: (data: Partial<FlowData>) => void;
}

export function DisplayStep({ step, data: _data, onUpdate: _onUpdate }: DisplayStepProps) {
  return (
    <ThemedView style={styles.container}>
      {step.image && <Image source={step.image} style={styles.image} resizeMode="contain" />}

      <ThemedText type="title" style={styles.title}>
        {step.title}
      </ThemedText>

      {step.subtitle && (
        <ThemedText type="subtitle1" style={styles.subtitle}>
          {step.subtitle}
        </ThemedText>
      )}

      {step.description && <ThemedText style={styles.description}>{step.description}</ThemedText>}

      {step.content &&
        step.content.map((item, index) => (
          <View key={index} style={styles.contentItem}>
            <ThemedText type="body">{item.title}</ThemedText>
            {item.description && (
              <ThemedText type="caption" style={styles.itemDescription}>
                {item.description}
              </ThemedText>
            )}
          </View>
        ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 24,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 16,
  },
  description: {
    marginBottom: 24,
  },
  contentItem: {
    marginBottom: 16,
  },
  itemDescription: {
    marginTop: 4,
  },
});
