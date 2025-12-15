// FILE: src/store/slices/assessmentSlice.js
// Assessment Redux Slice
// ============================================================================

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { assessmentApi } from '../../services/api/assessmentApi';
import { questionApi } from '../../services/api/questionApi';

// Load Questions
export const loadQuestions = createAsyncThunk(
  'assessment/loadQuestions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await questionApi.getActiveQuestions();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Submit Assessment
export const submitAssessment = createAsyncThunk(
  'assessment/submit',
  async (answers, { rejectWithValue }) => {
    try {
      const response = await assessmentApi.submitAssessment(answers);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchLatestResult = createAsyncThunk(
  'assessment/fetchLatestResult',
  async (_, { rejectWithValue }) => {
    try {
      const response = await assessmentApi.getLatestAssessment();
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null; // No assessment found
      }
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  currentQuestion: 1,
  answers: {},
  questions: [],
  isLoading: false,
  error: null,
  result: null,
  latestResult: null,
  hasCompletedAssessment: false,
  isCheckingPrevious: false,
};

const assessmentSlice = createSlice({
  name: 'assessment',
  initialState,
  reducers: {
    setCurrentQuestion: (state, action) => {
      state.currentQuestion = action.payload;
    },
    setAnswer: (state, action) => {
      const { questionId, answer } = action.payload;
      state.answers[questionId] = answer;
    },
    clearAnswers: (state) => {
      state.answers = {};
      state.currentQuestion = 1;
      state.result = null;
      state.error = null;
    },
    nextQuestion: (state) => {
      state.currentQuestion += 1;
    },
    previousQuestion: (state) => {
      if (state.currentQuestion > 1) {
        state.currentQuestion -= 1;
      }
    },
    startNewAssessment: (state) => {
      state.currentQuestion = 1;
      state.answers = {};
      state.result = null;
      state.error = null;
      state.hasCompletedAssessment = false;
    },
  },
  extraReducers: (builder) => {
    // Load Questions
    builder
      .addCase(loadQuestions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadQuestions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.questions = action.payload;
      })
      .addCase(loadQuestions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to load questions';
      });

    // Submit Assessment
    builder
      .addCase(submitAssessment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(submitAssessment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.result = action.payload;
      })
      .addCase(submitAssessment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to submit assessment';
      });
    builder
      .addCase(fetchLatestResult.pending, (state) => {
        state.isCheckingPrevious = true;
      })
      .addCase(fetchLatestResult.fulfilled, (state, action) => {
        state.isCheckingPrevious = false;
        if (action.payload) {
          state.latestResult = action.payload;
          state.hasCompletedAssessment = true;
        }
      })
      .addCase(fetchLatestResult.rejected, (state) => {
        state.isCheckingPrevious = false;
        state.hasCompletedAssessment = false;
      });
  },
});

export const {
  setCurrentQuestion,
  setAnswer,
  clearAnswers,
  nextQuestion,
  previousQuestion,
  startNewAssessment,
} = assessmentSlice.actions;

export default assessmentSlice.reducer;
// // FILE: src/store/slices/assessmentSlice.js
// // Assessment Redux Slice
// // ============================================================================

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { assessmentApi } from '../../services/api/assessmentApi';

// // Async Thunks
// export const submitAssessment = createAsyncThunk(
//   'assessment/submit',
//   async (answers, { rejectWithValue }) => {
//     try {
//       const response = await assessmentApi.submitAssessment(answers);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// export const saveDraftAssessment = createAsyncThunk(
//   'assessment/saveDraft',
//   async ({ answers, currentQuestion }, { rejectWithValue }) => {
//     try {
//       const response = await assessmentApi.saveDraft(answers, currentQuestion);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// export const fetchUserAssessments = createAsyncThunk(
//   'assessment/fetchHistory',
//   async ({ page, limit }, { rejectWithValue }) => {
//     try {
//       const response = await assessmentApi.getUserAssessments(page, limit);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// export const fetchLatestAssessment = createAsyncThunk(
//   'assessment/fetchLatest',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await assessmentApi.getLatestAssessment();
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// const initialState = {
//   currentQuestion: 1,
//   answers: {},
//   isLoading: false,
//   error: null,
//   result: null,
//   assessments: [],
//   latestAssessment: null,
//   pagination: null,
// };

// const assessmentSlice = createSlice({
//   name: 'assessment',
//   initialState,
//   reducers: {
//     setCurrentQuestion: (state, action) => {
//       state.currentQuestion = action.payload;
//     },
//     setAnswer: (state, action) => {
//       const { questionId, answer } = action.payload;
//       state.answers[questionId] = answer;
//     },
//     clearAnswers: (state) => {
//       state.answers = {};
//       state.currentQuestion = 1;
//       state.result = null;
//       state.error = null;
//     },
//     nextQuestion: (state) => {
//       state.currentQuestion += 1;
//     },
//     previousQuestion: (state) => {
//       if (state.currentQuestion > 1) {
//         state.currentQuestion -= 1;
//       }
//     },
//     clearError: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     // Submit Assessment
//     builder
//       .addCase(submitAssessment.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(submitAssessment.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.result = action.payload;
//       })
//       .addCase(submitAssessment.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload?.message || 'Failed to submit assessment';
//       });

//     // Save Draft
//     builder
//       .addCase(saveDraftAssessment.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(saveDraftAssessment.fulfilled, (state) => {
//         state.isLoading = false;
//       })
//       .addCase(saveDraftAssessment.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload?.message || 'Failed to save draft';
//       });

//     // Fetch Assessments
//     builder.addCase(fetchUserAssessments.fulfilled, (state, action) => {
//       state.assessments = action.payload.assessments;
//       state.pagination = action.payload.pagination;
//     });

//     // Fetch Latest
//     builder.addCase(fetchLatestAssessment.fulfilled, (state, action) => {
//       state.latestAssessment = action.payload;
//     });
//   },
// });

// export const {
//   setCurrentQuestion,
//   setAnswer,
//   clearAnswers,
//   nextQuestion,
//   previousQuestion,
//   clearError,
// } = assessmentSlice.actions;

// export default assessmentSlice.reducer;
