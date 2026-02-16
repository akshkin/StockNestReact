import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
	baseQuery: fetchBaseQuery({ baseUrl: "https://localhost:7036/api" }),
	tagTypes: ["User"],
	endpoints: (builder) => ({}),
});
