import { useState } from "react";
import type { ZodSchema } from "zod";

export function useZodForm<T>(schema: ZodSchema<T>, initialValues: T) {
	const [data, setData] = useState<T>(initialValues);
	const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

	function update(field: keyof T, value: string) {
		let parsedValue;
		// parse only fields that have a number as value type
		if (typeof value === "string") {
			if (typeof initialValues[field] === "number") {
				parsedValue = value === "" ? "" : Number(value);
			} else {
				parsedValue = value;
			}
		}
		const newData = { ...data, [field]: parsedValue };
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

	const isValid = schema.safeParse(data).success;
	Object.values(data as object).every((value) => value);

	return { data, update, errors, isValid };
}
