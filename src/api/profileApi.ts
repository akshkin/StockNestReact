import { apiSlice } from "./apiSlice";

export const profileApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getProfile: builder.query({
			query: () => ({
				url: "/account/profile",
				method: "GET",
			}),
			providesTags: ["Profile"],
		}),
		updateProfile: builder.mutation({
			query: (profileData) => ({
				url: "/account/update-profile",
				method: "POST",
				body: { ...profileData },
			}),
			invalidatesTags: ["Profile"],
		}),
	}),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = profileApi;
