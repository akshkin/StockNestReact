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
			query: ({ formData }) => ({
				url: "/groups/create",
				method: "POST",
				body: {
					...formData,
				},
			}),
		}),
		updateGroup: builder.mutation({
			query: ({ groupId, formData }) => ({
				url: `/groups/${groupId}/edit`,
				method: "POST",
				body: {
					...formData,
				},
			}),
		}),
		deleteGroup: builder.mutation({
			query: ({ id }) => ({
				url: `/groups/${id}/delete`,
				method: "POST",
			}),
		}),
		inviteMemeberToGroup: builder.mutation({
			query: ({ groupId, inviterData }) => ({
				url: `/groups/${groupId}/invite`,
				method: "POST",
				body: {
					...inviterData,
				},
			}),
		}),
		getGroupMembers: builder.query({
			query: (groupId) => ({
				url: `/groups/${groupId}/members`,
				method: "GET",
			}),
		}),
		removeGroupMember: builder.mutation({
			query: ({ groupId, userId }) => ({
				url: `/groups/${groupId}/deleteMember/${userId}`,
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
	useInviteMemeberToGroupMutation,
	useGetGroupMembersQuery,
	useRemoveGroupMemberMutation,
} = groupsApiSlice;
