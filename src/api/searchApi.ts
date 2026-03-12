import { apiSlice } from "./apiSlice";

export const searchApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getSearchResults: builder.query({
			query: (query) => ({
				url: `/search?query=${encodeURIComponent(query)}`,
				method: "GET",
			}),
		}),
	}),
});

export const { useLazyGetSearchResultsQuery } = searchApi;
