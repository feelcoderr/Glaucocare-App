// FILE: src/screens/home/DashboardScreen.jsx
// Dashboard/Home Screen
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { fetchDashboard, dismissInfoCard } from '../../store/slices/dashboardSlice';
import { colors } from '../../styles/colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const DashboardScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const {
    user,
    nextMedicationReminder,
    statistics,
    recentDoctors,
    upcomingEvents,
    featuredBlogs,
    infoCard,
    isLoading,
  } = useSelector((state) => state.dashboard);
  console.log(recentDoctors);
  const [refreshing, setRefreshing] = useState(false);
  console.log('user : ', user);
  useEffect(() => {
    dispatch(fetchDashboard());
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchDashboard());
    setRefreshing(false);
  };

  const handleDismissInfoCard = () => {
    dispatch(dismissInfoCard());
  };

  const formatTime = (time) => {
    return time;
  };

  const renderQuickActions = () => (
    <View style={styles.quickActionsContainer}>
      <TouchableOpacity
        style={styles.quickActionCard}
        onPress={() => navigation.navigate('MedicationList')}>
        <LinearGradient
          colors={['#2B3C8D', '#1672BC']} // your primaryGradient colors
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }} // roughly matches a 89.65° angle (horizontal)
          style={styles.quickActionIcon}>
          <MaterialCommunityIcons name="medication" size={26} color={colors.white} />
        </LinearGradient>

        <Text style={styles.quickActionText}>Medication</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.quickActionCard}
        onPress={() => navigation.navigate('DoctorList')}>
        <LinearGradient
          colors={['#2B3C8D', '#1672BC']} // your primaryGradient colors
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }} // roughly matches a 89.65° angle (horizontal)
          style={styles.quickActionIcon}>
          <MaterialCommunityIcons name="doctor" size={26} color={colors.white} />
        </LinearGradient>
        <Text style={styles.quickActionText}>Find Doctor</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.quickActionCard}
        onPress={() => navigation.navigate('ExerciseList')}>
        <LinearGradient
          colors={['#2B3C8D', '#1672BC']} // your primaryGradient colors
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }} // roughly matches a 89.65° angle (horizontal)
          style={styles.quickActionIcon}>
          <MaterialCommunityIcons name="eye" size={26} color={colors.white} />
        </LinearGradient>
        <Text style={styles.quickActionText}>Eye Exercise</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.quickActionCard}
        onPress={() => navigation.navigate('EventList')}>
        <LinearGradient
          colors={['#2B3C8D', '#1672BC']} // your primaryGradient colors
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }} // roughly matches a 89.65° angle (horizontal)
          style={styles.quickActionIcon}>
          <MaterialCommunityIcons name="timetable" size={26} color={colors.white} />
        </LinearGradient>
        <Text style={styles.quickActionText}>Events</Text>
      </TouchableOpacity>
    </View>
  );

  const renderNextMedication = () => {
    if (!nextMedicationReminder) return null;

    return (
      <LinearGradient
        colors={[colors.primaryDark, colors.primaryLight]}
        style={styles.medicationCard}>
        <View style={styles.medicationContent}>
          <View style={styles.medicationIconContainer}>
            <Ionicons name="medical" size={24} color={colors.white} />
          </View>
          <View style={styles.medicationInfo}>
            <Text style={styles.medicationTitle}>
              {nextMedicationReminder.medication?.name || 'Eyedrops'}
            </Text>
            <Text style={styles.medicationTime}>
              {formatTime(nextMedicationReminder.nextTime || '12:30 PM')}
            </Text>
          </View>
          <View style={styles.medicationTimeIcon}>
            <Ionicons name="time-outline" size={20} color={colors.white} />
          </View>
        </View>
        <View style={styles.paginationDots}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </LinearGradient>
    );
  };

  const renderInfoCard = () => {
    if (!infoCard) return null;

    return (
      <View style={[styles.infoCard, { backgroundColor: infoCard.backgroundColor || '#E3F2FD' }]}>
        <View style={styles.infoCardContent}>
          <View style={styles.infoCardText}>
            <Text style={styles.infoCardMessage}>{infoCard.message}</Text>
          </View>
          {infoCard.illustration && (
            <Image source={{ uri: infoCard.illustration }} style={styles.infoCardIllustration} />
          )}
        </View>
        {infoCard.isCloseable && (
          <TouchableOpacity style={styles.infoCardClose} onPress={handleDismissInfoCard}>
            <Ionicons name="close" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderRecentDoctors = () => {
    if (!recentDoctors || recentDoctors.length === 0) return null;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent doctor interaction</Text>
          <TouchableOpacity onPress={() => navigation.navigate('DoctorList')}>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        {recentDoctors.map((doctor) => (
          <TouchableOpacity
            key={doctor._id}
            style={styles.doctorCard}
            onPress={() => navigation.navigate('DoctorDetail', { doctorId: doctor._id })}>
            <Image
              source={{ uri: doctor.profilePhoto || 'https://via.placeholder.com/60' }}
              style={styles.doctorImage}
            />
            <View style={styles.doctorInfo}>
              <Text style={styles.doctorName}>{doctor.fullname}</Text>
              <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderUpcomingEvent = () => {
    if (!upcomingEvents || upcomingEvents.length === 0) return null;

    const event = upcomingEvents[0];

    return (
      <TouchableOpacity
        style={styles.eventCard}
        onPress={() => navigation.navigate('EventDetail', { eventId: event._id })}>
        <View style={styles.eventContent}>
          <Image
            source={{
              uri:
                event.featuredImage ||
                'https://res.cloudinary.com/datgoelws/image/upload/v1762163345/camp_image_d8yztk.jpg',
            }}
            style={styles.eventImage}
          />
          <View style={styles.eventInfo}>
            <Text style={styles.eventTitle} numberOfLines={2}>
              {event.title}
            </Text>
            <Text style={styles.eventLocation} numberOfLines={1}>
              Location: {event.venue?.city || 'Online'}
            </Text>
            <Text style={styles.eventTime}>
              Time: {new Date(event.eventDate).toLocaleDateString()} - {event.eventTime}
            </Text>
            <View style={styles.eventContact}>
              <Ionicons name="call-outline" size={14} color={colors.textSecondary} />
              <Text style={styles.eventContactText}>+91 9821875963</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderFeaturedBlogs = () => {
    if (!featuredBlogs || featuredBlogs.length === 0) return null;

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured blog</Text>
          <TouchableOpacity onPress={() => navigation.navigate('BlogList')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.blogsScroll}>
          {featuredBlogs.map((blog) => (
            <TouchableOpacity
              key={blog._id}
              style={styles.blogCard}
              onPress={() => navigation.navigate('BlogDetail', { blogId: blog._id })}>
              <Image
                source={{ uri: blog.featuredImage || 'https://via.placeholder.com/200x120' }}
                style={styles.blogImage}
              />
              <Text style={styles.blogTitle} numberOfLines={2}>
                {blog.title}
              </Text>
              <Text style={styles.blogReadTime}>{blog.readingTime || 5} min read</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  if (isLoading && !refreshing) {
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
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Image
              source={{
                uri:
                  user?.profilePicture ||
                  'https://res.cloudinary.com/datgoelws/image/upload/v1761806946/profile-imgage_lgtgih.jpg',
              }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>Hello {user?.fullname?.split(' ')[0] || 'Luna'}</Text>
            <Text style={styles.subGreeting}>Welcome to Glaucocare</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => navigation.navigate('Notifications')}>
          <LinearGradient
            colors={['#2B3C8D', '#1672BC']} // your primaryGradient colors
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }} // roughly matches a 89.65° angle (horizontal)
            style={styles.notificationButton}>
            <Ionicons name="notifications" size={24} color={colors.white} />
          </LinearGradient>
          {statistics.unreadNotifications > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>
                {statistics.unreadNotifications > 9 ? '9+' : statistics.unreadNotifications}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {/* Quick Actions */}
        {renderQuickActions()}

        {/* Search Bar */}
        <TouchableOpacity style={styles.searchBar} onPress={() => navigation.navigate('Search')}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <Text style={styles.searchPlaceholder}>Search</Text>
        </TouchableOpacity>

        {/* Next Medication Reminder */}
        {renderNextMedication()}

        {/* Info Card */}
        {renderInfoCard()}

        {/* Recent Doctors */}
        {renderRecentDoctors()}

        {/* Upcoming Event */}
        {renderUpcomingEvent()}

        {/* Featured Blogs */}
        {renderFeaturedBlogs()}

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E3F2FD',
  },
  headerText: {
    marginLeft: 12,
  },
  greeting: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
  },
  subGreeting: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Poppins_700Bold',
  },
  scrollView: {
    flex: 1,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  quickActionCard: {
    alignItems: 'center',
    width: '23%',
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 11,
    color: colors.textPrimary,
    fontFamily: 'Poppins_500Medium',
    textAlign: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  searchPlaceholder: {
    marginLeft: 12,
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
  },
  medicationCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  medicationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medicationIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  medicationInfo: {
    flex: 1,
    marginLeft: 16,
  },
  medicationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 4,
  },
  medicationTime: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
    fontFamily: 'Poppins_700Bold',
  },
  medicationTimeIcon: {
    marginLeft: 8,
  },
  paginationDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dotActive: {
    backgroundColor: colors.white,
    width: 24,
  },
  infoCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    position: 'relative',
  },
  infoCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoCardText: {
    flex: 1,
    paddingRight: 8,
  },
  infoCardMessage: {
    fontSize: 13,
    color: colors.textPrimary,
    fontFamily: 'Poppins_400Regular',
    lineHeight: 20,
  },
  infoCardIllustration: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  infoCardClose: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primaryDark,
    fontFamily: 'Poppins_500Medium',
  },
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  doctorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E3F2FD',
  },
  doctorInfo: {
    flex: 1,
    marginLeft: 12,
  },
  doctorName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 2,
  },
  doctorSpecialty: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
  },
  eventCard: {
    backgroundColor: colors.primaryDark,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  eventContent: {
    flexDirection: 'row',
    padding: 16,
  },
  eventImage: {
    width: 100,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#E3F2FD',
  },
  eventInfo: {
    flex: 1,
    marginLeft: 16,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
    fontFamily: 'Poppins_700Bold',
    marginBottom: 6,
  },
  eventLocation: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Poppins_400Regular',
    marginBottom: 4,
  },
  eventTime: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Poppins_400Regular',
    marginBottom: 8,
  },
  eventContact: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventContactText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: 'Poppins_400Regular',
    marginLeft: 4,
  },
  blogsScroll: {
    paddingLeft: 16,
  },
  blogCard: {
    width: 180,
    marginRight: 12,
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
  },
  blogImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#E3F2FD',
  },
  blogTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
    padding: 12,
    paddingBottom: 4,
    lineHeight: 18,
  },
  blogReadTime: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
});

