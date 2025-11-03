/**
 * Selection Step Renderer
 *
 * Renders selection steps (single or multiple choice) from the flow configuration
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme-colors';
import type { SelectionOption, SelectionStepConfig, StepRendererProps } from '@/types/flow';
import { debugError } from '@/utils/debug';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export function SelectionStepRenderer({ step, data, onUpdate, onNext: _onNext, onBack: _onBack, onSkip: _onSkip, context: _context }: StepRendererProps<SelectionStepConfig>) {
  const colors = useThemeColors();
  const [options, setOptions] = useState<SelectionOption[]>([]);
  const [loading, setLoading] = useState(false);

  // Load options (static or dynamic)
  useEffect(() => {
    async function loadOptions() {
      if (Array.isArray(step.options)) {
        setOptions(step.options);
      } else {
        setLoading(true);
        try {
          const dynamicOptions = await step.options(data);
          setOptions(dynamicOptions);
        } catch (_error: unknown) {
          debugError('Failed to load options:', _error);
          setOptions([]);
        } finally {
          setLoading(false);
        }
      }
    }

    loadOptions();
  }, [step, step.options, data]);

  // Get selected values
  const selectedValues = Array.isArray(data[step.id]) ? (data[step.id] as string[]) : data[step.id] ? [String(data[step.id])] : [];

  const handleSelect = (option: SelectionOption) => {
    if (step.multiple) {
      const currentValues = Array.isArray(data[step.id]) ? (data[step.id] as string[]) : [];
      const newValues = currentValues.includes(option.id) ? currentValues.filter((id) => id !== option.id) : [...currentValues, option.id];
      onUpdate({ [step.id]: newValues });
    } else {
      onUpdate({ [step.id]: option.id });
    }
  };

  const isSelected = (optionId: string) => selectedValues.includes(optionId);

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <ThemedText type="body" style={styles.loadingText}>
          Loading options...
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
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
        {step.description && (
          <ThemedText type="body" style={styles.description}>
            {step.description}
          </ThemedText>
        )}
      </ThemedView>

      <ThemedView style={styles.optionsContainer}>
        {options.map((option) => {
          // Skip conditional options
          if (option.condition && !option.condition(data)) {
            return null;
          }

          const selected = isSelected(option.id);

          return (
            <TouchableOpacity
              key={option.id}
              style={[styles.option, selected && { backgroundColor: colors.primary, borderColor: colors.primary }]}
              onPress={() => handleSelect(option)}
              disabled={option.disabled}
              accessibilityRole="button"
              accessibilityState={{ selected, disabled: option.disabled }}
            >
              {option.image && <Image source={option.image} style={styles.optionImage} resizeMode="cover" />}
              {option.icon && (
                <View style={styles.optionIconContainer}>
                  <Ionicons name={option.icon as keyof typeof Ionicons.glyphMap} size={32} color={selected ? colors['on-primary'] : option.iconColor || colors.text} />
                </View>
              )}
              <View style={styles.optionContent}>
                <ThemedText type="subtitle1" style={[styles.optionTitle, selected && { color: colors['on-primary'] }]}>
                  {option.title}
                </ThemedText>
                {option.subtitle && (
                  <ThemedText type="body" style={[styles.optionSubtitle, selected && { color: colors['on-primary'] }]}>
                    {option.subtitle}
                  </ThemedText>
                )}
                {option.description && (
                  <ThemedText type="caption" style={[styles.optionDescription, selected && { color: colors['on-primary'] }]}>
                    {option.description}
                  </ThemedText>
                )}
                {option.recommended && (
                  <View style={[styles.badge, { backgroundColor: colors.success }]}>
                    <ThemedText type="caption" style={{ color: colors['on-primary'] }}>
                      Recommended
                    </ThemedText>
                  </View>
                )}
                {option.badge && (
                  <View style={[styles.badge, { backgroundColor: colors.info }]}>
                    <ThemedText type="caption" style={{ color: colors['on-primary'] }}>
                      {option.badge}
                    </ThemedText>
                  </View>
                )}
              </View>
              {selected && (
                <View style={styles.checkmark}>
                  <Ionicons name="checkmark-circle" size={24} color={colors['on-primary']} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ThemedView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
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
  description: {
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  optionsContainer: {
    gap: Spacing.md,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    gap: Spacing.md,
  },
  optionImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  optionIconContainer: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    marginBottom: Spacing.xs,
  },
  optionSubtitle: {
    marginBottom: Spacing.xs,
    opacity: 0.8,
  },
  optionDescription: {
    opacity: 0.7,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 6,
    marginTop: Spacing.xs,
  },
  checkmark: {
    marginLeft: Spacing.sm,
  },
});
