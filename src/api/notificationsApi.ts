import { apiSlice } from "./apiSlice";

export type NotificationType = {
	id: number;
	message: string;
	type: string;
	seen: boolean;
	createdAt: string;
	groupId?: number | null;
	categoryId?: number | null;
	itemId?: number | null;
};

export const notificationsApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getNotifications: builder.query<NotificationType[], void>({
			query: () => ({
				url: "notifications/all",
				method: "GET",
			}),
			providesTags: ["Notifications"],
		}),
	}),
});

export const { useGetNotificationsQuery } = notificationsApi;
