import { apiSlice } from "./apiSlice";

export type Item = {
	itemId: number;
	name: string;
	quantity: number;
};

export const itemsApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		createItem: builder.mutation({
			query: ({ groupId, categoryId, formData }) => ({
				url: `items/group/${groupId}/category/${categoryId}/create`,
				method: "POST",
				body: { ...formData },
			}),
		}),
		getItems: builder.query({
			query: ({ groupId, categoryId }) => ({
				url: `items/group/${groupId}/category/${categoryId}`,
				method: "GET",
			}),
		}),
		updateItem: builder.mutation({
			query: ({ groupId, categoryId, itemId, formData }) => ({
				url: `items/group/${groupId}/category/${categoryId}/item/${itemId}/edit`,
				method: "POST",
				body: { ...formData },
			}),
		}),
		deleteItems: builder.mutation({
			query: ({ groupId, categoryId, itemIds }) => ({
				url: `items/group/${groupId}/category/${categoryId}/delete`,
				method: "POST",
				body: itemIds,
			}),
		}),
	}),
});

export const {
	useCreateItemMutation,
	useGetItemsQuery,
	useUpdateItemMutation,
	useDeleteItemsMutation,
} = itemsApi;
