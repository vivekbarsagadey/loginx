import { ScreenContainer } from '@/components/screen-container';
import { ThemedButton } from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedTextInput } from '@/components/themed-text-input';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/i18n';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet } from 'react-native';

type FeedbackCategory = 'bug' | 'feature' | 'improvement' | 'other';

interface CategoryOption {
  id: FeedbackCategory;
  icon: React.ComponentProps<typeof Feather>['name'];
  labelKey: string;
}

export default function FeedbackScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<FeedbackCategory>('improvement');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories: CategoryOption[] = [
    { id: 'bug', icon: 'alert-circle', labelKey: 'screens.feedback.categories.bug' },
    { id: 'feature', icon: 'zap', labelKey: 'screens.feedback.categories.feature' },
    { id: 'improvement', icon: 'trending-up', labelKey: 'screens.feedback.categories.improvement' },
    { id: 'other', icon: 'message-circle', labelKey: 'screens.feedback.categories.other' },
  ];

  const handleCategorySelect = async (category: FeedbackCategory) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory(category);
  };

  const handleSubmit = async () => {
    // Validation
    if (!subject.trim()) {
      Alert.alert(i18n.t('screens.feedback.validation.subjectRequired.title'), i18n.t('screens.feedback.validation.subjectRequired.message'));
      return;
    }

    if (!message.trim()) {
      Alert.alert(i18n.t('screens.feedback.validation.messageRequired.title'), i18n.t('screens.feedback.validation.messageRequired.message'));
      return;
    }

    if (message.trim().length < 10) {
      Alert.alert(i18n.t('screens.feedback.validation.messageTooShort.title'), i18n.t('screens.feedback.validation.messageTooShort.message'));
      return;
    }

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Success
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(i18n.t('screens.feedback.success.title'), i18n.t('screens.feedback.success.message'), [
        {
          text: i18n.t('screens.feedback.success.button'),
          onPress: () => router.back(),
        },
      ]);

      // Reset form
      setSubject('');
      setMessage('');
      setSelectedCategory('improvement');
    } catch (_error) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(i18n.t('screens.feedback.error.title'), i18n.t('screens.feedback.error.message'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenContainer scrollable>
      {/* Header */}
      <ThemedText type="h1" style={styles.title}>
        {i18n.t('screens.feedback.title')}
      </ThemedText>
      <ThemedText style={styles.subtitle}>{i18n.t('screens.feedback.subtitle')}</ThemedText>

      {/* Category Selection */}
      <ThemedView style={styles.section}>
        <ThemedText type="h3" style={styles.sectionTitle}>
          {i18n.t('screens.feedback.categoryLabel')}
        </ThemedText>
        <ThemedView style={styles.categoriesGrid}>
          {categories.map((category) => (
            <CategoryButton key={category.id} category={category} isSelected={selectedCategory === category.id} onPress={() => handleCategorySelect(category.id)} />
          ))}
        </ThemedView>
      </ThemedView>

      {/* Subject Input */}
      <ThemedView style={styles.section}>
        <ThemedText type="h3" style={styles.sectionTitle}>
          {i18n.t('screens.feedback.subjectLabel')}
        </ThemedText>
        <ThemedTextInput
          value={subject}
          onChangeText={setSubject}
          placeholder={i18n.t('screens.feedback.subjectPlaceholder')}
          maxLength={100}
          editable={!isSubmitting}
          accessibilityLabel="Feedback subject"
          accessibilityHint="Enter a brief subject for your feedback"
        />
        <ThemedText style={styles.charCount}>{subject.length}/100</ThemedText>
      </ThemedView>

      {/* Message Input */}
      <ThemedView style={styles.section}>
        <ThemedText type="h3" style={styles.sectionTitle}>
          {i18n.t('screens.feedback.messageLabel')}
        </ThemedText>
        <ThemedTextInput
          value={message}
          onChangeText={setMessage}
          placeholder={i18n.t('screens.feedback.messagePlaceholder')}
          multiline
          numberOfLines={8}
          maxLength={1000}
          editable={!isSubmitting}
          style={styles.messageInput}
          accessibilityLabel="Feedback message"
          accessibilityHint="Enter detailed feedback message"
        />
        <ThemedText style={styles.charCount}>{message.length}/1000</ThemedText>
      </ThemedView>

      {/* Info Box */}
      <ThemedView style={styles.infoBox}>
        <Feather name="info" size={20} color={useThemeColor({}, 'primary')} />
        <ThemedText style={styles.infoText}>{i18n.t('screens.feedback.infoMessage')}</ThemedText>
      </ThemedView>

      {/* Submit Button */}
      <ThemedButton
        title={isSubmitting ? i18n.t('screens.feedback.submitting') : i18n.t('screens.feedback.submitButton')}
        onPress={handleSubmit}
        disabled={isSubmitting}
        style={styles.submitButton}
        accessibilityLabel="Submit feedback"
        accessibilityHint="Submits your feedback to the team"
      />
    </ScreenContainer>
  );
}

interface CategoryButtonProps {
  category: CategoryOption;
  isSelected: boolean;
  onPress: () => void;
}

function CategoryButton({ category, isSelected, onPress }: CategoryButtonProps) {
  const borderColor = useThemeColor({}, 'border');
  const primaryColor = useThemeColor({}, 'primary');
  const surfaceColor = useThemeColor({}, 'surface');

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.categoryButton,
        {
          borderColor: isSelected ? primaryColor : borderColor,
          backgroundColor: isSelected ? `${primaryColor}15` : surfaceColor,
        },
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={i18n.t(category.labelKey)}
    >
      <Feather name={category.icon} size={24} color={isSelected ? primaryColor : borderColor} />
      <ThemedText style={[styles.categoryLabel, { color: isSelected ? primaryColor : undefined }]}>{i18n.t(category.labelKey)}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: Spacing.xs,
  },
  subtitle: {
    marginBottom: Spacing.lg,
    opacity: 0.8,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    marginBottom: Spacing.sm,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  categoryButton: {
    flex: 1,
    minWidth: '47%',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: Spacing.xs,
    opacity: 0.6,
  },
  messageInput: {
    minHeight: 120,
    textAlignVertical: 'top',
    paddingTop: Spacing.sm,
  },
  infoBox: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    marginBottom: Spacing.lg,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  submitButton: {
    marginBottom: Spacing.xl,
  },
});
