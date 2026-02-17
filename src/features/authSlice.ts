import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

const authSlice = createSlice({
	name: "auth",
	initialState: { token: localStorage.getItem("user") || null },
	reducers: {
		setCredentials: (state, action) => {
			const token = action.payload;
			state.token = token;
			localStorage.setItem("user", token);
		},
		logOut: (state) => {
			state.token = null;
			localStorage.removeItem("user");
		},
	},
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentToken = (state: RootState) => state.auth.token;
