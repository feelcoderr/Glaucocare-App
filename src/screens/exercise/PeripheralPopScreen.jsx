// FILE: src/screens/exercise/PeripheralPopScreen.jsx
// Eye Exercise: Peripheral Pop (with 30-second Modal)
// ============================================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal, // 1. Import Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// Define colors
const colors = {
  background: '#1a1a2e',
  textPrimary: '#ffffff',
  textSecondary: '#b8c5d1',
  primary: '#4CAF50', // Active green
  fixationDot: '#ffffff',
  stimulusDot: '#FFD700', // Yellow
  modalOverlay: 'rgba(0, 0, 0, 0.7)',
};

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * A single dot component. It handles its own self-destruction timer.
 */
const StimulusDot = React.memo(({ id, style, onRemove }) => {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(id), 3500);
    return () => clearTimeout(timer);
  }, [id, onRemove]);

  return (
    <TouchableOpacity
      style={[styles.stimulusDot, style]}
      onPress={() => onRemove(id)}
      activeOpacity={0.7}
    />
  );
});

const PeripheralPopScreen = ({ navigation }) => {
  const [dots, setDots] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false); // 2. Add modal state
  const dotIdCounter = useRef(0);
  const intervalRef = useRef(null);
  const sessionTimerRef = useRef(null); // Timer for the 30-second session

  const lastRestReminder = useRef(Date.now());
  // Function to remove a dot by its ID
  const removeDot = useCallback((id) => {
    setDots((prevDots) => prevDots.filter((dot) => dot.id !== id));
  }, []);

  // Function to create a new dot
  const createPeripheralDot = () => {
    const newId = dotIdCounter.current++;
    const margin = 30;
    const dotSize = 24;
    let pos = {};
    const edge = Math.floor(Math.random() * 4);

    switch (edge) {
      case 0: // Top
        pos = { top: margin, left: Math.random() * (SCREEN_WIDTH - margin * 2) + margin };
        break;
      case 1: // Right
        pos = {
          top: Math.random() * (SCREEN_HEIGHT - margin * 2) + margin,
          left: SCREEN_WIDTH - margin - dotSize,
        };
        break;
      case 2: // Bottom
        pos = {
          top: SCREEN_HEIGHT - margin - dotSize - 150,
          left: Math.random() * (SCREEN_WIDTH - margin * 2) + margin,
        };
        break;
      case 3: // Left
        pos = { top: Math.random() * (SCREEN_HEIGHT - margin * 2) + margin, left: margin };
        break;
    }
    setDots((prevDots) => [...prevDots, { id: newId, style: pos }]);
  };

  // Start/Stop the exercise and session timer
  useEffect(() => {
    // Start dot creation interval
    intervalRef.current = setInterval(createPeripheralDot, 2500);

    // 3. Start 30-second session timer
    sessionTimerRef.current = setTimeout(() => {
      setIsModalVisible(true); // Show modal after 30s
      if (intervalRef.current) {
        clearInterval(intervalRef.current); // Stop the game
      }
    }, 60000); // 30 seconds

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (sessionTimerRef.current) {
        clearTimeout(sessionTimerRef.current);
      }
    };
  }, []);

  // 4. Handle closing the modal
  const handleModalClose = () => {
    setIsModalVisible(false);
    navigation.goBack(); // Go back to exercises list
  };

  // Rest reminder effect
  useEffect(() => {
    const checkRest = () => {
      const now = Date.now();
      if (now - lastRestReminder.current > 5 * 60 * 1000) {
        // 5 minutes
        Alert.alert(
          'Time for a Break',
          "You've been practicing for a while. Take a moment to rest your eyes by looking at something far away for 20 seconds.",
          [{ text: 'OK' }]
        );
        lastRestReminder.current = now;
      }
    };

    const restInterval = setInterval(checkRest, 60000); // Check every minute
    return () => clearInterval(restInterval);
  }, []);
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Peripheral Pop</Text>
        <View style={{ width: 40 }} />
      </View>

      <Text style={styles.instructions}>
        Keep your eyes on the center dot and tap the yellow dots when they appear.
      </Text>

      <View style={styles.gameArea}>
        <View style={styles.fixationDot} />
        {dots.map((dot) => (
          <StimulusDot key={dot.id} id={dot.id} style={dot.style} onRemove={removeDot} />
        ))}
      </View>

      {/* 5. Add the Modal component */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleModalClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Awesome Focus!</Text>
            <Text style={styles.modalMessage}>
              You have completed a full 1 min session. Great work on your peripheral vision!
            </Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleModalClose}>
              <Text style={styles.modalButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// 6. Add Modal Styles
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
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  instructions: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
    lineHeight: 22,
  },
  gameArea: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  fixationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.fixationDot,
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -6 }, { translateY: -6 }],
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  stimulusDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.stimulusDot,
    position: 'absolute',
    borderWidth: 3,
    borderColor: 'rgba(255, 215, 0, 0.6)',
  },
  // --- Modal Styles ---
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.modalOverlay,
  },
  modalContent: {
    width: '80%',
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
});

export default PeripheralPopScreen;
