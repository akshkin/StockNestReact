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
