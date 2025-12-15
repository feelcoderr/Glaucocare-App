// // FILE: src/screens/doctor/DoctorDetailScreen.jsx
// // Doctor Detail Screen
// // ============================================================================

// import React, { useEffect } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   Image,
//   Linking,
//   ActivityIndicator,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useDispatch, useSelector } from 'react-redux';
// import { Ionicons } from '@expo/vector-icons';
// import { fetchDoctorById } from '../../store/slices/doctorSlice';
// import { colors } from '../../styles/colors';
// import MapView, { Marker } from 'react-native-maps';
// const DoctorDetailScreen = ({ route, navigation }) => {
//   const { doctorId } = route.params;
//   const dispatch = useDispatch();
//   const { selectedDoctor: doctor, isLoading } = useSelector((state) => state.doctor);

//   useEffect(() => {
//     dispatch(fetchDoctorById(doctorId));
//   }, [doctorId]);

//   const handleCall = () => {
//     if (doctor?.mobile) {
//       Linking.openURL(`tel:${doctor.mobile}`);
//     }
//   };

//   const handleEmail = () => {
//     if (doctor?.email) {
//       Linking.openURL(`mailto:${doctor.email}`);
//     }
//   };

//   const handleGetDirections = () => {
//     if (doctor?.location) {
//       const [lng, lat] = doctor.location.coordinates;
//       Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`);
//     }
//   };

//   if (isLoading || !doctor) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={colors.primaryDark} />
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container} edges={['top']}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Doctor Profile</Text>
//       </View>

//       <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
//         {/* Doctor Profile Card */}
//         <View style={styles.profileCard}>
//           <Image
//             source={{ uri: doctor.profilePhoto || 'https://via.placeholder.com/120' }}
//             style={styles.profileImage}
//           />
//           <View style={styles.profileInfo}>
//             <Text style={styles.doctorName}>{doctor.fullname}</Text>
//             <Text style={styles.qualification}>{doctor.qualification}</Text>
//             <TouchableOpacity style={styles.specialtyBadge}>
//               <Text style={styles.specialtyText}>{doctor.specialty}</Text>
//             </TouchableOpacity>

//             {/* Rating */}
//             <View style={styles.ratingContainer}>
//               <View style={styles.stars}>
//                 {[1, 2, 3, 4, 5].map((star) => (
//                   <Ionicons key={star} name="star" size={16} color="#FFA500" />
//                 ))}
//               </View>
//               <Text style={styles.ratingText}>4.8 (234 reviews)</Text>
//             </View>

//             <Text style={styles.experienceText}>{doctor.experience}+ years experience</Text>
//           </View>
//         </View>

//         {/* About Section */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>About</Text>
//           <Text style={styles.aboutText}>{doctor.about || 'No description available'}</Text>
//         </View>

//         {/* Education Section */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Education</Text>
//           <View style={styles.listItem}>
//             <Text style={styles.bulletPoint}>•</Text>
//             <Text style={styles.listText}>Treated 5,000+ glaucoma patients</Text>
//           </View>
//           <View style={styles.listItem}>
//             <Text style={styles.bulletPoint}>•</Text>
//             <Text style={styles.listText}>
//               Published researcher in the Indian Journal of Ophthalmology
//             </Text>
//           </View>
//         </View>

//         {/* Availability Section */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Availability</Text>
//           <View style={styles.availabilityRow}>
//             <Text style={styles.dayText}>Mon:</Text>
//             <Text style={styles.timeText}>10:00 AM - 1:00 PM</Text>
//           </View>
//           <View style={styles.availabilityRow}>
//             <Text style={styles.dayText}>Wed:</Text>
//             <Text style={styles.timeText}>5:00 PM - 7:00 PM</Text>
//           </View>
//           <View style={styles.availabilityRow}>
//             <Text style={styles.dayText}>Fri:</Text>
//             <Text style={styles.timeText}>10:00 AM - 1:00 PM</Text>
//           </View>
//           <View style={styles.availabilityRow}>
//             <Text style={styles.dayText}>Sat:</Text>
//             <Text style={styles.timeText}>4:00 PM - 6:00 PM</Text>
//           </View>
//         </View>

