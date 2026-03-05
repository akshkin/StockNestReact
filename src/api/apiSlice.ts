import type {
	BaseQueryApi,
	FetchArgs,
	FetchBaseQueryError,
	FetchBaseQueryMeta,
	QueryReturnValue,
} from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

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
	if (result?.error?.status === 401) {
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
	],
	refetchOnFocus: true,
	endpoints: () => ({}),
});
