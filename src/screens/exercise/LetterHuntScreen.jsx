// FILE: src/screens/exercise/LetterHuntScreen.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const colors = {
  background: '#1a1a2e',
  textPrimary: '#ffffff',
  textSecondary: '#b8c5d1',
  primary: '#4CAF50',
  cellBg: 'rgba(255, 255, 255, 0.08)',
  cellBorder: 'rgba(255, 255, 255, 0.15)',
  modalOverlay: 'rgba(0, 0, 0, 0.7)',
};

const GRID_SIZE = 36; // 6x6 grid
const TARGET_LETTERS = ['C', 'O', 'G', 'Q', 'P', 'R'];
const DISTRACTORS = ['B', 'D', 'H', 'K', 'N', 'W'];
const MIN_TARGETS = 3;
const MAX_TARGETS = 6;

const LetterHuntScreen = ({ navigation }) => {
  const [grid, setGrid] = useState([]);
  const [targetLetter, setTargetLetter] = useState('');
  const [targetCount, setTargetCount] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const generateNewGrid = useCallback(() => {
    const newTargetLetter = TARGET_LETTERS[Math.floor(Math.random() * TARGET_LETTERS.length)];
    const newGrid = [];
    let newTargetCount = 0;

    const targetIndices = new Set();
    const numTargets = Math.floor(Math.random() * (MAX_TARGETS - MIN_TARGETS + 1)) + MIN_TARGETS;
    while (targetIndices.size < numTargets) {
      targetIndices.add(Math.floor(Math.random() * GRID_SIZE));
    }

    for (let i = 0; i < GRID_SIZE; i++) {
      const isTarget = targetIndices.has(i);
      let letter = '';
      if (isTarget) {
        letter = newTargetLetter;
        newTargetCount++;
      } else {
        letter = DISTRACTORS[Math.floor(Math.random() * DISTRACTORS.length)];
      }

      newGrid.push({
        id: i,
        letter: String(letter || ''), // ensure a string
        isFound: false,
      });
    }

    setTargetLetter(String(newTargetLetter || ''));
    setGrid(newGrid);
    setTargetCount(newTargetCount);
  }, []);

  useEffect(() => {
    generateNewGrid();
  }, [generateNewGrid]);

  const handleCellPress = (id) => {
    const newGrid = grid.map((cell) => {
      if (cell.id === id && cell.letter === targetLetter && !cell.isFound) {
        return { ...cell, isFound: true };
      }
      return cell;
    });

    setGrid(newGrid);

    const foundCount = newGrid.filter((c) => c.isFound).length;
    if (foundCount === targetCount) {
      setIsModalVisible(true);
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    generateNewGrid();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessible={true}>
          {/* wrap icon inside a View to guarantee element child */}
          <View>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </View>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Letter Hunt</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Target Display */}
      <View style={styles.searchHeader}>
        <Text style={styles.searchInstruction}>Find this letter:</Text>
        <Text style={styles.targetDisplay}>{targetLetter || '-'}</Text>
      </View>

      {/* Letter Grid */}
      <View style={styles.letterGrid}>
        {grid.map((cell) => (
          <TouchableOpacity
            key={String(cell.id)}
            style={[styles.letterCell, cell.isFound && styles.cellCorrect]}
            onPress={() => handleCellPress(cell.id)}
            disabled={cell.isFound}
            accessibilityRole="button"
            accessible={true}
            accessibilityLabel={`letter-cell-${cell.id}`}>
            {/* ensure Text child always present */}
            <Text style={styles.letterText}>{String(cell.letter)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Completion Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleModalClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Great Job!</Text>
            <Text style={styles.modalMessage}>
              {"You found all the letters. Let's try a new grid!"}
            </Text>
            <TouchableOpacity style={styles.modalButton} onPress={handleModalClose}>
              <Text style={styles.modalButtonText}>Next Grid</Text>
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
  searchHeader: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  searchInstruction: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  targetDisplay: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
    textShadowColor: 'rgba(76, 175, 80, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  letterGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignContent: 'center',
    padding: 20,
  },
  letterCell: {
    width: '15%',
    aspectRatio: 1,
    margin: '0.8%',
    backgroundColor: colors.cellBg,
    borderColor: colors.cellBorder,
    borderWidth: 2,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellCorrect: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  letterText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
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

export default LetterHuntScreen;

// // FILE: src/screens/exercise/LetterHuntScreen.jsx
// // Eye Exercise: Letter Hunt (with Custom Modal)
// // ============================================================================

// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Modal, // 1. Import Modal
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { Ionicons } from '@expo/vector-icons';

// // We'll define colors based on the HTML file
// const colors = {
//   background: '#1a1a2e',
//   textPrimary: '#ffffff',
//   textSecondary: '#b8c5d1',
//   primary: '#4CAF50', // Active green
//   cellBg: 'rgba(255, 255, 255, 0.08)',
//   cellBorder: 'rgba(255, 255, 255, 0.15)',
//   modalOverlay: 'rgba(0, 0, 0, 0.7)', // Semi-transparent overlay
// };

// const GRID_SIZE = 36; // 6x6 grid
// const TARGET_LETTERS = ['C', 'O', 'G', 'Q', 'P', 'R'];
// const DISTRACTORS = ['B', 'D', 'H', 'K', 'N', 'W'];
// const MIN_TARGETS = 3;
// const MAX_TARGETS = 6;

// const LetterHuntScreen = ({ navigation }) => {
//   const [grid, setGrid] = useState([]);
//   const [targetLetter, setTargetLetter] = useState('');
//   const [targetCount, setTargetCount] = useState(0);
//   const [isModalVisible, setIsModalVisible] = useState(false); // 2. Add modal state

//   // Function to generate a new game grid
//   const generateNewGrid = useCallback(() => {
//     const newTargetLetter = TARGET_LETTERS[Math.floor(Math.random() * TARGET_LETTERS.length)];
//     const newGrid = [];
//     let newTargetCount = 0;

//     // Create an array of target indices
//     const targetIndices = new Set();
//     const numTargets = Math.floor(Math.random() * (MAX_TARGETS - MIN_TARGETS + 1)) + MIN_TARGETS;
//     while (targetIndices.size < numTargets) {
//       targetIndices.add(Math.floor(Math.random() * GRID_SIZE));
//     }

//     for (let i = 0; i < GRID_SIZE; i++) {
//       const isTarget = targetIndices.has(i);
//       let letter = '';
//       if (isTarget) {
//         letter = newTargetLetter;
//         newTargetCount++;
//       } else {
//         letter = DISTRACTORS[Math.floor(Math.random() * DISTRACTORS.length)];
//       }

//       newGrid.push({
//         id: i,
//         letter: letter,
//         isFound: false,
//       });
//     }

//     setTargetLetter(newTargetLetter);
//     setGrid(newGrid);
//     setTargetCount(newTargetCount);
//   }, []);

//   // Generate grid on mount
//   useEffect(() => {
//     generateNewGrid();
//   }, [generateNewGrid]);

//   const handleCellPress = (id) => {
//     const newGrid = grid.map((cell) => {
//       if (cell.id === id && cell.letter === targetLetter && !cell.isFound) {
//         return { ...cell, isFound: true };
//       }
//       return cell;
//     });

//     setGrid(newGrid);

//     // Check for win
//     const foundCount = newGrid.filter((c) => c.isFound).length;
//     if (foundCount === targetCount) {
//       // 3. Instead of Alert, show the modal
//       setIsModalVisible(true);
//     }
//   };

//   // 4. Handle closing the modal and starting the next round
//   const handleModalClose = () => {
//     setIsModalVisible(false);
//     generateNewGrid();
//   };

//   return (
//     <SafeAreaView style={styles.container} edges={['top']}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Letter Hunt</Text>
//         <View style={{ width: 40 }} /> {/* Spacer */}
//       </View>

//       {/* Target Display */}
//       <View style={styles.searchHeader}>
//         <Text style={styles.searchInstruction}>Find this letter:</Text>
//         <Text style={styles.targetDisplay}>{targetLetter}</Text>
//       </View>

//       {/* Letter Grid */}
//       <View style={styles.letterGrid}>
//         {grid.map((cell) => (
//           <TouchableOpacity
//             key={cell.id}
//             style={[styles.letterCell, cell.isFound && styles.cellCorrect]}
//             onPress={() => handleCellPress(cell.id)}
//             disabled={cell.isFound}>
//             <Text style={styles.letterText}>{cell.letter}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* 5. Add the Modal component */}
//       <Modal
//         visible={isModalVisible}
//         transparent={true}
//         animationType="fade"
//         onRequestClose={handleModalClose}>
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Great Job!</Text>
//             <Text style={styles.modalMessage}>
//               You found all the letters. Let`s try a new grid!
//             </Text>
//             <TouchableOpacity style={styles.modalButton} onPress={handleModalClose}>
//               <Text style={styles.modalButtonText}>Next Grid</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// // 6. Add Modal Styles
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
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(255, 255, 255, 0.1)',
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: colors.textPrimary,
//   },
//   searchHeader: {
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: 'rgba(0, 0, 0, 0.3)',
//   },
//   searchInstruction: {
//     fontSize: 16,
//     color: colors.textSecondary,
//   },
//   targetDisplay: {
//     fontSize: 48,
//     fontWeight: 'bold',
//     color: colors.primary,
//     textShadowColor: 'rgba(76, 175, 80, 0.5)',
//     textShadowOffset: { width: 0, height: 0 },
//     textShadowRadius: 20,
//   },
//   letterGrid: {
//     flex: 1,
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//     alignContent: 'center',
//     padding: 20,
//   },
//   letterCell: {
//     width: '15%',
//     aspectRatio: 1,
//     margin: '0.8%',
//     backgroundColor: colors.cellBg,
//     borderColor: colors.cellBorder,
//     borderWidth: 2,
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   cellCorrect: {
//     backgroundColor: colors.primary,
//     borderColor: colors.primary,
//   },
//   letterText: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: colors.textPrimary,
//   },

//   // --- Modal Styles ---
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: colors.modalOverlay,
//   },
//   modalContent: {
//     width: '80%',
//     backgroundColor: colors.background,
//     borderRadius: 16,
//     padding: 24,
//     alignItems: 'center',
//     borderColor: 'rgba(255, 255, 255, 0.2)',
//     borderWidth: 1,
//   },
//   modalTitle: {
//     fontSize: 22,
//     fontWeight: '600',
//     color: colors.primary,
//     marginBottom: 12,
//   },
//   modalMessage: {
//     fontSize: 16,
//     color: colors.textSecondary,
//     textAlign: 'center',
//     marginBottom: 24,
//     lineHeight: 22,
//   },
//   modalButton: {
//     backgroundColor: colors.primary,
//     paddingVertical: 12,
//     paddingHorizontal: 40,
//     borderRadius: 10,
//   },
//   modalButtonText: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: colors.textPrimary,
//   },
// });

// export default LetterHuntScreen;