//         {/* Contact Info Section */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Contact Info</Text>
//           <View style={styles.contactCard}>
//             <TouchableOpacity style={styles.contactItem} onPress={handleEmail}>
//               <Ionicons name="mail-outline" size={20} color={colors.primaryDark} />
//               <Text style={styles.contactText}>{doctor.email}</Text>
//             </TouchableOpacity>

//             <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
//               <Ionicons name="call-outline" size={20} color={colors.primaryDark} />
//               <Text style={styles.contactText}>{doctor.mobile}</Text>
//             </TouchableOpacity>

//             <View style={styles.contactItem}>
//               <Ionicons name="location-outline" size={20} color={colors.primaryDark} />
//               <Text style={styles.contactText}>
//                 {doctor.hospitalAddress?.street}, {doctor.hospitalAddress?.city}
//               </Text>
//             </View>
//           </View>
//         </View>

//         {/* Location Map */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Location</Text>
//           <View style={styles.mapPlaceholder}>
//             <MapView
//               style={styles.map}
//               initialRegion={{
//                 latitude: doctor?.location?.coordinates[1] || 22.792061427772357, // lat
//                 longitude: doctor?.location?.coordinates[0] || 79.26072314885853, // lng
//                 latitudeDelta: 0.01,
//                 longitudeDelta: 0.01,
//               }}>
//               <Marker
//                 coordinate={{
//                   latitude: doctor?.location?.coordinates[1] || 22.792061427772357,
//                   longitude: doctor?.location?.coordinates[0] || 79.70017629039144,
//                 }}
//                 title="Doctor Location"
//               />
//             </MapView>
//           </View>
//         </View>

//         {/* Get Directions Button */}
//         <TouchableOpacity style={styles.directionsButton} onPress={handleGetDirections}>
//           <Text style={styles.directionsButtonText}>Get Directions</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { fetchDoctorById } from '../../store/slices/doctorSlice';
import { colors } from '../../styles/colors';

const DEFAULT_LAT = 22.792061427772357;
const DEFAULT_LNG = 79.26072314885853;