export default DashboardScreen;

// FILE: src/screens/home/HomeScreen.jsx
// Home/Dashboard Screen
// ============================================================================

// import React, { useEffect } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Image,
//   RefreshControl,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useDispatch, useSelector } from 'react-redux';
// import { Ionicons } from '@expo/vector-icons';
// import { LinearGradient } from 'expo-linear-gradient';
// import { fetchDashboardData } from '../../store/slices/dashboardSlice';
// import { colors } from '../../styles/colors';
// import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
// const HomeScreen = ({ navigation }) => {
//   const dispatch = useDispatch();
//   const {
//     user,
//     nextMedication,
//     statistics,
//     recentDoctors,
//     upcomingEvents,
//     featuredBlogs,
//     infoCard,
//     isLoading,
//   } = useSelector((state) => state.dashboard);
//   const { isAuthenticated } = useSelector((state) => state.auth);

//   useEffect(() => {
//     if (isAuthenticated) {
//       dispatch(fetchDashboardData());
//     }
//   }, [isAuthenticated]);

//   const onRefresh = () => {
//     if (isAuthenticated) {
//       dispatch(fetchDashboardData());
//     }
//   };

//   const quickActions = [
//     {
//       icon: 'medication',
//       label: 'Medication',
//       onPress: () => navigation.navigate('MedicationList'),
//     },
//     {
//       icon: 'doctor',
//       label: 'Find Doctor',
//       onPress: () => navigation.navigate('DoctorList'),
//     },
//     {
//       icon: 'eye',
//       label: 'Eye Exercise',
//       onPress: () => navigation.navigate('ExercisesList'),
//     },
//     {
//       icon: 'timetable',
//       label: 'Events',
//       onPress: () => navigation.navigate('EventList'),
//     },
//   ];

