import { submitRating } from '@/actions/feedback.action';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedButton } from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedTextInput } from '@/components/themed-text-input';
import { ThemedView } from '@/components/themed-view';
import { StarRating } from '@/components/ui/star-rating';
import { CommonText } from '@/constants/common-styles';
import { Spacing } from '@/constants/layout';
import { useAlert } from '@/hooks/use-alert';
import { useAuth } from '@/hooks/use-auth-provider';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/i18n';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

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
  const router = useRouter();
  const { user } = useAuth();
  const { show: showAlert, AlertComponent } = useAlert();
  const primaryColor = useThemeColor({}, 'primary');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [selectedLikes, setSelectedLikes] = useState<string[]>([]);
  const [selectedImprovements, setSelectedImprovements] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async () => {
    if (rating === 0) {
      showAlert(i18n.t('screens.rateApp.validation.ratingRequired.title'), i18n.t('screens.rateApp.validation.ratingRequired.message'), [{ text: 'OK' }], { variant: 'warning' });
      return;
    }

    if (!user) {
      showAlert('Error', 'You must be logged in to submit a rating', [{ text: 'OK' }], { variant: 'error' });
      return;
    }

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsSubmitting(true);

    try {
      const result = await submitRating(
        user.uid,
        rating,
        review.trim() || undefined,
        selectedLikes.length > 0 ? selectedLikes : undefined,
        selectedImprovements.length > 0 ? selectedImprovements : undefined
      );

      if (result.success) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // Show success message
        showAlert(
          i18n.t('screens.rateApp.success.title'),
          i18n.t('screens.rateApp.success.message'),
          [
            {
              text: i18n.t('screens.rateApp.success.button'),
              onPress: () => router.back(),
            },
          ],
          { variant: 'success' }
        );
      } else {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        showAlert(i18n.t('screens.rateApp.error.title'), result.error || i18n.t('screens.rateApp.error.message'), [{ text: 'OK' }], { variant: 'error' });
      }
    } catch (_error) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      showAlert(i18n.t('screens.rateApp.error.title'), i18n.t('screens.rateApp.error.message'), [{ text: 'OK' }], { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <ThemedView style={styles.optionsGrid}>
            {LIKE_OPTIONS.map((option) => (
              <OptionButton key={option.id} option={option} isSelected={selectedLikes.includes(option.id)} onPress={() => handleLikeToggle(option.id)} />
            ))}
          </ThemedView>
        </ThemedView>
      )}

      {/* What could be improved? */}
      {rating > 0 && (
        <ThemedView style={styles.section}>
          <ThemedText type="h3" style={CommonText.sectionTitle}>
            {i18n.t('screens.rateApp.improvementsLabel')}
          </ThemedText>
          <ThemedView style={styles.optionsGrid}>
            {IMPROVEMENT_OPTIONS.map((option) => (
              <OptionButton key={option.id} option={option} isSelected={selectedImprovements.includes(option.id)} onPress={() => handleImprovementToggle(option.id)} />
            ))}
          </ThemedView>
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
          <ThemedText style={styles.charCount}>{review.length}/500</ThemedText>
        </ThemedView>
      )}

      {/* Info Box */}
      {rating > 0 && (
        <ThemedView style={[styles.infoBox, { backgroundColor: primaryColor + '1A' }]}>
          <Feather name="heart" size={20} color={primaryColor} />
          <ThemedText style={styles.infoText}>{i18n.t('screens.rateApp.infoMessage')}</ThemedText>
        </ThemedView>
      )}

      {/* Submit Button */}
      {rating > 0 && (
        <ThemedButton
          title={isSubmitting ? i18n.t('screens.rateApp.submitting') : i18n.t('screens.rateApp.submitButton')}
          onPress={handleSubmit}
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

interface OptionButtonProps {
  option: { id: string; label: string; icon: React.ComponentProps<typeof Feather>['name'] };
  isSelected: boolean;
  onPress: () => void;
}

function OptionButton({ option, isSelected, onPress }: OptionButtonProps) {
  const borderColor = useThemeColor({}, 'border');
  const primaryColor = useThemeColor({}, 'primary');
  const surfaceColor = useThemeColor({}, 'surface');

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.optionButton,
        {
          borderColor: isSelected ? primaryColor : borderColor,
          backgroundColor: isSelected ? `${primaryColor}15` : surfaceColor,
        },
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={option.label}
    >
      <Feather name={option.icon} size={20} color={isSelected ? primaryColor : borderColor} />
      <ThemedText style={[styles.optionLabel, { color: isSelected ? primaryColor : undefined }]}>{option.label}</ThemedText>
    </Pressable>
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
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 20,
    borderWidth: 1.5,
    gap: Spacing.xs,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  reviewInput: {
    minHeight: 120,
    textAlignVertical: 'top',
    paddingTop: Spacing.sm,
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: Spacing.xs,
    opacity: 0.6,
  },
  infoBox: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
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
