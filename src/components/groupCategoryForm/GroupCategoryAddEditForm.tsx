import React, { useState } from "react";
import InputField from "../inputField/InputField";
import { useGetGroupsQuery } from "../../api/groupsApi";
import ErrorText from "../errorText/ErrorText";
import { useZodForm } from "../../hooks/useZodForm";

type FormProps<T> = {
	mode?: string;
	initialValue: T;
	label: "Group" | "Category"; // "Group", "Category",
	schema: any; // eslint-disable-line
	groupId?: number;
	categoryId?: number;
	onCreate?: ({
		groupId,
		formData,
	}: {
		groupId?: number;
		formData: T;
	}) => Promise<any>; // eslint-disable-line
	onUpdate: ({
		groupId,
		categoryId,
		formData,
	}: {
		groupId: number;
		categoryId?: number;
		formData: T;
	}) => Promise<any>; // eslint-disable-line
	closeModal: () => void;
};

function GroupCategoryAddEditForm<T extends { name: string }>({
	mode,
	groupId,
	categoryId,
	initialValue,
	label,
	closeModal,
	schema,
	onCreate,
	onUpdate,
}: FormProps<T>) {
	const isEditing = mode === "Edit";

	const { data, update, errors, isValid } = useZodForm<T>(schema, {
		...initialValue,
	} as T);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { refetch } = useGetGroupsQuery({});

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setIsSubmitting(true);
		let res;
		if (isEditing) {
			if (label === "Category") {
				//update category
				res = await onUpdate({
					groupId: groupId!,
					categoryId: categoryId,
					formData: data,
				});
			} else {
				//update group
				res = await onUpdate({
					groupId: groupId!,
					formData: data,
				});
			}
		} else {
			if (onCreate) {
				// create category or group
				if (groupId) {
					// create category
					res = await onCreate({ groupId: groupId, formData: data });
				} else {
					//create group
					res = await onCreate({ formData: data });
				}
			}
		}

		if (!("error" in res)) {
			await refetch();
			closeModal();
		} else {
			if (typeof res.error.data === "string") {
				setError(res.error.data);
			} else {
				setError("An error occured");
			}
		}
		setIsSubmitting(false);
	}

	return (
		<form>
			<InputField
				label={`${label} name`}
				name="name"
				value={data.name}
				onChange={(e) => update("name", e.target.value)}
				placeholder={`Type ${label.toLowerCase()} name`}
				error={errors.name}
			/>

			<button
				disabled={isSubmitting || !isValid}
				onClick={onSubmit}
				type="submit"
			>
				{isEditing ? "Update" : "Create"}
			</button>

			{error && <ErrorText error={error} />}
		</form>
	);
}

export default GroupCategoryAddEditForm;
