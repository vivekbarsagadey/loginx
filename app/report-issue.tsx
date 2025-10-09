import { submitIssueReport } from '@/actions/feedback.action';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedButton } from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedTextInput } from '@/components/themed-text-input';
import { ThemedView } from '@/components/themed-view';
import { CommonText } from '@/constants/common-styles';
import { Spacing } from '@/constants/layout';
import { useAuth } from '@/hooks/use-auth-provider';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { IssueType } from '@/types/feedback';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet } from 'react-native';

interface IssueOption {
  id: IssueType;
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
  description: string;
}

const ISSUE_TYPES: IssueOption[] = [
  { id: 'crash', icon: 'x-circle', label: 'App Crash', description: 'App closes unexpectedly' },
  { id: 'performance', icon: 'zap-off', label: 'Performance', description: 'Slow or laggy performance' },
  { id: 'ui-bug', icon: 'layout', label: 'UI Bug', description: 'Visual or display issues' },
  { id: 'functionality', icon: 'tool', label: 'Functionality', description: 'Feature not working as expected' },
  { id: 'security', icon: 'shield-off', label: 'Security', description: 'Security or privacy concern' },
  { id: 'other', icon: 'help-circle', label: 'Other', description: 'Something else' },
];

export default function ReportIssueScreen() {
  const router = useRouter();
  const { user } = useAuth();
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
      Alert.alert('Subject Required', 'Please enter a subject for your issue report.');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Description Required', 'Please describe the issue you encountered.');
      return;
    }

    if (description.trim().length < 20) {
      Alert.alert('Description Too Short', 'Please provide more details about the issue (at least 20 characters).');
      return;
    }

    if (!user) {
      Alert.alert('Error', 'You must be logged in to report an issue');
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
        Alert.alert('Issue Reported!', 'Thank you for reporting this issue. Our team will investigate and work on a fix.', [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]);

        // Reset form
        setSubject('');
        setDescription('');
        setStepsToReproduce('');
        setExpectedBehavior('');
        setActualBehavior('');
        setSelectedIssue('functionality');
      } else {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Alert.alert('Submission Failed', result.error || 'Failed to submit issue report. Please try again.');
      }
    } catch (_error) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Submission Failed', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenContainer scrollable>
      {/* Issue Type Selection */}
      <ThemedView style={styles.section}>
        <ThemedText type="h3" style={CommonText.sectionTitle}>
          What type of issue are you experiencing?
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
          Subject *
        </ThemedText>
        <ThemedTextInput value={subject} onChangeText={setSubject} placeholder="Brief summary of the issue" maxLength={100} editable={!isSubmitting} accessibilityLabel="Issue subject" />
        <ThemedText style={styles.charCount}>{subject.length}/100</ThemedText>
      </ThemedView>

      {/* Description */}
      <ThemedView style={styles.section}>
        <ThemedText type="h3" style={CommonText.sectionTitle}>
          Description *
        </ThemedText>
        <ThemedTextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Describe the issue in detail..."
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
          Steps to Reproduce (Optional)
        </ThemedText>
        <ThemedTextInput
          value={stepsToReproduce}
          onChangeText={setStepsToReproduce}
          placeholder="1. Go to...&#10;2. Click on...&#10;3. See error..."
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
          Expected Behavior (Optional)
        </ThemedText>
        <ThemedTextInput
          value={expectedBehavior}
          onChangeText={setExpectedBehavior}
          placeholder="What did you expect to happen?"
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
          Actual Behavior (Optional)
        </ThemedText>
        <ThemedTextInput
          value={actualBehavior}
          onChangeText={setActualBehavior}
          placeholder="What actually happened?"
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
        <ThemedText style={styles.infoText}>The more details you provide, the faster we can identify and fix the issue. Device information will be automatically included.</ThemedText>
      </ThemedView>

      {/* Submit Button */}
      <ThemedButton
        title={isSubmitting ? 'Submitting...' : 'Submit Issue Report'}
        onPress={handleSubmit}
        disabled={isSubmitting}
        style={styles.submitButton}
        accessibilityLabel="Submit issue report"
      />
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
