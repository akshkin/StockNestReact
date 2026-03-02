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
		getNotifications: builder.query<NotificationResponseType[], void>({
			query: () => ({
				url: "notifications/all",
				method: "GET",
			}),
			providesTags: ["Notifications"],
		}),
		getUnreadNotifications: builder.query<NotificationResponseType[], void>({
			query: () => ({
				url: "notifications/unread",
				method: "GET",
			}),
			providesTags: ["Notifications"],
		}),
		setNotificationAsSeen: builder.mutation({
			query: (notificationId) => ({
				url: `notifications/${notificationId}/seen`,
				method: "POST",
			}),
			invalidatesTags: ["Notifications"],
		}),
		setAllNotificationsAsSeen: builder.mutation({
			query: () => ({
				url: `notifications/seenAll`,
				method: "POST",
			}),
			invalidatesTags: ["Notifications"],
		}),
	}),
});

export const {
	useGetNotificationsQuery,
	useGetUnreadNotificationsQuery,
	useSetNotificationAsSeenMutation,
	useSetAllNotificationsAsSeenMutation,
} = notificationsApi;
