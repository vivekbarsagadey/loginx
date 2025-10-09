import { submitIssueReport } from '@/actions/feedback.action';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedButton } from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedTextInput } from '@/components/themed-text-input';
import { ThemedView } from '@/components/themed-view';
import { CommonText } from '@/constants/common-styles';
import { Spacing } from '@/constants/layout';
import { useAlert } from '@/hooks/use-alert';
import { useAuth } from '@/hooks/use-auth-provider';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/i18n';
import type { IssueType } from '@/types/feedback';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

interface IssueOption {
  id: IssueType;
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
  description: string;
}

const ISSUE_TYPES: IssueOption[] = [
  { id: 'crash', icon: 'x-circle', label: i18n.t('screens.reportIssue.issueTypes.crash.label'), description: i18n.t('screens.reportIssue.issueTypes.crash.description') },
  { id: 'performance', icon: 'zap-off', label: i18n.t('screens.reportIssue.issueTypes.performance.label'), description: i18n.t('screens.reportIssue.issueTypes.performance.description') },
  { id: 'ui-bug', icon: 'layout', label: i18n.t('screens.reportIssue.issueTypes.uiBug.label'), description: i18n.t('screens.reportIssue.issueTypes.uiBug.description') },
  { id: 'functionality', icon: 'tool', label: i18n.t('screens.reportIssue.issueTypes.functionality.label'), description: i18n.t('screens.reportIssue.issueTypes.functionality.description') },
  { id: 'security', icon: 'shield-off', label: i18n.t('screens.reportIssue.issueTypes.security.label'), description: i18n.t('screens.reportIssue.issueTypes.security.description') },
  { id: 'other', icon: 'help-circle', label: i18n.t('screens.reportIssue.issueTypes.other.label'), description: i18n.t('screens.reportIssue.issueTypes.other.description') },
];

export default function ReportIssueScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { show: showAlert, AlertComponent } = useAlert();
  const primaryColor = useThemeColor({}, 'primary');
  const [selectedIssue, setSelectedIssue] = useState<IssueType>('functionality');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [stepsToReproduce, setStepsToReproduce] = useState('');
  const [expectedBehavior, setExpectedBehavior] = useState('');
  const [actualBehavior, setActualBehavior] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleIssueSelect = async (issueType: IssueType) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedIssue(issueType);
  };

  const handleSubmit = async () => {
    // Validation
    if (!subject.trim()) {
      showAlert(i18n.t('screens.reportIssue.validation.subjectRequired.title'), i18n.t('screens.reportIssue.validation.subjectRequired.message'), [{ text: i18n.t('common.ok') }], {
        variant: 'warning',
      });
      return;
    }

    if (!description.trim()) {
      showAlert(i18n.t('screens.reportIssue.validation.descriptionRequired.title'), i18n.t('screens.reportIssue.validation.descriptionRequired.message'), [{ text: i18n.t('common.ok') }], {
        variant: 'warning',
      });
      return;
    }

    if (description.trim().length < 20) {
      showAlert(i18n.t('screens.reportIssue.validation.descriptionTooShort.title'), i18n.t('screens.reportIssue.validation.descriptionTooShort.message'), [{ text: i18n.t('common.ok') }], {
        variant: 'warning',
      });
      return;
    }

    if (!user) {
      showAlert(i18n.t('common.error'), 'You must be logged in to report an issue', [{ text: i18n.t('common.ok') }], { variant: 'error' });
      return;
    }

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsSubmitting(true);

    try {
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

      if (result.success) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        showAlert(
          i18n.t('screens.reportIssue.success.title'),
          i18n.t('screens.reportIssue.success.message'),
          [
            {
              text: i18n.t('common.ok'),
              onPress: () => router.back(),
            },
          ],
          { variant: 'success' }
        );

        // Reset form
        setSubject('');
        setDescription('');
        setStepsToReproduce('');
        setExpectedBehavior('');
        setActualBehavior('');
        setSelectedIssue('functionality');
      } else {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        showAlert(i18n.t('screens.reportIssue.error.title'), result.error || i18n.t('screens.reportIssue.error.message'), [{ text: i18n.t('common.ok') }], { variant: 'error' });
      }
    } catch (_error) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      showAlert(i18n.t('screens.reportIssue.error.title'), i18n.t('screens.reportIssue.error.message'), [{ text: i18n.t('common.ok') }], { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenContainer scrollable>
      {/* Issue Type Selection */}
      <ThemedView style={styles.section}>
        <ThemedText type="h3" style={CommonText.sectionTitle}>
          {i18n.t('screens.reportIssue.issueType')}
        </ThemedText>
        <ThemedView style={styles.issueGrid}>
          {ISSUE_TYPES.map((issue) => (
            <IssueTypeButton key={issue.id} issue={issue} isSelected={selectedIssue === issue.id} onPress={() => handleIssueSelect(issue.id)} />
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
        <ThemedText style={styles.charCount}>{subject.length}/100</ThemedText>
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
        <ThemedText style={styles.charCount}>{description.length}/1000</ThemedText>
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
        <ThemedText style={styles.charCount}>{stepsToReproduce.length}/500</ThemedText>
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
      <ThemedView style={styles.infoBox}>
        <Feather name="info" size={20} color={primaryColor} />
        <ThemedText style={styles.infoText}>{i18n.t('screens.reportIssue.infoText')}</ThemedText>
      </ThemedView>

      {/* Submit Button */}
      <ThemedButton
        title={isSubmitting ? i18n.t('screens.reportIssue.submitting') : i18n.t('screens.reportIssue.submitButton')}
        onPress={handleSubmit}
        disabled={isSubmitting}
        style={styles.submitButton}
        accessibilityLabel="Submit issue report"
      />
      {AlertComponent}
    </ScreenContainer>
  );
}

interface IssueTypeButtonProps {
  issue: IssueOption;
  isSelected: boolean;
  onPress: () => void;
}

function IssueTypeButton({ issue, isSelected, onPress }: IssueTypeButtonProps) {
  const borderColor = useThemeColor({}, 'border');
  const primaryColor = useThemeColor({}, 'primary');
  const surfaceColor = useThemeColor({}, 'surface');
  const textMutedColor = useThemeColor({}, 'text-muted');

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.issueButton,
        {
          borderColor: isSelected ? primaryColor : borderColor,
          backgroundColor: isSelected ? `${primaryColor}15` : surfaceColor,
        },
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      accessibilityLabel={issue.label}
    >
      <Feather name={issue.icon} size={24} color={isSelected ? primaryColor : borderColor} />
      <ThemedText style={[styles.issueLabel, { color: isSelected ? primaryColor : undefined }]}>{issue.label}</ThemedText>
      <ThemedText style={[styles.issueDescription, { color: isSelected ? primaryColor : textMutedColor }]}>{issue.description}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: Spacing.lg,
  },
  issueGrid: {
    gap: Spacing.sm,
  },
  issueButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: 12,
    borderWidth: 2,
    gap: Spacing.xs,
  },
  issueLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  issueDescription: {
    fontSize: 13,
    opacity: 0.8,
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: Spacing.xs,
    opacity: 0.6,
  },
  textArea: {
    minHeight: 100,
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
