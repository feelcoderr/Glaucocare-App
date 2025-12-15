// FILE: src/screens/document/DocumentListScreenEnhanced.jsx
// Enhanced Document List & Download Screen with Preview
// ============================================================================

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  Modal,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { fetchUserDocuments, deleteDocument } from '../../store/slices/documentSlice';
import { colors } from '../../styles/colors';

const DocumentListScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { documents, isLoading } = useSelector((state) => state.document);
  const documentType = route?.params?.documentType || 'All';

  const [downloadingId, setDownloadingId] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [sortBy, setSortBy] = useState('date'); // date, name, type

  useEffect(() => {
    dispatch(fetchUserDocuments({ page: 1, limit: 100 }));
  }, []);

  // Filter and sort documents
  const getFilteredAndSortedDocuments = () => {
    let filtered =
      documentType === 'All'
        ? documents
        : documents.filter((doc) => doc.documentType === documentType);

    // Sort
    switch (sortBy) {
      case 'date':
        return filtered.sort((a, b) => new Date(b.documentDate) - new Date(a.documentDate));
      case 'name':
        return filtered.sort((a, b) => a.title.localeCompare(b.title));
      case 'type':
        return filtered.sort((a, b) => a.documentType.localeCompare(b.documentType));
      default:
        return filtered;
    }
  };

  const filteredDocuments = getFilteredAndSortedDocuments();

  // Get icon and color for document type
  const getDocumentIcon = (type) => {
    const icons = {
      'Test Results': { icon: 'document-text', color: '#2196F3', bg: '#E3F2FD' },
      Prescriptions: { icon: 'medical', color: '#E91E63', bg: '#FCE4EC' },
      'Medical Reports': { icon: 'clipboard', color: '#9C27B0', bg: '#F3E5F5' },
      'Insurance Documents': { icon: 'shield-checkmark', color: '#FF9800', bg: '#FFF3E0' },
      'X-rays/Images': { icon: 'image', color: '#4CAF50', bg: '#E8F5E9' },
      Other: { icon: 'folder', color: '#795548', bg: '#EFEBE9' },
    };
    return icons[type] || { icon: 'document', color: '#6B7280', bg: '#F3F4F6' };
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / 1048576).toFixed(2) + ' MB';
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Download document
  const handleDownload = async (document) => {
    try {
      setDownloadingId(document._id);

      const fileUrl = document.fileUrl;
      if (!fileUrl) {
        Alert.alert('Error', 'File URL not found');
        return;
      }

      const fileName = document.fileName || `document_${document._id}.pdf`;
      const fileUri = FileSystem.documentDirectory + fileName;

      const downloadResult = await FileSystem.downloadAsync(fileUrl, fileUri);

      if (downloadResult.status === 200) {
        const canShare = await Sharing.isAvailableAsync();

        if (canShare) {
          await Sharing.shareAsync(downloadResult.uri, {
            mimeType: document.mimeType || 'application/pdf',
            dialogTitle: 'Save Document',
            UTI: document.mimeType || 'application/pdf',
          });
          Alert.alert('Success', 'Document downloaded successfully');
        } else {
          Alert.alert('Success', 'Document saved to app directory');
        }
      } else {
        Alert.alert('Error', 'Failed to download document');
      }
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to download document: ' + error.message);
    } finally {
      setDownloadingId(null);
    }
  };

  // Share document
  const handleShare = async (document) => {
    try {
      const fileUrl = document.fileUrl;
      if (!fileUrl) {
        Alert.alert('Error', 'File URL not found');
        return;
      }

      const fileName = document.fileName || `document_${document._id}.pdf`;
      const fileUri = FileSystem.documentDirectory + fileName;

      // Download first
      const downloadResult = await FileSystem.downloadAsync(fileUrl, fileUri);

      if (downloadResult.status === 200) {
        const canShare = await Sharing.isAvailableAsync();

        if (canShare) {
          await Sharing.shareAsync(downloadResult.uri, {
            mimeType: document.mimeType || 'application/pdf',
            dialogTitle: `Share ${document.title}`,
          });
        } else {
          Alert.alert('Error', 'Sharing is not available on this device');
        }
      }
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert('Error', 'Failed to share document: ' + error.message);
    }
  };

  // View document
  const handleView = (document) => {
    setSelectedDocument(document);
    setShowPreviewModal(true);
  };

  // Open in browser
  const handleOpenInBrowser = async (document) => {
    try {
      const fileUrl = document.fileUrl;
      if (!fileUrl) {
        Alert.alert('Error', 'File URL not found');
        return;
      }

      const supported = await Linking.canOpenURL(fileUrl);
      if (supported) {
        await Linking.openURL(fileUrl);
      } else {
        Alert.alert('Error', 'Cannot open this file type');
      }
    } catch (error) {
      console.error('Open error:', error);
      Alert.alert('Error', 'Failed to open document: ' + error.message);
    }
  };

  // Delete document
  const handleDelete = (documentId) => {
    Alert.alert(
      'Delete Document',
      'Are you sure you want to delete this document? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(deleteDocument(documentId)).unwrap();
              Alert.alert('Success', 'Document deleted successfully');
              setShowPreviewModal(false);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete document');
            }
          },
        },
      ]
    );
  };

  // Render document item
  const renderDocumentItem = ({ item }) => {
    const { icon, color, bg } = getDocumentIcon(item.documentType);
    const isDownloading = downloadingId === item._id;

    return (
      <TouchableOpacity
        style={styles.documentCard}
        onPress={() => handleView(item)}
        activeOpacity={0.7}>
        {/* Icon & Info */}
        <View style={styles.documentHeader}>
          <View style={[styles.iconCircle, { backgroundColor: bg }]}>
            <Ionicons name={icon} size={28} color={color} />
          </View>

          <View style={styles.documentInfo}>
            <Text style={styles.documentTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.documentType}>{item.documentType}</Text>
            <View style={styles.metaRow}>
              <Ionicons name="calendar-outline" size={12} color={colors.textSecondary} />
              <Text style={styles.metaText}>{formatDate(item.documentDate)}</Text>
              <Text style={styles.metaDivider}>•</Text>
              <Ionicons name="document-outline" size={12} color={colors.textSecondary} />
              <Text style={styles.metaText}>{formatFileSize(item.fileSize)}</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={(e) => {
              e.stopPropagation();
              handleShare(item);
            }}>
            <Ionicons name="share-outline" size={20} color={colors.primaryDark} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickActionButton, styles.deleteAction]}
            onPress={(e) => {
              e.stopPropagation();
              handleDelete(item._id);
            }}>
            <Ionicons name="trash-outline" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  // Preview Modal
  const PreviewModal = () => {
    if (!selectedDocument) return null;

    const { icon, color, bg } = getDocumentIcon(selectedDocument.documentType);
    const isImage = selectedDocument.mimeType?.startsWith('image/');

    return (
      <Modal
        visible={showPreviewModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPreviewModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Document Details</Text>
              <TouchableOpacity onPress={() => setShowPreviewModal(false)}>
                <Ionicons name="close" size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Document Preview */}
              <View style={[styles.previewContainer, { backgroundColor: bg }]}>
                {isImage ? (
                  <Image
                    source={{ uri: selectedDocument.fileUrl }}
                    style={styles.previewImage}
                    resizeMode="contain"
                  />
                ) : (
                  <View style={styles.previewPlaceholder}>
                    <Ionicons name={icon} size={64} color={color} />
                    <Text style={styles.previewText}>{selectedDocument.fileName}</Text>
                  </View>
                )}
              </View>

              {/* Document Info */}
              <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>{selectedDocument.title}</Text>
                <Text style={styles.infoType}>{selectedDocument.documentType}</Text>

                <View style={styles.infoGrid}>
                  <View style={styles.infoItem}>
                    <Ionicons name="calendar" size={20} color={colors.textSecondary} />
                    <View style={styles.infoItemText}>
                      <Text style={styles.infoLabel}>Date</Text>
                      <Text style={styles.infoValue}>
                        {formatDate(selectedDocument.documentDate)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.infoItem}>
                    <Ionicons name="document" size={20} color={colors.textSecondary} />
                    <View style={styles.infoItemText}>
                      <Text style={styles.infoLabel}>Size</Text>
                      <Text style={styles.infoValue}>
                        {formatFileSize(selectedDocument.fileSize)}
                      </Text>
                    </View>
                  </View>

                  {/* <View style={styles.infoItem}>
                    <Ionicons name="file-tray" size={20} color={colors.textSecondary} />
                    <View style={styles.infoItemText}>
                      <Text style={styles.infoLabel}>Type</Text>
                      <Text style={styles.infoValue}>{selectedDocument.mimeType || 'Unknown'}</Text>
                    </View>
                  </View> */}

                  {/* <View style={styles.infoItem}>
                    <Ionicons name="time" size={20} color={colors.textSecondary} />
                    <View style={styles.infoItemText}>
                      <Text style={styles.infoLabel}>Uploaded</Text>
                      <Text style={styles.infoValue}>
                        {formatDate(selectedDocument.uploadedAt)}
                      </Text>
                    </View>
                  </View> */}
                </View>

                {selectedDocument.description && (
                  <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionLabel}>Description</Text>
                    <Text style={styles.descriptionText}>{selectedDocument.description}</Text>
                  </View>
                )}
              </View>

              {/* Action Buttons */}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => handleOpenInBrowser(selectedDocument)}>
                  <Ionicons name="eye" size={20} color={colors.white} />
                  <Text style={styles.modalButtonText}>View</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => handleDownload(selectedDocument)}>
                  <Ionicons name="download" size={20} color={colors.white} />
                  <Text style={styles.modalButtonText}>Download</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => handleShare(selectedDocument)}>
                  <Ionicons name="share-social" size={20} color={colors.white} />
                  <Text style={styles.modalButtonText}>Share</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.deleteButton]}
                  onPress={() => handleDelete(selectedDocument._id)}>
                  <Ionicons name="trash" size={20} color={colors.white} />
                  <Text style={styles.modalButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{documentType}</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primaryDark} />
          <Text style={styles.loadingText}>Loading documents...</Text>
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
        <Text style={styles.headerTitle}>{documentType}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('DocumentDashboardScreen')}>
          <Ionicons name="add-circle" size={24} color={colors.primaryDark} />
        </TouchableOpacity>
      </View>

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <Text style={styles.countText}>
          {filteredDocuments.length} {filteredDocuments.length === 1 ? 'Document' : 'Documents'}
        </Text>
        <View style={styles.sortButtons}>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'date' && styles.sortButtonActive]}
            onPress={() => setSortBy('date')}>
            <Ionicons
              name="calendar-outline"
              size={16}
              color={sortBy === 'date' ? colors.white : colors.textSecondary}
            />
            <Text style={[styles.sortButtonText, sortBy === 'date' && styles.sortButtonTextActive]}>
              Date
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'name' && styles.sortButtonActive]}
            onPress={() => setSortBy('name')}>
            <Ionicons
              name="text-outline"
              size={16}
              color={sortBy === 'name' ? colors.white : colors.textSecondary}
            />
            <Text style={[styles.sortButtonText, sortBy === 'name' && styles.sortButtonTextActive]}>
              Name
            </Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={[styles.sortButton, sortBy === 'type' && styles.sortButtonActive]}
            onPress={() => setSortBy('type')}>
            <Ionicons
              name="folder-outline"
              size={16}
              color={sortBy === 'type' ? colors.white : colors.textSecondary}
            />
            <Text style={[styles.sortButtonText, sortBy === 'type' && styles.sortButtonTextActive]}>
              Type
            </Text>
          </TouchableOpacity> */}
        </View>
      </View>

      {/* Document List */}
      {filteredDocuments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={64} color={colors.textSecondary} />
          <Text style={styles.emptyTitle}>No Documents Found</Text>
          <Text style={styles.emptySubtitle}>
            Upload your first {documentType.toLowerCase()} document
          </Text>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => navigation.navigate('DocumentDashboardScreen')}>
            <Ionicons name="add" size={20} color={colors.white} />
            <Text style={styles.uploadButtonText}>Add Document</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredDocuments}
          renderItem={renderDocumentItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Preview Modal */}
      <PreviewModal />
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
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  countText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.background,
    gap: 4,
  },
  sortButtonActive: {
    backgroundColor: colors.primaryDark,
  },
  sortButtonText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Poppins_500Medium',
  },
  sortButtonTextActive: {
    color: colors.white,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 24,
  },
  documentCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  documentHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 4,
  },
  documentType: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
    marginLeft: 2,
  },
  metaDivider: {
    marginHorizontal: 4,
    color: colors.textSecondary,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  quickActionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  deleteAction: {
    backgroundColor: '#FEE2E2',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
    marginBottom: 24,
  },
  uploadButton: {
    flexDirection: 'row',
    backgroundColor: colors.primaryDark,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 8,
  },
  uploadButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  // Modal Styles
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
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primaryDark,
    fontFamily: 'Poppins_700Bold',
  },
  previewContainer: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
    minHeight: 200,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  previewPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  previewText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
    marginTop: 12,
    textAlign: 'center',
  },
  infoSection: {
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 4,
  },
  infoType: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
    marginBottom: 20,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  infoItem: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  infoItemText: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
  },
  descriptionContainer: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  descriptionLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    fontFamily: 'Poppins_500Medium',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: 'Poppins_400Regular',
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    minWidth: '47%',
    flexDirection: 'row',
    backgroundColor: colors.primaryDark,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  deleteButton: {
    backgroundColor: '#EF4444',
  },
  modalButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
});

export default DocumentListScreen;
