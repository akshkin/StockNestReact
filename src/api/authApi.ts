import { apiSlice } from "./apiSlice";

export const authApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		login: builder.mutation({
			query: (credentials) => ({
				url: "/account/login",
				method: "POST",
				body: credentials,
			}),
		}),
		register: builder.mutation({
			query: (data) => ({
				url: "/account/register",
				method: "POST",
				body: data,
			}),
		}),
		refresh: builder.mutation({
			query: () => ({
				url: "/account/refresh",
				method: "GET",
			}),
		}),
		logout: builder.mutation({
			query: () => ({
				url: "/account/logout",
				method: "POST",
			}),
		}),
	}),
});

export const {
	useLoginMutation,
	useRegisterMutation,
	useRefreshMutation,
	useLogoutMutation,
} = authApi;
