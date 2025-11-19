// FILE: src/screens/document/DocumentDashboardScreen.jsx
// Document Dashboard Screen
// ============================================================================

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { fetchUserDocuments, uploadDocument } from '../../store/slices/documentSlice';
import { colors } from '../../styles/colors';
import { Alert, Platform } from 'react-native';
const DocumentDashboardScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { documentsByType, isLoading, isUploading } = useSelector((state) => state.document);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    documentType: '',
    file: null,
  });

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserDocuments({ page: 1, limit: 100 }));
    }
  }, [isAuthenticated]);

  const documentCategories = [
    {
      type: 'Test Results',
      icon: '📋',
      color: '#E3F2FD',
      iconColor: '#2196F3',
      count: documentsByType['Test Results'],
    },
    {
      type: 'Prescriptions',
      icon: '📄',
      color: '#FCE4EC',
      iconColor: '#E91E63',
      count: documentsByType['Prescriptions'],
    },
    {
      type: 'Medical Reports',
      icon: '📑',
      color: '#F3E5F5',
      iconColor: '#9C27B0',
      count: documentsByType['Medical Reports'],
    },
    {
      type: 'Insurance Documents',
      icon: '🛡️',
      color: '#FFF3E0',
      iconColor: '#FF9800',
      count: documentsByType['Insurance Documents'],
    },
    {
      type: 'X-rays/Images',
      icon: '🩻',
      color: '#E8F5E9',
      iconColor: '#4CAF50',
      count: documentsByType['X-rays/Images'],
    },
    {
      type: 'Other',
      icon: '📦',
      color: '#EFEBE9',
      iconColor: '#795548',
      count: documentsByType['Other'],
    },
  ];

  const handleCategoryPress = (type) => {
    navigation.navigate('DocumentList', { documentType: type });
  };

  // ✅ FIXED: Updated for new ImagePicker API
  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Camera permission is required to take photos');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
      });

      console.log('📸 Image picker result:', result);

      // ✅ FIXED: Use result.canceled (not result.cancelled)
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];

        // ✅ FIXED: Create proper file object
        const file = {
          uri: asset.uri,
          name: `photo_${Date.now()}.jpg`,
          type: 'image/jpeg',
          size: asset.fileSize || 0,
        };

        console.log('✅ Image selected:', file);
        setUploadForm({ ...uploadForm, file });
      }
    } catch (error) {
      console.error('❌ Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image: ' + error.message);
    }
  };

  // ✅ FIXED: Updated for new DocumentPicker API
  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'],
        copyToCacheDirectory: true,
        multiple: false,
      });

      console.log('📄 Document picker result:', result);

      // ✅ FIXED: New API uses result.canceled (not result.type === 'success')
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];

        // ✅ FIXED: Create proper file object with all needed properties
        const file = {
          uri: asset.uri,
          name: asset.name,
          type: asset.mimeType || getMimeType(asset.name),
          size: asset.size,
        };

        console.log('✅ Document selected:', file);
        setUploadForm({ ...uploadForm, file });
      } else {
        console.log('📄 Document picker canceled');
      }
    } catch (error) {
      console.error('❌ Document picker error:', error);
      Alert.alert('Error', 'Failed to pick document: ' + error.message);
    }
  };

  // ✅ NEW: Helper to determine MIME type from filename
  const getMimeType = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    const mimeTypes = {
      pdf: 'application/pdf',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
    };
    return mimeTypes[extension] || 'application/octet-stream';
  };

  // ✅ FIXED: Improved upload handler with validation
  const handleUpload = async () => {
    try {
      console.log('=== UPLOAD VALIDATION ===');
      console.log('Title:', uploadForm.title);
      console.log('Type:', uploadForm.documentType);
      console.log('File:', uploadForm.file);

      // Validation
      if (!uploadForm.title || !uploadForm.documentType || !uploadForm.file) {
        Alert.alert('Missing Information', 'Please fill all fields and select a file');
        return;
      }

      // ✅ FIXED: Create FormData properly
      const formData = new FormData();

      // ✅ CRITICAL: iOS file URI needs special handling
      formData.append('document', {
        uri:
          Platform.OS === 'ios' ? uploadForm.file.uri.replace('file://', '') : uploadForm.file.uri,
        type: uploadForm.file.type,
        name: uploadForm.file.name,
      });

      formData.append('title', uploadForm.title);
      formData.append('documentType', uploadForm.documentType);
      formData.append('documentDate', new Date().toISOString().split('T')[0]);

      console.log('📤 Uploading with FormData...');
      console.log('- Title:', uploadForm.title);
      console.log('- Type:', uploadForm.documentType);
      console.log('- File URI:', uploadForm.file.uri);
      console.log('- File Type:', uploadForm.file.type);
      console.log('- File Name:', uploadForm.file.name);

      const result = await dispatch(uploadDocument(formData)).unwrap();

      console.log('✅ Upload successful:', result);

      Alert.alert('Success', 'Document uploaded successfully');
      setShowUploadModal(false);
      setUploadForm({ title: '', documentType: '', file: null });
      dispatch(fetchUserDocuments({ page: 1, limit: 100 }));
    } catch (error) {
      console.error('❌ Upload error:', error);
      Alert.alert('Upload Failed', error.message || 'Failed to upload document');
    }
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Documents Dashboard</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Please login to access documents</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Documents Dashboard</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Title Section */}
        <Text style={styles.pageTitle}>Medical Documents</Text>
        <Text style={styles.pageSubtitle}>Securely store and access your health files anytime</Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search documents..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Document Categories Grid */}
        <View style={styles.categoriesGrid}>
          {documentCategories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={styles.categoryCard}
              onPress={() => handleCategoryPress(category.type)}>
              <View style={[styles.iconCircle, { backgroundColor: category.color }]}>
                <Text style={styles.iconText}>{category.icon}</Text>
              </View>
              <Text style={styles.categoryTitle}>{category.type}</Text>
              <Text style={styles.categoryCount}>{category.count} items</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Add New Document Button */}
        <TouchableOpacity style={styles.addButton} onPress={() => setShowUploadModal(true)}>
          <Ionicons name="add" size={20} color={colors.white} />
          <Text style={styles.addButtonText}>Add New Document</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Upload Modal */}
      <Modal
        visible={showUploadModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowUploadModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Document</Text>
              <TouchableOpacity onPress={() => setShowUploadModal(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Document Title */}
              <Text style={styles.label}>Document Title</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter document title"
                placeholderTextColor={colors.textSecondary}
                value={uploadForm.title}
                onChangeText={(text) => setUploadForm({ ...uploadForm, title: text })}
              />

              {/* Category Selector */}
              <Text style={styles.label}>Category</Text>
              <TouchableOpacity style={styles.dropdown}>
                <Text style={[styles.dropdownText, !uploadForm.documentType && styles.placeholder]}>
                  {uploadForm.documentType || 'Select category'}
                </Text>
                <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
              </TouchableOpacity>

              {/* Quick Category Buttons */}
              <View style={styles.quickCategories}>
                {['Test Results', 'Prescriptions', 'Medical Reports', 'Other'].map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.quickCategoryButton,
                      uploadForm.documentType === cat && styles.quickCategoryButtonActive,
                    ]}
                    onPress={() => setUploadForm({ ...uploadForm, documentType: cat })}>
                    <Text
                      style={[
                        styles.quickCategoryText,
                        uploadForm.documentType === cat && styles.quickCategoryTextActive,
                      ]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Upload Area */}
              <TouchableOpacity style={styles.uploadArea} onPress={handlePickDocument}>
                <Ionicons name="cloud-upload-outline" size={40} color={colors.primaryDark} />
                <Text style={styles.uploadText}>Tap to upload or take photo</Text>
                <Text style={styles.uploadSubtext}>Max size: 10MB</Text>
                {uploadForm.file && (
                  <Text style={styles.fileName}>{uploadForm.file.name || 'Image selected'}</Text>
                )}
              </TouchableOpacity>

              {/* Action Buttons */}
              <View style={styles.uploadButtons}>
                <TouchableOpacity style={styles.cameraButton} onPress={handlePickImage}>
                  <Ionicons name="camera" size={20} color={colors.white} />
                  <Text style={styles.cameraButtonText}>Take Photo</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.galleryButton} onPress={handlePickDocument}>
                  <Ionicons name="folder-open" size={20} color={colors.primaryDark} />
                  <Text style={styles.galleryButtonText}>Choose File</Text>
                </TouchableOpacity>
              </View>

              {/* Upload Button */}
              <TouchableOpacity
                style={[styles.uploadButton, isUploading && styles.uploadButtonDisabled]}
                onPress={handleUpload}
                disabled={isUploading}>
                <Text style={styles.uploadButtonText}>
                  {isUploading ? 'Uploading...' : 'Upload Document'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    fontFamily: 'Poppins_700Bold',
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: 'Poppins_400Regular',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconText: {
    fontSize: 28,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: colors.primaryDark,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primaryDark,
    fontFamily: 'Poppins_700Bold',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    fontFamily: 'Poppins_500Medium',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: 'Poppins_400Regular',
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dropdownText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: 'Poppins_400Regular',
  },
  placeholder: {
    color: colors.textSecondary,
  },
  quickCategories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  quickCategoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickCategoryButtonActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  quickCategoryText: {
    fontSize: 12,
    color: colors.textPrimary,
    fontFamily: 'Poppins_500Medium',
  },
  quickCategoryTextActive: {
    color: colors.white,
  },
  uploadArea: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.primaryDark,
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: '#F8FAFC',
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryDark,
    fontFamily: 'Poppins_600SemiBold',
    marginTop: 12,
  },
  uploadSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
    marginTop: 4,
  },
  fileName: {
    fontSize: 12,
    color: '#10B981',
    fontFamily: 'Poppins_500Medium',
    marginTop: 8,
  },
  uploadButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cameraButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.primaryDark,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  cameraButtonText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
  },
  galleryButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primaryDark,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  galleryButtonText: {
    color: colors.primaryDark,
    fontSize: 14,
    fontFamily: 'Poppins_600SemiBold',
  },
  uploadButton: {
    backgroundColor: colors.primaryDark,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  uploadButtonDisabled: {
    opacity: 0.6,
  },
  uploadButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
});

export default DocumentDashboardScreen;
