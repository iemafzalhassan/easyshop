import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  currentUser: null,
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },
    setCurrentUser: (state, action: PayloadAction<User | null>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    removeCurrentUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setAuthenticated,
  setCurrentUser,
  removeCurrentUser,
  setLoading,
  setError,
} = authSlice.actions;

export default authSlice.reducer;
