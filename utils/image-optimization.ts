import { type Action, type FlipType, manipulateAsync, SaveFormat } from 'expo-image-manipulator';

/**
 * Image Optimization Utilities
 * Provides functions for image compression, resizing, and format conversion
 */

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0-1
  format?: 'jpeg' | 'png' | 'webp';
  rotate?: number; // degrees
  flip?: 'horizontal' | 'vertical';
}

export interface OptimizedImage {
  uri: string;
  width: number;
  height: number;
  originalSize?: number;
  optimizedSize?: number;
  compressionRatio?: number;
}

/**
 * Optimize an image by resizing, compressing, and converting format
 */
export async function optimizeImage(uri: string, options: ImageOptimizationOptions = {}): Promise<OptimizedImage> {
  try {
    const { maxWidth = 1920, maxHeight = 1920, quality = 0.8, format = 'jpeg', rotate, flip } = options;

    const actions: Action[] = [];

    // Add resize action
    actions.push({
      resize: {
        width: maxWidth,
        height: maxHeight,
      },
    });

    // Add rotation if specified
    if (rotate) {
      actions.push({ rotate });
    }

    // Add flip if specified
    if (flip) {
      actions.push({ flip: flip as FlipType });
    }

    const saveFormat = format === 'jpeg' ? SaveFormat.JPEG : format === 'png' ? SaveFormat.PNG : SaveFormat.WEBP;

    const result = await manipulateAsync(uri, actions, {
      compress: quality,
      format: saveFormat,
    });

    return {
      uri: result.uri,
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    console.error('[ImageOptimization] Error optimizing image:', error);
    throw new Error('Failed to optimize image');
  }
}

/**
 * Compress image to target file size (approximate)
 */
export async function compressImageToSize(uri: string, targetSizeBytes: number, maxIterations: number = 5): Promise<OptimizedImage> {
  let currentQuality = 0.9;
  let result = await optimizeImage(uri, { quality: currentQuality });

  for (let i = 0; i < maxIterations; i++) {
    // Note: expo-image-manipulator doesn't provide file size
    // This is a simplified version that reduces quality incrementally
    currentQuality -= 0.15;
    if (currentQuality < 0.3) {
      break;
    }

    result = await optimizeImage(uri, { quality: currentQuality });
  }

  return result;
}

/**
 * Create thumbnail from image
 */
export async function createThumbnail(uri: string, size: number = 200): Promise<OptimizedImage> {
  return optimizeImage(uri, {
    maxWidth: size,
    maxHeight: size,
    quality: 0.7,
    format: 'jpeg',
  });
}

/**
 * Rotate image by specified degrees
 */
export async function rotateImage(uri: string, degrees: number): Promise<OptimizedImage> {
  return optimizeImage(uri, { rotate: degrees });
}

/**
 * Flip image horizontally or vertically
 */
export async function flipImage(uri: string, direction: 'horizontal' | 'vertical'): Promise<OptimizedImage> {
  return optimizeImage(uri, { flip: direction });
}

/**
 * Convert image to WebP format for smaller file size
 */
export async function convertToWebP(uri: string, quality: number = 0.8): Promise<OptimizedImage> {
  return optimizeImage(uri, {
    format: 'webp',
    quality,
  });
}

/**
 * Batch optimize multiple images
 */
export async function batchOptimizeImages(uris: string[], options: ImageOptimizationOptions = {}): Promise<OptimizedImage[]> {
  const results: OptimizedImage[] = [];

  for (const uri of uris) {
    try {
      const optimized = await optimizeImage(uri, options);
      results.push(optimized);
    } catch (error) {
      console.error(`[ImageOptimization] Failed to optimize ${uri}:`, error);
      // Continue with other images even if one fails
    }
  }

  return results;
}

/**
 * Get optimal image dimensions maintaining aspect ratio
 */
export function calculateOptimalDimensions(originalWidth: number, originalHeight: number, maxWidth: number, maxHeight: number): { width: number; height: number } {
  const aspectRatio = originalWidth / originalHeight;

  let width = originalWidth;
  let height = originalHeight;

  // Check if resizing is needed
  if (width > maxWidth) {
    width = maxWidth;
    height = width / aspectRatio;
  }

  if (height > maxHeight) {
    height = maxHeight;
    width = height * aspectRatio;
  }

  return {
    width: Math.round(width),
    height: Math.round(height),
  };
}

/**
 * Validate image dimensions
 */
export function validateImageDimensions(
  width: number,
  height: number,
  minWidth: number = 100,
  minHeight: number = 100,
  maxWidth: number = 4096,
  maxHeight: number = 4096
): { valid: boolean; error?: string } {
  if (width < minWidth || height < minHeight) {
    return {
      valid: false,
      error: `Image is too small. Minimum size is ${minWidth}x${minHeight}px.`,
    };
  }

  if (width > maxWidth || height > maxHeight) {
    return {
      valid: false,
      error: `Image is too large. Maximum size is ${maxWidth}x${maxHeight}px.`,
    };
  }

  return { valid: true };
}

/**
 * Image optimization presets
 */
export const ImagePresets = {
  PROFILE_PHOTO: {
    maxWidth: 512,
    maxHeight: 512,
    quality: 0.85,
    format: 'jpeg' as const,
  },
  THUMBNAIL: {
    maxWidth: 200,
    maxHeight: 200,
    quality: 0.7,
    format: 'jpeg' as const,
  },
  HIGH_QUALITY: {
    maxWidth: 1920,
    maxHeight: 1920,
    quality: 0.9,
    format: 'jpeg' as const,
  },
  WEB_OPTIMIZED: {
    maxWidth: 1200,
    maxHeight: 1200,
    quality: 0.8,
    format: 'webp' as const,
  },
  COMPRESSED: {
    maxWidth: 800,
    maxHeight: 800,
    quality: 0.6,
    format: 'jpeg' as const,
  },
} as const;
