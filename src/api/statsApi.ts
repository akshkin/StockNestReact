import { apiSlice } from "./apiSlice";

export const statsApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getStats: builder.query({
			query: () => ({
				url: "stats",
				method: "GET",
			}),
		}),
	}),
});

export const { useGetStatsQuery } = statsApi;
