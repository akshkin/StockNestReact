import { apiSlice } from "./apiSlice";

export type Group = {
	groupId: number;
	name: string;
	role: string;
};

export type GroupMember = {
	fullName: string;
	email: string;
	role: string;
	isMe: boolean;
	userId: string;
	profileImageUrl: string;
};

export const groupsApiSlice = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getGroups: builder.query({
			query: () => "/groups",
			providesTags: ["Groups"],
		}),
		getGroupById: builder.query({
			query: (id) => `/groups/${id}`,
		}),
		createNewGroup: builder.mutation({
			query: ({ formData }) => ({
				url: "/groups/create",
				method: "POST",
				body: {
					...formData,
				},
			}),
			invalidatesTags: ["Groups"],
		}),
		updateGroup: builder.mutation({
			query: ({ groupId, formData }) => ({
				url: `/groups/${groupId}/edit`,
				method: "POST",
				body: {
					...formData,
				},
			}),
			invalidatesTags: ["Groups"],
		}),
		deleteGroup: builder.mutation({
			query: ({ id }) => ({
				url: `/groups/${id}/delete`,
				method: "POST",
			}),
			invalidatesTags: ["Groups"],
		}),
		inviteMemeberToGroup: builder.mutation({
			query: ({ groupId, inviterData }) => ({
				url: `/groups/${groupId}/invite`,
				method: "POST",
				body: {
					...inviterData,
				},
			}),
			invalidatesTags: ["GroupMembers"],
		}),
		getGroupMembers: builder.query({
			query: (groupId) => ({
				url: `/groups/${groupId}/members`,
				method: "GET",
			}),
			providesTags: ["GroupMembers"],
		}),
		removeGroupMember: builder.mutation({
			query: ({ groupId, userId }) => ({
				url: `/groups/${groupId}/deleteMember/${userId}`,
				method: "POST",
			}),
			invalidatesTags: ["GroupMembers"],
		}),
	}),
});

export const {
	useGetGroupsQuery,
	useGetGroupByIdQuery,
	useCreateNewGroupMutation,
	useUpdateGroupMutation,
	useDeleteGroupMutation,
	useInviteMemeberToGroupMutation,
	useGetGroupMembersQuery,
	useRemoveGroupMemberMutation,
} = groupsApiSlice;
