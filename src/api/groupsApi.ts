import { apiSlice } from "./apiSlice";

export type Group = {
	groupId: number;
	name: string;
};

export const groupsApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getGroups: builder.query({
			query: () => "/groups",
		}),
		getGroupById: builder.query({
			query: (id) => `/groups/${id}`,
		}),
		createNewGroup: builder.mutation({
			query: (group) => ({
				url: "/groups/create",
				method: "POST",
				body: {
					...group,
				},
			}),
		}),
		updateGroup: builder.mutation({
			query: ({ id, group }) => ({
				url: `/groups/${id}/edit`,
				method: "POST",
				body: {
					...group,
				},
			}),
		}),
		deleteGroup: builder.mutation({
			query: ({ id }) => ({
				url: `/groups/${id}/delete`,
				method: "POST",
			}),
		}),
	}),
});

export const {
	useGetGroupsQuery,
	useGetGroupByIdQuery,
	useCreateNewGroupMutation,
	useUpdateGroupMutation,
	useDeleteGroupMutation,
} = groupsApiSlice;
