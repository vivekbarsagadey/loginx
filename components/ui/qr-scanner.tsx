import { ThemedButton } from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAlert } from '@/hooks/use-alert';
import { useThemeColor } from '@/hooks/use-theme-color';
import { createLogger } from '@/utils/debug';
import { Ionicons } from '@expo/vector-icons';
import { Camera, CameraView } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, View } from 'react-native';

const logger = createLogger('QRScanner');

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
  title?: string;
  description?: string;
}

/**
 * QR Code Scanner Component
 * Uses expo-camera for scanning QR codes (for 2FA setup, etc.)
 */
export function QRScanner({ onScan, onClose, title = 'Scan QR Code', description = 'Position the QR code within the frame' }: QRScannerProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const alert = useAlert();

  const primaryColor = useThemeColor({}, 'primary');
  const bgColor = useThemeColor({}, 'bg');
  const textColor = useThemeColor({}, 'text');
  const surfaceColor = useThemeColor({}, 'surface');

  const requestCameraPermission = useCallback(async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');

      if (status !== 'granted') {
        alert.show('Camera Permission Required', 'Please grant camera permission to scan QR codes.', [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: onClose,
          },
          {
            text: 'Open Settings',
            onPress: () => {
              if (Platform.OS === 'ios') {
                // On iOS, user needs to manually open settings
                alert.show('Open Settings', 'Please go to Settings > Privacy > Camera to enable camera access.', [{ text: 'OK' }]);
              }
              onClose();
            },
          },
        ]);
      }
    } catch (error) {
      logger.error('Error requesting camera permission:', error);
      alert.show('Error', 'Failed to request camera permission. Please try again.', [{ text: 'OK' }], { variant: 'error' });
      onClose();
    }
  }, [onClose, alert]);

  useEffect(() => {
    requestCameraPermission();
  }, [requestCameraPermission]);

  const handleBarCodeScanned = async ({ data }: { type: string; data: string }) => {
    if (scanned || !isActive) {
      return;
    }

    setScanned(true);
    setIsActive(false);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Validate QR code data
    if (data && data.trim()) {
      onScan(data);
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      alert.show(
        'Invalid QR Code',
        'The scanned QR code is invalid. Please try again.',
        [
          {
            text: 'OK',
            onPress: () => {
              setScanned(false);
              setIsActive(true);
            },
          },
        ],
        { variant: 'error' }
      );
    }
  };

  const handleRescan = () => {
    setScanned(false);
    setIsActive(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  if (hasPermission === null) {
    return (
      <>
        <ThemedView style={styles.container}>
          <ActivityIndicator size="large" color={primaryColor} />
          <ThemedText style={styles.loadingText}>Requesting camera permission...</ThemedText>
        </ThemedView>
        {alert.AlertComponent}
      </>
    );
  }

  if (hasPermission === false) {
    return (
      <>
        <ThemedView style={styles.container}>
          <Ionicons name="videocam-off" size={64} color={textColor} style={styles.icon} />
          <ThemedText type="h2" style={styles.title}>
            Camera Access Denied
          </ThemedText>
          <ThemedText style={styles.description}>Please enable camera access in your device settings to scan QR codes.</ThemedText>
          <ThemedButton title="Close" onPress={onClose} variant="secondary" style={styles.button} />
        </ThemedView>
        {alert.AlertComponent}
      </>
    );
  }

  return (
    <View style={styles.fullScreen}>
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={isActive && !scanned ? handleBarCodeScanned : undefined}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      >
        {/* Header */}
        <ThemedView style={[styles.header, { backgroundColor: bgColor + 'E6' }]}>
          <ThemedText type="h3" style={styles.headerTitle}>
            {title}
          </ThemedText>
          <Pressable onPress={onClose} style={styles.closeButton} accessibilityLabel="Close QR scanner" accessibilityRole="button" hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="close" size={28} color={textColor} />
          </Pressable>
        </ThemedView>

        {/* Scanning Frame */}
        <View style={styles.scannerContainer}>
          <View style={styles.scannerFrame}>
            {/* Corner markers */}
            <View style={[styles.corner, styles.cornerTopLeft, { borderColor: primaryColor }]} />
            <View style={[styles.corner, styles.cornerTopRight, { borderColor: primaryColor }]} />
            <View style={[styles.corner, styles.cornerBottomLeft, { borderColor: primaryColor }]} />
            <View style={[styles.corner, styles.cornerBottomRight, { borderColor: primaryColor }]} />

            {scanned && (
              <View style={[styles.scannedOverlay, { backgroundColor: primaryColor + '40' }]}>
                <Ionicons name="checkmark-circle" size={64} color={primaryColor} />
                <ThemedText style={[styles.scannedText, { color: primaryColor }]}>QR Code Scanned!</ThemedText>
              </View>
            )}
          </View>
        </View>

        {/* Footer */}
        <ThemedView style={[styles.footer, { backgroundColor: surfaceColor + 'E6' }]}>
          <ThemedText style={styles.description}>{description}</ThemedText>
          {scanned && <ThemedButton title="Scan Again" onPress={handleRescan} variant="secondary" style={styles.button} accessibilityLabel="Scan another QR code" />}
        </ThemedView>
      </CameraView>
      {alert.AlertComponent}
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  camera: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
  },
  headerTitle: {
    flex: 1,
  },
  closeButton: {
    padding: 8,
  },
  scannerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerFrame: {
    width: 280,
    height: 280,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderWidth: 4,
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
    borderTopLeftRadius: 8,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    borderTopRightRadius: 8,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomLeftRadius: 8,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderBottomRightRadius: 8,
  },
  scannedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    gap: 12,
  },
  scannedText: {
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    gap: 16,
  },
  loadingText: {
    marginTop: 16,
    opacity: 0.7,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 22,
  },
  button: {
    marginTop: 8,
  },
});
