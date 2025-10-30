// FILE: src/screens/exercise/ExerciseListScreen.jsx
// Exercises & Games Screen (Static Data)
// ============================================================================

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';

// Static Data
const EXERCISES_AND_GAMES = [
  {
    id: '1',
    title: 'Blink Training',
    type: 'Exercise',
    level: 'Beginner',
    icon: 'https://via.placeholder.com/60',
  },
  {
    id: '2',
    title: 'Focus Tracker',
    type: 'Game',
    level: 'Intermediate',
    icon: 'https://via.placeholder.com/60',
  },
  {
    id: '3',
    title: 'Eye Movement Guide',
    type: 'Exercise',
    level: 'Beginner',
    icon: 'https://via.placeholder.com/60',
  },
  {
    id: '4',
    title: 'Color Spot Challenge',
    type: 'Exercise',
    level: 'Beginner',
    icon: 'https://via.placeholder.com/60',
  },
  {
    id: '5',
    title: 'Visual Memory Grid',
    type: 'Game',
    level: 'Advanced',
    icon: 'https://via.placeholder.com/60',
  },
  {
    id: '6',
    title: 'Pattern Recognition',
    type: 'Game',
    level: 'Intermediate',
    icon: 'https://via.placeholder.com/60',
  },
  {
    id: '7',
    title: 'Near-Far Focus',
    type: 'Exercise',
    level: 'Beginner',
    icon: 'https://via.placeholder.com/60',
  },
  {
    id: '8',
    title: 'Eye Relaxation',
    type: 'Exercise',
    level: 'Beginner',
    icon: 'https://via.placeholder.com/60',
  },
];

const ExerciseListScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Games', 'Exercises'];

  const getFilteredData = () => {
    let filtered = EXERCISES_AND_GAMES;

    // Filter by type
    if (activeFilter === 'Games') {
      filtered = filtered.filter((item) => item.type === 'Game');
    } else if (activeFilter === 'Exercises') {
      filtered = filtered.filter((item) => item.type === 'Exercise');
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner':
        return '#10B981';
      case 'Intermediate':
        return '#F59E0B';
      case 'Advanced':
        return '#EF4444';
      default:
        return colors.textSecondary;
    }
  };

  const renderExerciseCard = ({ item }) => (
    <TouchableOpacity
      style={styles.exerciseCard}
      onPress={() => {
        // Just show alert for static page
        alert(`${item.title} - Coming Soon!`);
      }}
      activeOpacity={0.7}>
      {/* Icon/Image */}
      <View style={styles.iconContainer}>
        <Image source={{ uri: item.icon }} style={styles.exerciseIcon} />
      </View>

      {/* Content */}
      <View style={styles.exerciseContent}>
        <Text style={styles.exerciseTitle}>{item.title}</Text>
        <View style={styles.exerciseMeta}>
          <Text style={styles.exerciseType}>{item.type}</Text>
          <View style={styles.levelDot} />
          <Text style={[styles.exerciseLevel, { color: getLevelColor(item.level) }]}>
            {item.level}
          </Text>
        </View>
      </View>

      {/* Play Button */}
      <TouchableOpacity
        style={styles.playButton}
        onPress={() => {
          alert(`${item.title} - Coming Soon!`);
        }}>
        <Text style={styles.playButtonText}>Play</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Exercises & Games</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Subtitle */}
      <Text style={styles.subtitle}>Strengthen your vision with daily training</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search exercises and games"
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterChip, activeFilter === filter && styles.filterChipActive]}
            onPress={() => setActiveFilter(filter)}>
            <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Exercise List */}
      <FlatList
        data={getFilteredData()}
        renderItem={renderExerciseCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="eye-off-outline" size={80} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No exercises found</Text>
          </View>
        }
      />
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
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
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
    marginBottom: 20,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: colors.primaryDark,
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
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  iconContainer: {
    marginRight: 16,
  },
  exerciseIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E3F2FD',
  },
  exerciseContent: {
    flex: 1,
  },
  exerciseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 6,
  },
  exerciseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseType: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
  },
  levelDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.textSecondary,
    marginHorizontal: 8,
  },
  exerciseLevel: {
    fontSize: 13,
    fontFamily: 'Poppins_500Medium',
  },
  playButton: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 8,
  },
  playButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
    fontFamily: 'Poppins_600SemiBold',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontFamily: 'Poppins_500Medium',
    marginTop: 16,
  },
});

export default ExerciseListScreen;
