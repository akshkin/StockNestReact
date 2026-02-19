import { useParams } from "react-router-dom";
import {
	useGetGroupByIdQuery,
	useGetGroupMembersQuery,
	useInviteMemeberToGroupMutation,
	type GroupMember,
} from "../../api/groupsApi";
import ErrorText from "../../components/errorText/ErrorText";
import Loading from "../../components/loading/Loading";
import Modal from "../../components/modal/Modal";
import { useState } from "react";
import InputField from "../../components/inputField/InputField";
import { inviteMemberSchema } from "../../schemas";
import { zodErrorsToObject } from "../../helpers/utils";
import type z from "zod";
import styles from "./group.module.scss";
import UserInfoCard from "../../components/userInfoCard/UserInfoCard";

type inviteMemberSchema = z.infer<typeof inviteMemberSchema>;

const defaultData: inviteMemberSchema = {
	email: "",
	role: "Member",
};
function Group() {
	const { id } = useParams();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [formData, setFormData] = useState(defaultData);
	const [errors, setErrors] = useState<
		Partial<Record<keyof inviteMemberSchema, string>>
	>({});

	const { data: group, isLoading, error } = useGetGroupByIdQuery(id);
	const [
		inviteMemberToGroup,
		{ error: inviteError, isLoading: isInviting, reset },
	] = useInviteMemeberToGroupMutation();

	const {
		data: groupMembersResponse,
		isLoading: membersLoading,
		error: memberError,
		refetch,
	} = useGetGroupMembersQuery(id);

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

		await inviteMemberToGroup({
			groupId: Number(id),
			inviterData: { ...formData },
		});
		refetch();
	}

	const isFormValid =
		Object.keys(errors).length === 0 && formData.email && formData.role;

	if (isLoading) return <Loading />;

	const modalChild = (
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
				<option value="Member">Member</option>
				<option value="Viewer">Viewer</option>
			</select>

			<div className={styles.buttonsContainer}>
				<button disabled={!isFormValid || isInviting} onClick={handleSubmit}>
					Add
				</button>
				<button
					className="invertedButton"
					type="button"
					onClick={() => setIsModalOpen(false)}
				>
					Cancel
				</button>
			</div>
			{inviteError && (
				<ErrorText
					error={
						"data" in inviteError
							? inviteError.data?.toString()
							: "An error occurred while inviting the member"
					}
				/>
			)}
		</form>
	);

	console.log(groupMembersResponse);

	return (
		<>
			{error && (
				<ErrorText error="An error occurred while fetching the group details." />
			)}
			{memberError && (
				<ErrorText error="An error occurred while fetching the group members." />
			)}
			<h2 className={styles.title}>Group: {group?.name}</h2>
			{group.role === "Owner" && (
				<button onClick={() => setIsModalOpen(true)}>
					Add a person to group
				</button>
			)}
			{isModalOpen && (
				<Modal
					title="Add a person to group"
					closeModal={() => setIsModalOpen(false)}
					children={modalChild}
				/>
			)}
			<h3>Members</h3>
			{membersLoading && <Loading />}
			{groupMembersResponse?.groupMembers.length &&
				groupMembersResponse?.groupMembers.map((groupMember: GroupMember) => (
					<UserInfoCard
						key={groupMember.email}
						groupId={Number(id)}
						user={groupMember}
						myRole={groupMembersResponse.myRole}
					/>
				))}
		</>
	);
}

export default Group;
