import { gap, rounded } from '@/constants/style-utils';
import { useAlert } from '@/hooks/use-alert';
import { useOnboarding } from '@/hooks/use-onboarding-provider';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/i18n';
import { logger } from '@/utils/logger';
import { savePendingProfileData } from '@/utils/pending-profile';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ThemedButton } from '../themed-button';
import { ThemedText } from '../themed-text';
import { ThemedTextInput } from '../themed-text-input';
import { ThemedView } from '../themed-view';
import { PhotoUpload } from '../ui/photo-upload';

interface ProfileSlideProps {
  width: number;
  onNext?: () => void;
  onSkip?: () => void;
}

export const ProfileSlide = ({ width, onNext, onSkip }: ProfileSlideProps) => {
  const primaryColor = useThemeColor({}, 'primary');
  const successColor = useThemeColor({}, 'success');
  const textMutedColor = useThemeColor({}, 'text-muted');
  const { trackSlideCompletion } = useOnboarding();
  const { show: showAlert, AlertComponent } = useAlert();

  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [isCompleting, setIsCompleting] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleComplete = useCallback(async () => {
    setIsCompleting(true);

    try {
      // Save profile data to temporary storage for use after login
      const profileData = {
        displayName: displayName.trim(),
        photoURL,
        completedAt: Date.now(),
      };

      // Store for retrieval after authentication
      await savePendingProfileData(profileData);

      await trackSlideCompletion('profile');
      onNext?.();
    } catch (_error) {
      // Continue anyway - profile can be updated later
    } finally {
      setIsCompleting(false);
    }
  }, [displayName, photoURL, trackSlideCompletion, onNext]);

  const handleSkip = useCallback(async () => {
    await trackSlideCompletion('profile');
    onSkip?.();
  }, [trackSlideCompletion, onSkip]);

  const handleInteraction = useCallback(() => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  }, [hasInteracted]);

  const isValid = displayName.trim().length >= 2;
  const showCompleteButton = hasInteracted && isValid;

  return (
    <ThemedView style={[styles.container, { width }]}>
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} bounces={false}>
        <ThemedView style={styles.header}>
          <ThemedView style={[styles.iconContainer, { backgroundColor: `${primaryColor}20` }]}>
            <Ionicons name="person-circle" size={48} color={primaryColor} />
          </ThemedView>

          <ThemedText type="h1" style={styles.title}>
            {i18n.t('onb.profile.title')}
          </ThemedText>

          <ThemedText type="body" style={styles.subtitle}>
            {i18n.t('onb.profile.subtitle')}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.form}>
          {/* Profile Photo Upload */}
          <ThemedView style={styles.photoSection}>
            <ThemedText type="h3" style={styles.sectionTitle}>
              {i18n.t('onb.profile.avatar')}
            </ThemedText>
            <PhotoUpload
              value={photoURL}
              onChange={(url) => {
                setPhotoURL(url);
                handleInteraction();
              }}
              onError={(error) => {
                logger.error('Photo upload error:', error);
                showAlert('Upload Error', 'Failed to upload photo. You can add one later.', [{ text: 'OK' }], { variant: 'error' });
              }}
            />
          </ThemedView>

          {/* Display Name Input */}
          <ThemedView style={styles.inputSection}>
            <ThemedText type="h3" style={styles.sectionTitle}>
              {i18n.t('onb.profile.displayName')} *
            </ThemedText>
            <ThemedTextInput
              value={displayName}
              onChangeText={(text) => {
                setDisplayName(text);
                handleInteraction();
              }}
              placeholder="Enter your display name"
              maxLength={50}
              style={styles.input}
              autoCapitalize="words"
              autoCorrect={false}
            />
            <ThemedText type="caption" style={styles.helperText}>
              This is how others will see your name
            </ThemedText>
          </ThemedView>

          {/* Benefits List */}
          <ThemedView style={styles.benefitsSection}>
            <ThemedText type="h3" style={styles.sectionTitle}>
              Why complete your profile?
            </ThemedText>

            {profileBenefits.map((benefit, index) => (
              <ThemedView key={index} style={styles.benefitItem}>
                <ThemedView style={[styles.benefitIcon, { backgroundColor: `${successColor}20` }]}>
                  <Ionicons name={benefit.icon} size={20} color={successColor} />
                </ThemedView>
                <ThemedView style={styles.benefitContent}>
                  <ThemedText type="body" style={styles.benefitTitle}>
                    {benefit.title}
                  </ThemedText>
                  <ThemedText type="caption" style={styles.benefitDescription}>
                    {benefit.description}
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            ))}
          </ThemedView>

          {/* Optional Notice */}
          <ThemedView style={styles.noticeSection}>
            <ThemedView style={[styles.noticeIcon, { backgroundColor: `${textMutedColor}20` }]}>
              <Ionicons name="information-circle" size={20} color={textMutedColor} />
            </ThemedView>
            <ThemedText type="caption" style={styles.noticeText}>
              This step is optional. You can always complete your profile later in Settings.
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ScrollView>

      {/* Action Buttons */}
      <ThemedView style={styles.footer}>
        <ThemedView style={styles.buttonContainer}>
          <ThemedButton title={i18n.t('onb.profile.skip')} onPress={handleSkip} variant="secondary" style={styles.skipButton} />

          {showCompleteButton ? (
            <ThemedButton title={i18n.t('onb.profile.complete')} onPress={handleComplete} loading={isCompleting} disabled={!isValid} style={styles.completeButton} />
          ) : (
            <ThemedButton title="Skip for now" onPress={handleSkip} variant="secondary" style={styles.completeButton} />
          )}
        </ThemedView>

        {/* Progress Indicator */}
        <ThemedView style={styles.progressSection}>
          <ThemedText type="caption" style={styles.progressText}>
            Profile completion: {displayName.trim() ? '50%' : '0%'}
            {photoURL ? ' + photo' : ''}
          </ThemedText>
        </ThemedView>
      </ThemedView>
      {AlertComponent}
    </ThemedView>
  );
};

const profileBenefits = [
  {
    icon: 'person' as const,
    title: 'Personalized Experience',
    description: 'Get a customized app experience tailored to you',
  },
  {
    icon: 'people' as const,
    title: 'Better Recognition',
    description: 'Others can easily identify you in shared spaces',
  },
  {
    icon: 'shield-checkmark' as const,
    title: 'Account Security',
    description: 'A complete profile helps protect your account',
  },
  {
    icon: 'settings' as const,
    title: 'Quick Setup',
    description: 'Set it up now to save time later',
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    ...rounded.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 20,
  },
  form: {
    ...gap.lg,
  },
  photoSection: {
    alignItems: 'center',
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: '600',
  },
  inputSection: {},
  input: {
    marginBottom: 8,
  },
  helperText: {
    opacity: 0.7,
  },
  benefitsSection: {},
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  benefitIcon: {
    width: 40,
    height: 40,
    ...rounded.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontWeight: '500',
    marginBottom: 2,
  },
  benefitDescription: {
    opacity: 0.7,
    lineHeight: 16,
  },
  noticeSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    ...rounded.sm,
    backgroundColor: 'transparent',
  },
  noticeIcon: {
    width: 24,
    height: 24,
    ...rounded.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 2,
  },
  noticeText: {
    flex: 1,
    opacity: 0.7,
    lineHeight: 16,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    ...gap.md,
    marginBottom: 12,
  },
  skipButton: {
    flex: 1,
  },
  completeButton: {
    flex: 2,
  },
  progressSection: {
    alignItems: 'center',
  },
  progressText: {
    opacity: 0.6,
  },
});
