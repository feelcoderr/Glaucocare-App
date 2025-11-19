// FILE: src/screens/exercise/ClockSweepScreen.jsx
// Eye Exercise: Clock Sweep
// ============================================================================

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// We'll define colors based on the HTML file
const colors = {
  background: '#1a1a2e',
  textPrimary: '#ffffff',
  textSecondary: '#b8c5d1',
  fixationDot: '#ffffff',
  target: '#FF6B6B', // Red target
};

const TARGET_SIZE = 36;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const HEADER_HEIGHT = 120; // Approx height of header + instructions

// Center of the game area
const GAME_WIDTH = SCREEN_WIDTH;
const GAME_HEIGHT = SCREEN_HEIGHT - HEADER_HEIGHT;
const CENTER_X = GAME_WIDTH / 2;
const CENTER_Y = GAME_HEIGHT / 2;
const RADIUS = Math.min(GAME_WIDTH, GAME_HEIGHT) * 0.35;

const ClockSweepScreen = ({ navigation }) => {
  const [clockPosition, setClockPosition] = useState(0); // 0 to 11
  const [targetStyle, setTargetStyle] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const sessionTimerRef = useRef(null);
  // Calculate target position when clockPosition changes
  useEffect(() => {
    // Angle in radians. (0 = 12 o'clock, 1 = 1 o'clock)
    // -90 degrees offset because 0-degrees is 'East' in trig
    const angle = (clockPosition * 30 - 90) * (Math.PI / 180);

    const x = CENTER_X + RADIUS * Math.cos(angle) - TARGET_SIZE / 2;
    const y = CENTER_Y + RADIUS * Math.sin(angle) - TARGET_SIZE / 2;

    setTargetStyle({
      top: y,
      left: x,
    });

    // Pulse animation
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.2, duration: 300, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [clockPosition]);
  // 3. Start 30-second session timer on mount
  useEffect(() => {
    sessionTimerRef.current = setTimeout(() => {
      setIsModalVisible(true); // Show modal after 30s
    }, 60000); // 30 seconds

    // Cleanup on unmount
    return () => {
      if (sessionTimerRef.current) {
        clearTimeout(sessionTimerRef.current);
      }
    };
  }, []); // Empty dependency array ensures this runs only once
  const handleTargetPress = () => {
    // Animate tap
    Animated.timing(scaleAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
      // Move to next position
      setClockPosition((prevPos) => (prevPos + 1) % 12);
    });
  };
  const handleModalClose = () => {
    setIsModalVisible(false);
    navigation.goBack(); // Go back to exercises list
  };
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Clock Sweep</Text>
        <View style={{ width: 40 }} /> {/* Spacer */}
      </View>

      {/* Instructions */}
      <Text style={styles.instructions}>
        Follow and tap the red targets as they appear around the clock face.
      </Text>

      {/* Game Area */}
      <View style={styles.gameArea}>
        {/* Fixation Dot */}
        <View style={styles.fixationDot} />

        {/* Clock Target */}
        <Animated.View
          style={[styles.clockTarget, targetStyle, { transform: [{ scale: scaleAnim }] }]}>
          <TouchableOpacity
            style={styles.touchableTarget}
            onPress={handleTargetPress}
            activeOpacity={1}
          />
        </Animated.View>
      </View>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleModalClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Well Done!</Text>
            <Text style={styles.modalMessage}>
              You finished your 1 min sweep exercise. Keep it up!
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
    top: CENTER_Y - 6,
    left: CENTER_X - 6,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    zIndex: 10,
  },
  clockTarget: {
    width: TARGET_SIZE,
    height: TARGET_SIZE,
    borderRadius: TARGET_SIZE / 2,
    backgroundColor: colors.target,
    position: 'absolute',
    borderWidth: 4,
    borderColor: 'rgba(255, 107, 107, 0.6)',
    shadowColor: colors.target,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 5,
  },
  touchableTarget: {
    width: '100%',
    height: '100%',
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

export default ClockSweepScreen;
