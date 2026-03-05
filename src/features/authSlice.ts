import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

const authSlice = createSlice({
	name: "auth",
	initialState: { name: null },
	reducers: {
		setCredentials: (state, action) => {
			const user = action.payload;
			state.name = user;
		},
		logOut: (state) => {
			state.name = null;
		},
	},
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.name;
