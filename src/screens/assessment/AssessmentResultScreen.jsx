// FILE: src/screens/assessment/AssessmentResultScreen.jsx
// Assessment Results Screen
// ============================================================================

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { clearAnswers } from '../../store/slices/assessmentSlice';
import { colors } from '../../styles/colors';

const AssessmentResultScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { result, latestResult } = useSelector((state) => state.assessment);

  const scaleValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(scaleValue, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  const assessmentData = result || latestResult;

  if (!assessmentData) {
    console.log('⚠️ No assessment data available, redirecting to home');
    navigation.replace('Main', { screen: 'HomeTab' });
    return null;
  }

  console.log('📝 Assessment Data:', assessmentData);

  const riskLevel = assessmentData.riskLevel?.toLowerCase() || 'low';
  const riskScore = assessmentData.riskScore || assessmentData.assessment?.riskScore || 0;
  const recommendations = assessmentData.recommendations || [];

  const getRiskColor = () => {
    switch (riskLevel) {
      case 'high':
        return {
          primary: '#EF4444',
          secondary: '#FEE2E2',
          gradient: ['#EF4444', '#DC2626'],
          icon: 'alert-circle',
        };
      case 'moderate':
        return {
          primary: '#F59E0B',
          secondary: '#FEF3C7',
          gradient: ['#F59E0B', '#D97706'],
          icon: 'warning',
        };
      default:
        return {
          primary: '#10B981',
          secondary: '#D1FAE5',
          gradient: ['#10B981', '#059669'],
          icon: 'checkmark-circle',
        };
    }
  };
  const riskColorScheme = getRiskColor();
  const getRiskTitle = () => {
    switch (riskLevel) {
      case 'high':
        return 'High Risk Detected';
      case 'moderate':
        return 'Moderate Risk';
      default:
        return 'Low Risk - Great!';
    }
  };

  const getRiskMessage = () => {
    switch (riskLevel) {
      case 'high':
        return 'Your assessment indicates a higher risk for eye health issues. We recommend consulting with an eye care professional soon.';
      case 'moderate':
        return 'Your assessment shows some concerns. Following the recommendations below can help maintain your eye health.';
      default:
        return 'Your eye health appears to be in good condition. Continue following the recommendations to maintain it.';
    }
  };

  const handleDone = () => {
    dispatch(clearAnswers());
    navigation.navigate('Main');
  };

  const handleViewHistory = () => {
    dispatch(clearAnswers());
    navigation.navigate('AssessmentHistory');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Header Card */}
        <Animated.View style={[styles.headerCard, { transform: [{ scale: scaleValue }] }]}>
          <LinearGradient
            colors={riskColorScheme.gradient}
            style={styles.gradientBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}>
            <View style={styles.iconContainer}>
              <Ionicons name={riskColorScheme.icon} size={64} color={colors.white} />
            </View>
            <Text style={styles.headerTitle}>{getRiskTitle()}</Text>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreLabel}>Risk Score</Text>
              <Text style={styles.scoreValue}>{riskScore}/18</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        <View style={styles.disclaimerCard}>
          <View style={styles.disclaimerHeader}>
            <Ionicons name="information-circle-outline" size={20} color="#F59E0B" />
            <Text style={styles.disclaimerTitle}>Medical Disclaimer</Text>
          </View>
          <Text style={styles.disclaimerText}>
            This app does NOT diagnose, treat, cure, or prevent any medical condition. Always
            consult qualified healthcare professionals for medical advice.
          </Text>
        </View>

        {/* Message Card */}
        <View style={styles.messageCard}>
          <Text style={styles.messageText}>{getRiskMessage()}</Text>
        </View>

        {/* Recommendations Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="medical-outline" size={24} color={colors.primaryDark} />
            <Text style={styles.sectionTitle}>Recommendations</Text>
          </View>

          <View style={styles.recommendationsContainer}>
            {recommendations && recommendations.length > 0 ? (
              recommendations.map((recommendation, index) => (
                <View key={index} style={styles.recommendationItem}>
                  <View
                    style={[
                      styles.recommendationBullet,
                      { backgroundColor: riskColorScheme.primary },
                    ]}>
                    <Text style={styles.recommendationNumber}>{index + 1}</Text>
                  </View>
                  <Text style={styles.recommendationText}>{recommendation}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noRecommendations}>
                No specific recommendations at this time.
              </Text>
            )}
          </View>
        </View>

        {/* Next Steps Section */}
        {/* <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="compass-outline" size={24} color={colors.primaryDark} />
            <Text style={styles.sectionTitle}>Next Steps</Text>
          </View>

          <View style={styles.nextStepsContainer}>
            <TouchableOpacity
              style={styles.nextStepCard}
              onPress={() => {
                dispatch(clearAnswers());
                navigation.replace('DoctorList');
              }}>
              <View style={[styles.nextStepIcon, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="people-outline" size={24} color={colors.primaryDark} />
              </View>
              <View style={styles.nextStepContent}>
                <Text style={styles.nextStepTitle}>Find a Doctor</Text>
                <Text style={styles.nextStepDescription}>Connect with eye care specialists</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.nextStepCard}
              onPress={() => {
                dispatch(clearAnswers());
                navigation.replace('BlogTab');
              }}>
              <View style={[styles.nextStepIcon, { backgroundColor: '#FEF3C7' }]}>
                <Ionicons name="book-outline" size={24} color="#F59E0B" />
              </View>
              <View style={styles.nextStepContent}>
                <Text style={styles.nextStepTitle}>Learn More</Text>
                <Text style={styles.nextStepDescription}>Read articles about eye health</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.nextStepCard}
              onPress={() => {
                dispatch(clearAnswers());
                navigation.replace('ExerciseList');
              }}>
              <View style={[styles.nextStepIcon, { backgroundColor: '#D1FAE5' }]}>
                <Ionicons name="fitness-outline" size={24} color="#10B981" />
              </View>
              <View style={styles.nextStepContent}>
                <Text style={styles.nextStepTitle}>Eye Exercises</Text>
                <Text style={styles.nextStepDescription}>Practice daily eye exercises</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View> */}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  headerCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  gradientBackground: {
    padding: 32,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.white,
    fontFamily: 'Poppins_700Bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  scoreContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  scoreLabel: {
    fontSize: 12,
    color: colors.white,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
    marginBottom: 4,
    opacity: 0.9,
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.white,
    fontFamily: 'Poppins_700Bold',
    textAlign: 'center',
  },
  messageCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  messageText: {
    fontSize: 15,
    color: colors.textPrimary,
    fontFamily: 'Poppins_400Regular',
    lineHeight: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
  },
  recommendationsContainer: {
    gap: 12,
  },
  recommendationItem: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  recommendationBullet: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recommendationNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
    fontFamily: 'Poppins_600SemiBold',
  },
  recommendationText: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: 'Poppins_400Regular',
    lineHeight: 22,
  },
  noRecommendations: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  nextStepsContainer: {
    gap: 12,
  },
  nextStepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  nextStepIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  nextStepContent: {
    flex: 1,
  },
  nextStepTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 2,
  },
  nextStepDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
  },
  bottomActions: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primaryDark,
    fontFamily: 'Poppins_600SemiBold',
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.white,
    fontFamily: 'Poppins_600SemiBold',
  },
  disclaimerCard: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FCD34D',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  disclaimerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  disclaimerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    fontFamily: 'Poppins_600SemiBold',
  },
  disclaimerText: {
    fontSize: 13,
    color: '#78350F',
    fontFamily: 'Poppins_400Regular',
    lineHeight: 20,
  },
});

export default AssessmentResultScreen;
