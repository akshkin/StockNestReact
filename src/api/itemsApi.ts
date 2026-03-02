import { apiSlice } from "./apiSlice";

export type Item = {
	itemId: number;
	name: string;
	quantity: number;
};

export type ItemsResponseType = {
	items: Item[];
	hasNextPage: boolean;
	pageSize: number;
	pageNumber: number;
	totalCount: number;
};

export const itemsApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		createItem: builder.mutation({
			query: ({ groupId, categoryId, formData }) => ({
				url: `items/group/${groupId}/category/${categoryId}/create`,
				method: "POST",
				body: { ...formData },
			}),
			invalidatesTags: ["Items"],
		}),
		getItems: builder.query<
			ItemsResponseType,
			{ groupId: number; categoryId: number; page: number }
		>({
			query: ({ groupId, categoryId, page }) => ({
				url: `items/group/${groupId}/category/${categoryId}?page=${page}`,
				method: "GET",
			}),
			providesTags: ["Items"],
		}),
		updateItem: builder.mutation({
			query: ({ groupId, categoryId, itemId, formData }) => ({
				url: `items/group/${groupId}/category/${categoryId}/item/${itemId}/edit`,
				method: "POST",
				body: { ...formData },
			}),
			invalidatesTags: ["Items"],
		}),
		deleteItems: builder.mutation({
			query: ({ groupId, categoryId, itemIds }) => ({
				url: `items/group/${groupId}/category/${categoryId}/delete`,
				method: "POST",
				body: itemIds,
			}),
			invalidatesTags: ["Items"],
		}),
	}),
});

export const {
	useCreateItemMutation,
	useGetItemsQuery,
	useUpdateItemMutation,
	useDeleteItemsMutation,
} = itemsApi;
