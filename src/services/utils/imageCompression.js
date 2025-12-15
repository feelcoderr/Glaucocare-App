// FILE: src/utils/imageCompression.js
// Image Compression Utility (Updated for expo-file-system v54)
// ============================================================================

import * as ImageManipulator from 'expo-image-manipulator';
import { File } from 'expo-file-system';

/**
 * Get file size in MB using new File API
 */
export const getFileSizeMB = async (uri) => {
  try {
    const file = new File(uri);
    const sizeMB = file.size / (1024 * 1024);
    return sizeMB;
  } catch (error) {
    console.error('Error getting file size:', error);
    return 0;
  }
};

/**
 * Get file size synchronously in MB
 */
export const getFileSizeMBSync = (uri) => {
  try {
    const file = new File(uri);
    return file.size / (1024 * 1024);
  } catch (error) {
    console.error('Error getting file size:', error);
    return 0;
  }
};

/**
 * Check if file is an image
 */
export const isImageFile = (mimeType) => {
  return mimeType?.startsWith('image/');
};

/**
 * Compress image based on file size
 * Returns compressed URI or throws error if file is too large
 */
export const compressImage = async (uri, options = {}) => {
  const {
    maxSizeMB = 5, // Maximum file size allowed
    targetSizeMB = 2, // Target size after compression
    maxWidth = 1920, // Maximum width in pixels
    quality = 0.7, // Initial quality (0-1)
  } = options;

  try {
    // Get original file size using new API
    const originalSizeMB = getFileSizeMBSync(uri);

    console.log(`📊 Original file size: ${originalSizeMB.toFixed(2)} MB`);

    // Check if file is too large (beyond compression help)
    if (originalSizeMB > maxSizeMB * 2) {
      throw new Error(
        `File size (${originalSizeMB.toFixed(1)} MB) is too large. Maximum allowed is ${maxSizeMB} MB. Please select a smaller image.`
      );
    }

    // If file is already small enough, return original
    if (originalSizeMB <= targetSizeMB) {
      console.log('✅ File size is acceptable, no compression needed');
      return uri;
    }

    // Determine compression settings based on original size
    let width = maxWidth;
    let compressionQuality = quality;

    if (originalSizeMB > 10) {
      width = 1280;
      compressionQuality = 0.6;
    } else if (originalSizeMB > 5) {
      width = 1600;
      compressionQuality = 0.65;
    } else if (originalSizeMB > 3) {
      width = 1920;
      compressionQuality = 0.7;
    } else {
      width = 2560;
      compressionQuality = 0.75;
    }

    console.log(`🔄 Compressing with: width=${width}px, quality=${compressionQuality}`);

    // Compress image
    const manipResult = await ImageManipulator.manipulateAsync(uri, [{ resize: { width } }], {
      compress: compressionQuality,
      format: ImageManipulator.SaveFormat.JPEG,
    });

    // Get compressed file size
    const compressedSizeMB = getFileSizeMBSync(manipResult.uri);
    const reductionPercent = ((1 - compressedSizeMB / originalSizeMB) * 100).toFixed(1);

    console.log(`✅ Compressed file size: ${compressedSizeMB.toFixed(2)} MB`);
    console.log(`📉 Size reduction: ${reductionPercent}%`);

    // Check if compressed file is still too large
    if (compressedSizeMB > maxSizeMB) {
      // Try one more time with more aggressive compression
      console.log('⚠️ File still too large, trying more aggressive compression...');

      const secondPass = await ImageManipulator.manipulateAsync(
        manipResult.uri,
        [{ resize: { width: 1280 } }],
        {
          compress: 0.5,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      const finalSizeMB = getFileSizeMBSync(secondPass.uri);
      console.log(`✅ Final compressed size: ${finalSizeMB.toFixed(2)} MB`);

      if (finalSizeMB > maxSizeMB) {
        throw new Error(
          `Unable to compress file to acceptable size. Current: ${finalSizeMB.toFixed(1)} MB, Maximum: ${maxSizeMB} MB. Please select a smaller image.`
        );
      }

      return secondPass.uri;
    }

    return manipResult.uri;
  } catch (error) {
    console.error('❌ Compression error:', error);
    throw error;
  }
};

/**
 * Smart compression for different document types
 */
export const compressDocumentImage = async (uri, documentType) => {
  const compressionSettings = {
    'Test Results': {
      maxWidth: 2560,
      quality: 0.85,
      targetSizeMB: 3,
    },
    Prescriptions: {
      maxWidth: 2560,
      quality: 0.85,
      targetSizeMB: 3,
    },
    'Medical Reports': {
      maxWidth: 2560,
      quality: 0.8,
      targetSizeMB: 3,
    },
    'X Rays Images': {
      maxWidth: 2048,
      quality: 0.8,
      targetSizeMB: 4,
    },
    'Insurance Documents': {
      maxWidth: 2560,
      quality: 0.85,
      targetSizeMB: 3,
    },
    Other: {
      maxWidth: 1920,
      quality: 0.75,
      targetSizeMB: 2,
    },
  };

  const settings = compressionSettings[documentType] || compressionSettings['Other'];

  return compressImage(uri, settings);
};

/**
 * Validate file before upload
 */
export const validateFileForUpload = async (file) => {
  try {
    // Check if file exists
    if (!file || !file.uri) {
      throw new Error('No file selected');
    }

    // For images, check size
    if (isImageFile(file.type)) {
      const sizeMB = getFileSizeMBSync(file.uri);

      if (sizeMB > 15) {
        throw new Error(
          `Image is too large (${sizeMB.toFixed(1)} MB). Please select an image smaller than 15 MB.`
        );
      }
    }

    // For PDFs, check size
    if (file.type === 'application/pdf') {
      const sizeMB = getFileSizeMBSync(file.uri);

      if (sizeMB > 10) {
        throw new Error(`PDF is too large (${sizeMB.toFixed(1)} MB). Maximum allowed is 10 MB.`);
      }
    }

    return true;
  } catch (error) {
    throw error;
  }
};

/**
 * Get file info including size
 */
export const getFileInfo = (uri) => {
  try {
    const file = new File(uri);
    return {
      exists: file.exists,
      size: file.size,
      sizeMB: (file.size / (1024 * 1024)).toFixed(2),
      uri: file.uri,
      type: file.type,
      name: file.name,
    };
  } catch (error) {
    console.error('Error getting file info:', error);
    return null;
  }
};

/**
 * Check if file exists
 */
export const fileExists = (uri) => {
  try {
    const file = new File(uri);
    return file.exists;
  } catch (error) {
    console.error('Error checking file existence:', error);
    return false;
  }
};
