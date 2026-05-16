import { apiSlice } from "./apiSlice";

export type UserSessionType = {
  sessionId: number;
  deviceName: string;
  ipAddress: string;
  location: string;
  lastActiveAt: string;
  isCurrentDevice: boolean;
};

export const profileApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => ({
        url: "/account/profile",
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),
    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: "/account/update-profile",
        method: "POST",
        body: { ...profileData },
      }),
      invalidatesTags: ["Profile"],
    }),
    getAllSessions: builder.query<UserSessionType[], void>({
      query: () => ({
        url: "/sessions",
        method: "GET",
      }),
      providesTags: ["Sessions"],
    }),
    revokeSession: builder.mutation({
      query: (sessionId) => ({
        url: `/sessions/revoke/${sessionId}`,
        method: "POST",
      }),
      invalidatesTags: ["Sessions"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetAllSessionsQuery,
  useRevokeSessionMutation,
} = profileApi;
