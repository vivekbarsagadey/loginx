/**
 * Consistency Examples
 * Demonstrates consistent UI patterns for predictable user experience
 *
 * Key Principle: Consistency = Predictability
 * Users learn faster when elements behave the same way everywhere
 */

import { ThemedButton } from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAlert } from '@/hooks/use-alert';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function ConsistencyExamples() {
  const alert = useAlert();
  const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3']);

  // ✅ Destructive Action Pattern
  // Always: Red color + Confirmation + Heavy haptic
  const handleDelete = (index: number) => {
    alert.show('Delete Item', `Are you sure you want to delete "${items[index]}"? This action cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive', // Red button + heavy haptic
        onPress: () => {
          const newItems = items.filter((_, i) => i !== index);
          setItems(newItems);
        },
      },
    ]);
  };

  // ✅ Clear All Pattern (Multiple destructive)
  // Always: Red color + Confirmation with count + Heavy haptic
  const handleClearAll = () => {
    alert.show('Clear All Items', `Are you sure you want to delete all ${items.length} items? This action cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete All',
        style: 'destructive',
        onPress: () => {
          setItems([]);
        },
      },
    ]);
  };

  // ✅ Success Action Pattern
  // Always: Primary color + Light haptic + Success feedback
  const handleSave = async () => {
    // Show loading state
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Success feedback
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    alert.show('Saved Successfully', 'Your changes have been saved.', [{ text: 'OK' }], { variant: 'success' });
  };

  // ✅ Warning Action Pattern
  // Always: Warning color + Confirmation + Medium haptic
  const handleSignOut = () => {
    alert.show('Sign Out', 'Are you sure you want to sign out? You will need to log in again.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        onPress: async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          alert.show('Signed Out', 'You have been signed out successfully.', [{ text: 'OK' }], { variant: 'default' });
        },
      },
    ]);
  };

  // ✅ Discard Changes Pattern (Destructive for unsaved work)
  const handleDiscard = () => {
    alert.show('Discard Changes', 'You have unsaved changes. Are you sure you want to discard them?', [
      { text: 'Keep Editing', style: 'cancel' },
      {
        text: 'Discard',
        style: 'destructive', // Red because discarding work is destructive
        onPress: () => {
          // Discard logic
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.content}>
        {/* Header */}
        <ThemedText type="h1" style={styles.title}>
          Consistency Examples
        </ThemedText>
        <ThemedText type="body" style={styles.subtitle}>
          All actions follow consistent patterns for predictable user experience
        </ThemedText>

        {/* Section 1: Destructive Actions */}
        <View style={styles.section}>
          <ThemedText type="h2">🔴 Destructive Actions</ThemedText>
          <ThemedText type="caption" style={styles.sectionDesc}>
            Always red, with confirmation, heavy haptic feedback
          </ThemedText>

          <View style={styles.buttonGroup}>
            <ThemedButton title="Delete Account" variant="destructive" onPress={() => handleDelete(0)} />

            <ThemedButton title="Remove Photo" variant="destructive" onPress={() => handleDelete(1)} />

            <ThemedButton title="Clear All Data" variant="destructive" onPress={handleClearAll} />

            <ThemedButton title="Discard Changes" variant="destructive" onPress={handleDiscard} />
          </View>
        </View>

        {/* Section 2: Primary Actions */}
        <View style={styles.section}>
          <ThemedText type="h2">🔵 Primary Actions</ThemedText>
          <ThemedText type="caption" style={styles.sectionDesc}>
            Brand color, light haptic, loading states
          </ThemedText>

          <View style={styles.buttonGroup}>
            <ThemedButton title="Save Changes" variant="primary" onPress={handleSave} />

            <ThemedButton title="Submit Form" variant="primary" onPress={handleSave} />

            <ThemedButton title="Confirm" variant="primary" onPress={handleSave} />
          </View>
        </View>

        {/* Section 3: Secondary Actions */}
        <View style={styles.section}>
          <ThemedText type="h2">⚪ Secondary Actions</ThemedText>
          <ThemedText type="caption" style={styles.sectionDesc}>
            Outlined, muted colors, less emphasis
          </ThemedText>

          <View style={styles.buttonGroup}>
            <ThemedButton title="Cancel" variant="secondary" onPress={() => {}} />

            <ThemedButton title="Go Back" variant="secondary" onPress={() => {}} />

            <ThemedButton title="Learn More" variant="tertiary" onPress={() => {}} />
          </View>
        </View>

        {/* Section 4: Warning Actions */}
        <View style={styles.section}>
          <ThemedText type="h2">⚠️ Warning Actions</ThemedText>
          <ThemedText type="caption" style={styles.sectionDesc}>
            Important actions that need confirmation
          </ThemedText>

          <View style={styles.buttonGroup}>
            <ThemedButton title="Sign Out" variant="secondary" onPress={handleSignOut} />

            <ThemedButton title="Reset Settings" variant="secondary" onPress={handleSignOut} />
          </View>
        </View>

        {/* Section 5: Link Actions */}
        <View style={styles.section}>
          <ThemedText type="h2">🔗 Link Actions</ThemedText>
          <ThemedText type="caption" style={styles.sectionDesc}>
            Subtle, inline actions
          </ThemedText>

          <View style={styles.buttonGroup}>
            <ThemedButton title="Skip" variant="link" onPress={() => {}} />

            <ThemedButton title="Not now" variant="link" onPress={() => {}} />

            <ThemedButton title="View details" variant="link" onPress={() => {}} />
          </View>
        </View>

        {/* Consistency Benefits */}
        <View style={styles.benefitsSection}>
          <ThemedText type="h2">✅ Benefits of Consistency</ThemedText>

          <View style={styles.benefit}>
            <ThemedText type="body">🚀 Faster Learning</ThemedText>
            <ThemedText type="caption">Users recognize patterns and know what to expect</ThemedText>
          </View>

          <View style={styles.benefit}>
            <ThemedText type="body">🛡️ Fewer Errors</ThemedText>
            <ThemedText type="caption">Confirmation dialogs prevent accidental destructive actions</ThemedText>
          </View>

          <View style={styles.benefit}>
            <ThemedText type="body">💪 Increased Confidence</ThemedText>
            <ThemedText type="caption">Predictable behavior makes users feel in control</ThemedText>
          </View>

          <View style={styles.benefit}>
            <ThemedText type="body">♿ Better Accessibility</ThemedText>
            <ThemedText type="caption">Consistent patterns work better with screen readers</ThemedText>
          </View>

          <View style={styles.benefit}>
            <ThemedText type="body">⚡ Easier Maintenance</ThemedText>
            <ThemedText type="caption">Reusable patterns mean faster development</ThemedText>
          </View>
        </View>

        {/* Pattern Summary */}
        <View style={styles.summarySection}>
          <ThemedText type="h2">📋 Pattern Summary</ThemedText>

          <View style={styles.patternCard}>
            <ThemedText type="bodyBold" style={styles.patternTitle}>
              🔴 Destructive
            </ThemedText>
            <ThemedText type="caption">Color: Red (error)</ThemedText>
            <ThemedText type="caption">Confirmation: Always required</ThemedText>
            <ThemedText type="caption">Haptic: Heavy impact</ThemedText>
            <ThemedText type="caption">Examples: Delete, Remove, Clear</ThemedText>
          </View>

          <View style={styles.patternCard}>
            <ThemedText type="bodyBold" style={styles.patternTitle}>
              🔵 Primary
            </ThemedText>
            <ThemedText type="caption">Color: Brand primary</ThemedText>
            <ThemedText type="caption">Confirmation: Not required</ThemedText>
            <ThemedText type="caption">Haptic: Light impact</ThemedText>
            <ThemedText type="caption">Examples: Save, Submit, Confirm</ThemedText>
          </View>

          <View style={styles.patternCard}>
            <ThemedText type="bodyBold" style={styles.patternTitle}>
              ⚪ Secondary
            </ThemedText>
            <ThemedText type="caption">Color: Outlined/muted</ThemedText>
            <ThemedText type="caption">Confirmation: Not required</ThemedText>
            <ThemedText type="caption">Haptic: Light impact</ThemedText>
            <ThemedText type="caption">Examples: Cancel, Back, Skip</ThemedText>
          </View>
        </View>
      </ThemedView>
      {alert.AlertComponent}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 24,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    opacity: 0.7,
    marginBottom: 16,
  },
  section: {
    gap: 12,
  },
  sectionDesc: {
    opacity: 0.7,
    marginBottom: 8,
  },
  buttonGroup: {
    gap: 12,
  },
  benefitsSection: {
    gap: 16,
    marginTop: 24,
  },
  benefit: {
    gap: 4,
    paddingVertical: 8,
  },
  summarySection: {
    gap: 16,
    marginTop: 24,
  },
  patternCard: {
    padding: 16,
    borderRadius: 12,
    gap: 6,
  },
  patternTitle: {
    marginBottom: 6,
  },
});
