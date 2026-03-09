import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "../../services/apiClient.js";

export const fetchQuizzes = createAsyncThunk("quizzes/fetchAll", async (_, { getState }) => {
  const token = getState().auth.token;
  const response = await apiRequest({ path: "/quizzes", token });
  return response.data;
});

export const fetchQuizById = createAsyncThunk("quizzes/fetchById", async (quizId, { getState }) => {
  const token = getState().auth.token;
  const response = await apiRequest({ path: `/quizzes/${quizId}`, token });
  return response.data;
});

export const fetchQuestionsByQuiz = createAsyncThunk(
  "quizzes/fetchQuestionsByQuiz",
  async (quizId, { getState }) => {
    const token = getState().auth.token;
    const response = await apiRequest({ path: `/quizzes/${quizId}/questions`, token });
    return response.data;
  }
);

export const submitQuiz = createAsyncThunk("quizzes/submit", async ({ quizId, answers }, { getState }) => {
  const token = getState().auth.token;
  const response = await apiRequest({
    path: `/quizzes/${quizId}/submit`,
    method: "POST",
    token,
    body: { answers },
  });
  return response.data;
});

export const createQuiz = createAsyncThunk("quizzes/create", async (payload, { getState, dispatch }) => {
  const token = getState().auth.token;
  await apiRequest({ path: "/quizzes", method: "POST", token, body: payload });
  await dispatch(fetchQuizzes());
});

export const updateQuiz = createAsyncThunk(
  "quizzes/update",
  async ({ quizId, payload }, { getState, dispatch }) => {
    const token = getState().auth.token;
    await apiRequest({ path: `/quizzes/${quizId}`, method: "PUT", token, body: payload });
    await dispatch(fetchQuizzes());
  }
);

export const deleteQuiz = createAsyncThunk("quizzes/delete", async (quizId, { getState, dispatch }) => {
  const token = getState().auth.token;
  await apiRequest({ path: `/quizzes/${quizId}`, method: "DELETE", token });
  await dispatch(fetchQuizzes());
});

export const createQuestion = createAsyncThunk(
  "quizzes/createQuestion",
  async ({ quizId, payload }, { getState, dispatch }) => {
    const token = getState().auth.token;
    await apiRequest({ path: `/quizzes/${quizId}/questions`, method: "POST", token, body: payload });
    await dispatch(fetchQuestionsByQuiz(quizId));
  }
);

export const updateQuestion = createAsyncThunk(
  "quizzes/updateQuestion",
  async ({ questionId, quizId, payload }, { getState, dispatch }) => {
    const token = getState().auth.token;
    await apiRequest({ path: `/questions/${questionId}`, method: "PUT", token, body: payload });
    await dispatch(fetchQuestionsByQuiz(quizId));
  }
);

export const deleteQuestion = createAsyncThunk(
  "quizzes/deleteQuestion",
  async ({ questionId, quizId }, { getState, dispatch }) => {
    const token = getState().auth.token;
    await apiRequest({ path: `/questions/${questionId}`, method: "DELETE", token });
    await dispatch(fetchQuestionsByQuiz(quizId));
  }
);

const quizSlice = createSlice({
  name: "quizzes",
  initialState: {
    list: [],
    selectedQuiz: null,
    questions: [],
    submissionResult: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearQuizError: (state) => {
      state.error = null;
    },
    clearSubmission: (state) => {
      state.submissionResult = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchQuizById.fulfilled, (state, action) => {
        state.selectedQuiz = action.payload;
      })
      .addCase(fetchQuestionsByQuiz.fulfilled, (state, action) => {
        state.questions = action.payload;
      })
      .addCase(submitQuiz.fulfilled, (state, action) => {
        state.submissionResult = action.payload;
      })
      .addMatcher(
        (action) => action.type.startsWith("quizzes/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.error = action.error.message;
          state.loading = false;
        }
      );
  },
});

export const { clearQuizError, clearSubmission } = quizSlice.actions;
export default quizSlice.reducer;