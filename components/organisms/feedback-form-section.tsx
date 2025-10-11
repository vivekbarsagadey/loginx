import { ThemedTextInput } from '@/components/themed-text-input';
import { CharacterCounter } from '@/components/ui/character-counter';
import { StarRating } from '@/components/ui/star-rating';
import { Spacing } from '@/constants/layout';
import i18n from '@/i18n';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { SectionHeader } from '../molecules/section-header';

interface FeedbackFormSectionProps {
  /**
   * Subject input value
   */
  subject: string;
  /**
   * Message input value
   */
  message: string;
  /**
   * Rating value (0-5)
   */
  rating: number;
  /**
   * Handler for subject change
   */
  onSubjectChange: (value: string) => void;
  /**
   * Handler for message change
   */
  onMessageChange: (value: string) => void;
  /**
   * Handler for rating change
   */
  onRatingChange: (value: number) => void;
  /**
   * Whether the form is disabled (e.g., during submission)
   * @default false
   */
  disabled?: boolean;
  /**
   * Maximum length for subject
   * @default 100
   */
  subjectMaxLength?: number;
  /**
   * Maximum length for message
   * @default 1000
   */
  messageMaxLength?: number;
  /**
   * Whether to show the rating section
   * @default true
   */
  showRating?: boolean;
  /**
   * Optional style overrides
   */
  style?: ViewStyle;
}

/**
 * FeedbackFormSection component for collecting feedback with subject, message, and rating.
 * Provides character counters and proper input validation.
 *
 * @example
 * <FeedbackFormSection
 *   subject={subject}
 *   message={message}
 *   rating={rating}
 *   onSubjectChange={setSubject}
 *   onMessageChange={setMessage}
 *   onRatingChange={setRating}
 * />
 */
export function FeedbackFormSection({
  subject,
  message,
  rating,
  onSubjectChange,
  onMessageChange,
  onRatingChange,
  disabled = false,
  subjectMaxLength = 100,
  messageMaxLength = 1000,
  showRating = true,
  style,
}: FeedbackFormSectionProps) {
  return (
    <View style={[styles.container, style]}>
      {/* Subject Section */}
      <View style={styles.section}>
        <SectionHeader title={i18n.t('screens.feedback.subjectLabel')} />
        <ThemedTextInput
          value={subject}
          onChangeText={onSubjectChange}
          placeholder={i18n.t('screens.feedback.subjectPlaceholder')}
          maxLength={subjectMaxLength}
          editable={!disabled}
          accessibilityLabel="Feedback subject"
          accessibilityHint="Enter a brief subject for your feedback"
        />
        <CharacterCounter count={subject.length} maxLength={subjectMaxLength} />
      </View>

      {/* Message Section */}
      <View style={styles.section}>
        <SectionHeader title={i18n.t('screens.feedback.messageLabel')} />
        <ThemedTextInput
          value={message}
          onChangeText={onMessageChange}
          placeholder={i18n.t('screens.feedback.messagePlaceholder')}
          multiline
          numberOfLines={8}
          maxLength={messageMaxLength}
          editable={!disabled}
          style={styles.messageInput}
          accessibilityLabel="Feedback message"
          accessibilityHint="Enter detailed feedback message"
        />
        <CharacterCounter count={message.length} maxLength={messageMaxLength} />
      </View>

      {/* Rating Section */}
      {showRating && (
        <View style={styles.section}>
          <SectionHeader title="Rate Your Experience (Optional)" />
          <View style={styles.ratingContainer}>
            <StarRating value={rating} onChange={onRatingChange} starSize={32} showLabel accessibilityLabel="Rate your experience" readonly={disabled} />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.lg,
  },
  section: {
    gap: Spacing.sm,
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
});
