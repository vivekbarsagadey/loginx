import { submitIssueReport } from '@/actions/feedback.action';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedButton } from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedTextInput } from '@/components/themed-text-input';
import { ThemedView } from '@/components/themed-view';
import { CharacterCounter } from '@/components/ui/character-counter';
import { InfoBox } from '@/components/ui/info-box';
import { SelectableButton } from '@/components/ui/selectable-button';
import { CommonText } from '@/constants/common-styles';
import { Spacing } from '@/constants/layout';
import { getIssueTypes } from '@/data/issue-types';
import { useAlert } from '@/hooks/use-alert';
import { useAuth } from '@/hooks/use-auth-provider';
import { useFormSubmit } from '@/hooks/use-form-submit';
import { useHapticNavigation } from '@/hooks/use-haptic-navigation';
import i18n from '@/i18n';
import type { IssueType } from '@/types/feedback';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

const ISSUE_TYPES = getIssueTypes();

export default function ReportIssueScreen() {
  const { user } = useAuth();
  const { show: showAlert, AlertComponent } = useAlert();
  const { back } = useHapticNavigation();

  const [selectedIssue, setSelectedIssue] = useState<IssueType>('functionality');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [stepsToReproduce, setStepsToReproduce] = useState('');
  const [expectedBehavior, setExpectedBehavior] = useState('');
  const [actualBehavior, setActualBehavior] = useState('');

  const handleIssueSelect = async (issueType: IssueType) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedIssue(issueType);
  };

  // Validation function
  const validateForm = () => {
    if (!subject.trim()) {
      showAlert(i18n.t('screens.reportIssue.validation.subjectRequired.title'), i18n.t('screens.reportIssue.validation.subjectRequired.message'), [{ text: i18n.t('common.ok') }], {
        variant: 'warning',
      });
      return false;
    }

    if (!description.trim()) {
      showAlert(i18n.t('screens.reportIssue.validation.descriptionRequired.title'), i18n.t('screens.reportIssue.validation.descriptionRequired.message'), [{ text: i18n.t('common.ok') }], {
        variant: 'warning',
      });
      return false;
    }

    if (description.trim().length < 20) {
      showAlert(i18n.t('screens.reportIssue.validation.descriptionTooShort.title'), i18n.t('screens.reportIssue.validation.descriptionTooShort.message'), [{ text: i18n.t('common.ok') }], {
        variant: 'warning',
      });
      return false;
    }

    if (!user) {
      showAlert(i18n.t('common.error'), 'You must be logged in to report an issue', [{ text: i18n.t('common.ok') }], { variant: 'error' });
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

      const result = await submitIssueReport(
        user.uid,
        user.email || undefined,
        selectedIssue,
        subject,
        description,
        stepsToReproduce.trim() || undefined,
        expectedBehavior.trim() || undefined,
        actualBehavior.trim() || undefined
      );

      if (!result.success) {
        throw new Error(result.error || 'Failed to submit issue report');
      }

      // Reset form on success
      setSubject('');
      setDescription('');
      setStepsToReproduce('');
      setExpectedBehavior('');
      setActualBehavior('');
      setSelectedIssue('functionality');
    },
    {
      successTitle: i18n.t('screens.reportIssue.success.title'),
      successMessage: i18n.t('screens.reportIssue.success.message'),
      onSuccess: () => back(),
      validate: validateForm,
    }
  );

  return (
    <ScreenContainer scrollable>
      {/* Issue Type Selection */}
      <ThemedView style={styles.section}>
        <ThemedText type="h3" style={CommonText.sectionTitle}>
          {i18n.t('screens.reportIssue.issueType')}
        </ThemedText>
        <ThemedView style={styles.issueGrid}>
          {ISSUE_TYPES.map((issue) => (
            <SelectableButton
              key={issue.id}
              label={issue.label}
              description={issue.description}
              icon={issue.icon}
              isSelected={selectedIssue === issue.id}
              onPress={() => handleIssueSelect(issue.id)}
              variant="default"
            />
          ))}
        </ThemedView>
      </ThemedView>

      {/* Subject */}
      <ThemedView style={styles.section}>
        <ThemedText type="h3" style={CommonText.sectionTitle}>
          {i18n.t('screens.reportIssue.subject')}
        </ThemedText>
        <ThemedTextInput
          value={subject}
          onChangeText={setSubject}
          placeholder={i18n.t('screens.reportIssue.subjectPlaceholder')}
          maxLength={100}
          editable={!isSubmitting}
          accessibilityLabel="Issue subject"
        />
        <CharacterCounter count={subject.length} maxLength={100} />
      </ThemedView>

      {/* Description */}
      <ThemedView style={styles.section}>
        <ThemedText type="h3" style={CommonText.sectionTitle}>
          {i18n.t('screens.reportIssue.description')}
        </ThemedText>
        <ThemedTextInput
          value={description}
          onChangeText={setDescription}
          placeholder={i18n.t('screens.reportIssue.descriptionPlaceholder')}
          multiline
          numberOfLines={6}
          maxLength={1000}
          editable={!isSubmitting}
          style={styles.textArea}
          accessibilityLabel="Issue description"
        />
        <CharacterCounter count={description.length} maxLength={1000} />
      </ThemedView>

      {/* Steps to Reproduce */}
      <ThemedView style={styles.section}>
        <ThemedText type="h3" style={CommonText.sectionTitle}>
          {i18n.t('screens.reportIssue.stepsToReproduce')}
        </ThemedText>
        <ThemedTextInput
          value={stepsToReproduce}
          onChangeText={setStepsToReproduce}
          placeholder={i18n.t('screens.reportIssue.stepsPlaceholder')}
          multiline
          numberOfLines={5}
          maxLength={500}
          editable={!isSubmitting}
          style={styles.textArea}
          accessibilityLabel="Steps to reproduce"
        />
        <CharacterCounter count={stepsToReproduce.length} maxLength={500} />
      </ThemedView>

      {/* Expected vs Actual Behavior */}
      <ThemedView style={styles.section}>
        <ThemedText type="h3" style={CommonText.sectionTitle}>
          {i18n.t('screens.reportIssue.expectedBehavior')}
        </ThemedText>
        <ThemedTextInput
          value={expectedBehavior}
          onChangeText={setExpectedBehavior}
          placeholder={i18n.t('screens.reportIssue.expectedPlaceholder')}
          multiline
          numberOfLines={3}
          maxLength={300}
          editable={!isSubmitting}
          style={styles.textArea}
          accessibilityLabel="Expected behavior"
        />
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="h3" style={CommonText.sectionTitle}>
          {i18n.t('screens.reportIssue.actualBehavior')}
        </ThemedText>
        <ThemedTextInput
          value={actualBehavior}
          onChangeText={setActualBehavior}
          placeholder={i18n.t('screens.reportIssue.actualPlaceholder')}
          multiline
          numberOfLines={3}
          maxLength={300}
          editable={!isSubmitting}
          style={styles.textArea}
          accessibilityLabel="Actual behavior"
        />
      </ThemedView>

      {/* Info Box */}
      <InfoBox message={i18n.t('screens.reportIssue.infoText')} icon="info" variant="info" style={styles.infoBox} />

      {/* Submit Button */}
      <ThemedButton
        title={isSubmitting ? i18n.t('screens.reportIssue.submitting') : i18n.t('screens.reportIssue.submitButton')}
        onPress={submit}
        disabled={isSubmitting}
        style={styles.submitButton}
        accessibilityLabel="Submit issue report"
      />
      {AlertComponent}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.lg,
  },
  issueGrid: {
    gap: Spacing.sm,
  },
  textArea: {
    minHeight: 100,
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
