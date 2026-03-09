import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "../../services/apiClient.js";

const storageKey = "quiz_auth";

const readAuth = () => {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? JSON.parse(raw) : { token: null, user: null };
  } catch {
    return { token: null, user: null };
  }
};

const persistAuth = (token, user) => {
  if (!token || !user) {
    localStorage.removeItem(storageKey);
    return;
  }
  localStorage.setItem(storageKey, JSON.stringify({ token, user }));
};

const bootstrap = readAuth();

export const loginUser = createAsyncThunk("auth/login", async (credentials) => {
  const response = await apiRequest({ path: "/auth/login", method: "POST", body: credentials });
  return response.data;
});

export const registerUser = createAsyncThunk("auth/register", async (payload) => {
  const response = await apiRequest({ path: "/auth/signup", method: "POST", body: payload });
  return response.data;
});

export const fetchMe = createAsyncThunk("auth/me", async (_, { getState }) => {
  const token = getState().auth.token;
  const response = await apiRequest({ path: "/auth/me", token });
  return response.data;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: bootstrap.token,
    user: bootstrap.user,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.error = null;
      persistAuth(null, null);
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        persistAuth(state.token, state.user);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        persistAuth(state.token, state.user);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
        persistAuth(state.token, state.user);
      })
      .addCase(fetchMe.rejected, (state) => {
        state.token = null;
        state.user = null;
        persistAuth(null, null);
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;