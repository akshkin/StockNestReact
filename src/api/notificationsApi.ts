import { apiSlice } from "./apiSlice";

export type NotificationType =
	| "GroupUpdated"
	| "GroupDeleted"
	| "CategoryCreated"
	| "CategoryUpdated"
	| "CategoryDeleted"
	| "ItemCreated"
	| "ItemUpdated"
	| "ItemDeleted"
	| "UserJoinedGroup"
	| "UserRemovedFromGroup";

export type NotificationResponseType = {
	items: NotificationItemType[];
	hasNextPage: boolean;
	pageSize: number;
	pageNumber: number;
	totalCount: number;
	totalPagesCount: number;
};

export type NotificationItemType = {
	id: number;
	message: string;
	type: NotificationType;
	seen: boolean;
	createdAt: string;
	groupId?: number | null;
	categoryId?: number | null;
	itemId?: number | null;
};

export const notificationsApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getNotifications: builder.query<NotificationResponseType, number>({
			query: (page) => ({
				url: `notifications/all?page=${page}`,
				method: "GET",
			}),
			providesTags: ["Notifications"],
		}),
		getUnreadNotifications: builder.query<NotificationResponseType, number>({
			query: (page) => ({
				url: `notifications/unread?page=${page}`,
				method: "GET",
			}),
			providesTags: ["Notifications"],
		}),
		setNotificationAsSeen: builder.mutation({
			query: (notificationId) => ({
				url: `notifications/${notificationId}/seen`,
				method: "POST",
			}),
			invalidatesTags: ["Notifications", "NotificationCount"],
		}),
		setAllNotificationsAsSeen: builder.mutation({
			query: () => ({
				url: `notifications/seenAll`,
				method: "POST",
			}),
			invalidatesTags: ["Notifications", "NotificationCount"],
		}),
		getLatestNotifications: builder.query<NotificationItemType[], void>({
			query: () => ({
				url: "notifications/latest",
			}),
			providesTags: ["Notifications"],
		}),
		getUnreadNotificationsCount: builder.query<number, void>({
			query: () => ({
				url: "notifications/unread-count",
			}),
			providesTags: ["NotificationCount"],
		}),
	}),
});

export const {
	useGetNotificationsQuery,
	useGetUnreadNotificationsQuery,
	useSetNotificationAsSeenMutation,
	useSetAllNotificationsAsSeenMutation,
	useGetLatestNotificationsQuery,
	useGetUnreadNotificationsCountQuery,
} = notificationsApi;
