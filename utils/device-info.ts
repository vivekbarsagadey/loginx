/**
 * Device Information and Capabilities
 * Detects device memory and capabilities for adaptive optimization
 */

import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { debugLog } from './debug';

export interface DeviceCapabilities {
  totalMemoryMB: number;
  estimatedAvailableMemoryMB: number;
  isLowEnd: boolean;
  isMidRange: boolean;
  isHighEnd: boolean;
  deviceType: string;
  modelName: string | null;
  recommendedCacheSize: number;
  osVersion: string | null;
}

/**
 * Get device capabilities and recommended cache size
 */
export const getDeviceCapabilities = async (): Promise<DeviceCapabilities> => {
  const deviceType = Device.deviceType?.toString() || 'UNKNOWN';
  const modelName = Device.modelName;
  const osVersion = Device.osVersion;

  // Estimate memory based on device type and model
  let estimatedMemoryMB = 2048; // Default 2GB for unknown devices

  if (Platform.OS === 'ios') {
    // iOS devices - estimate by model name
    if (modelName) {
      // iPhone 15/16 series (6-8GB)
      if (modelName.includes('iPhone 15') || modelName.includes('iPhone 16')) {
        estimatedMemoryMB = 6144;
      } else if (modelName.includes('iPhone 13') || modelName.includes('iPhone 14')) {
        // iPhone 13/14 series (4-6GB)
        estimatedMemoryMB = 4096;
      } else if (modelName.includes('iPhone 11') || modelName.includes('iPhone 12')) {
        // iPhone 11/12 series (3-4GB)
        estimatedMemoryMB = 3072;
      } else if (modelName.includes('iPhone X')) {
        // iPhone X/XS/XR series (2-3GB)
        estimatedMemoryMB = 2048;
      } else if (modelName.includes('iPhone 8') || modelName.includes('iPhone 7')) {
        // iPhone 8 and older (1-2GB)
        estimatedMemoryMB = 1536;
      } else if (modelName.includes('iPad Pro')) {
        // iPad Pro (6-16GB)
        estimatedMemoryMB = 8192;
      } else if (modelName.includes('iPad Air') || modelName.includes('iPad mini')) {
        // iPad Air/Mini (3-4GB)
        estimatedMemoryMB = 4096;
      } else if (modelName.includes('iPad')) {
        // Regular iPad (2-3GB)
        estimatedMemoryMB = 3072;
      }
    }
  } else if (Platform.OS === 'android') {
    // Android - estimate based on device type
    // In production, you could use a native module to get actual RAM
    if (deviceType === '2') {
      // TABLET
      estimatedMemoryMB = 4096; // Tablets typically have 4-8GB
    } else if (deviceType === '4') {
      // TV
      estimatedMemoryMB = 2048; // Android TV boxes vary widely
    } else {
      // PHONE (default)
      // For Android phones, we could check OS version as a proxy
      // Newer Android versions typically run on higher-end devices
      const osVersionNum = osVersion ? parseFloat(osVersion) : 0;
      if (osVersionNum >= 13) {
        estimatedMemoryMB = 4096; // Android 13+ usually on 4GB+ devices
      } else if (osVersionNum >= 11) {
        estimatedMemoryMB = 3072; // Android 11-12 usually on 3GB+ devices
      } else {
        estimatedMemoryMB = 2048; // Older Android or unknown
      }
    }
  } else if (Platform.OS === 'web') {
    // Web - can try to get actual memory
    if (typeof window !== 'undefined' && 'deviceMemory' in navigator) {
      const deviceMemory = (navigator as { deviceMemory?: number }).deviceMemory;
      if (deviceMemory) {
        estimatedMemoryMB = deviceMemory * 1024; // deviceMemory is in GB
      }
    } else {
      estimatedMemoryMB = 4096; // Default for web - assume desktop
    }
  }

  // Calculate categories
  const isLowEnd = estimatedMemoryMB < 2048;
  const isMidRange = estimatedMemoryMB >= 2048 && estimatedMemoryMB < 4096;
  const isHighEnd = estimatedMemoryMB >= 4096;

  // Calculate recommended cache size based on memory
  let recommendedCacheSize: number;
  if (estimatedMemoryMB < 1536) {
    recommendedCacheSize = 30; // Very low-end: <1.5GB
  } else if (estimatedMemoryMB < 2048) {
    recommendedCacheSize = 50; // Low-end: 1.5-2GB
  } else if (estimatedMemoryMB < 3072) {
    recommendedCacheSize = 75; // Lower mid-range: 2-3GB
  } else if (estimatedMemoryMB < 4096) {
    recommendedCacheSize = 100; // Mid-range: 3-4GB (current default)
  } else if (estimatedMemoryMB < 6144) {
    recommendedCacheSize = 150; // Higher mid-range: 4-6GB
  } else if (estimatedMemoryMB < 8192) {
    recommendedCacheSize = 200; // High-end: 6-8GB
  } else {
    recommendedCacheSize = 250; // Very high-end: 8GB+
  }

  const capabilities: DeviceCapabilities = {
    totalMemoryMB: estimatedMemoryMB,
    estimatedAvailableMemoryMB: Math.floor(estimatedMemoryMB * 0.5), // Rough estimate
    isLowEnd,
    isMidRange,
    isHighEnd,
    deviceType,
    modelName,
    recommendedCacheSize,
    osVersion,
  };

  debugLog(`[DeviceInfo] 📱 Device capabilities: ${modelName || 'Unknown'}, ` + `${estimatedMemoryMB}MB RAM, recommended cache: ${recommendedCacheSize} entries`);

  return capabilities;
};

/**
 * Get a human-readable description of device capabilities
 */
export const getDeviceDescription = (capabilities: DeviceCapabilities): string => {
  const tier = capabilities.isHighEnd ? 'High-end' : capabilities.isMidRange ? 'Mid-range' : 'Low-end';

  return (
    `${tier} device: ${capabilities.modelName || 'Unknown model'} ` + `(~${capabilities.totalMemoryMB}MB RAM, ${capabilities.deviceType}) ` + `- Cache: ${capabilities.recommendedCacheSize} entries`
  );
};

/**
 * Check if device is suitable for aggressive caching
 */
export const shouldUseAggressiveCaching = (capabilities: DeviceCapabilities): boolean => {
  return capabilities.isHighEnd && capabilities.totalMemoryMB >= 4096;
};

/**
 * Check if device needs conservative caching
 */
export const shouldUseConservativeCaching = (capabilities: DeviceCapabilities): boolean => {
  return capabilities.isLowEnd || capabilities.totalMemoryMB < 2048;
};
