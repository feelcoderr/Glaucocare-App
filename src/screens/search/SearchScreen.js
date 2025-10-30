// FILE: src/screens/search/SearchScreen.jsx
// Global Search Screen
// ============================================================================

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import {
  performSearch,
  fetchRecentSearches,
  fetchPopularSearches,
  clearRecentSearches,
  setQuery,
  clearResults,
} from '../../store/slices/searchSlice';
import { colors } from '../../styles/colors';

const SearchScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { query, results, recentSearches, popularSearches, isLoading } = useSelector(
    (state) => state.search
  );

  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    dispatch(fetchRecentSearches());
    dispatch(fetchPopularSearches());
  }, []);

  const handleSearch = () => {
    if (searchText.trim().length < 2) return;
    dispatch(performSearch({ query: searchText, limit: 5 }));
  };

  const handleRecentSearchTap = (searchQuery) => {
    setSearchText(searchQuery);
    dispatch(performSearch({ query: searchQuery, limit: 5 }));
  };

  const handleClearRecentSearches = () => {
    dispatch(clearRecentSearches());
  };

  const handleCancel = () => {
    setSearchText('');
    dispatch(clearResults());
    navigation.goBack();
  };

  const handleCategoryPress = (category) => {
    let screen = '';
    switch (category) {
      case 'doctors':
        screen = 'DoctorList';
        break;
      case 'blogs':
        screen = 'BlogList';
        break;
      case 'events':
        screen = 'EventList';
        break;
      case 'educational':
        screen = 'EducationalList';
        break;
    }
    if (screen) {
      navigation.navigate(screen);
    }
  };

  const renderRecentSearches = () => {
    if (!recentSearches || recentSearches.length === 0) return null;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Searches</Text>
          <TouchableOpacity onPress={handleClearRecentSearches}>
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.recentSearchesContainer}>
          {recentSearches.slice(0, 3).map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.recentSearchChip}
              onPress={() => handleRecentSearchTap(item.query)}>
              <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
              <Text style={styles.recentSearchText}>{item.query}</Text>
              <Ionicons name="close" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderCategoryCards = () => {
    const categories = [
      {
        key: 'doctors',
        title: 'Doctors',
        icon: 'medical',
        count: results.doctors?.count || 2145,
        color: '#E3F2FD',
      },
      {
        key: 'blogs',
        title: 'Articles',
        icon: 'newspaper',
        count: results.blogs?.count || 1832,
        color: '#FFE5E5',
      },
      {
        key: 'events',
        title: 'Events',
        icon: 'calendar',
        count: results.events?.count || 128,
        color: '#E8F5E9',
      },
      {
        key: 'educational',
        title: 'Community Stories',
        icon: 'people',
        count: results.educational?.count || 892,
        color: '#F3E8FF',
      },
    ];

    return (
      <View style={styles.categoryGrid}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.key}
            style={styles.categoryCard}
            onPress={() => handleCategoryPress(category.key)}>
            <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
              <Ionicons name={category.icon} size={28} color={colors.primaryDark} />
            </View>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            <Text style={styles.categoryCount}>{category.count.toLocaleString()} items</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderPopularSearches = () => {
    if (!popularSearches || popularSearches.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Searches</Text>
        {popularSearches.map((search, index) => (
          <TouchableOpacity
            key={index}
            style={styles.popularSearchItem}
            onPress={() => handleRecentSearchTap(search)}>
            <Ionicons name="trending-up" size={18} color={colors.primaryDark} />
            <Text style={styles.popularSearchText}>{search}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderSuggestedForYou = () => {
    const suggestions = [
      'Patient Success Stories',
      '10 Tips for eyes',
      'Free Health Check-up',
      'Patient Success Stories',
    ];

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Suggested for you</Text>
        {suggestions.map((suggestion, index) => (
          <TouchableOpacity
            key={index}
            style={styles.suggestionItem}
            onPress={() => handleRecentSearchTap(suggestion)}>
            <Ionicons name="search" size={18} color={colors.textSecondary} />
            <Text style={styles.suggestionText}>{suggestion}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderSearchResults = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primaryDark} />
        </View>
      );
    }

    if (!query || !results.doctors) return null;

    const hasResults =
      results.doctors.items.length > 0 ||
      results.blogs.items.length > 0 ||
      results.events.items.length > 0 ||
      results.educational.items.length > 0;

    if (!hasResults) {
      return (
        <View style={styles.noResultsContainer}>
          <Ionicons name="search-outline" size={64} color={colors.textSecondary} />
          <Text style={styles.noResultsText}>No results found</Text>
          <Text style={styles.noResultsSubtext}>Try different keywords</Text>
        </View>
      );
    }

    return (
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsHeader}>Search results for {query}</Text>

        {/* Doctors */}
        {results.doctors.items.length > 0 && (
          <View style={styles.resultSection}>
            <View style={styles.resultSectionHeader}>
              <Text style={styles.resultSectionTitle}>
                Doctors ({results.doctors.count.toLocaleString()})
              </Text>
              <TouchableOpacity onPress={() => handleCategoryPress('doctors')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            {results.doctors.items.map((doctor) => (
              <TouchableOpacity
                key={doctor._id}
                style={styles.resultItem}
                onPress={() => navigation.navigate('DoctorDetail', { doctorId: doctor._id })}>
                <Ionicons name="medical" size={20} color={colors.primaryDark} />
                <View style={styles.resultItemContent}>
                  <Text style={styles.resultItemTitle}>{doctor.fullname}</Text>
                  <Text style={styles.resultItemSubtitle}>{doctor.specialty}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Blogs */}
        {results.blogs.items.length > 0 && (
          <View style={styles.resultSection}>
            <View style={styles.resultSectionHeader}>
              <Text style={styles.resultSectionTitle}>
                Articles ({results.blogs.count.toLocaleString()})
              </Text>
              <TouchableOpacity onPress={() => handleCategoryPress('blogs')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            {results.blogs.items.map((blog) => (
              <TouchableOpacity
                key={blog._id}
                style={styles.resultItem}
                onPress={() => navigation.navigate('BlogDetail', { blogId: blog._id })}>
                <Ionicons name="newspaper" size={20} color={colors.primaryDark} />
                <View style={styles.resultItemContent}>
                  <Text style={styles.resultItemTitle} numberOfLines={1}>
                    {blog.title}
                  </Text>
                  <Text style={styles.resultItemSubtitle} numberOfLines={1}>
                    {blog.excerpt}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Events */}
        {results.events.items.length > 0 && (
          <View style={styles.resultSection}>
            <View style={styles.resultSectionHeader}>
              <Text style={styles.resultSectionTitle}>
                Events ({results.events.count.toLocaleString()})
              </Text>
              <TouchableOpacity onPress={() => handleCategoryPress('events')}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            {results.events.items.map((event) => (
              <TouchableOpacity
                key={event._id}
                style={styles.resultItem}
                onPress={() => navigation.navigate('EventDetail', { eventId: event._id })}>
                <Ionicons name="calendar" size={20} color={colors.primaryDark} />
                <View style={styles.resultItemContent}>
                  <Text style={styles.resultItemTitle}>{event.title}</Text>
                  <Text style={styles.resultItemSubtitle}>
                    {new Date(event.eventDate).toLocaleDateString()} - {event.venue?.city}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search</Text>
        <TouchableOpacity onPress={handleCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor={colors.textSecondary}
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
          autoFocus
          returnKeyType="search"
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {query && results.doctors ? (
          renderSearchResults()
        ) : (
          <>
            {renderRecentSearches()}
            {renderCategoryCards()}
            {renderPopularSearches()}
            {renderSuggestedForYou()}
          </>
        )}
        <View style={{ height: 20 }} />
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
  cancelText: {
    fontSize: 16,
    color: colors.primaryDark,
    fontFamily: 'Poppins_500Medium',
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
    fontSize: 16,
    color: colors.textPrimary,
    fontFamily: 'Poppins_400Regular',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 12,
  },
  clearAllText: {
    fontSize: 14,
    color: colors.primaryDark,
    fontFamily: 'Poppins_500Medium',
  },
  recentSearchesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  recentSearchChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  recentSearchText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: 'Poppins_400Regular',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
  },
  popularSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  popularSearchText: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    fontFamily: 'Poppins_400Regular',
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  suggestionText: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    fontFamily: 'Poppins_400Regular',
    marginLeft: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
    marginTop: 16,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
    marginTop: 4,
  },
  resultsContainer: {
    paddingHorizontal: 16,
  },
  resultsHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 20,
  },
  resultSection: {
    marginBottom: 24,
  },
  resultSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultSectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primaryDark,
    fontFamily: 'Poppins_500Medium',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
  },
  resultItemContent: {
    flex: 1,
    marginLeft: 12,
  },
  resultItemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 2,
  },
  resultItemSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
  },
});

export default SearchScreen;
// // FILE: src/screens/search/SearchScreen.jsx
// // Search Screen
// // ============================================================================

// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   ActivityIndicator,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useDispatch, useSelector } from 'react-redux';
// import { Ionicons } from '@expo/vector-icons';
// import {
//   performSearch,
//   fetchRecentSearches,
//   fetchPopularSearches,
//   clearRecentSearches,
//   setQuery,
// } from '../../store/slices/searchSlice';
// import { colors } from '../../styles/colors';

// const SearchScreen = ({ navigation }) => {
//   const dispatch = useDispatch();
//   const { query, results, recentSearches, popularSearches, isLoading } = useSelector(
//     (state) => state.search
//   );
//   const [searchText, setSearchText] = useState('');

//   useEffect(() => {
//     dispatch(fetchRecentSearches());
//     dispatch(fetchPopularSearches());
//   }, []);

//   const handleSearch = () => {
//     if (searchText.trim().length > 0) {
//       dispatch(setQuery(searchText));
//       dispatch(performSearch(searchText));
//     }
//   };

//   const handleRecentSearchPress = (searchQuery) => {
//     setSearchText(searchQuery);
//     dispatch(setQuery(searchQuery));
//     dispatch(performSearch(searchQuery));
//   };

//   const handleClearRecent = () => {
//     dispatch(clearRecentSearches());
//   };

//   const searchCategories = [
//     {
//       icon: '👨‍⚕️',
//       label: 'Doctors',
//       count: results?.doctors?.count || 2145,
//       color: '#E3F2FD',
//       onPress: () => navigation.navigate('DoctorList'),
//     },
//     {
//       icon: '📄',
//       label: 'Articles',
//       count: results?.blogs?.count || 1832,
//       color: '#FCE4EC',
//       onPress: () => {},
//     },
//     {
//       icon: '📅',
//       label: 'Events',
//       count: results?.events?.count || 128,
//       color: '#E8F5E9',
//       onPress: () => navigation.navigate('EventList'),
//     },
//     {
//       icon: '📖',
//       label: 'Community Stories',
//       count: results?.educational?.count || 892,
//       color: '#F3E5F5',
//       onPress: () => {},
//     },
//   ];

//   return (
//     <SafeAreaView style={styles.container} edges={['top']}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Search</Text>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Text style={styles.cancelText}>Cancel</Text>
//         </TouchableOpacity>
//       </View>

//       {/* Search Input */}
//       <View style={styles.searchContainer}>
//         <Ionicons name="search" size={20} color={colors.textSecondary} />
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search"
//           placeholderTextColor={colors.textSecondary}
//           value={searchText}
//           onChangeText={setSearchText}
//           onSubmitEditing={handleSearch}
//           autoFocus
//         />
//       </View>

//       <ScrollView showsVerticalScrollIndicator={false}>
//         {/* Recent Searches */}
//         {!results && recentSearches.length > 0 && (
//           <View style={styles.section}>
//             <View style={styles.sectionHeader}>
//               <Text style={styles.sectionTitle}>Recent Searches</Text>
//               <TouchableOpacity onPress={handleClearRecent}>
//                 <Text style={styles.clearText}>Clear All</Text>
//               </TouchableOpacity>
//             </View>
//             <View style={styles.recentChips}>
//               {recentSearches.slice(0, 3).map((item, index) => (
//                 <TouchableOpacity
//                   key={index}
//                   style={styles.recentChip}
//                   onPress={() => handleRecentSearchPress(item.query)}>
//                   <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
//                   <Text style={styles.recentChipText}>{item.query}</Text>
//                   <Ionicons name="close" size={16} color={colors.textSecondary} />
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </View>
//         )}

//         {/* Search Categories */}
//         {!results && (
//           <View style={styles.categoriesGrid}>
//             {searchCategories.map((category, index) => (
//               <TouchableOpacity
//                 key={index}
//                 style={[styles.categoryCard, { backgroundColor: category.color }]}
//                 onPress={category.onPress}>
//                 <Text style={styles.categoryIcon}>{category.icon}</Text>
//                 <Text style={styles.categoryLabel}>{category.label}</Text>
//                 <Text style={styles.categoryCount}>{category.count.toLocaleString()} items</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         )}

//         {/* Popular Searches */}
//         {!results && popularSearches.length > 0 && (
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Popular Searches</Text>
//             {popularSearches.map((searchTerm, index) => (
//               <TouchableOpacity
//                 key={index}
//                 style={styles.popularItem}
//                 onPress={() => handleRecentSearchPress(searchTerm)}>
//                 <Ionicons name="trending-up" size={20} color={colors.primaryDark} />
//                 <Text style={styles.popularText}>{searchTerm}</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         )}

//         {/* Suggested for you */}
//         {!results && (
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Suggested for you</Text>
//             {[
//               'Patient Success Stories',
//               '10 Tips for eyes',
//               'Free Health Check-up',
//               'Patient Success Stories',
//             ].map((suggestion, index) => (
//               <TouchableOpacity key={index} style={styles.suggestionItem}>
//                 <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
//                 <Text style={styles.suggestionText}>{suggestion}</Text>
//                 <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
//               </TouchableOpacity>
//             ))}
//           </View>
//         )}

//         {/* Search Results */}
//         {isLoading && (
//           <View style={styles.loadingContainer}>
//             <ActivityIndicator size="large" color={colors.primaryDark} />
//           </View>
//         )}

//         {results && !isLoading && (
//           <View style={styles.resultsContainer}>
//             <Text style={styles.resultsTitle}>Search Results for `{query}`</Text>

//             {/* Doctors Results */}
//             {results.doctors?.items?.length > 0 && (
//               <View style={styles.resultSection}>
//                 <Text style={styles.resultSectionTitle}>Doctors ({results.doctors.count})</Text>
//                 {results.doctors.items.map((doctor, index) => (
//                   <TouchableOpacity
//                     key={index}
//                     style={styles.resultItem}
//                     onPress={() => navigation.navigate('DoctorDetail', { doctorId: doctor._id })}>
//                     <Text style={styles.resultItemTitle}>{doctor.fullname}</Text>
//                     <Text style={styles.resultItemSubtitle}>{doctor.specialty}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             )}

//             {/* Blogs Results */}
//             {results.blogs?.items?.length > 0 && (
//               <View style={styles.resultSection}>
//                 <Text style={styles.resultSectionTitle}>Articles ({results.blogs.count})</Text>
//                 {results.blogs.items.map((blog, index) => (
//                   <TouchableOpacity key={index} style={styles.resultItem}>
//                     <Text style={styles.resultItemTitle}>{blog.title}</Text>
//                     <Text style={styles.resultItemSubtitle}>{blog.excerpt}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             )}

//             {/* Events Results */}
//             {results.events?.items?.length > 0 && (
//               <View style={styles.resultSection}>
//                 <Text style={styles.resultSectionTitle}>Events ({results.events.count})</Text>
//                 {results.events.items.map((event, index) => (
//                   <TouchableOpacity
//                     key={index}
//                     style={styles.resultItem}
//                     onPress={() => navigation.navigate('EventDetail', { eventId: event._id })}>
//                     <Text style={styles.resultItemTitle}>{event.title}</Text>
//                     <Text style={styles.resultItemSubtitle}>{event.venue?.city}</Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             )}
//           </View>
//         )}
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.background,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: colors.textPrimary,
//     fontFamily: 'Poppins_600SemiBold',
//   },
//   cancelText: {
//     fontSize: 16,
//     color: colors.primaryDark,
//     fontFamily: 'Poppins_500Medium',
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: colors.white,
//     marginHorizontal: 16,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderRadius: 12,
//     marginBottom: 20,
//   },
//   searchInput: {
//     flex: 1,
//     marginLeft: 12,
//     fontSize: 16,
//     color: colors.textPrimary,
//     fontFamily: 'Poppins_400Regular',
//   },
//   section: {
//     marginBottom: 24,
//     paddingHorizontal: 16,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: colors.textPrimary,
//     fontFamily: 'Poppins_600SemiBold',
//   },
//   clearText: {
//     fontSize: 14,
//     color: colors.textSecondary,
//     fontFamily: 'Poppins_400Regular',
//     textDecorationLine: 'underline',
//   },
//   recentChips: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//   },
//   recentChip: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: colors.white,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     borderRadius: 20,
//     gap: 6,
//   },
//   recentChipText: {
//     fontSize: 14,
//     color: colors.textPrimary,
//     fontFamily: 'Poppins_400Regular',
//   },
//   categoriesGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     paddingHorizontal: 8,
//     marginBottom: 24,
//   },
//   categoryCard: {
//     width: '48%',
//     margin: 8,
//     padding: 16,
//     borderRadius: 12,
//     alignItems: 'flex-start',
//   },
//   categoryIcon: {
//     fontSize: 32,
//     marginBottom: 8,
//   },
//   categoryLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: colors.textPrimary,
//     fontFamily: 'Poppins_600SemiBold',
//     marginBottom: 4,
//   },
//   categoryCount: {
//     fontSize: 12,
//     color: colors.textSecondary,
//     fontFamily: 'Poppins_400Regular',
//   },
//   popularItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//     gap: 12,
//   },
//   popularText: {
//     flex: 1,
//     fontSize: 15,
//     color: colors.textPrimary,
//     fontFamily: 'Poppins_400Regular',
//   },
//   suggestionItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 12,
//     gap: 12,
//   },
//   suggestionText: {
//     flex: 1,
//     fontSize: 15,
//     color: colors.textPrimary,
//     fontFamily: 'Poppins_400Regular',
//   },
//   loadingContainer: {
//     padding: 40,
//     alignItems: 'center',
//   },
//   resultsContainer: {
//     paddingHorizontal: 16,
//   },
//   resultsTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: colors.textPrimary,
//     fontFamily: 'Poppins_600SemiBold',
//     marginBottom: 20,
//   },
//   resultSection: {
//     marginBottom: 24,
//   },
//   resultSectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: colors.textPrimary,
//     fontFamily: 'Poppins_600SemiBold',
//     marginBottom: 12,
//   },
//   resultItem: {
//     backgroundColor: colors.white,
//     padding: 16,
//     borderRadius: 12,
//     marginBottom: 8,
//   },
//   resultItemTitle: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: colors.textPrimary,
//     fontFamily: 'Poppins_600SemiBold',
//     marginBottom: 4,
//   },
//   resultItemSubtitle: {
//     fontSize: 13,
//     color: colors.textSecondary,
//     fontFamily: 'Poppins_400Regular',
//   },
// });

// export default SearchScreen;
