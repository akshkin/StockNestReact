import { apiSlice } from "./apiSlice";

export type Category = {
	categoryId: number;
	name: string;
};

export const categoriesApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		createCategory: builder.mutation({
			query: ({ groupId, formData }) => ({
				url: `categories/group/${groupId}/create`,
				method: "POST",
				body: { ...formData },
			}),
			invalidatesTags: ["Categories", "Stats"],
		}),
		updateCategory: builder.mutation({
			query: ({ groupId, categoryId, formData }) => ({
				url: `categories/group/${groupId}/category/${categoryId}/edit`,
				method: "POST",
				body: { ...formData },
			}),
			invalidatesTags: ["Categories"],
		}),
		getCategories: builder.query({
			query: (groupId) => ({
				url: `categories/group/${groupId}`,
				method: "GET",
			}),
			providesTags: ["Categories"],
		}),
		getCategoryById: builder.query({
			query: ({ groupId, categoryId }) => ({
				url: `categories/group/${groupId}/category/${categoryId}`,
				method: "GET",
			}),
		}),
		deleteCategory: builder.mutation({
			query: ({ groupId, categoryId }) => ({
				url: `categories/group/${groupId}/category/${categoryId}/delete`,
				method: "POST",
			}),
			invalidatesTags: ["Categories", "Stats"],
		}),
	}),
});

export const {
	useCreateCategoryMutation,
	useUpdateCategoryMutation,
	useGetCategoriesQuery,
	useGetCategoryByIdQuery,
	useDeleteCategoryMutation,
} = categoriesApi;
