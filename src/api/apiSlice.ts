import type {
  BaseQueryApi,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  QueryReturnValue,
} from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logOut } from "../features/authSlice";
import { toast } from "react-toastify";

const baseUrl = import.meta.env.VITE_BASE_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: baseUrl,
  credentials: "include",
});

let refreshPromise: Promise<
  QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>
> | null = null;

const baseQueryWithReauth = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: object,
) => {
  const result = await baseQuery(args, api, extraOptions);

  /* Try refresh request only once and then retry original requests after a successful
   *   response from refresh request
   */

  const isLoginRequest =
    (typeof args === "string" && args.includes("/account/login")) ||
    (typeof args === "object" &&
      args !== null &&
      "url" in args &&
      typeof args.url === "string" &&
      args.url.includes("/account/login"));

  const isRefreshRequest =
    (typeof args === "string" && args.includes("/account/refresh")) ||
    (typeof args === "object" &&
      args !== null &&
      "url" in args &&
      typeof args.url === "string" &&
      args.url.includes("/account/refresh"));

  const isLogoutRequest =
    (typeof args === "string" && args.includes("/account/logout")) ||
    (typeof args === "object" &&
      args !== null &&
      "url" in args &&
      typeof args.url === "string" &&
      args.url.includes("/account/logout"));

  // prevent refresh request when logging in , logging out and if it is a refresh request
  if (
    result?.error?.status === 401 &&
    !isLoginRequest &&
    !isRefreshRequest &&
    !isLogoutRequest
  ) {
    if (!refreshPromise) {
      refreshPromise = (async () =>
        await baseQuery("/account/refresh", api, extraOptions))().finally(
        () => {
          refreshPromise = null;
        },
      );
    }

    const refreshResult = await refreshPromise;

    if (!refreshResult.error) {
      return await baseQuery(args, api, extraOptions);
    }

    api.dispatch(logOut());

    // Show a toast notification
    toast.error("Your session has expired. Please log in again.");

    return refreshResult;
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "User",
    "Groups",
    "Categories",
    "Items",
    "GroupMembers",
    "Notifications",
    "NotificationCount",
    "Profile",
    "Stats",
  ],

  refetchOnReconnect: true,
  // refetchOnFocus: true,
  endpoints: () => ({}),
});
