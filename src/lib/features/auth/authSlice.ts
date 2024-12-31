import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
export type User = {
  id: number;
  name: string;
  email: string;
};

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
}

// Define the initial state using that type
const initialState: AuthState = {
  isAuthenticated: false,
  currentUser:
    (typeof window !== "undefined" &&
      JSON.parse(localStorage.getItem("currentUser") as string)) ||
    null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },

    removeCurrentUser: (state) => {
      state.currentUser = null;
    },

    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      localStorage.setItem("currentUser", JSON.stringify(state.currentUser));
    },
  },
});

export const { setAuthenticated, removeCurrentUser, setCurrentUser } =
  authSlice.actions;
export default authSlice.reducer;
