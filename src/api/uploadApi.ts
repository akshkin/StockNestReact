import { apiSlice } from "./apiSlice";

export const uploadApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		uploadImage: builder.query({
			query: () => ({
				url: "upload/upload-image",
				method: "GET",
			}),
		}),
	}),
});

export const { useLazyUploadImageQuery } = uploadApi;
