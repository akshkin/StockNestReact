import { logOut, setCredentials } from "../features/authSlice";
import { apiSlice } from "./apiSlice";

export const authApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		login: builder.mutation({
			query: (credentials) => ({
				url: "/account/login",
				method: "POST",
				body: credentials,
			}),
			onQueryStarted: async (_, { queryFulfilled, dispatch }) => {
				try {
					const { data } = await queryFulfilled;
					console.log(data);
					setTimeout(() => {
						dispatch(apiSlice.util.resetApiState());
					}, 1000);
				} catch (err) {
					console.log(err);
				}
			},
		}),
		register: builder.mutation({
			query: (data) => ({
				url: "/account/register",
				method: "POST",
				body: data,
			}),
		}),
		refresh: builder.query({
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
			async onQueryStarted(_, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					console.log(data);
					dispatch(logOut());
					setTimeout(() => {
						dispatch(apiSlice.util.resetApiState());
					}, 1000);
				} catch (err) {
					console.log(err);
				}
			},
		}),
		getMe: builder.query({
			query: () => ({
				url: "/account/me",
				method: "GET",
			}),
			async onQueryStarted(_, { dispatch, queryFulfilled }) {
				try {
					const { data } = await queryFulfilled;
					dispatch(setCredentials(data.name));
				} catch (err) {
					console.log(err);
				}
			},
		}),
	}),
});

export const {
	useLoginMutation,
	useRegisterMutation,
	useRefreshQuery,
	useLogoutMutation,
	useGetMeQuery,
} = authApi;