//   return (
//     <SafeAreaView style={styles.container} edges={['top']}>
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}>
//         {/* Header */}
//         <View style={styles.header}>
//           <View style={styles.userInfo}>
//             <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
//               <Image
//                 source={{ uri: user?.profilePicture || 'https://via.placeholder.com/50' }}
//                 style={styles.avatar}
//               />
//             </TouchableOpacity>
//             <View style={styles.greeting}>
//               <Text style={styles.greetingText}>
//                 Hello {user?.fullname?.split(' ')[0] || 'Guest'}
//               </Text>
//               <Text style={styles.welcomeText}>Welcome to Glaucocare</Text>
//             </View>
//           </View>
//           <TouchableOpacity
//             style={styles.notificationButton}
//             onPress={() => navigation.navigate('Notifications')}>
//             <Ionicons name="notifications" size={24} color={colors.white} />
//             {statistics.unreadNotifications > 0 && (
//               <View style={styles.badge}>
//                 <Text style={styles.badgeText}>{statistics.unreadNotifications}</Text>
//               </View>
//             )}
//           </TouchableOpacity>
//         </View>

//         {/* Quick Actions */}
//         <View style={styles.quickActions}>
//           {quickActions.map((action, index) => (
//             <TouchableOpacity key={index} style={styles.actionButton} onPress={action.onPress}>
//               <View style={styles.actionIcon}>
//                 <Text style={styles.iconText}>
//                   <MaterialCommunityIcons name={action.icon} size={28} color={colors.white} />
//                 </Text>
//               </View>
//               <Text style={styles.actionLabel}>{action.label}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Search Bar */}
//         <TouchableOpacity style={styles.searchBar} onPress={() => navigation.navigate('Search')}>
//           <Ionicons name="search" size={20} color={colors.textSecondary} />
//           <Text style={styles.searchPlaceholder}>Search</Text>
//         </TouchableOpacity>

