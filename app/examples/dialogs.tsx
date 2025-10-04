/**
 * Dialog Components Usage Examples
 * Complete examples of how to use all dialog components in the project
 */

import { ScreenContainer } from '@/components/screen-container';
import { ThemedButton } from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { ActionSheet, useActionSheet } from '@/components/ui/action-sheet';
import { BottomSheet, ConfirmationDialog, ThemedAlert } from '@/components/ui/dialog';
import { LoadingOverlay, useLoadingOverlay } from '@/components/ui/loading-overlay';
import { Toast, useToast } from '@/components/ui/toast';
import { Spacing } from '@/constants/layout';
import { useConfirmation, useDialog } from '@/hooks/use-dialog';
import i18n from '@/i18n';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function DialogExamplesScreen() {
  // Initialize all dialog hooks
  const alert = useDialog();
  const confirmation = useConfirmation();
  const bottomSheet = useDialog();
  const actionSheet = useActionSheet();
  const toast = useToast();
  const loading = useLoadingOverlay();

  // Example handlers
  const handleShowAlert = () => {
    alert.show();
  };

  const handleShowSuccess = () => {
    toast.showSuccess('Operation completed successfully!');
  };

  const handleShowError = () => {
    toast.showError('Something went wrong. Please try again.');
  };

  const handleShowWarning = () => {
    toast.showWarning('This action requires your attention.');
  };

  const handleShowInfo = () => {
    toast.showInfo('Here is some useful information.');
  };

  const handleShowConfirmation = () => {
    confirmation.show({
      title: i18n.t('dialogs.examples.confirmation.title'),
      message: i18n.t('dialogs.examples.confirmation.message'),
      destructive: false,
      onConfirm: async () => {
        // Simulate async action
        loading.show('Processing...');
        await new Promise((resolve) => setTimeout(resolve, 2000));
        loading.hide();
        toast.showSuccess('Action confirmed!');
      },
    });
  };

  const handleShowDestructiveConfirmation = () => {
    confirmation.show({
      title: 'Delete Item',
      message: 'This will permanently delete the item. This action cannot be undone.',
      destructive: true,
      onConfirm: async () => {
        loading.show('Deleting...');
        await new Promise((resolve) => setTimeout(resolve, 1500));
        loading.hide();
        toast.showSuccess('Item deleted successfully');
      },
    });
  };

  const handleShowBottomSheet = () => {
    bottomSheet.show();
  };

  const handleShowActionSheet = () => {
    actionSheet.show(
      [
        {
          label: 'Edit',
          icon: 'edit',
          onPress: () => {
            toast.showInfo('Edit selected');
          },
        },
        {
          label: 'Share',
          icon: 'share',
          onPress: () => {
            toast.showInfo('Share selected');
          },
        },
        {
          label: 'Duplicate',
          icon: 'copy',
          onPress: () => {
            toast.showInfo('Duplicate selected');
          },
        },
        {
          label: 'Delete',
          icon: 'trash',
          destructive: true,
          onPress: () => {
            toast.showError('Delete selected');
          },
        },
      ],
      'Choose Action',
      'Select what you want to do with this item'
    );
  };

  const handleShowLoading = async () => {
    loading.show('Loading data...');
    await new Promise((resolve) => setTimeout(resolve, 3000));
    loading.hide();
    toast.showSuccess('Data loaded!');
  };

  return (
    <ScreenContainer scrollable>
      <ThemedText type="h1" style={styles.title}>
        Dialog Components
      </ThemedText>
      <ThemedText type="body" style={styles.description}>
        Examples of all dialog components available in the app.
      </ThemedText>

      {/* Alert Examples */}
      <View style={styles.section}>
        <ThemedText type="h2" style={styles.sectionTitle}>
          Alerts
        </ThemedText>
        <ThemedButton title="Show Success Alert" onPress={handleShowAlert} style={styles.button} />
      </View>

      {/* Toast Examples */}
      <View style={styles.section}>
        <ThemedText type="h2" style={styles.sectionTitle}>
          Toast Notifications
        </ThemedText>
        <ThemedButton title="Success Toast" onPress={handleShowSuccess} style={styles.button} />
        <ThemedButton title="Error Toast" onPress={handleShowError} style={styles.button} />
        <ThemedButton title="Warning Toast" onPress={handleShowWarning} style={styles.button} />
        <ThemedButton title="Info Toast" onPress={handleShowInfo} style={styles.button} />
      </View>

      {/* Confirmation Examples */}
      <View style={styles.section}>
        <ThemedText type="h2" style={styles.sectionTitle}>
          Confirmation Dialogs
        </ThemedText>
        <ThemedButton title="Confirm Action" onPress={handleShowConfirmation} style={styles.button} />
        <ThemedButton title="Destructive Confirmation" onPress={handleShowDestructiveConfirmation} style={styles.button} />
      </View>

      {/* Bottom Sheet Examples */}
      <View style={styles.section}>
        <ThemedText type="h2" style={styles.sectionTitle}>
          Bottom Sheet
        </ThemedText>
        <ThemedButton title="Show Bottom Sheet" onPress={handleShowBottomSheet} style={styles.button} />
      </View>

      {/* Action Sheet Examples */}
      <View style={styles.section}>
        <ThemedText type="h2" style={styles.sectionTitle}>
          Action Sheet
        </ThemedText>
        <ThemedButton title="Show Action Sheet" onPress={handleShowActionSheet} style={styles.button} />
      </View>

      {/* Loading Examples */}
      <View style={styles.section}>
        <ThemedText type="h2" style={styles.sectionTitle}>
          Loading Overlay
        </ThemedText>
        <ThemedButton title="Show Loading (3s)" onPress={handleShowLoading} style={styles.button} />
      </View>

      {/* Render Dialog Components */}
      <ThemedAlert
        visible={alert.visible}
        onClose={alert.hide}
        title={i18n.t('dialogs.examples.alert.title')}
        message={i18n.t('dialogs.examples.alert.message')}
        buttonText={i18n.t('dialogs.buttons.ok')}
        variant="success"
      />

      {confirmation.config && (
        <ConfirmationDialog
          visible={confirmation.visible}
          onClose={confirmation.hide}
          title={confirmation.config.title}
          message={confirmation.config.message}
          confirmText={i18n.t('dialogs.buttons.confirm')}
          cancelText={i18n.t('dialogs.buttons.cancel')}
          onConfirm={confirmation.config.onConfirm}
          destructive={confirmation.config.destructive}
        />
      )}

      <BottomSheet visible={bottomSheet.visible} onClose={bottomSheet.hide} title="Bottom Sheet Example">
        <View>
          <ThemedText type="body" style={styles.sheetText}>
            This is a bottom sheet. You can put any custom content here.
          </ThemedText>
          <ThemedButton
            title="Option 1"
            onPress={() => {
              bottomSheet.hide();
              toast.showInfo('Option 1 selected');
            }}
            style={styles.button}
          />
          <ThemedButton
            title="Option 2"
            onPress={() => {
              bottomSheet.hide();
              toast.showInfo('Option 2 selected');
            }}
            style={styles.button}
          />
          <ThemedButton title="Close" onPress={bottomSheet.hide} style={styles.button} />
        </View>
      </BottomSheet>

      {actionSheet.config && (
        <ActionSheet visible={actionSheet.visible} onClose={actionSheet.hide} title={actionSheet.config.title} message={actionSheet.config.message} options={actionSheet.config.options} />
      )}

      <Toast visible={toast.toastConfig.visible} message={toast.toastConfig.message} type={toast.toastConfig.type} onHide={toast.hide} />

      <LoadingOverlay visible={loading.visible} message={loading.message} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: Spacing.sm,
  },
  description: {
    marginBottom: Spacing.xl,
    opacity: 0.7,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    marginBottom: Spacing.md,
  },
  button: {
    marginBottom: Spacing.sm,
  },
  sheetText: {
    marginBottom: Spacing.lg,
  },
});
