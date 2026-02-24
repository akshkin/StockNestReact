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
			invalidatesTags: ["Items"],
		}),
		getItems: builder.query({
			query: ({ groupId, categoryId }) => ({
				url: `items/group/${groupId}/category/${categoryId}`,
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