//         {/* Next Medication Card */}
//         {nextMedication && (
//           <LinearGradient
//             colors={[colors.primaryDark, colors.primaryLight]}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 1 }}
//             style={styles.medicationCard}>
//             <View style={styles.medicationHeader}>
//               <Text style={styles.medicationTitle}>Next Medication</Text>
//               <Ionicons name="time-outline" size={20} color={colors.white} />
//             </View>
//             <View style={styles.medicationContent}>
//               <View style={styles.medicationIcon}>
//                 <Ionicons name="medical" size={24} color={colors.primaryDark} />
//               </View>
//               <View style={styles.medicationInfo}>
//                 <Text style={styles.medicationName}>{nextMedication.medication?.name}</Text>
//                 <Text style={styles.medicationTime}>{nextMedication.nextTime}</Text>
//               </View>
//             </View>
//           </LinearGradient>
//         )}

//         {/* Info Card */}
//         {infoCard && (
//           <View
//             style={[styles.infoCard, { backgroundColor: infoCard.backgroundColor || '#E3F2FD' }]}>
//             <View style={styles.infoContent}>
//               <Text style={styles.infoText}>{infoCard.message}</Text>
//             </View>
//             <View style={styles.infoIllustration}>
//               <Text style={styles.illustrationPlaceholder}>🏥</Text>
//             </View>
//           </View>
//         )}

