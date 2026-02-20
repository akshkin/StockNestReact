import { useState } from "react";
import type { ZodSchema } from "zod/v3";

export function useZodForm<T>(schema: ZodSchema<T>, initialValues: T) {
	const [data, setData] = useState<T>(initialValues);
	const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

	function update(field: keyof T, value: string) {
		const newData = { ...data, [field]: value };
		setData(newData);

		const formErrors: Partial<Record<keyof T, string>> = {};

		const result = schema.safeParse(newData);
		if (!result.success) {
			for (const issue of result.error.issues) {
				const key = issue.path[0] as keyof T;
				formErrors[key as keyof T] = issue.message;
			}
			setErrors(formErrors);
		} else {
			setErrors({});
		}
	}

	const isValid =
		Object.keys(errors).length === 0 &&
		Object.values(data as object).every((value) => value);

	return { data, update, errors, isValid };
}
