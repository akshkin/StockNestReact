import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
	baseUrl: "https://localhost:7036/api",
	credentials: "include",
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
	// console.log(args); // request url, method, body
	// console.log(api); // signal, dispatch, getState()
	// console.log(extraOptions); //custom like {shout: true}

	let result = await baseQuery(args, api, extraOptions);

	if (result?.error?.status === 401) {
		console.log("sending refresh token");

		// send refresh token to get new access token
		const refreshResult = await baseQuery(
			"/account/refresh",
			api,
			extraOptions,
		);

		if (refreshResult?.data) {
			// retry original query with new access token
			result = await baseQuery(args, api, extraOptions);
		} else {
			if (refreshResult?.error?.status === 401) {
				refreshResult.error.data = "Your login has expired. ";
				await baseQuery("/account/logout", api, extraOptions);
				setTimeout(() => {
					api.dispatch(apiSlice.util.resetApiState());
				}, 1000);
			}
			return refreshResult;
		}
	}
	return result;
};

export const apiSlice = createApi({
	baseQuery: baseQueryWithReauth,
	tagTypes: ["User", "Groups", "Categories", "Items", "GroupMembers"],
	refetchOnFocus: true,
	endpoints: (builder) => ({}),
});
