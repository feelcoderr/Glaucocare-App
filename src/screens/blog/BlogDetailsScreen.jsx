// FILE: src/screens/blog/BlogDetailScreen.jsx
// Blog Detail Screen
// ============================================================================

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { fetchBlogById, clearSelectedBlog } from '../../store/slices/blogSlice';
import { colors } from '../../styles/colors';

const BlogDetailScreen = ({ route, navigation }) => {
  const { blogId, slug } = route.params;
  const dispatch = useDispatch();
  const { selectedBlog, isLoading } = useSelector((state) => state.blog);

  useEffect(() => {
    const identifier = slug || blogId;
    dispatch(fetchBlogById(identifier));

    return () => {
      dispatch(clearSelectedBlog());
    };
  }, [blogId, slug]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this article: ${selectedBlog?.title}`,
        url: `https://glaucocare.in/blog/${selectedBlog?.slug}`,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primaryDark} />
      </View>
    );
  }

  if (!selectedBlog) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Blog not found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Blog</Text>
        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Featured Image */}
        <Image
          source={{ uri: selectedBlog.featuredImage || 'https://via.placeholder.com/400x250' }}
          style={styles.featuredImage}
        />

        {/* Content Container */}
        <View style={styles.contentContainer}>
          {/* Category Badge and Date */}
          <View style={styles.metaContainer}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>
                {selectedBlog.categories?.[0] || 'VisionCare'}
              </Text>
            </View>
            <View style={styles.dateShareContainer}>
              <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.dateText}>{formatDate(selectedBlog.publishedAt)}</Text>
              <TouchableOpacity style={styles.shareIconButton} onPress={handleShare}>
                <Ionicons name="share-outline" size={16} color={colors.primaryDark} />
                <Text style={styles.shareText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>{selectedBlog.title}</Text>

          {/* Blog Content */}
          <Text style={styles.content}>{selectedBlog.content || selectedBlog.excerpt}</Text>

          {/* Detailed Content Sections */}
          <View style={styles.detailedSection}>
            <Text style={styles.sectionText}>
              In today is fast-paced world, our eyes are constantly exposed to digital screens,
              pollution, and stress — all of which contribute to rising eye health issues like
              glaucoma, dry eye syndrome, and digital eye strain. But here is the silver lining:
              early detection and modern diagnostic tools are transforming the way we approach eye
              care. Technologies like Optical Coherence Tomography (OCT) and non-contact tonometers
              are now commonly used to detect signs of glaucoma before symptoms even appear.
            </Text>
            <Text style={styles.sectionText}>
              With regular eye checkups, many vision-related complications can be prevented or
              treated before they cause permanent damage. Glaucoma, often called the silent thief of
              sight, is one such condition that benefits greatly from proactive monitoring and
              lifestyle adjustments.
            </Text>
            <Text style={styles.sectionText}>
              Whether you are experiencing minor discomfort or managing an existing eye condition,
              the future of vision care is rooted in early action, advanced diagnostics, and
              personalized treatment — and that future is already here.
            </Text>
          </View>

          {/* Image Section */}
          {selectedBlog.additionalImages && selectedBlog.additionalImages.length > 0 && (
            <Image source={{ uri: selectedBlog.additionalImages[0] }} style={styles.contentImage} />
          )}

          {/* Takeaway Tips Section */}
          <View style={styles.takeawaySection}>
            <Text style={styles.takeawayTitle}>Takeaway Tips:</Text>
            <View style={styles.tipsList}>
              <View style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>
                  Schedule annual eye checkups — especially if you are over 40.
                </Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>
                  Know your family history; glaucoma is hereditary.
                </Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>
                  Watch for subtle signs like blurry vision or eye pressure. Invasive options
                </Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>
                  Stay informed about the latest eye care technologies.
                </Text>
              </View>
            </View>
          </View>

          {/* Related Articles */}
          <View style={styles.relatedSection}>
            <Text style={styles.relatedTitle}>Related Articles</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.relatedScroll}>
              {[1, 2].map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.relatedCard}
                  onPress={() => navigation.push('BlogDetail', { blogId: `related-${item}` })}>
                  <Image
                    source={{ uri: 'https://via.placeholder.com/200x120' }}
                    style={styles.relatedImage}
                  />
                  <View style={styles.relatedContent}>
                    <View style={styles.relatedBadge}>
                      <Text style={styles.relatedBadgeText}>VisionCare</Text>
                    </View>
                    <View style={styles.relatedDate}>
                      <Ionicons name="calendar-outline" size={12} color={colors.textSecondary} />
                      <Text style={styles.relatedDateText}>Feb 15, 2024</Text>
                    </View>
                  </View>
                  <Text style={styles.relatedCardTitle} numberOfLines={2}>
                    The Future of Artificial Intelligence in Modern Technology
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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
    paddingVertical: 12,
    backgroundColor: colors.background,
  },
  backButton: {
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
    flex: 1,
    textAlign: 'center',
  },
  shareButton: {
    width: 40,
    alignItems: 'flex-end',
  },
  scrollView: {
    flex: 1,
  },
  featuredImage: {
    width: '100%',
    height: 250,
    backgroundColor: '#E3F2FD',
  },
  contentContainer: {
    padding: 20,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryBadgeText: {
    fontSize: 11,
    color: colors.primaryDark,
    fontFamily: 'Poppins_600SemiBold',
  },
  dateShareContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
  },
  shareIconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 8,
  },
  shareText: {
    fontSize: 12,
    color: colors.primaryDark,
    fontFamily: 'Poppins_500Medium',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    fontFamily: 'Poppins_700Bold',
    lineHeight: 28,
    marginBottom: 20,
  },
  content: {
    fontSize: 15,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
    lineHeight: 24,
    marginBottom: 20,
  },
  detailedSection: {
    marginBottom: 24,
  },
  sectionText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
    lineHeight: 22,
    marginBottom: 16,
  },
  contentImage: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    backgroundColor: '#E3F2FD',
    marginBottom: 24,
  },
  takeawaySection: {
    backgroundColor: '#F0F7FF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 32,
  },
  takeawayTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 16,
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipBullet: {
    fontSize: 16,
    color: colors.textPrimary,
    fontFamily: 'Poppins_700Bold',
    marginRight: 8,
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
    lineHeight: 20,
  },
  relatedSection: {
    marginTop: 8,
  },
  relatedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 16,
  },
  relatedScroll: {
    marginLeft: -20,
    paddingLeft: 20,
  },
  relatedCard: {
    width: 200,
    backgroundColor: colors.white,
    borderRadius: 12,
    marginRight: 12,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  relatedImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#E3F2FD',
  },
  relatedContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    paddingBottom: 8,
  },
  relatedBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  relatedBadgeText: {
    fontSize: 10,
    color: colors.primaryDark,
    fontFamily: 'Poppins_600SemiBold',
  },
  relatedDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  relatedDateText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
  },
  relatedCardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
    paddingHorizontal: 12,
    paddingBottom: 12,
    lineHeight: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontFamily: 'Poppins_500Medium',
  },
});

export default BlogDetailScreen;
