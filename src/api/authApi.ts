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
	}),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
