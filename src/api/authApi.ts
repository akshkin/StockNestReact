import { setCredentials } from "../features/authSlice";
import { apiSlice } from "./apiSlice";

export const authApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		login: builder.mutation({
			query: (credentials) => ({
				url: "/account/login",
				method: "POST",
				body: credentials,
			}),
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					dispatch(setCredentials(data.token)); // store in auth slice
				} catch (err) {
					console.error("Failed to set user data:", err);
				}
			},
		}),
		register: builder.mutation({
			query: (data) => ({
				url: "/account/register",
				method: "POST",
				body: data,
			}),
			async onQueryStarted(arg, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					dispatch(setCredentials(data.token)); // store in auth slice
				} catch (err) {
					console.error("Failed to set user data:", err);
				}
			},
		}),
	}),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
