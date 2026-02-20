import { Outlet, useParams } from "react-router-dom";
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
import { groupSchema, inviteMemberSchema } from "../../schemas";
import { zodErrorsToObject } from "../../helpers/utils";
import type z from "zod";
import styles from "./group.module.scss";
import UserInfoCard from "../../components/userInfoCard/UserInfoCard";
import GroupCategoryAddEditForm from "../../components/groupCategoryForm/GroupCategoryAddEditForm";
import {
	useCreateCategoryMutation,
	useGetCategoriesQuery,
	useUpdateCategoryMutation,
	type Category,
} from "../../api/categoriesApi";
import GroupCard from "../../components/groupCard/GroupCard";

type inviteMemberSchema = z.infer<typeof inviteMemberSchema>;
type categorySchema = z.infer<typeof groupSchema>;

const defaultInviterData: inviteMemberSchema = {
	email: "",
	role: "Member",
};

const defaultCategoryData: categorySchema = {
	name: "",
};
function Group() {
	const { groupId } = useParams();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [formData, setFormData] = useState(defaultInviterData);
	const [errors, setErrors] = useState<
		Partial<Record<keyof inviteMemberSchema, string>>
	>({});
	const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

	const { data: group, isLoading, error } = useGetGroupByIdQuery(groupId);
	const [
		inviteMemberToGroup,
		{ error: inviteError, isLoading: isInviting, reset },
	] = useInviteMemeberToGroupMutation();

	const {
		data: groupMembersResponse,
		isLoading: membersLoading,
		error: memberError,
		refetch,
	} = useGetGroupMembersQuery(groupId);

	const [createCategory] = useCreateCategoryMutation();
	const [updateCategory] = useUpdateCategoryMutation();
	const { data: categories, error: categoriesError } =
		useGetCategoriesQuery(groupId);

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
			groupId: Number(groupId),
			inviterData: { ...formData },
		});
		refetch();
		setFormData(defaultInviterData);
	}

	function closeModal() {
		setIsModalOpen(false);
		setFormData(defaultInviterData);
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
						"data" in inviteError
							? inviteError.data?.toString()
							: "An error occurred while inviting the member"
					}
				/>
			)}
		</form>
	);

	console.log(categoriesError);

	return (
		<>
			{error && (
				<ErrorText error="An error occurred while fetching the group details." />
			)}
			{memberError && (
				<ErrorText error="An error occurred while fetching the group members." />
			)}
			<h2 className={styles.title}>Group: {group?.name}</h2>
			{group?.role === "Owner" && (
				<button onClick={() => setIsModalOpen(true)}>
					Add a person to group
				</button>
			)}
			<button
				style={{ backgroundColor: "black" }}
				onClick={() => setIsCategoryModalOpen(true)}
			>
				Create a category
			</button>

			{isCategoryModalOpen && (
				<Modal
					title="Add a category"
					closeModal={() => setIsCategoryModalOpen(false)}
					children={
						<GroupCategoryAddEditForm
							initialValue={defaultCategoryData}
							label="Category"
							groupId={Number(groupId)}
							schema={groupSchema}
							onCreate={createCategory}
							onUpdate={updateCategory}
							closeModal={() => setIsCategoryModalOpen(false)}
						/>
					}
				/>
			)}

			{isModalOpen && (
				<Modal
					title="Add a person to group"
					closeModal={closeModal}
					children={modalChild}
				/>
			)}
			<h3>Members</h3>
			{membersLoading && <Loading />}
			{groupMembersResponse?.groupMembers.length &&
				groupMembersResponse?.groupMembers.map((groupMember: GroupMember) => (
					<UserInfoCard
						key={groupMember.email}
						groupId={Number(groupId)}
						user={groupMember}
						myRole={groupMembersResponse.myRole}
					/>
				))}

			{categories?.length &&
				categories.map((category: Category) => (
					<GroupCard
						key={category.categoryId}
						id={category.categoryId}
						name={category.name}
						type="Category"
						role={group.role}
						groupId={Number(groupId)}
						navigateLink={`/dashboard/group/${groupId}/category/${category.categoryId}`}
					/>
				))}
			{categoriesError && (
				<ErrorText
					error={
						"data" in categoriesError
							? categoriesError.data.toString()
							: "An error occured while fetching categories"
					}
				/>
			)}
			<Outlet />
		</>
	);
}

export default Group;