const DoctorDetailScreen = ({ route, navigation }) => {
  const { doctorId } = route.params;
  const dispatch = useDispatch();
  const { selectedDoctor: doctor, isLoading } = useSelector((state) => state.doctor);

  useEffect(() => {
    if (doctorId) dispatch(fetchDoctorById(doctorId));
  }, [doctorId, dispatch]);

  const handleCall = () => {
    const phone = doctor?.mobile;
    if (phone) {
      Linking.openURL(`tel:${phone}`).catch((err) => {
        console.warn('Failed to open dialer', err);
      });
    }
  };

  const handleEmail = () => {
    const email = doctor?.email;
    if (email) {
      Linking.openURL(`mailto:${email}`).catch((err) => {
        console.warn('Failed to open email client', err);
      });
    }
  };

  const handleGetDirections = () => {
    const coords = doctor?.location?.coordinates;
    // expecting [lng, lat]
    if (Array.isArray(coords) && coords.length >= 2) {
      const [lng, lat] = coords;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      Linking.openURL(url).catch((err) => {
        console.warn('Failed to open maps', err);
      });
    } else {
      // fallback: open maps to default location or to hospital address if available
      const address = doctor?.hospitalAddress
        ? encodeURIComponent(
            `${doctor.hospitalAddress.street || ''} ${doctor.hospitalAddress.city || ''}`
          )
        : '';
      const url = address
        ? `https://www.google.com/maps/search/?api=1&query=${address}`
        : `https://www.google.com/maps/@${DEFAULT_LAT},${DEFAULT_LNG},15z`;
      Linking.openURL(url).catch((err) => console.warn('Failed to open maps', err));
    }
  };

  if (isLoading || !doctor) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primaryDark} />
      </View>
    );
  }

  // Safe coordinate extraction with fallback
  const coords = Array.isArray(doctor?.location?.coordinates) ? doctor.location.coordinates : null;
  const lat = coords && coords.length >= 2 ? coords[1] : DEFAULT_LAT;
  const lng = coords && coords.length >= 2 ? coords[0] : DEFAULT_LNG;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Doctor Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Doctor Profile Card */}
        <View style={styles.profileCard}>
          <Image
            source={{ uri: doctor.profilePhoto || 'https://via.placeholder.com/120' }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.doctorName}>{doctor.fullname || 'Unknown Doctor'}</Text>
            <Text style={styles.qualification}>{doctor.qualification || ''}</Text>
            {doctor.specialty ? (
              <TouchableOpacity style={styles.specialtyBadge}>
                <Text style={styles.specialtyText}>{doctor.specialty}</Text>
              </TouchableOpacity>
            ) : null}

            {/* Rating */}
            <View style={styles.ratingContainer}>
              <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons key={star} name="star" size={16} color="#FFA500" />
                ))}
              </View>
              <Text style={styles.ratingText}>4.8 (234 reviews)</Text>
            </View>

            <Text style={styles.experienceText}>
              {doctor.experience
                ? `${doctor.experience}+ years experience`
                : 'Experience info not available'}
            </Text>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>{doctor.about || 'No description available'}</Text>
        </View>

        {/* Education Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          <View style={styles.listItem}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.listText}>Treated 5,000+ glaucoma patients</Text>
          </View>
          <View style={styles.listItem}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.listText}>
              Published researcher in the Indian Journal of Ophthalmology
            </Text>
          </View>
        </View>

        {/* Availability Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Availability</Text>
          <View style={styles.availabilityRow}>
            <Text style={styles.dayText}>Mon:</Text>
            <Text style={styles.timeText}>10:00 AM - 1:00 PM</Text>
          </View>
          <View style={styles.availabilityRow}>
            <Text style={styles.dayText}>Wed:</Text>
            <Text style={styles.timeText}>5:00 PM - 7:00 PM</Text>
          </View>
          <View style={styles.availabilityRow}>
            <Text style={styles.dayText}>Fri:</Text>
            <Text style={styles.timeText}>10:00 AM - 1:00 PM</Text>
          </View>
          <View style={styles.availabilityRow}>
            <Text style={styles.dayText}>Sat:</Text>
            <Text style={styles.timeText}>4:00 PM - 6:00 PM</Text>
          </View>
        </View>

        {/* Contact Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Info</Text>
          <View style={styles.contactCard}>
            <TouchableOpacity style={styles.contactItem} onPress={handleEmail}>
              <Ionicons name="mail-outline" size={20} color={colors.primaryDark} />
              <Text style={styles.contactText}>{doctor.email || 'Not available'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
              <Ionicons name="call-outline" size={20} color={colors.primaryDark} />
              <Text style={styles.contactText}>{doctor.mobile || 'Not available'}</Text>
            </TouchableOpacity>

            <View style={styles.contactItem}>
              <Ionicons name="location-outline" size={20} color={colors.primaryDark} />
              <Text style={styles.contactText}>
                {doctor.hospitalAddress?.street || ''}
                {doctor.hospitalAddress?.city ? `, ${doctor.hospitalAddress.city}` : ''}
              </Text>
            </View>
          </View>
        </View>

        {/* Get Directions Button */}
        <TouchableOpacity style={styles.directionsButton} onPress={handleGetDirections}>
          <Text style={styles.directionsButtonText}>Get Directions</Text>
        </TouchableOpacity>
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
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
  },
  addButton: {
    backgroundColor: colors.primaryDark,
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  profileCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 140,
    borderRadius: 12,
    backgroundColor: '#E3F2FD',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    fontFamily: 'Poppins_700Bold',
    marginBottom: 4,
  },
  qualification: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
    marginBottom: 8,
  },
  specialtyBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  specialtyText: {
    fontSize: 12,
    color: colors.primaryDark,
    fontFamily: 'Poppins_500Medium',
  },
  ratingContainer: {
    alignItems: 'center',
    marginBottom: 4,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 13,
    color: colors.textPrimary,
    fontFamily: 'Poppins_500Medium',
  },
  experienceText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
    lineHeight: 22,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 14,
    color: colors.textPrimary,
    marginRight: 8,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
    lineHeight: 20,
  },
  availabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    fontFamily: 'Poppins_500Medium',
  },
  timeText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
  },
  contactCard: {
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  contactText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
    marginLeft: 12,
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
  },
  map: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  directionsButton: {
    backgroundColor: colors.primaryDark,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  directionsButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
});

export default DoctorDetailScreen;
