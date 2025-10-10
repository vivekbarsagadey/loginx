import { submitFeedback } from '@/actions/feedback.action';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedButton } from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedTextInput } from '@/components/themed-text-input';
import { ThemedView } from '@/components/themed-view';
import { CharacterCounter } from '@/components/ui/character-counter';
import { InfoBox } from '@/components/ui/info-box';
import { SelectableButton } from '@/components/ui/selectable-button';
import { StarRating } from '@/components/ui/star-rating';
import { CommonText } from '@/constants/common-styles';
import { Spacing } from '@/constants/layout';
import { getFeedbackCategories } from '@/data/feedback-categories';
import { useAlert } from '@/hooks/use-alert';
import { useAuth } from '@/hooks/use-auth-provider';
import { useFormSubmit } from '@/hooks/use-form-submit';
import { useHapticNavigation } from '@/hooks/use-haptic-navigation';
import i18n from '@/i18n';
import type { FeedbackCategory } from '@/types/feedback';
import { validateLengthRange, validateRequiredField } from '@/utils/form-validation';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

export default function FeedbackScreen() {
  const { user } = useAuth();
  const { show: showAlert, AlertComponent } = useAlert();
  const { back } = useHapticNavigation();

  const [selectedCategory, setSelectedCategory] = useState<FeedbackCategory>('improvement');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);

  const categories = getFeedbackCategories();

  const handleCategorySelect = (category: FeedbackCategory) => {
    setSelectedCategory(category);
  };

  // Validation function
  const validateForm = () => {
    const subjectValidation = validateRequiredField(subject, 'Subject');
    if (!subjectValidation.isValid) {
      showAlert(i18n.t('screens.feedback.validation.subjectRequired.title'), i18n.t('screens.feedback.validation.subjectRequired.message'), [{ text: 'OK' }], { variant: 'warning' });
      return false;
    }

    const messageValidation = validateLengthRange(message, 10, 1000, 'Message');
    if (!messageValidation.isValid) {
      const isRequired = !message.trim();
      showAlert(
        i18n.t(isRequired ? 'screens.feedback.validation.messageRequired.title' : 'screens.feedback.validation.messageTooShort.title'),
        i18n.t(isRequired ? 'screens.feedback.validation.messageRequired.message' : 'screens.feedback.validation.messageTooShort.message'),
        [{ text: 'OK' }],
        { variant: 'warning' }
      );
      return false;
    }

    if (!user) {
      showAlert('Error', 'You must be logged in to submit feedback', [{ text: 'OK' }], { variant: 'error' });
      return false;
    }

    return true;
  };

  // Form submission with hook
  const { submit, isSubmitting } = useFormSubmit(
    async () => {
      const result = await submitFeedback(user!.uid, user!.email || undefined, selectedCategory, subject, message, rating > 0 ? rating : undefined, true);

      if (!result.success) {
        throw new Error(result.error || 'Failed to submit feedback');
      }

      // Reset form on success
      setSubject('');
      setMessage('');
      setRating(0);
      setSelectedCategory('improvement');
    },
    {
      successTitle: i18n.t('screens.feedback.success.title'),
      successMessage: i18n.t('screens.feedback.success.message'),
      onSuccess: () => back(),
      validate: validateForm,
    }
  );

  return (
    <ScreenContainer scrollable>
      {/* Category Selection */}
      <ThemedView style={styles.section}>
        <ThemedText type="h3" style={CommonText.sectionTitle}>
          {i18n.t('screens.feedback.categoryLabel')}
        </ThemedText>
        <ThemedView style={styles.categoriesGrid}>
          {categories.map((category) => (
            <SelectableButton
              key={category.id}
              label={i18n.t(category.labelKey)}
              icon={category.icon}
              isSelected={selectedCategory === category.id}
              onPress={() => handleCategorySelect(category.id)}
              variant="default"
              style={styles.categoryButton}
            />
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
        <CharacterCounter count={subject.length} maxLength={100} />
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
        <CharacterCounter count={message.length} maxLength={1000} />
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
      <InfoBox message={i18n.t('screens.feedback.infoMessage')} variant="info" style={styles.infoBox} />

      {/* Submit Button */}
      <ThemedButton
        title={isSubmitting ? i18n.t('screens.feedback.submitting') : i18n.t('screens.feedback.submitButton')}
        onPress={submit}
        disabled={isSubmitting}
        style={styles.submitButton}
        accessibilityLabel="Submit feedback"
        accessibilityHint="Submits your feedback to the team"
      />
      {AlertComponent}
    </ScreenContainer>
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
    marginBottom: Spacing.lg,
  },
  submitButton: {
    marginBottom: Spacing.xl,
  },
});
