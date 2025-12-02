// FILE: src/screens/assessment/EyeHealthAssessmentScreen.jsx
// Eye Health Assessment Screen - Exact Design Match
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import {
  setAnswer,
  nextQuestion,
  previousQuestion,
  submitAssessment,
  clearAnswers,
  loadQuestions,
} from '../../store/slices/assessmentSlice';
import { colors } from '../../styles/colors';

const EyeHealthAssessmentScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { currentQuestion, answers, isLoading, questions } = useSelector(
    (state) => state.assessment
  );

  const [detailText, setDetailText] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);

  // Load questions on mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoadingQuestions(true);
        await dispatch(loadQuestions()).unwrap();
      } catch (error) {
        Alert.alert('Error', 'Failed to load questions. Please try again.');
        navigation.goBack();
      } finally {
        setIsLoadingQuestions(false);
        console.log(questions);
      }
    };

    fetchQuestions();
  }, []);

  // Load saved answer when question changes
  useEffect(() => {
    if (questions.length > 0) {
      const savedAnswer = answers[currentQuestion];

      if (savedAnswer) {
        if (Array.isArray(savedAnswer)) {
          setSelectedOptions(savedAnswer);
          setDetailText('');
        } else if (typeof savedAnswer === 'object' && savedAnswer.choice) {
          setSelectedOptions([savedAnswer.choice]);
          setDetailText(savedAnswer.detail || '');
        } else if (typeof savedAnswer === 'string') {
          if (question?.type === 'text') {
            setDetailText(savedAnswer);
            setSelectedOptions([]);
          } else {
            setSelectedOptions([savedAnswer]);
            setDetailText('');
          }
        }
      } else {
        setSelectedOptions([]);
        setDetailText('');
      }
    }
  }, [currentQuestion, questions]);

  // Show loading while fetching questions
  if (isLoadingQuestions) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primaryDark} />
        <Text style={styles.loadingText}>Loading assessment...</Text>
      </View>
    );
  }

  // If no questions available
  if (!questions || questions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.textSecondary} />
          <Text style={styles.errorText}>No questions available</Text>
          <TouchableOpacity style={styles.errorButton} onPress={() => navigation.goBack()}>
            <Text style={styles.errorButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const question = questions.find((q) => q.id === currentQuestion);
  const totalQuestions = questions.length;
  const progress = (currentQuestion / totalQuestions) * 100;
  const isLastQuestion = currentQuestion === totalQuestions;
  console.log(currentQuestion);
  const handleOptionSelect = (value) => {
    if (question.type === 'multiple') {
      if (selectedOptions.includes(value)) {
        setSelectedOptions(selectedOptions.filter((v) => v !== value));
      } else {
        setSelectedOptions([...selectedOptions, value]);
      }
    } else {
      setSelectedOptions([value]);
    }
  };

  const saveCurrentAnswer = () => {
    let answer;

    if (question.type === 'multiple') {
      answer = selectedOptions;
    } else if (question.type === 'yes_no_detail') {
      answer = {
        choice: selectedOptions[0] || null,
        detail: detailText.trim(),
      };
    } else if (question.type === 'text') {
      answer = detailText.trim();
    } else {
      answer = selectedOptions[0] || null;
    }

    dispatch(setAnswer({ questionId: currentQuestion, answer }));
  };

  const handleNext = () => {
    // Validate required question
    if (question.required) {
      if (question.type === 'text') {
        if (!detailText.trim()) {
          Alert.alert('Required', 'Please answer this question to continue');
          return;
        }
      } else if (selectedOptions.length === 0) {
        Alert.alert('Required', 'Please answer this question to continue');
        return;
      }
    }

    saveCurrentAnswer();
    dispatch(nextQuestion());
  };

  const handlePrevious = () => {
    saveCurrentAnswer();
    dispatch(previousQuestion());
  };

  const handleSkip = () => {
    if (isLastQuestion) {
      handleSubmit();
    } else {
      dispatch(nextQuestion());
    }
  };

  const handleSubmit = async () => {
    // Save current answer before submitting
    saveCurrentAnswer();

    Alert.alert('Submit Assessment', 'Are you sure you want to submit your assessment?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Submit',
        onPress: async () => {
          try {
            // Include current answer
            const finalAnswers = { ...answers };

            if (question.type === 'multiple') {
              finalAnswers[currentQuestion] = selectedOptions;
            } else if (question.type === 'yes_no_detail') {
              finalAnswers[currentQuestion] = {
                choice: selectedOptions[0] || null,
                detail: detailText.trim(),
              };
            } else if (question.type === 'text') {
              finalAnswers[currentQuestion] = detailText.trim();
            } else {
              finalAnswers[currentQuestion] = selectedOptions[0] || null;
            }

            await dispatch(submitAssessment(finalAnswers)).unwrap();

            // Navigate to Results Screen instead of showing alert
            navigation.replace('AssessmentResult');
          } catch (error) {
            Alert.alert('Error', error.message || 'Failed to submit assessment');
          }
        },
      },
    ]);
  };

  const handleCompleteLater = () => {
    Alert.alert('Exit Assessment', 'Your progress will not be saved. Do you want to exit?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Exit',
        style: 'destructive',
        onPress: () => {
          dispatch(clearAnswers());
          navigation.goBack();
        },
      },
    ]);
  };

  const shouldShowDetailInput = () => {
    if (question.type === 'text') return true;
    if (question.type === 'yes_no_detail' && selectedOptions.includes('yes')) return true;
    return false;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Eye Health Assessment</Text>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Question {currentQuestion} of {totalQuestions}
        </Text>
        <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
      </View>
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Question */}
        <View style={styles.questionHeader}>
          <Text style={styles.questionNumber}>{currentQuestion}.</Text>
          <Text style={styles.questionText}>{question.question}</Text>
          {!question.required && (
            <TouchableOpacity onPress={handleSkip}>
              <Text style={styles.skipLink}>Skip</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Options */}
        {question.options && question.options.length > 0 && (
          <View style={styles.optionsContainer}>
            {question.options.map((option) => {
              const isSelected = selectedOptions.includes(option.value);
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.optionButton, isSelected && styles.optionButtonSelected]}
                  onPress={() => handleOptionSelect(option.value)}
                  activeOpacity={0.7}>
                  <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                    {isSelected && <Ionicons name="checkmark" size={16} color={colors.white} />}
                  </View>
                  <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Detail Input */}
        {shouldShowDetailInput() && (
          <TextInput
            style={styles.detailInput}
            placeholder={question.detailPlaceholder || 'Please specify'}
            placeholderTextColor="#9CA3AF"
            value={detailText}
            onChangeText={setDetailText}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        )}
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.bottomContainer}>
        <View style={styles.buttonRow}>
          {currentQuestion > 1 && (
            <TouchableOpacity
              style={styles.previousButton}
              onPress={handlePrevious}
              disabled={isLoading}>
              <Text style={styles.previousButtonText}>Previous</Text>
            </TouchableOpacity>
          )}

          {!isLastQuestion && (
            <TouchableOpacity
              style={[styles.nextButton, currentQuestion === 1 && styles.nextButtonFull]}
              onPress={handleNext}
              disabled={isLoading}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          )}

          {isLastQuestion && (
            <TouchableOpacity
              style={[styles.submitButton, currentQuestion === 1 && styles.submitButtonFull]}
              onPress={handleSubmit}
              disabled={isLoading}>
              {isLoading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={styles.submitButtonText}>Submit</Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.completeLaterButton}
          onPress={handleCompleteLater}
          disabled={isLoading}>
          <Text style={styles.completeLaterText}>Complete Later</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
    fontFamily: 'Poppins_500Medium',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 18,
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
    marginTop: 16,
    marginBottom: 24,
  },
  errorButton: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  errorButtonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#F9FAFB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
    flex: 1,
    textAlign: 'center',
    marginLeft: -40,
  },
  saveText: {
    fontSize: 16,
    color: colors.primaryDark,
    fontFamily: 'Poppins_600SemiBold',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  progressText: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: 'Poppins_400Regular',
  },
  progressPercentage: {
    fontSize: 13,
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primaryDark,
    borderRadius: 3,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  questionHeader: {
    marginBottom: 24,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontFamily: 'Poppins_400Regular',
    lineHeight: 24,
  },
  skipLink: {
    fontSize: 16,
    color: colors.primaryDark,
    fontFamily: 'Poppins_600SemiBold',
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  optionButtonSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: colors.primaryDark,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  checkboxSelected: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    fontFamily: 'Poppins_400Regular',
  },
  optionTextSelected: {
    color: colors.primaryDark,
    fontWeight: '500',
    fontFamily: 'Poppins_500Medium',
  },
  detailInput: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: colors.textPrimary,
    fontFamily: 'Poppins_400Regular',
    minHeight: 120,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  bottomContainer: {
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  previousButton: {
    flex: 1,
    backgroundColor: colors.white,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  previousButtonText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
  },
  nextButton: {
    flex: 1,
    backgroundColor: colors.primaryDark,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonFull: {
    flex: 1,
  },
  nextButtonText: {
    fontSize: 16,
    color: colors.white,
    fontFamily: 'Poppins_600SemiBold',
  },
  submitButton: {
    flex: 1,
    backgroundColor: colors.primaryDark,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonFull: {
    flex: 1,
  },
  submitButtonText: {
    fontSize: 16,
    color: colors.white,
    fontFamily: 'Poppins_600SemiBold',
  },
  completeLaterButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  completeLaterText: {
    fontSize: 16,
    color: colors.primaryDark,
    fontFamily: 'Poppins_600SemiBold',
  },
});

export default EyeHealthAssessmentScreen;
// // FILE: src/screens/assessment/EyeHealthAssessmentScreen.jsx
// // Eye Health Assessment Screen
// // ============================================================================

// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   TextInput,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useDispatch, useSelector } from 'react-redux';
// import { Ionicons } from '@expo/vector-icons';
// import {
//   setAnswer,
//   setCurrentQuestion,
//   nextQuestion,
//   previousQuestion,
//   submitAssessment,
//   clearAnswers,
// } from '../../store/slices/assessmentSlice';
// import { assessmentQuestions } from '../../data/assessmentQuestions';
// import { colors } from '../../styles/colors';

// const EyeHealthAssessmentScreen = ({ navigation }) => {
//   const dispatch = useDispatch();
//   const { currentQuestion, answers, isLoading } = useSelector((state) => state.assessment);

//   const [detailText, setDetailText] = useState('');
//   const [selectedOptions, setSelectedOptions] = useState([]);

//   const question = assessmentQuestions.find((q) => q.id === currentQuestion);
//   const totalQuestions = assessmentQuestions.length;
//   const progress = (currentQuestion / totalQuestions) * 100;

//   useEffect(() => {
//     // Load existing answer for current question
//     if (answers[currentQuestion]) {
//       const answer = answers[currentQuestion];
//       if (question.type === 'multiple' || question.type === 'single') {
//         setSelectedOptions(Array.isArray(answer) ? answer : [answer]);
//       } else if (
//         question.type === 'yes_no' ||
//         question.type === 'yes_no_detail'
//       ) {
//         setSelectedOptions([answer.choice]);
//         setDetailText(answer.detail || '');
//       } else if (question.type === 'text') {
//         setDetailText(answer || '');
//       }
//     } else {
//       setSelectedOptions([]);
//       setDetailText('');
//     }
//   }, [currentQuestion, answers]);

//   const handleOptionSelect = (value) => {
//     if (question.type === 'multiple') {
//       // Multiple selection
//       if (selectedOptions.includes(value)) {
//         setSelectedOptions(selectedOptions.filter((v) => v !== value));
//       } else {
//         setSelectedOptions([...selectedOptions, value]);
//       }
//     } else {
//       // Single selection
//       setSelectedOptions([value]);
//     }
//   };

//   const handleNext = () => {
//     // Validate required fields
//     if (question.required && selectedOptions.length === 0 && !detailText.trim()) {
//       Alert.alert('Required', 'Please answer this question to continue');
//       return;
//     }

//     // Save answer
//     let answer;
//     if (question.type === 'multiple') {
//       answer = selectedOptions;
//     } else if (question.type === 'yes_no_detail') {
//       answer = {
//         choice: selectedOptions[0] || null,
//         detail: detailText.trim(),
//       };
//     } else if (question.type === 'text') {
//       answer = detailText.trim();
//     } else {
//       answer = selectedOptions[0] || null;
//     }

//     dispatch(setAnswer({ questionId: currentQuestion, answer }));

//     // Move to next question
//     if (currentQuestion < totalQuestions) {
//       dispatch(nextQuestion());
//     }
//   };

//   const handlePrevious = () => {
//     if (currentQuestion > 1) {
//       dispatch(previousQuestion());
//     }
//   };

//   const handleSkip = () => {
//     if (currentQuestion < totalQuestions) {
//       dispatch(nextQuestion());
//     } else {
//       handleSubmit();
//     }
//   };

//   const handleSubmit = async () => {
//     Alert.alert(
//       'Submit Assessment',
//       'Are you sure you want to submit your assessment?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Submit',
//           onPress: async () => {
//             try {
//               await dispatch(submitAssessment(answers)).unwrap();
//               Alert.alert(
//                 'Success',
//                 'Your assessment has been submitted successfully!',
//                 [
//                   {
//                     text: 'OK',
//                     onPress: () => {
//                       dispatch(clearAnswers());
//                       navigation.navigate('Main', { screen: 'HomeTab' });
//                     },
//                   },
//                 ]
//               );
//             } catch (error) {
//               Alert.alert('Error', error.message || 'Failed to submit assessment');
//             }
//           },
//         },
//       ]
//     );
//   };

//   const handleCompleteLater = () => {
//     Alert.alert(
//       'Exit Assessment',
//       'Your progress will not be saved. Do you want to exit?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Exit',
//           style: 'destructive',
//           onPress: () => {
//             dispatch(clearAnswers());
//             navigation.goBack();
//           },
//         },
//       ]
//     );
//   };

//   const isLastQuestion = currentQuestion === totalQuestions;

//   const shouldShowDetailInput = () => {
//     if (question.type === 'text') return true;
//     if (question.type === 'yes_no_detail') {
//       return selectedOptions.includes('yes');
//     }
//     return false;
//   };

//   return (
//     <SafeAreaView style={styles.container} edges={['top']}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Eye Health Assessment</Text>
//         <TouchableOpacity onPress={handleSkip}>
//           <Text style={styles.skipText}>
//             {isLastQuestion ? 'Skip' : 'Skip'}
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {/* Progress Bar */}
//       <View style={styles.progressContainer}>
//         <Text style={styles.progressText}>
//           Question {currentQuestion} of {totalQuestions}
//         </Text>
//         <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
//       </View>
//       <View style={styles.progressBarBackground}>
//         <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
//       </View>

//       <ScrollView
//         style={styles.scrollView}
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}>
//         {/* Question */}
//         <Text style={styles.questionNumber}>{currentQuestion}.</Text>
//         <Text style={styles.questionText}>{question.question}</Text>

//         {/* Options */}
//         {question.options && (
//           <View style={styles.optionsContainer}>
//             {question.options.map((option) => {
//               const isSelected = selectedOptions.includes(option.value);
//               return (
//                 <TouchableOpacity
//                   key={option.value}
//                   style={[
//                     styles.optionButton,
//                     isSelected && styles.optionButtonSelected,
//                   ]}
//                   onPress={() => handleOptionSelect(option.value)}
//                   activeOpacity={0.7}>
//                   <View
//                     style={[
//                       styles.checkbox,
//                       isSelected && styles.checkboxSelected,
//                     ]}>
//                     {isSelected && (
//                       <Ionicons name="checkmark" size={16} color={colors.white} />
//                     )}
//                   </View>
//                   <Text
//                     style={[
//                       styles.optionText,
//                       isSelected && styles.optionTextSelected,
//                     ]}>
//                     {option.label}
//                   </Text>
//                 </TouchableOpacity>
//               );
//             })}
//           </View>
//         )}

//         {/* Detail Input */}
//         {shouldShowDetailInput() && (
//           <TextInput
//             style={styles.detailInput}
//             placeholder={question.detailPlaceholder || 'Please specify'}
//             placeholderTextColor="#9CA3AF"
//             value={detailText}
//             onChangeText={setDetailText}
//             multiline
//             numberOfLines={4}
//             textAlignVertical="top"
//           />
//         )}
//       </ScrollView>

//       {/* Bottom Buttons */}
//       <View style={styles.bottomContainer}>
//         <View style={styles.buttonRow}>
//           {currentQuestion > 1 && (
//             <TouchableOpacity
//               style={styles.previousButton}
//               onPress={handlePrevious}
//               disabled={isLoading}>
//               <Text style={styles.previousButtonText}>Previous</Text>
//             </TouchableOpacity>
//           )}

//           {!isLastQuestion && (
//             <TouchableOpacity
//               style={[
//                 styles.nextButton,
//                 currentQuestion === 1 && styles.nextButtonFull,
//               ]}
//               onPress={handleNext}
//               disabled={isLoading}>
//               <Text style={styles.nextButtonText}>Next</Text>
//             </TouchableOpacity>
//           )}

//           {isLastQuestion && (
//             <TouchableOpacity
//               style={[
//                 styles.submitButton,
//                 currentQuestion === 1 && styles.submitButtonFull,
//               ]}
//               onPress={handleSubmit}
//               disabled={isLoading}>
//               {isLoading ? (
//                 <ActivityIndicator color={colors.white} />
//               ) : (
//                 <Text style={styles.submitButtonText}>Submit</Text>
//               )}
//             </TouchableOpacity>
//           )}
//         </View>

//         <TouchableOpacity
//           style={styles.completeLaterButton}
//           onPress={handleCompleteLater}
//           disabled={isLoading}>
//           <Text style={styles.completeLaterText}>Complete Later</Text>
//         </TouchableOpacity>
//       </View>
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
//     paddingVertical: 16,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: colors.textPrimary,
//     fontFamily: 'Poppins_600SemiBold',
//     flex: 1,
//     textAlign: 'center',
//     marginLeft: -40,
//   },
//   skipText: {
//     fontSize: 16,
//     color: colors.primaryDark,
//     fontFamily: 'Poppins_500Medium',
//   },
//   progressContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     marginBottom: 8,
//   },
//   progressText: {
//     fontSize: 13,
//     color: colors.textSecondary,
//     fontFamily: 'Poppins_400Regular',
//   },
//   progressPercentage: {
//     fontSize: 13,
//     color: colors.textSecondary,
//     fontFamily: 'Poppins_600SemiBold',
//   },
//   progressBarBackground: {
//     height: 6,
//     backgroundColor: '#E5E7EB',
//     marginHorizontal: 16,
//     borderRadius: 3,
//     overflow: 'hidden',
//   },
//   progressBarFill: {
//     height: '100%',
//     backgroundColor: colors.primaryDark,
//     borderRadius: 3,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     padding: 16,
//     paddingBottom: 40,
//   },
//   questionNumber: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: colors.textPrimary,
//     fontFamily: 'Poppins_600SemiBold',
//     marginBottom: 8,
//   },
//   questionText: {
//     fontSize: 16,
//     color: colors.textPrimary,
//     fontFamily: 'Poppins_400Regular',
//     lineHeight: 24,
//     marginBottom: 24,
//   },
//   optionsContainer: {
//     gap: 12,
//   },
//   optionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: colors.white,
//     padding: 16,
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: 'transparent',
//   },
//   optionButtonSelected: {
//     backgroundColor: '#E3F2FD',
//     borderColor: colors.primaryDark,
//   },
//   checkbox: {
//     width: 20,
//     height: 20,
//     borderRadius: 4,
//     borderWidth: 2,
//     borderColor: '#D1D5DB',
//     marginRight: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   checkboxSelected: {
//     backgroundColor: colors.primaryDark,
//     borderColor: colors.primaryDark,
//   },
//   optionText: {
//     flex: 1,
//     fontSize: 15,
//     color: colors.textPrimary,
//     fontFamily: 'Poppins_400Regular',
//   },
//   optionTextSelected: {
//     color: colors.primaryDark,
//     fontWeight: '500',
//     fontFamily: 'Poppins_500Medium',
//   },
//   detailInput: {
//     backgroundColor: colors.white,
//     borderRadius: 12,
//     padding: 16,
//     fontSize: 15,
//     color: colors.textPrimary,
//     fontFamily: 'Poppins_400Regular',
//     minHeight: 120,
//     marginTop: 16,
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//   },
//   bottomContainer: {
//     padding: 16,
//     backgroundColor: colors.background,
//     borderTopWidth: 1,
//     borderTopColor: '#E5E7EB',
//   },
//   buttonRow: {
//     flexDirection: 'row',
//     gap: 12,
//     marginBottom: 12,
//   },
//   previousButton: {
//     flex: 1,
//     backgroundColor: colors.white,
//     paddingVertical: 14,
//     borderRadius: 12,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//   },
//   previousButtonText: {
//     fontSize: 16,
//     color: colors.textPrimary,
//     fontFamily: 'Poppins_600SemiBold',
//   },
//   nextButton: {
//     flex: 1,
//     backgroundColor: colors.primaryDark,
//     paddingVertical: 14,
//     borderRadius: 12,
//     alignItems: 'center',
//   },
//   nextButtonFull: {
//     flex: 1,
//   },
//   nextButtonText: {
//     fontSize: 16,
//     color: colors.white,
//     fontFamily: 'Poppins_600SemiBold',
//   },
//   submitButton: {
//     flex: 1,
//     backgroundColor: colors.primaryDark,
//     paddingVertical: 14,
//     borderRadius: 12,
//     alignItems: 'center',
//   },
//   submitButtonFull: {
//     flex: 1,
//   },
//   submitButtonText: {
//     fontSize: 16,
//     color: colors.white,
//     fontFamily: 'Poppins_600SemiBold',
//   },
//   completeLaterButton: {
//     paddingVertical: 14,
//     alignItems: 'center',
//   },
//   completeLaterText: {
//     fontSize: 16,
//     color: colors.primaryDark,
//     fontFamily: 'Poppins_600SemiBold',
//   },
// });

// export default EyeHealthAssessmentScreen;
