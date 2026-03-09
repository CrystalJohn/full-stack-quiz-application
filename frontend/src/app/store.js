import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import quizReducer from "../features/quizzes/quizSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    quizzes: quizReducer,
  },
});