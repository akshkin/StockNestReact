import { ZodError } from "zod";

export function zodErrorsToObject<T extends object>(error: ZodError<T>) {
	const errors: Partial<Record<keyof T, string>> = {};

	for (const issue of error.issues) {
		const key = issue.path[0] as keyof T;
		errors[key] = issue.message;
	}

	return errors;
}
