import { submitFeedback } from '@/actions/feedback.action';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedButton } from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedTextInput } from '@/components/themed-text-input';
import { ThemedView } from '@/components/themed-view';
import { StarRating } from '@/components/ui/star-rating';
import { CommonText } from '@/constants/common-styles';
import { Spacing } from '@/constants/layout';
import { useAuth } from '@/hooks/use-auth-provider';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/i18n';
import type { FeedbackCategory } from '@/types/feedback';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet } from 'react-native';

interface CategoryOption {
  id: FeedbackCategory;
  icon: React.ComponentProps<typeof Feather>['name'];
  labelKey: string;
}

export default function FeedbackScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const primaryColor = useThemeColor({}, 'primary');
  const [selectedCategory, setSelectedCategory] = useState<FeedbackCategory>('improvement');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);
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

    if (!user) {
      Alert.alert('Error', 'You must be logged in to submit feedback');
      return;
    }

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsSubmitting(true);

    try {
      const result = await submitFeedback(user.uid, user.email || undefined, selectedCategory, subject, message, rating > 0 ? rating : undefined, true);

      if (result.success) {
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
        setRating(0);
        setSelectedCategory('improvement');
      } else {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert(i18n.t('screens.feedback.error.title'), result.error || i18n.t('screens.feedback.error.message'));
      }
    } catch (_error) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(i18n.t('screens.feedback.error.title'), i18n.t('screens.feedback.error.message'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenContainer scrollable>
      {/* Category Selection */}
      <ThemedView style={styles.section}>
        <ThemedText type="h3" style={CommonText.sectionTitle}>
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
        <ThemedText type="h3" style={CommonText.sectionTitle}>
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
        <ThemedText type="h3" style={CommonText.sectionTitle}>
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

      {/* Optional Rating */}
      <ThemedView style={styles.section}>
        <ThemedText type="h3" style={CommonText.sectionTitle}>
          Rate Your Experience (Optional)
        </ThemedText>
        <ThemedView style={styles.ratingContainer}>
          <StarRating value={rating} onChange={setRating} starSize={32} showLabel accessibilityLabel="Rate your experience" />
        </ThemedView>
      </ThemedView>

      {/* Info Box */}
      <ThemedView style={styles.infoBox}>
        <Feather name="info" size={20} color={primaryColor} />
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
  section: {
    marginBottom: Spacing.lg,
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
  ratingContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
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
