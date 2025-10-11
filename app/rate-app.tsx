import { submitRating } from '@/actions/feedback.action';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedButton } from '@/components/themed-button';
import { HStack } from '@/components/themed-stack';
import { ThemedText } from '@/components/themed-text';
import { ThemedTextInput } from '@/components/themed-text-input';
import { ThemedView } from '@/components/themed-view';
import { CharacterCounter } from '@/components/ui/character-counter';
import { InfoBox } from '@/components/ui/info-box';
import { SelectableButton } from '@/components/ui/selectable-button';
import { StarRating } from '@/components/ui/star-rating';
import { CommonText } from '@/constants/common-styles';
import { Spacing } from '@/constants/layout';
import { useAlert } from '@/hooks/use-alert';
import { useAuth } from '@/hooks/use-auth-provider';
import { useFormSubmit } from '@/hooks/use-form-submit';
import { useHapticNavigation } from '@/hooks/use-haptic-navigation';
import i18n from '@/i18n';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

const RATING_LABELS = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

const LIKE_OPTIONS = [
  { id: 'ui', label: 'User Interface', icon: 'layout' as const },
  { id: 'performance', label: 'Performance', icon: 'zap' as const },
  { id: 'features', label: 'Features', icon: 'star' as const },
  { id: 'security', label: 'Security', icon: 'shield' as const },
  { id: 'ease', label: 'Easy to Use', icon: 'check-circle' as const },
  { id: 'support', label: 'Support', icon: 'message-circle' as const },
];

const IMPROVEMENT_OPTIONS = [
  { id: 'speed', label: 'Speed', icon: 'zap' as const },
  { id: 'design', label: 'Design', icon: 'eye' as const },
  { id: 'features', label: 'More Features', icon: 'plus-circle' as const },
  { id: 'stability', label: 'Stability', icon: 'shield' as const },
  { id: 'docs', label: 'Documentation', icon: 'book' as const },
  { id: 'other', label: 'Other', icon: 'more-horizontal' as const },
];

export default function RateAppScreen() {
  const { user } = useAuth();
  const { show: showAlert, AlertComponent } = useAlert();
  const { back } = useHapticNavigation();

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [selectedLikes, setSelectedLikes] = useState<string[]>([]);
  const [selectedImprovements, setSelectedImprovements] = useState<string[]>([]);

  const handleRatingChange = async (newRating: number) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRating(newRating);
  };

  const handleLikeToggle = async (id: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedLikes((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const handleImprovementToggle = async (id: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedImprovements((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  // Validation function
  const validateForm = () => {
    if (rating === 0) {
      showAlert(i18n.t('screens.rateApp.validation.ratingRequired.title'), i18n.t('screens.rateApp.validation.ratingRequired.message'), [{ text: 'OK' }], { variant: 'warning' });
      return false;
    }

    if (!user) {
      showAlert('Error', 'You must be logged in to submit a rating', [{ text: 'OK' }], { variant: 'error' });
      return false;
    }

    return true;
  };

  // Form submission with hook
  const { submit, isSubmitting } = useFormSubmit(
    async () => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const result = await submitRating(
        user.uid,
        rating,
        review.trim() || undefined,
        selectedLikes.length > 0 ? selectedLikes : undefined,
        selectedImprovements.length > 0 ? selectedImprovements : undefined
      );

      if (!result.success) {
        throw new Error(result.error || 'Failed to submit rating');
      }
    },
    {
      successTitle: i18n.t('screens.rateApp.success.title'),
      successMessage: i18n.t('screens.rateApp.success.message'),
      onSuccess: () => back(),
      validate: validateForm,
    }
  );

  return (
    <ScreenContainer scrollable>
      {/* Star Rating */}
      <ThemedView style={styles.ratingSection}>
        <ThemedText type="h3" style={CommonText.sectionTitle}>
          {i18n.t('screens.rateApp.ratingLabel')}
        </ThemedText>
        <StarRating value={rating} onChange={handleRatingChange} starSize={40} showLabel labels={RATING_LABELS} accessibilityLabel="Rate the app" />
      </ThemedView>

      {/* What do you like? */}
      {rating > 0 && (
        <ThemedView style={styles.section}>
          <ThemedText type="h3" style={CommonText.sectionTitle}>
            {i18n.t('screens.rateApp.likesLabel')}
          </ThemedText>
          <HStack spacing="sm" wrap style={styles.optionsGrid}>
            {LIKE_OPTIONS.map((option) => (
              <SelectableButton key={option.id} label={option.label} icon={option.icon} isSelected={selectedLikes.includes(option.id)} onPress={() => handleLikeToggle(option.id)} variant="compact" />
            ))}
          </HStack>
        </ThemedView>
      )}

      {/* What could be improved? */}
      {rating > 0 && (
        <ThemedView style={styles.section}>
          <ThemedText type="h3" style={CommonText.sectionTitle}>
            {i18n.t('screens.rateApp.improvementsLabel')}
          </ThemedText>
          <HStack spacing="sm" wrap style={styles.optionsGrid}>
            {IMPROVEMENT_OPTIONS.map((option) => (
              <SelectableButton
                key={option.id}
                label={option.label}
                icon={option.icon}
                isSelected={selectedImprovements.includes(option.id)}
                onPress={() => handleImprovementToggle(option.id)}
                variant="compact"
              />
            ))}
          </HStack>
        </ThemedView>
      )}

      {/* Review Text */}
      {rating > 0 && (
        <ThemedView style={styles.section}>
          <ThemedText type="h3" style={CommonText.sectionTitle}>
            {i18n.t('screens.rateApp.reviewLabel')}
          </ThemedText>
          <ThemedTextInput
            value={review}
            onChangeText={setReview}
            placeholder={i18n.t('screens.rateApp.reviewPlaceholder')}
            multiline
            numberOfLines={6}
            maxLength={500}
            editable={!isSubmitting}
            style={styles.reviewInput}
            accessibilityLabel="Review text"
            accessibilityHint="Enter your detailed review"
          />
          <CharacterCounter count={review.length} maxLength={500} />
        </ThemedView>
      )}

      {/* Info Box */}
      {rating > 0 && <InfoBox message={i18n.t('screens.rateApp.infoMessage')} icon="heart" variant="info" style={styles.infoBox} />}

      {/* Submit Button */}
      {rating > 0 && (
        <ThemedButton
          title={isSubmitting ? i18n.t('screens.rateApp.submitting') : i18n.t('screens.rateApp.submitButton')}
          onPress={submit}
          disabled={isSubmitting}
          style={styles.submitButton}
          accessibilityLabel="Submit rating"
          accessibilityHint="Submits your rating and review"
        />
      )}
      {AlertComponent}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  ratingSection: {
    marginBottom: Spacing.xl,
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  reviewInput: {
    minHeight: 120,
    textAlignVertical: 'top',
    paddingTop: Spacing.sm,
  },
  infoBox: {
    marginBottom: Spacing.lg,
  },
  submitButton: {
    marginBottom: Spacing.xl,
  },
});
