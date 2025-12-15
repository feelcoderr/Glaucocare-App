// FILE: src/screens/event/EventListScreen.jsx
// Events List Screen
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { fetchEvents, setFilters } from '../../store/slices/eventSlice';
import { colors } from '../../styles/colors';

const EventListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { events, isLoading, filters } = useSelector((state) => state.event);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Free');

  const filterOptions = ['Free', 'All', 'Recent', 'Location', 'Registered'];

  useEffect(() => {
    dispatch(fetchEvents({ ...filters, upcoming: true }));
  }, [filters]);

  const handleSearch = () => {
    // Implement search functionality
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (timeString) => {
    return timeString;
  };

  const handleFilterPress = (filter) => {
    setActiveFilter(filter);

    let filterParams = {};

    switch (filter) {
      case 'All':
        filterParams = { upcoming: undefined };
        break;
      case 'Free':
        filterParams = { upcoming: true, isFree: true };
        break;
      case 'Upcoming':
        filterParams = { upcoming: true };
        break;
      case 'Past':
        filterParams = { upcoming: false };
        break;
      default:
        filterParams = {};
    }

    dispatch(setFilters(filterParams));
    dispatch(fetchEvents({ ...filters, ...filterParams }));
  };
  const renderEventCard = ({ item }) => (
    <TouchableOpacity
      style={styles.eventCard}
      // onPress={() => navigation.navigate('EventDetail', { eventId: item._id })}
    >
      {/* Event Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri:
              item.featuredImage ||
              'https://res.cloudinary.com/datgoelws/image/upload/v1762598690/event_-2_w3hnz8.png',
          }}
          style={styles.eventImage}
        />
        {item.isFree && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>NEW</Text>
          </View>
        )}
      </View>

      {/* Event Details */}
      <View style={styles.eventDetails}>
        <Text style={styles.eventTitle} numberOfLines={2}>
          {item.title}
        </Text>

        {/* Date & Time */}
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.infoText}>
            Date & Time: {formatDate(item.eventDate)} - {item.eventTime}
          </Text>
        </View>

        {/* Location */}
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.infoText}>
            {item.venue?.name || item.venue?.address || 'Online (GlaucoCare app)'}
          </Text>
        </View>

        {/* Contact */}
        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.infoText}>
            {item.organizer?.contact?.email || 'events@glaucocare.com'}
          </Text>
        </View>

        {item.organizer?.contact?.phone && (
          <View style={styles.infoRow}>
            <Ionicons name="call-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.infoText}>{item.organizer.contact.phone}</Text>
          </View>
        )}
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
        <Text style={styles.headerTitle}>Events</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search Bar */}
      {/* <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search event..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
      </View> */}

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        {filterOptions.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterChip, activeFilter === filter && styles.filterChipActive]}
            onPress={() => handleFilterPress(filter)}>
            <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Events List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primaryDark} />
        </View>
      ) : (
        <FlatList
          data={events}
          renderItem={renderEventCard}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
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
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: 'Poppins_400Regular',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  filterText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: 'Poppins_500Medium',
  },
  filterTextActive: {
    color: colors.white,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  eventCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  imageContainer: {
    position: 'relative',
  },
  eventImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#E3F2FD',
  },
  newBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  newBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Poppins_700Bold',
  },
  eventDetails: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
    marginLeft: 8,
    lineHeight: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EventListScreen;