//         {/* Recent Doctor Interaction */}
//         {recentDoctors.length > 0 && (
//           <View style={styles.section}>
//             <View style={styles.sectionHeader}>
//               <Text style={styles.sectionTitle}>Recent doctor interaction</Text>
//               <TouchableOpacity onPress={() => navigation.navigate('DoctorList')}>
//                 <Text style={styles.seeAll}>See all</Text>
//               </TouchableOpacity>
//             </View>
//             {recentDoctors.map((doctor, index) => (
//               <TouchableOpacity
//                 key={index}
//                 style={styles.doctorCard}
//                 onPress={() => navigation.navigate('DoctorDetail', { doctorId: doctor._id })}>
//                 <Image
//                   source={{ uri: doctor.profilePhoto || 'https://via.placeholder.com/50' }}
//                   style={styles.doctorAvatar}
//                 />
//                 <View style={styles.doctorInfo}>
//                   <Text style={styles.doctorName}>{doctor.fullname}</Text>
//                   <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
//                 </View>
//                 <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
//               </TouchableOpacity>
//             ))}
//           </View>
//         )}

//         {/* Upcoming Events */}
//         {upcomingEvents.length > 0 && upcomingEvents[0] && (
//           <View style={styles.section}>
//             <LinearGradient
//               colors={[colors.primaryDark, colors.primaryLight]}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 1 }}
//               style={styles.eventCard}>
//               <View style={styles.eventIllustration}>
//                 <Text style={styles.eventIcon}>👨‍⚕️</Text>
//               </View>
//               <View style={styles.eventContent}>
//                 <Text style={styles.eventTitle}>{upcomingEvents[0].title}</Text>
//                 <View style={styles.eventDetail}>
//                   <Ionicons name="location-outline" size={14} color={colors.white} />
//                   <Text style={styles.eventLocation}>{upcomingEvents[0].venue?.city}</Text>
//                 </View>
//                 <View style={styles.eventDetail}>
//                   <Ionicons name="calendar-outline" size={14} color={colors.white} />
//                   <Text style={styles.eventLocation}>
//                     Time: {new Date(upcomingEvents[0].eventDate).toLocaleDateString()} -{' '}
//                     {upcomingEvents[0].eventTime}
//                   </Text>
//                 </View>
//                 <TouchableOpacity style={styles.eventButton}>
//                   <Ionicons name="call-outline" size={16} color={colors.white} />
//                   <Text style={styles.eventButtonText}>+91 4521875963</Text>
//                 </TouchableOpacity>
//               </View>
//             </LinearGradient>
//           </View>
//         )}

