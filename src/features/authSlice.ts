import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

type AuthStatus = "unknown" | "loading" | "authenticated" | "guest";

const initialState = {
  user: null,
  status: "unknown" as AuthStatus,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setCredentials: (state, action) => {
      const user = action.payload;
      state.user = user;
    },
    logOut: (state) => {
      state.user = null;
    },
    setAuthStatus: (state, action: { payload: AuthStatus }) => {
      state.status = action.payload;
    },
  },
});

export const { setCredentials, logOut, setAuthStatus } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectAuthStatus = (state: RootState) => state.auth.status;
