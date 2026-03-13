import { apiSlice } from "./apiSlice";

export type StatsReponseType = {
	itemsPerGroup: StatsGroupType[];
	totalCategories: number;
	totalGroups: number;
	totalItems: number;
	userCreatedItems: number;
	userUpdatedItems: number;
	topCategories: StatsGroupType[];
};

export type StatsGroupType = {
	groupId: number;
	groupName: string;
	categoryId: number;
	categoryName: string;
	count: number;
};

export const statsApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getStats: builder.query({
			query: () => ({
				url: "stats",
				method: "GET",
			}),
			providesTags: ["Stats"],
		}),
	}),
});

export const { useGetStatsQuery } = statsApi;
