import { apiSlice } from "./apiSlice";

export const categoriesApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		createCategory: builder.mutation({
			query: ({ groupId, formData }) => ({
				url: `categories/group/${groupId}/create`,
				method: "POST",
				body: { ...formData },
			}),
		}),
		updateCategory: builder.mutation({
			query: ({ groupId, categoryId, formData }) => ({
				url: `categories/group/${groupId}/category/${categoryId}/edit`,
				method: "POST",
				body: { ...formData },
			}),
		}),
		getCategories: builder.query({
			query: (groupId) => ({
				url: `categories/group/${groupId}`,
				method: "GET",
			}),
		}),
	}),
});

export const {
	useCreateCategoryMutation,
	useUpdateCategoryMutation,
	useGetCategoriesQuery,
} = categoriesApi;
