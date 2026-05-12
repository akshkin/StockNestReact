import { apiSlice } from "./apiSlice";
import type { NotificationItemType } from "./notificationsApi";

export type StatsReponseType = {
  itemsPerGroup: StatsGroupType[];
  totalCategories: number;
  totalGroups: number;
  totalItems: number;
  userCreatedItems: number;
  userUpdatedItems: number;
  topCategories: StatsGroupType[];
  latestNotifications: NotificationItemType[];
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
    getStats: builder.query<StatsReponseType, void>({
      query: () => ({
        url: "stats",
        method: "GET",
      }),
      providesTags: ["Stats"],
    }),
  }),
});

export const { useGetStatsQuery } = statsApi;
