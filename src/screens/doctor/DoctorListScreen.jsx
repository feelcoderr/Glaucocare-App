// FILE: src/screens/doctor/DoctorListScreen.jsx
// Doctor List Screen with Search and Filters
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
import { fetchDoctors, setFilters } from '../../store/slices/doctorSlice';
import { colors } from '../../styles/colors';

const DoctorListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { doctors, isLoading, filters, pagination } = useSelector((state) => state.doctor);

  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('Ahmedabad, Gujarat');

  useEffect(() => {
    dispatch(fetchDoctors(filters));
  }, [filters]);

  const handleSearch = () => {
    dispatch(setFilters({ search: searchQuery, page: 1 }));
  };

  const renderDoctorCard = ({ item }) => (
    <TouchableOpacity
      style={styles.doctorCard}
      onPress={() => navigation.navigate('DoctorDetail', { doctorId: item._id })}>
      <Image
        source={{ uri: item.profilePhoto || 'https://via.placeholder.com/100' }}
        style={styles.doctorImage}
      />
      <View style={styles.doctorInfo}>
        <View style={styles.doctorHeader}>
          <View style={styles.doctorNameContainer}>
            <Text style={styles.doctorName}>{item.fullname}</Text>
            <Text style={styles.doctorSpecialty}>{item.specialty}</Text>
          </View>
        </View>

        <View style={styles.hospitalInfo}>
          <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.hospitalText}>{item.hospitalName}</Text>
        </View>

        <View style={styles.availabilityContainer}>
          <Text style={styles.availabilityLabel}>Availability Today:</Text>
          <Text style={styles.availabilityTime}>10:00 AM - 6:00 PM</Text>
        </View>

        <View style={styles.seeMoreContainer}>
          <TouchableOpacity
            style={styles.seeMoreButton}
            onPress={() => navigation.navigate('DoctorDetail', { doctorId: item._id })}>
            <Text style={styles.seeMoreText}>See More</Text>
          </TouchableOpacity>
        </View>
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
        <Text style={styles.headerTitle}>Find Doctors</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search doctors, specialties..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
      </View>

      {/* Location and Filter */}
      {/* <View style={styles.filterRow}>
        <View style={styles.locationContainer}>
          <Ionicons name="location" size={18} color={colors.primaryDark} />
          <Text style={styles.locationText}>{location}</Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View> */}

      {/* Doctors List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primaryDark} />
        </View>
      ) : (
        <FlatList
          data={doctors}
          renderItem={renderDoctorCard}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          onEndReached={() => {
            if (pagination && pagination.currentPage < pagination.totalPages) {
              dispatch(setFilters({ page: pagination.currentPage + 1 }));
            }
          }}
          onEndReachedThreshold={0.5}
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
    marginLeft: 8,
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: 'Poppins_400Regular',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontFamily: 'Poppins_500Medium',
    marginLeft: 4,
  },
  filterButton: {
    padding: 8,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  doctorCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  doctorImage: {
    width: 100,
    height: 'auto',
    borderRadius: 8,
    backgroundColor: '#E3F2FD',
  },
  doctorInfo: {
    flex: 1,
    marginLeft: 12,
  },
  doctorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  doctorNameContainer: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
  },
  seeMoreButton: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  seeMoreText: {
    color: colors.white,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  hospitalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  hospitalText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
    marginLeft: 4,
    flex: 1,
  },
  availabilityContainer: {
    flexDirection: '',
    alignItems: 'start',
  },

  availabilityLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
  },
  availabilityTime: {
    fontSize: 12,
    color: '#10B981',
    fontFamily: 'Poppins_500Medium',
    marginLeft: 4,
  },
  seeMoreContainer: {
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DoctorListScreen;
