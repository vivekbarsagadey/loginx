import { submitFeedback } from '@/actions/feedback.action';
import { CategorySelector } from '@/components/organisms/category-selector';
import { FeedbackFormSection } from '@/components/organisms/feedback-form-section';
import { FormScreen } from '@/components/templates/form-screen';
import { InfoBox } from '@/components/ui/info-box';
import { getFeedbackCategories } from '@/data/feedback-categories';
import { useAlert } from '@/hooks/use-alert';
import { useAuth } from '@/hooks/use-auth-provider';
import { useFormSubmit } from '@/hooks/use-form-submit';
import { useHapticNavigation } from '@/hooks/use-haptic-navigation';
import i18n from '@/i18n';
import type { FeedbackCategory } from '@/types/feedback';
import { validateLengthRange, validateRequiredField } from '@/utils/form-validation';
import { useState } from 'react';

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
    <FormScreen
      title={i18n.t('screens.feedback.title')}
      description={i18n.t('screens.feedback.description')}
      primaryActionLabel={isSubmitting ? i18n.t('screens.feedback.submitting') : i18n.t('screens.feedback.submitButton')}
      onPrimaryAction={submit}
      primaryActionDisabled={isSubmitting}
      primaryActionLoading={isSubmitting}
      secondaryActionLabel={i18n.t('common.cancel')}
      onSecondaryAction={back}
      footer={<InfoBox message={i18n.t('screens.feedback.infoMessage')} variant="info" />}
    >
      {/* Category Selection */}
      <CategorySelector
        categories={categories.map((cat) => ({
          id: cat.id,
          labelKey: i18n.t(cat.labelKey),
          icon: cat.icon,
        }))}
        selectedCategory={selectedCategory}
        onSelectCategory={(id) => handleCategorySelect(id as FeedbackCategory)}
      />

      {/* Feedback Form */}
      <FeedbackFormSection subject={subject} message={message} rating={rating} onSubjectChange={setSubject} onMessageChange={setMessage} onRatingChange={setRating} disabled={isSubmitting} />
      {AlertComponent}
    </FormScreen>
  );
}
