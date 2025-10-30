// FILE: src/screens/blog/BlogListScreen.jsx
// Blog Feed Screen
// ============================================================================

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { fetchBlogs, setFilters, clearBlogs } from '../../store/slices/blogSlice';
import { colors } from '../../styles/colors';

const BlogListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { blogs, isLoading, filters, pagination } = useSelector((state) => state.blog);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const categories = ['All', 'VisionCare', 'Surgery', 'Lifestyle', 'Wellness'];
  const sortOptions = ['Recent', 'Popular', 'Oldest'];
  const [activeSortBy, setActiveSortBy] = useState('Recent');
  const [showSortMenu, setShowSortMenu] = useState(false);

  useEffect(() => {
    loadBlogs();
  }, [filters]);

  const loadBlogs = () => {
    const params = {
      page: filters.page,
      limit: filters.limit,
      category: activeCategory !== 'All' ? activeCategory : '',
      search: searchQuery,
    };
    dispatch(fetchBlogs(params));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    dispatch(setFilters({ page: 1 }));
    await loadBlogs();
    setRefreshing(false);
  };

  const handleSearch = () => {
    dispatch(setFilters({ search: searchQuery, page: 1 }));
  };

  const handleCategoryPress = (category) => {
    setActiveCategory(category);
    dispatch(clearBlogs());
    dispatch(setFilters({ category: category !== 'All' ? category : '', page: 1 }));
  };

  const handleSortChange = (sortBy) => {
    setActiveSortBy(sortBy);
    setShowSortMenu(false);
    dispatch(setFilters({ sortBy: sortBy.toLowerCase(), page: 1 }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderBlogCard = ({ item }) => (
    <TouchableOpacity
      style={styles.blogCard}
      onPress={() => navigation.navigate('BlogDetail', { blogId: item._id, slug: item.slug })}
      activeOpacity={0.9}>
      {/* Featured Image */}
      <Image
        source={{ uri: item.featuredImage || 'https://via.placeholder.com/350x200' }}
        style={styles.blogImage}
      />

      {/* Blog Content */}
      <View style={styles.blogContent}>
        {/* Category Badge and Date */}
        <View style={styles.blogMeta}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{item.categories?.[0] || 'VisionCare'}</Text>
          </View>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.dateText}>{formatDate(item.publishedAt)}</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.blogTitle} numberOfLines={2}>
          {item.title}
        </Text>

        {/* Excerpt */}
        <Text style={styles.blogExcerpt} numberOfLines={2}>
          {item.excerpt}
        </Text>

        {/* Read More Button */}
        <TouchableOpacity
          style={styles.readMoreButton}
          onPress={() => navigation.navigate('BlogDetail', { blogId: item._id, slug: item.slug })}>
          <Text style={styles.readMoreText}>Read More</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.primaryDark} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Blog Feed</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search articles..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={() => setShowSortMenu(!showSortMenu)}>
          <Ionicons name="options-outline" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Category Filter Chips */}
      <View style={styles.categoryContainer}>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.categoryChip, activeCategory === item && styles.categoryChipActive]}
              onPress={() => handleCategoryPress(item)}>
              <Text
                style={[
                  styles.categoryChipText,
                  activeCategory === item && styles.categoryChipTextActive,
                ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Sort By Dropdown */}
      <View style={styles.sortContainer}>
        <TouchableOpacity style={styles.sortButton} onPress={() => setShowSortMenu(!showSortMenu)}>
          <Text style={styles.sortLabel}>Sort by: {activeSortBy}</Text>
          <Ionicons
            name={showSortMenu ? 'chevron-up' : 'chevron-down'}
            size={16}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
      </View>

      {/* Sort Menu Overlay */}
      {showSortMenu && (
        <View style={styles.sortMenu}>
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={styles.sortMenuItem}
              onPress={() => handleSortChange(option)}>
              <Text
                style={[styles.sortMenuText, activeSortBy === option && styles.sortMenuTextActive]}>
                {option}
              </Text>
              {activeSortBy === option && (
                <Ionicons name="checkmark" size={20} color={colors.primaryDark} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Blog List */}
      {isLoading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primaryDark} />
        </View>
      ) : (
        <FlatList
          data={blogs}
          renderItem={renderBlogCard}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          onEndReached={() => {
            if (pagination && pagination.currentPage < pagination.totalPages) {
              dispatch(setFilters({ page: pagination.currentPage + 1 }));
            }
          }}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="document-text-outline" size={80} color={colors.textSecondary} />
              <Text style={styles.emptyText}>No blogs found</Text>
            </View>
          }
        />
      )}
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
    flex: 1,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: 'Poppins_400Regular',
  },
  categoryContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: colors.primaryDark,
  },
  categoryChipText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: 'Poppins_500Medium',
  },
  categoryChipTextActive: {
    color: colors.white,
  },
  sortContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortLabel: {
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: 'Poppins_500Medium',
    marginRight: 4,
  },
  sortMenu: {
    position: 'absolute',
    top: 220,
    right: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1000,
    minWidth: 150,
  },
  sortMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sortMenuText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: 'Poppins_400Regular',
  },
  sortMenuTextActive: {
    color: colors.primaryDark,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  blogCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  blogImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#E3F2FD',
  },
  blogContent: {
    padding: 16,
  },
  blogMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryBadgeText: {
    fontSize: 11,
    color: colors.primaryDark,
    fontFamily: 'Poppins_600SemiBold',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
  },
  blogTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 8,
    lineHeight: 22,
  },
  blogExcerpt: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
    lineHeight: 20,
    marginBottom: 12,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readMoreText: {
    fontSize: 14,
    color: colors.primaryDark,
    fontFamily: 'Poppins_600SemiBold',
    marginRight: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontFamily: 'Poppins_500Medium',
    marginTop: 16,
  },
});

export default BlogListScreen;