//         {/* Featured Blog */}
//         {featuredBlogs.length > 0 && (
//           <View style={styles.section}>
//             <View style={styles.sectionHeader}>
//               <Text style={styles.sectionTitle}>Featured blog</Text>
//               <TouchableOpacity>
//                 <Text style={styles.seeAll}>See All</Text>
//               </TouchableOpacity>
//             </View>
//             <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//               {featuredBlogs.map((blog, index) => (
//                 <TouchableOpacity key={index} style={styles.blogCard}>
//                   <Image
//                     source={{ uri: blog.featuredImage || 'https://via.placeholder.com/200x120' }}
//                     style={styles.blogImage}
//                   />
//                   <View style={styles.blogContent}>
//                     <Text style={styles.blogTitle} numberOfLines={2}>
//                       {blog.title}
//                     </Text>
//                     <Text style={styles.blogTime}>{blog.readingTime} min read</Text>
//                   </View>
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
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
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 16,
//   },
//   userInfo: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   avatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 12,
//   },
//   greeting: {
//     justifyContent: 'center',
//   },
//   greetingText: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: colors.textPrimary,
//     fontFamily: 'Poppins_700Bold',
//   },
//   welcomeText: {
//     fontSize: 13,
//     color: colors.textSecondary,
//     fontFamily: 'Poppins_400Regular',
//   },
//   notificationButton: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: colors.primaryDark,
//     justifyContent: 'center',
//     alignItems: 'center',
//     position: 'relative',
//   },
//   badge: {
//     position: 'absolute',
//     top: 0,
//     right: 0,
//     backgroundColor: '#EF4444',
//     width: 18,
//     height: 18,
//     borderRadius: 9,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   badgeText: {
//     color: colors.white,
//     fontSize: 10,
//     fontWeight: '700',
//     fontFamily: 'Poppins_700Bold',
//   },
//   quickActions: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingHorizontal: 16,
//     marginBottom: 20,
//   },
//   actionButton: {
//     alignItems: 'center',
//   },
//   actionIcon: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: colors.primaryDark,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   iconText: {
//     fontSize: 28,
//   },
//   actionLabel: {
//     fontSize: 12,
//     color: colors.textPrimary,
//     fontFamily: 'Poppins_500Medium',
//   },
//   searchBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: colors.white,
//     marginHorizontal: 16,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderRadius: 12,
//     marginBottom: 20,
//   },
//   searchPlaceholder: {
//     flex: 1,
//     marginLeft: 12,
//     fontSize: 14,
//     color: colors.textSecondary,
//     fontFamily: 'Poppins_400Regular',
//   },
//   medicationCard: {
//     marginHorizontal: 16,
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 20,
//   },
//   medicationHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   medicationTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: colors.white,
//     fontFamily: 'Poppins_600SemiBold',
//   },
//   medicationContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   medicationIcon: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: colors.white,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   medicationInfo: {
//     flex: 1,
//   },
//   medicationName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: colors.white,
//     fontFamily: 'Poppins_600SemiBold',
//     marginBottom: 4,
//   },
//   medicationTime: {
//     fontSize: 14,
//     color: colors.white,
//     fontFamily: 'Poppins_400Regular',
//   },
//   infoCard: {
//     marginHorizontal: 16,
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   infoContent: {
//     flex: 1,
//   },
//   infoText: {
//     fontSize: 13,
//     color: colors.textPrimary,
//     fontFamily: 'Poppins_400Regular',
//     lineHeight: 20,
//   },
//   infoIllustration: {
//     marginLeft: 12,
//   },
//   illustrationPlaceholder: {
//     fontSize: 64,
//   },
//   section: {
//     marginBottom: 24,
//   },
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     marginBottom: 12,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: colors.textPrimary,
//     fontFamily: 'Poppins_600SemiBold',
//   },
//   seeAll: {
//     fontSize: 13,
//     color: colors.primaryDark,
//     fontFamily: 'Poppins_500Medium',
//   },
//   doctorCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: colors.white,
//     marginHorizontal: 16,
//     padding: 12,
//     borderRadius: 12,
//     marginBottom: 8,
//   },
//   doctorAvatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 12,
//   },
//   doctorInfo: {
//     flex: 1,
//   },
//   doctorName: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: colors.textPrimary,
//     fontFamily: 'Poppins_600SemiBold',
//   },
//   doctorSpecialty: {
//     fontSize: 13,
//     color: colors.textSecondary,
//     fontFamily: 'Poppins_400Regular',
//   },
//   eventCard: {
//     marginHorizontal: 16,
//     borderRadius: 16,
//     padding: 16,
//     flexDirection: 'row',
//   },
//   eventIllustration: {
//     marginRight: 16,
//   },
//   eventIcon: {
//     fontSize: 64,
//   },
//   eventContent: {
//     flex: 1,
//   },
//   eventTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: colors.white,
//     fontFamily: 'Poppins_600SemiBold',
//     marginBottom: 8,
//   },
//   eventDetail: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 4,
//   },
//   eventLocation: {
//     fontSize: 12,
//     color: colors.white,
//     fontFamily: 'Poppins_400Regular',
//     marginLeft: 6,
//   },
//   eventButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 8,
//     alignSelf: 'flex-start',
//     marginTop: 8,
//   },
//   eventButtonText: {
//     fontSize: 12,
//     color: colors.white,
//     fontFamily: 'Poppins_500Medium',
//     marginLeft: 6,
//   },
//   blogCard: {
//     width: 200,
//     marginLeft: 16,
//     backgroundColor: colors.white,
//     borderRadius: 12,
//     overflow: 'hidden',
//   },
//   blogImage: {
//     width: 200,
//     height: 120,
//     backgroundColor: '#E3F2FD',
//   },
//   blogContent: {
//     padding: 12,
//   },
//   blogTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: colors.textPrimary,
//     fontFamily: 'Poppins_600SemiBold',
//     marginBottom: 4,
//   },
//   blogTime: {
//     fontSize: 12,
//     color: colors.textSecondary,
//     fontFamily: 'Poppins_400Regular',
//   },
// });

// export default HomeScreen;
