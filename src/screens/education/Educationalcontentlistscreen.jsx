// FILE: src/screens/educational/EducationalContentListScreen.jsx
// Educational Content List Screen
// ============================================================================

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  RefreshControl,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import {
  fetchEducationalContentList,
  fetchCategories,
} from '../../store/slices/educationalContentSlice';
import { colors } from '../../styles/colors';

const EducationalContentListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { contentList, categories, isListLoading, listError } = useSelector(
    (state) => state.educationalContent
  );

  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    dispatch(fetchEducationalContentList());
    dispatch(fetchCategories());
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(
      fetchEducationalContentList({
        search: searchQuery,
        category: selectedCategory,
      })
    );
    setRefreshing(false);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    dispatch(
      fetchEducationalContentList({
        search: query,
        category: selectedCategory,
      })
    );
  };

  const handleCategorySelect = (categoryKey) => {
    const newCategory = selectedCategory === categoryKey ? null : categoryKey;
    setSelectedCategory(newCategory);
    dispatch(
      fetchEducationalContentList({
        search: searchQuery,
        category: newCategory,
      })
    );
  };

  const handleContentPress = (content) => {
    navigation.navigate('GlaucomaGuide', {
      slug: content.slug,
      title: content.title,
    });
  };

  if (isListLoading && !refreshing && contentList.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primaryDark} />
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
        <Text style={styles.headerTitle}>Educational Content</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search content..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor={colors.textSecondary}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.key}
            style={[
              styles.categoryChip,
              selectedCategory === category.key && styles.categoryChipActive,
            ]}
            onPress={() => handleCategorySelect(category.key)}>
            <Ionicons
              name={category.icon}
              size={16}
              color={selectedCategory === category.key ? colors.white : colors.primaryDark}
            />
            <Text
              style={[
                styles.categoryChipText,
                selectedCategory === category.key && styles.categoryChipTextActive,
              ]}>
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content List */}
      <ScrollView
        style={styles.contentList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {contentList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={64} color={colors.border} />
            <Text style={styles.emptyText}>No content available</Text>
          </View>
        ) : (
          contentList.map((content) => (
            <TouchableOpacity
              key={content._id}
              style={styles.contentCard}
              onPress={() => handleContentPress(content)}>
              <Image
                source={{ uri: content.heroImage }}
                style={styles.contentImage}
                resizeMode="cover"
              />
              <View style={styles.contentInfo}>
                <Text style={styles.contentTitle} numberOfLines={2}>
                  {content.title}
                </Text>
                <Text style={styles.contentDescription} numberOfLines={2}>
                  {content.shortDescription}
                </Text>
                <View style={styles.contentMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                    <Text style={styles.metaText}>{content.readingTime} min read</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="eye-outline" size={14} color={colors.textSecondary} />
                    <Text style={styles.metaText}>{content.viewCount || 0} views</Text>
                  </View>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ))
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: colors.white,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: colors.textPrimary,
  },
  categoriesContainer: {
    backgroundColor: colors.white,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoriesContent: {
    paddingHorizontal: 16,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.primaryDark,
  },
  categoryChipActive: {
    backgroundColor: colors.primaryDark,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primaryDark,
    marginLeft: 6,
  },
  categoryChipTextActive: {
    color: colors.white,
  },
  contentList: {
    flex: 1,
  },
  contentCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentImage: {
    width: 100,
    height: 100,
    backgroundColor: colors.border,
  },
  contentInfo: {
    flex: 1,
    padding: 12,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  contentDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 18,
  },
  contentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
  },
});

export default EducationalContentListScreen;
