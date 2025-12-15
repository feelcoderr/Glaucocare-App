// FILE: src/screens/settings/HelpFAQScreen.jsx
// Help & FAQ Screen
// ============================================================================

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';

const HelpFAQScreen = ({ navigation }) => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const faqData = [
    {
      category: 'Account & Profile',
      questions: [
        {
          question: 'How do I update my personal information?',
          answer:
            'You can update your name, phone number, date of birth, or gender by going to Settings > Account Settings > Profile Information.',
        },
        {
          question: 'Can I change my email or phone number after signing up?',
          answer:
            'No, you can not change email or phone number from App. For email or mobile number change you can contact us on Support because some changes may require re-verification.',
        },
        {
          question: 'Is my medical data private and secure?',
          answer:
            'Absolutely. Your data is encrypted and stored securely. We comply with data privacy standards to protect your data.',
        },
      ],
    },
    {
      category: 'Documents',
      questions: [
        {
          question: 'How do I upload my documents?',
          answer:
            'Go to Documents section, tap the + button, and select files from your device or take a photo of your document.',
        },
        {
          question: 'What file formats are supported?',
          answer: 'We support JPG, PNG, and JPEG formats. Maximum file size is 10MB per document.',
        },
      ],
    },
    {
      category: 'Reminders',
      questions: [
        {
          question: 'How do I set medication reminders?',
          answer:
            'Go to Medications section, add your medication, and set reminder times. You will receive notifications at the scheduled times.',
        },
      ],
    },
    {
      category: 'Glaucoma Awareness',
      questions: [
        {
          question: 'What is glaucoma?',
          answer:
            'Glaucoma is a group of eye conditions that damage the optic nerve, often caused by abnormally high pressure in your eye.',
        },
        {
          question: 'How can I prevent vision loss?',
          answer:
            'Regular eye checkups, early detection, proper medication adherence, and healthy lifestyle choices can help prevent vision loss.',
        },
      ],
    },
    {
      category: 'Support & General',
      questions: [
        {
          question: 'How do I contact support?',
          answer:
            'Go to Settings > Support > Contact Support. You can email us or call our support team Monday-Saturday, 9AM-6PM.',
        },
      ],
    },
  ];

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
    setExpandedQuestion(null);
  };

  const toggleQuestion = (question) => {
    setExpandedQuestion(expandedQuestion === question ? null : question);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FAQs</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {faqData.map((category, categoryIndex) => (
          <View key={categoryIndex} style={styles.categoryContainer}>
            <TouchableOpacity
              style={styles.categoryHeader}
              onPress={() => toggleCategory(category.category)}
              activeOpacity={0.7}>
              <Text style={styles.categoryTitle}>{category.category}</Text>
              <Ionicons
                name={expandedCategory === category.category ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={colors.textPrimary}
              />
            </TouchableOpacity>

            {expandedCategory === category.category && (
              <View style={styles.questionsContainer}>
                {category.questions.map((item, questionIndex) => (
                  <View key={questionIndex} style={styles.questionContainer}>
                    <TouchableOpacity
                      style={styles.questionHeader}
                      onPress={() => toggleQuestion(item.question)}
                      activeOpacity={0.7}>
                      <Text style={styles.questionBullet}>•</Text>
                      <Text style={styles.questionText}>{item.question}</Text>
                    </TouchableOpacity>

                    {expandedQuestion === item.question && (
                      <Text style={styles.answerText}>{item.answer}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}

        <View style={{ height: 40 }} />
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
  scrollView: {
    flex: 1,
  },
  categoryContainer: {
    marginBottom: 8,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
  },
  questionsContainer: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  questionContainer: {
    marginBottom: 12,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  questionBullet: {
    fontSize: 20,
    color: colors.textPrimary,
    marginRight: 8,
    marginTop: -4,
  },
  questionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    fontFamily: 'Poppins_500Medium',
    lineHeight: 20,
  },
  answerText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
    lineHeight: 20,
    marginLeft: 20,
    marginTop: 4,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#E3F2FD',
  },
});

export default HelpFAQScreen;
