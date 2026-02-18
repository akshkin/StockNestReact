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
		createNewGroup: builder.mutation({
			query: (group) => ({
				url: "/groups",
				method: "POST",
				body: {
					...group,
				},
			}),
		}),
		updateGroup: builder.mutation({
			query: (group) => ({
				url: "/groups",
				method: "PATCH",
				body: {
					...group,
				},
			}),
		}),
		deleteGroup: builder.mutation({
			query: ({ id }) => ({
				url: `/groups/${id}`,
				method: "DELETE",
			}),
		}),
	}),
});

export const {
	useGetGroupsQuery,
	useCreateNewGroupMutation,
	useUpdateGroupMutation,
	useDeleteGroupMutation,
} = groupsApiSlice;
