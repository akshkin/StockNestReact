import React, { useState } from "react";
import { useInviteMemeberToGroupMutation } from "../../api/groupsApi";
import { inviteMemberSchema } from "../../schemas";
import type z from "zod";
import InputField from "../../components/inputField/InputField";
import ErrorText from "../../components/errorText/ErrorText";
import styles from "./group.module.scss";
import { extractErrorMessage, zodErrorsToObject } from "../../helpers/utils";
import { toast } from "react-toastify";

type inviteMemberSchema = z.infer<typeof inviteMemberSchema>;

const defaultInviterData: inviteMemberSchema = {
	email: "",
	role: "Member",
};

type AddMemberFormProps = {
	groupId: number;
	closeModal: () => void;
};

function AddMemberForm({ groupId, closeModal }: AddMemberFormProps) {
	const [formData, setFormData] = useState(defaultInviterData);
	const [errors, setErrors] = useState<
		Partial<Record<keyof inviteMemberSchema, string>>
	>({});
	const [
		inviteMemberToGroup,
		{ error: inviteError, isLoading: isInviting, reset },
	] = useInviteMemeberToGroupMutation();

	function handleChange(
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) {
		reset();

		const newFormData = { ...formData, [e.target.name]: e.target.value };

		setFormData(newFormData);

		const result = inviteMemberSchema.safeParse(newFormData);

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

		const res = await inviteMemberToGroup({
			groupId: Number(groupId),
			inviterData: { ...formData },
		});

		if (!("error" in res)) {
			setFormData(defaultInviterData);
			closeModal();
			toast.success("Successfully added member to group!");
		}
	}

	const isFormValid =
		Object.keys(errors).length === 0 && formData.email && formData.role;
	return (
		<form>
			<InputField
				label="Email Address"
				value={formData.email}
				name="email"
				placeholder="johndoe@example.com"
				onChange={(e) => handleChange(e)}
				error={errors?.email}
			/>

			<select
				name="role"
				value={formData.role}
				onChange={(e) => handleChange(e)}
			>
				<option value="Co-Owner">Co-Owner</option>
				<option value="Member">Member</option>
				<option value="Viewer">Viewer</option>
			</select>

			<div className={styles.buttonsContainer}>
				<button disabled={!isFormValid || isInviting} onClick={handleSubmit}>
					Add
				</button>
				<button className="invertedButton" type="button" onClick={closeModal}>
					Cancel
				</button>
			</div>
			{inviteError && (
				<ErrorText
					error={
						extractErrorMessage(inviteError) ??
						"An error occurred while inviting the member"
					}
				/>
			)}
		</form>
	);
}

export default AddMemberForm;
