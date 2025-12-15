// FILE: src/screens/educational/GlaucomaGuideScreen.jsx
// Glaucoma Guide Detail Screen - FIXED VERSION
// ============================================================================

import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import YoutubePlayer from 'react-native-youtube-iframe';
import {
  fetchEducationalContentBySlug, // ✅ FIXED: Use the correct thunk
  clearCurrentContent,
} from '../../store/slices/educationalContentSlice';
import { colors } from '../../styles/colors';

const { width } = Dimensions.get('window');

const GlaucomaGuideScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  // const { slug } = route.params; // Get slug from route params
  const slug = 'understand-glaucoma';
  const { currentContent, isDetailLoading, detailError } = useSelector(
    (state) => state.educationalContent
  );
  console.log(currentContent, 'current content');
  const [activeTab, setActiveTab] = useState(null);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    // ✅ FIXED: Fetch content by slug using the correct thunk
    if (slug) {
      console.log('Fetching content for slug:', slug);
      dispatch(fetchEducationalContentBySlug(slug));
    }

    return () => {
      dispatch(clearCurrentContent());
    };
  }, [slug, dispatch]);

  useEffect(() => {
    // Set first tab as active when content loads
    if (currentContent && currentContent.tabs && currentContent.tabs.length > 0) {
      setActiveTab(currentContent.tabs[0].key);
      console.log('Content loaded:', currentContent.title);
    }
  }, [currentContent]);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    // Scroll to top when tab changes
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const renderSection = (section) => {
    switch (section.type) {
      case 'text':
        return <TextSection key={section._id || section.key} section={section} />;
      case 'video':
        return <VideoSection key={section._id || section.key} section={section} />;
      case 'list':
        return <ListSection key={section._id || section.key} section={section} />;
      case 'cards':
        return <CardsSection key={section._id || section.key} section={section} />;
      case 'faq':
        return <FAQSection key={section._id || section.key} section={section} />;
      case 'infobox':
        return <InfoBoxSection key={section._id || section.key} section={section} />;
      case 'image':
        return <ImageSection key={section._id || section.key} section={section} />;
      case 'carousel':
        return <CarouselSection key={section._id || section.key} section={section} />;
      default:
        console.warn('Unknown section type:', section.type);
        return null;
    }
  };

  if (isDetailLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primaryDark} />
        <Text style={styles.loadingText}>Loading content...</Text>
      </View>
    );
  }

  if (detailError) {
    return (
      <SafeAreaView style={styles.errorContainer} edges={['top']}>
        <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
        <Text style={styles.errorText}>{detailError}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => dispatch(fetchEducationalContentBySlug(slug))}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (!currentContent) {
    return (
      <SafeAreaView style={styles.errorContainer} edges={['top']}>
        <Ionicons name="document-text-outline" size={48} color={colors.textSecondary} />
        <Text style={styles.errorText}>No content available</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Filter sections for active tab
  const activeSections = currentContent.sections
    ? [...currentContent.sections]
        .filter((section) => section.tabKey === activeTab)
        .sort((a, b) => a.order - b.order)
    : [];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{currentContent.title}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Hero Section */}
      {currentContent.heroImage && (
        <View style={styles.heroSection}>
          <Image
            source={{
              uri:
                currentContent.heroImage ||
                'https://res.cloudinary.com/datgoelws/image/upload/v1762597109/Frame_2147223667_bwqwf6.png',
            }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          {/* <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>{currentContent.title}</Text>
            {currentContent.shortDescription && (
              <Text style={styles.heroSubtitle}>{currentContent.shortDescription}</Text>
            )}
          </View> */}
        </View>
      )}

      {/* Tabs */}
      {currentContent.tabs && currentContent.tabs.length > 0 && (
        <View style={styles.tabsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContent}>
            {[...currentContent.tabs]
              .sort((a, b) => a.order - b.order)
              .map((tab) => (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.tab, activeTab === tab.key && styles.activeTab]}
                  onPress={() => handleTabChange(tab.key)}>
                  <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
      )}

      {/* Content */}
      <ScrollView ref={scrollViewRef} style={styles.content} showsVerticalScrollIndicator={false}>
        {activeSections.length > 0 ? (
          activeSections.map((section) => renderSection(section))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No content available for this tab</Text>
          </View>
        )}

        {/* Bottom Spacing */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

// ============================================================================
// Section Components
// ============================================================================

// Text Section
const TextSection = ({ section }) => (
  <View style={styles.section}>
    {section.title && <Text style={styles.sectionTitle}>{section.title}</Text>}
    {section.subtitle && <Text style={styles.sectionSubtitle}>{section.subtitle}</Text>}

    {/* Parse HTML content */}
    {section.content && (
      <View style={styles.textContent}>
        <Text style={styles.textContentText}>
          {section.content.replace(/<[^>]*>/g, '')}
          {/* Simple HTML strip - use react-native-render-html for proper HTML rendering */}
        </Text>
      </View>
    )}

    {/* List items if present */}
    {section.items && section.items.length > 0 && (
      <View style={styles.listItems}>
        {section.items.map((item, index) => (
          <View key={index} style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.listItemText}>{typeof item === 'string' ? item : item.text}</Text>
          </View>
        ))}
      </View>
    )}
  </View>
);

// Video Section
const VideoSection = ({ section }) => {
  const [showPlayer, setShowPlayer] = useState(false);

  // Extract YouTube video ID from any YouTube URL
  const getYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:v=|\.be\/|embed\/)([^&?]+)/);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeId(section.media?.videoUrl);

  return (
    <View style={styles.section}>
      {section.title && <Text style={styles.sectionTitle}>{section.title}</Text>}

      {/* PLAYER ACTIVE */}
      {showPlayer && videoId ? (
        <View style={{ height: 220, borderRadius: 12, overflow: 'hidden' }}>
          <YoutubePlayer
            height={220}
            play={true}
            videoId={videoId}
            onChangeState={(state) => {
              if (state === 'ended') setShowPlayer(false);
            }}
          />
        </View>
      ) : (
        /* THUMBNAIL VIEW */
        <TouchableOpacity
          style={styles.videoContainer}
          onPress={() => setShowPlayer(true)}
          activeOpacity={0.9}>
          <Image
            source={{ uri: section.media?.thumbnail }}
            style={styles.videoThumbnail}
            resizeMode="cover"
          />

          {/* Play button overlay */}
          <View style={styles.playButton}>
            <Ionicons name="play" size={32} color={colors.white} />
          </View>

          {/* Duration Badge */}
          {section.media?.durationSec && (
            <View style={styles.videoDuration}>
              <Text style={styles.videoDurationText}>
                {Math.floor(section.media.durationSec / 60)}:
                {(section.media.durationSec % 60).toString().padStart(2, '0')}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

// List Section (Prevention Tips style)
const ListSection = ({ section }) => (
  <View style={styles.section}>
    {section.title && <Text style={styles.sectionTitle}>{section.title}</Text>}

    <View style={[styles.card, styles.infoCard]}>
      {section.items?.map((item, index) => (
        <View key={index} style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.listItemText}>{typeof item === 'string' ? item : item.text}</Text>
        </View>
      ))}
    </View>
  </View>
);

// Cards Section (Treatment Options style)
const CardsSection = ({ section }) => (
  <View style={styles.section}>
    {section.title && <Text style={styles.sectionTitle}>{section.title}</Text>}

    {section.cards &&
      [...section.cards]
        .sort((a, b) => a.order - b.order)
        .map((card, index) => (
          <View key={index} style={[styles.card, styles.treatmentCard]}>
            <View style={styles.cardHeader}>
              {card.icon && (
                <MaterialCommunityIcons name={card.icon} size={24} color={colors.success} />
              )}
              <Text style={styles.cardTitle}>{card.title}</Text>
            </View>

            {card.subtitle && <Text style={styles.cardSubtitle}>{card.subtitle}</Text>}

            {card.bullets && card.bullets.length > 0 && (
              <View style={styles.cardBullets}>
                {card.bullets.map((bullet, idx) => (
                  <View key={idx} style={styles.listItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.listItemText}>{bullet}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
  </View>
);

// FAQ Section
const FAQSection = ({ section }) => (
  <View style={styles.section}>
    {section.title && <Text style={styles.sectionTitle}>{section.title}</Text>}

    {section.faqs &&
      [...section.faqs]
        .sort((a, b) => a.order - b.order)
        .map((faq, index) => (
          <View key={index} style={styles.faqCard}>
            <Text style={styles.faqQuestion}>• {faq.question}</Text>
            <Text style={styles.faqAnswer}>{faq.answer}</Text>
          </View>
        ))}
  </View>
);

// Info Box Section (Warning style)
const InfoBoxSection = ({ section }) => {
  const getVariantStyle = (variant) => {
    switch (variant) {
      case 'warning':
        return { backgroundColor: '#FFF4E5', iconColor: '#F59E0B', icon: 'warning' };
      case 'success':
        return { backgroundColor: '#E8F5E9', iconColor: '#4CAF50', icon: 'checkmark-circle' };
      case 'danger':
        return { backgroundColor: '#FFEBEE', iconColor: '#F44336', icon: 'alert-circle' };
      default:
        return {
          backgroundColor: '#E3F2FD',
          iconColor: colors.primaryDark,
          icon: 'information-circle',
        };
    }
  };

  const variantStyle = getVariantStyle(section.infoBox?.variant);

  return (
    <View style={styles.section}>
      {section.title && <Text style={styles.sectionTitle}>{section.title}</Text>}

      <View
        style={[
          styles.card,
          styles.infoBoxCard,
          { backgroundColor: variantStyle.backgroundColor },
        ]}>
        <View style={styles.infoBoxHeader}>
          <Ionicons name={variantStyle.icon} size={20} color={variantStyle.iconColor} />
          <Text style={[styles.infoBoxTitle, { color: variantStyle.iconColor }]}>
            {section.infoBox?.variant?.charAt(0).toUpperCase() + section.infoBox?.variant?.slice(1)}
          </Text>
        </View>
        <Text style={styles.infoBoxText}>{section.infoBox?.text}</Text>
      </View>
    </View>
  );
};

// Image Section
const ImageSection = ({ section }) => (
  <View style={styles.section}>
    {section.title && <Text style={styles.sectionTitle}>{section.title}</Text>}
    {section.images?.[0] && (
      <Image source={{ uri: section.images[0] }} style={styles.sectionImage} resizeMode="cover" />
    )}
  </View>
);

// Carousel Section
const CarouselSection = ({ section }) => (
  <View style={styles.section}>
    {section.title && <Text style={styles.sectionTitle}>{section.title}</Text>}
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      pagingEnabled
      style={styles.carousel}>
      {section.images?.map((image, index) => (
        <Image
          key={index}
          source={{ uri: image }}
          style={styles.carouselImage}
          resizeMode="cover"
        />
      ))}
    </ScrollView>
  </View>
);

// ============================================================================
// Styles
// ============================================================================

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
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: colors.primaryDark,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
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
  heroSection: {
    height: 200,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: colors.black,
    opacity: 0.9,
  },
  tabsContainer: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabsContent: {
    paddingHorizontal: 12,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primaryDark,
  },
  tabText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: colors.primaryDark,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  textContent: {
    marginTop: 8,
  },
  textContentText: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.textPrimary,
  },
  listItems: {
    marginTop: 12,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bullet: {
    fontSize: 15,
    color: colors.textPrimary,
    marginRight: 8,
    marginTop: 2,
  },
  listItemText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 24,
    color: colors.textPrimary,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoCard: {
    backgroundColor: '#F0F9FF',
  },
  treatmentCard: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  cardBullets: {
    marginTop: 8,
  },
  faqCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  infoBoxCard: {
    borderLeftWidth: 4,
  },
  infoBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoBoxTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoBoxText: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textPrimary,
  },
  videoContainer: {
    position: 'relative',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -24 }, { translateY: -24 }],
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoDuration: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  videoDurationText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  sectionImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginTop: 8,
  },
  carousel: {
    marginTop: 8,
  },
  carouselImage: {
    width: width - 64,
    height: 200,
    borderRadius: 12,
    marginRight: 12,
  },
});

export default GlaucomaGuideScreen;
// // FILE: src/screens/educational/GlaucomaGuideScreen.jsx
// // Glaucoma Guide Detail Screen - Exact design from screenshots
// // ============================================================================

// import React, { useEffect, useState, useRef } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   Dimensions,
//   ActivityIndicator,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useDispatch, useSelector } from 'react-redux';
// import { Ionicons } from '@expo/vector-icons';
// import { Video } from 'expo-av';
// import {
//   getEducationalContent,
//   clearCurrentContent,
//   fetchEducationalContentBySlug,
// } from '../../store/slices/educationalContentSlice';
// import { colors } from '../../styles/colors';

// const { width } = Dimensions.get('window');

// const GlaucomaGuideScreen = ({ navigation, route }) => {
//   const dispatch = useDispatch();
//   const { slug } = route.params; // Get slug from route params

//   const { currentContent, isDetailLoading, detailError } = useSelector(
//     (state) => state.educationalContent
//   );
//   console.log('Current Content:', currentContent);
//   const [activeTab, setActiveTab] = useState(null);
//   const scrollViewRef = useRef(null);

//   useEffect(() => {
//     // Fetch content by slug
//     dispatch(getEducationalContent());

//     return () => {
//       dispatch(clearCurrentContent());
//     };
//   }, [slug]);

//   useEffect(() => {
//     // Set first tab as active when content loads
//     if (currentContent && currentContent.tabs && currentContent.tabs.length > 0) {
//       setActiveTab(currentContent.tabs[0].key);
//     }
//   }, [currentContent]);

//   const handleTabChange = (tabKey) => {
//     setActiveTab(tabKey);
//     // Scroll to top when tab changes
//     scrollViewRef.current?.scrollTo({ y: 0, animated: true });
//   };

//   const renderSection = (section) => {
//     switch (section.type) {
//       case 'text':
//         return <TextSection key={section._id} section={section} />;
//       case 'video':
//         return <VideoSection key={section._id} section={section} />;
//       case 'list':
//         return <ListSection key={section._id} section={section} />;
//       case 'cards':
//         return <CardsSection key={section._id} section={section} />;
//       case 'faq':
//         return <FAQSection key={section._id} section={section} />;
//       case 'infobox':
//         return <InfoBoxSection key={section._id} section={section} />;
//       case 'image':
//         return <ImageSection key={section._id} section={section} />;
//       case 'carousel':
//         return <CarouselSection key={section._id} section={section} />;
//       default:
//         return null;
//     }
//   };

//   if (isDetailLoading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={colors.primaryDark} />
//       </View>
//     );
//   }

//   if (detailError) {
//     return (
//       <View style={styles.errorContainer}>
//         <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
//         <Text style={styles.errorText}>{detailError}</Text>
//         <TouchableOpacity
//           style={styles.retryButton}
//           onPress={() => dispatch(fetchEducationalContentBySlug(slug))}>
//           <Text style={styles.retryButtonText}>Retry</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   if (!currentContent) {
//     return (
//       <View style={styles.loadingContainer}>
//         <Text>No content available</Text>
//       </View>
//     );
//   }

//   // Filter sections for active tab
//   const activeSections =
//     currentContent.sections
//       ?.filter((section) => section.tabKey === activeTab)
//       .sort((a, b) => a.order - b.order) || [];

//   return (
//     <SafeAreaView style={styles.container} edges={['top']}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//           <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Glaucoma Guide</Text>
//         <View style={{ width: 24 }} />
//       </View>

//       {/* Hero Section */}
//       <View style={styles.heroSection}>
//         <Image
//           source={{ uri: currentContent.heroImage }}
//           style={styles.heroImage}
//           resizeMode="cover"
//         />
//         <View style={styles.heroOverlay}>
//           <Text style={styles.heroTitle}>{currentContent.title}</Text>
//           <Text style={styles.heroSubtitle}>{currentContent.shortDescription}</Text>
//         </View>
//       </View>

//       {/* Tabs */}
//       <View style={styles.tabsContainer}>
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.tabsContent}>
//           {currentContent.tabs
//             ?.sort((a, b) => a.order - b.order)
//             .map((tab) => (
//               <TouchableOpacity
//                 key={tab.key}
//                 style={[styles.tab, activeTab === tab.key && styles.activeTab]}
//                 onPress={() => handleTabChange(tab.key)}>
//                 <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
//                   {tab.label}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//         </ScrollView>
//       </View>

//       {/* Content */}
//       <ScrollView ref={scrollViewRef} style={styles.content} showsVerticalScrollIndicator={false}>
//         {activeSections.map((section) => renderSection(section))}

//         {/* Bottom Spacing */}
//         <View style={{ height: 40 }} />
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// // ============================================================================
// // Section Components
// // ============================================================================

// // Text Section
// const TextSection = ({ section }) => (
//   <View style={styles.section}>
//     <Text style={styles.sectionTitle}>{section.title}</Text>
//     {section.subtitle && <Text style={styles.sectionSubtitle}>{section.subtitle}</Text>}

//     {/* Parse HTML content */}
//     <View style={styles.textContent}>
//       {section.content && (
//         <Text style={styles.textContentText}>
//           {section.content.replace(/<[^>]*>/g, '')}
//           {/* Simple HTML strip - use react-native-render-html for proper HTML rendering */}
//         </Text>
//       )}
//     </View>

//     {/* List items if present */}
//     {section.items && section.items.length > 0 && (
//       <View style={styles.listItems}>
//         {section.items.map((item, index) => (
//           <View key={index} style={styles.listItem}>
//             <Text style={styles.bullet}>•</Text>
//             <Text style={styles.listItemText}>{typeof item === 'string' ? item : item.text}</Text>
//           </View>
//         ))}
//       </View>
//     )}
//   </View>
// );

// // Video Section
// const VideoSection = ({ section }) => (
//   <View style={styles.section}>
//     <Text style={styles.sectionTitle}>{section.title}</Text>

//     <View style={styles.videoContainer}>
//       <Image
//         source={{ uri: section.media?.thumbnail || section.media?.videoUrl }}
//         style={styles.videoThumbnail}
//         resizeMode="cover"
//       />
//       <TouchableOpacity style={styles.playButton}>
//         <Ionicons name="play" size={32} color={colors.white} />
//       </TouchableOpacity>
//       {section.media?.durationSec && (
//         <View style={styles.videoDuration}>
//           <Text style={styles.videoDurationText}>
//             {Math.floor(section.media.durationSec / 60)}:
//             {(section.media.durationSec % 60).toString().padStart(2, '0')}
//           </Text>
//         </View>
//       )}
//     </View>
//   </View>
// );

// // List Section (Prevention Tips style)
// const ListSection = ({ section }) => (
//   <View style={styles.section}>
//     <Text style={styles.sectionTitle}>{section.title}</Text>

//     <View style={[styles.card, styles.infoCard]}>
//       {section.items?.map((item, index) => (
//         <View key={index} style={styles.listItem}>
//           <Text style={styles.bullet}>•</Text>
//           <Text style={styles.listItemText}>{typeof item === 'string' ? item : item.text}</Text>
//         </View>
//       ))}
//     </View>
//   </View>
// );

// // Cards Section (Treatment Options style)
// const CardsSection = ({ section }) => (
//   <View style={styles.section}>
//     <Text style={styles.sectionTitle}>{section.title}</Text>

//     {section.cards
//       ?.sort((a, b) => a.order - b.order)
//       .map((card, index) => (
//         <View key={index} style={[styles.card, styles.treatmentCard]}>
//           <View style={styles.cardHeader}>
//             {card.icon && <Ionicons name={card.icon} size={24} color={colors.success} />}
//             <Text style={styles.cardTitle}>{card.title}</Text>
//           </View>

//           {card.subtitle && <Text style={styles.cardSubtitle}>{card.subtitle}</Text>}

//           {card.bullets && card.bullets.length > 0 && (
//             <View style={styles.cardBullets}>
//               {card.bullets.map((bullet, idx) => (
//                 <View key={idx} style={styles.listItem}>
//                   <Text style={styles.bullet}>•</Text>
//                   <Text style={styles.listItemText}>{bullet}</Text>
//                 </View>
//               ))}
//             </View>
//           )}
//         </View>
//       ))}
//   </View>
// );

// // FAQ Section
// const FAQSection = ({ section }) => (
//   <View style={styles.section}>
//     <Text style={styles.sectionTitle}>{section.title}</Text>

//     {section.faqs
//       ?.sort((a, b) => a.order - b.order)
//       .map((faq, index) => (
//         <View key={index} style={styles.faqCard}>
//           <Text style={styles.faqQuestion}>• {faq.question}</Text>
//           <Text style={styles.faqAnswer}>{faq.answer}</Text>
//         </View>
//       ))}
//   </View>
// );

// // Info Box Section (Warning style)
// const InfoBoxSection = ({ section }) => {
//   const getVariantStyle = (variant) => {
//     switch (variant) {
//       case 'warning':
//         return { backgroundColor: '#FFF4E5', iconColor: '#F59E0B', icon: 'warning' };
//       case 'success':
//         return { backgroundColor: '#E8F5E9', iconColor: '#4CAF50', icon: 'checkmark-circle' };
//       case 'danger':
//         return { backgroundColor: '#FFEBEE', iconColor: '#F44336', icon: 'alert-circle' };
//       default:
//         return {
//           backgroundColor: '#E3F2FD',
//           iconColor: colors.primaryDark,
//           icon: 'information-circle',
//         };
//     }
//   };

//   const variantStyle = getVariantStyle(section.infoBox?.variant);

//   return (
//     <View style={styles.section}>
//       {section.title && <Text style={styles.sectionTitle}>{section.title}</Text>}

//       <View
//         style={[
//           styles.card,
//           styles.infoBoxCard,
//           { backgroundColor: variantStyle.backgroundColor },
//         ]}>
//         <View style={styles.infoBoxHeader}>
//           <Ionicons name={variantStyle.icon} size={20} color={variantStyle.iconColor} />
//           <Text style={[styles.infoBoxTitle, { color: variantStyle.iconColor }]}>
//             {section.infoBox?.variant?.charAt(0).toUpperCase() + section.infoBox?.variant?.slice(1)}
//           </Text>
//         </View>
//         <Text style={styles.infoBoxText}>{section.infoBox?.text}</Text>
//       </View>
//     </View>
//   );
// };

// // Image Section
// const ImageSection = ({ section }) => (
//   <View style={styles.section}>
//     {section.title && <Text style={styles.sectionTitle}>{section.title}</Text>}
//     <Image source={{ uri: section.images?.[0] }} style={styles.sectionImage} resizeMode="cover" />
//   </View>
// );

// // Carousel Section
// const CarouselSection = ({ section }) => (
//   <View style={styles.section}>
//     {section.title && <Text style={styles.sectionTitle}>{section.title}</Text>}
//     <ScrollView
//       horizontal
//       showsHorizontalScrollIndicator={false}
//       pagingEnabled
//       style={styles.carousel}>
//       {section.images?.map((image, index) => (
//         <Image
//           key={index}
//           source={{ uri: image }}
//           style={styles.carouselImage}
//           resizeMode="cover"
//         />
//       ))}
//     </ScrollView>
//   </View>
// );

// // ============================================================================
// // Styles
// // ============================================================================

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.background,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   errorText: {
//     fontSize: 16,
//     color: colors.textSecondary,
//     marginTop: 12,
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   retryButton: {
//     backgroundColor: colors.primaryDark,
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 8,
//   },
//   retryButtonText: {
//     color: colors.white,
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     backgroundColor: colors.white,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.border,
//   },
//   backButton: {
//     padding: 4,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: colors.textPrimary,
//   },
//   heroSection: {
//     height: 280,
//     position: 'relative',
//   },
//   heroImage: {
//     width: '100%',
//     height: '100%',
//   },
//   heroOverlay: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     padding: 24,
//     backgroundColor: 'rgba(135, 206, 235, 0.7)', // Light blue overlay
//   },
//   heroTitle: {
//     fontSize: 28,
//     fontWeight: '700',
//     color: colors.textPrimary,
//     marginBottom: 8,
//   },
//   heroSubtitle: {
//     fontSize: 16,
//     color: colors.textSecondary,
//     lineHeight: 22,
//   },
//   tabsContainer: {
//     backgroundColor: colors.white,
//     borderBottomWidth: 1,
//     borderBottomColor: colors.border,
//   },
//   tabsContent: {
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//   },
//   tab: {
//     marginRight: 24,
//     paddingBottom: 12,
//   },
//   activeTab: {
//     borderBottomWidth: 3,
//     borderBottomColor: colors.primaryDark,
//   },
//   tabText: {
//     fontSize: 16,
//     color: colors.textSecondary,
//     fontWeight: '500',
//   },
//   activeTabText: {
//     color: colors.textPrimary,
//     fontWeight: '600',
//   },
//   content: {
//     flex: 1,
//   },
//   section: {
//     padding: 16,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: colors.textPrimary,
//     marginBottom: 12,
//   },
//   sectionSubtitle: {
//     fontSize: 14,
//     color: colors.textSecondary,
//     marginBottom: 12,
//     lineHeight: 20,
//   },
//   textContent: {
//     marginBottom: 16,
//   },
//   textContentText: {
//     fontSize: 15,
//     color: colors.textSecondary,
//     lineHeight: 24,
//   },
//   listItems: {
//     marginTop: 8,
//   },
//   listItem: {
//     flexDirection: 'row',
//     marginBottom: 12,
//   },
//   bullet: {
//     fontSize: 16,
//     color: colors.textPrimary,
//     marginRight: 12,
//     marginTop: 2,
//   },
//   listItemText: {
//     flex: 1,
//     fontSize: 15,
//     color: colors.textSecondary,
//     lineHeight: 22,
//   },
//   videoContainer: {
//     width: '100%',
//     height: 200,
//     borderRadius: 12,
//     overflow: 'hidden',
//     position: 'relative',
//     marginTop: 8,
//   },
//   videoThumbnail: {
//     width: '100%',
//     height: '100%',
//   },
//   playButton: {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     marginTop: -32,
//     marginLeft: -32,
//     width: 64,
//     height: 64,
//     borderRadius: 32,
//     backgroundColor: 'rgba(0, 0, 0, 0.6)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   videoDuration: {
//     position: 'absolute',
//     bottom: 12,
//     right: 12,
//     backgroundColor: 'rgba(0, 0, 0, 0.7)',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 4,
//   },
//   videoDurationText: {
//     color: colors.white,
//     fontSize: 12,
//     fontWeight: '600',
//   },
//   card: {
//     backgroundColor: colors.white,
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: colors.border,
//   },
//   infoCard: {
//     backgroundColor: '#E3F2FD',
//     borderColor: '#2196F3',
//   },
//   treatmentCard: {
//     backgroundColor: '#E8F5E9',
//     borderColor: '#4CAF50',
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   cardTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: colors.textPrimary,
//     marginLeft: 8,
//   },
//   cardSubtitle: {
//     fontSize: 14,
//     color: colors.textSecondary,
//     marginBottom: 8,
//   },
//   cardBullets: {
//     marginTop: 8,
//   },
//   faqCard: {
//     backgroundColor: colors.white,
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: colors.border,
//   },
//   faqQuestion: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: colors.textPrimary,
//     marginBottom: 8,
//   },
//   faqAnswer: {
//     fontSize: 14,
//     color: colors.textSecondary,
//     lineHeight: 20,
//     paddingLeft: 12,
//   },
//   infoBoxCard: {
//     borderWidth: 1,
//   },
//   infoBoxHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   infoBoxTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     marginLeft: 8,
//     textTransform: 'capitalize',
//   },
//   infoBoxText: {
//     fontSize: 14,
//     color: colors.textSecondary,
//     lineHeight: 20,
//   },
//   sectionImage: {
//     width: '100%',
//     height: 200,
//     borderRadius: 12,
//     marginTop: 8,
//   },
//   carousel: {
//     marginTop: 8,
//   },
//   carouselImage: {
//     width: width - 48, // Account for padding
//     height: 200,
//     borderRadius: 12,
//     marginRight: 12,
//   },
// });

// export default GlaucomaGuideScreen;
