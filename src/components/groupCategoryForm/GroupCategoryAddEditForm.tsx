import React, { useState } from "react";
import InputField from "../inputField/InputField";
import {
	useCreateNewGroupMutation,
	useUpdateGroupMutation,
} from "../../api/groupsApi";
import { groupSchema } from "../../schemas";
import type z from "zod";
import ErrorText from "../errorText/ErrorText";
import { zodErrorsToObject } from "../../helpers/utils";
import styles from "./groupCategoryForm.module.scss";

type FormProps = {
	id?: number;
	name?: string;
	closeModal: () => void;
};

const defaultFormValues = {
	name: "",
};

type groupCategorySchema = z.infer<typeof groupSchema>;

function GroupCategoryAddEditForm({ id, name, closeModal }: FormProps) {
	const [formData, setFormData] =
		useState<groupCategorySchema>(defaultFormValues);

	const [errors, setErrors] = useState<
		Partial<Record<keyof groupCategorySchema, string>>
	>({});

	const isEditing = id ? true : false;

	const [createNewGroup, createNewGroupState] = useCreateNewGroupMutation();
	const [updateGroup, updateGroupState] = useUpdateGroupMutation();

	const isFormValid = Object.keys(errors).length === 0 && formData.name;

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		if (isEditing) updateGroupState.reset();
		else createNewGroupState.reset(); //reset the error from rtk query when user starts typing

		const newFormData = { ...formData, [e.target.name]: e.target.value };

		setFormData(newFormData);

		const result = groupSchema.safeParse(newFormData);

		if (!result.success) {
			const formErrors = zodErrorsToObject(result.error);
			setErrors(formErrors);
			return;
		} else {
			setErrors({});
		}
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		let response;

		if (isEditing) {
			response = await updateGroup({ id, group: formData });
		} else {
			response = await createNewGroup(formData);
		}

		console.log("API response:", response);

		if (!createNewGroupState.isSuccess && !updateGroupState.isSuccess)
			closeModal();
	}

	const hasError = !!(createNewGroupState?.error || updateGroupState?.error);
	// const errorString = "data" in createNewGroupState.error || "data" in updateGroupState?.error ? (createNewGroupState?.error || updateGroupState?.error)?.data : "An error occurred";

	return (
		<form className={styles.form}>
			<InputField
				label={`${name} name`}
				name="name"
				value={formData.name}
				onChange={(e) => handleChange(e)}
				placeholder="Type a name"
				error={errors?.name}
			/>
			<button
				disabled={
					createNewGroupState.isLoading ||
					updateGroupState.isLoading ||
					!isFormValid
				}
				onClick={handleSubmit}
			>
				{isEditing ? "Update" : "Create"}
			</button>
			{hasError && <ErrorText error={"An error occurred"} />}
		</form>
	);
}

export default GroupCategoryAddEditForm;
