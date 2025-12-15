// FILE: src/screens/exercise/ClockSweepScreen.jsx
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

const colors = {
  background: '#1a1a2e',
  textPrimary: '#ffffff',
  textSecondary: '#b8c5d1',
  fixationDot: '#ffffff',
  target: '#FF6B6B',
  primary: '#4A90E2',
  modalOverlay: 'rgba(0, 0, 0, 0.8)',
};

const TARGET_SIZE = 36;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const HEADER_HEIGHT = 120;
const GAME_WIDTH = SCREEN_WIDTH;
const GAME_HEIGHT = SCREEN_HEIGHT - HEADER_HEIGHT;
const CENTER_X = GAME_WIDTH / 2;
const CENTER_Y = GAME_HEIGHT / 2;
const RADIUS = Math.min(GAME_WIDTH, GAME_HEIGHT) * 0.35;

const ClockSweepScreen = ({ navigation }) => {
  const [clockPosition, setClockPosition] = useState(0);
  const [targetStyle, setTargetStyle] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const sessionTimerRef = useRef(null);

  useEffect(() => {
    const angle = (clockPosition * 30 - 90) * (Math.PI / 180);
    const x = CENTER_X + RADIUS * Math.cos(angle) - TARGET_SIZE / 2;
    const y = CENTER_Y + RADIUS * Math.sin(angle) - TARGET_SIZE / 2;

    setTargetStyle({ top: y, left: x });

    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.2, duration: 300, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, [clockPosition, scaleAnim]);

  useEffect(() => {
    // session timer (60s here)
    sessionTimerRef.current = setTimeout(() => {
      setIsModalVisible(true);
    }, 60000);

    return () => {
      if (sessionTimerRef.current) clearTimeout(sessionTimerRef.current);
    };
  }, []);

  const handleTargetPress = () => {
    Animated.timing(scaleAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
      setClockPosition((prev) => (prev + 1) % 12);
      // restore scale to 1 for next pulse (small safety)
      scaleAnim.setValue(1);
    });
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessible={true}>
          <View>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </View>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Clock Sweep</Text>

        <View style={{ width: 40 }} />
      </View>

      <Text style={styles.instructions}>
        Follow and tap the red targets as they appear around the clock face.
      </Text>

      <View style={styles.gameArea}>
        <View style={styles.fixationDot} />

        <Animated.View
          style={[styles.clockTarget, targetStyle, { transform: [{ scale: scaleAnim }] }]}>
          {/* Give TouchableOpacity a child element to avoid any platform transform oddities */}
          <TouchableOpacity
            style={styles.touchableTarget}
            onPress={handleTargetPress}
            activeOpacity={1}
            accessibilityRole="button"
            accessible={true}
            accessibilityLabel={`clock-target-${clockPosition}`}>
            <View style={{ flex: 1 }} />
          </TouchableOpacity>
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
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleModalClose}
              accessibilityRole="button">
              <Text style={styles.modalButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerTitle: { fontSize: 18, fontWeight: '600', color: colors.textPrimary },
  instructions: {
    color: colors.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
    lineHeight: 22,
  },
  gameArea: { flex: 1, position: 'relative', overflow: 'hidden' },
  fixationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.fixationDot,
    position: 'absolute',
    top: CENTER_Y - 6,
    left: CENTER_X - 6,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
    zIndex: 10,
  },
  clockTarget: {
    width: TARGET_SIZE,
    height: TARGET_SIZE,
    borderRadius: TARGET_SIZE / 2,
    backgroundColor: colors.target,
    position: 'absolute',
    borderWidth: 4,
    borderColor: 'rgba(255,107,107,0.6)',
    shadowColor: colors.target,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 5,
  },
  touchableTarget: { width: '100%', height: '100%' },
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
    borderColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
  },
  modalTitle: { fontSize: 22, fontWeight: '600', color: colors.primary, marginBottom: 12 },
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
  modalButtonText: { fontSize: 16, fontWeight: '500', color: colors.textPrimary },
});

export default ClockSweepScreen;
