import { useLocation, useParams } from "react-router-dom";
import {
	useGetGroupByIdQuery,
	useGetGroupMembersQuery,
	type GroupMember,
} from "../../api/groupsApi";
import ErrorText from "../../components/errorText/ErrorText";
import Loading from "../../components/loading/Loading";
import Modal from "../../components/modal/Modal";
import { useState } from "react";
import { groupCategorySchema } from "../../schemas";
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
import { IoMdPersonAdd, IoMdAddCircleOutline } from "react-icons/io";
import IconButton from "../../components/iconButton/IconButton";
import AddMemberForm from "./AddMemberForm";
import { extractErrorMessage, getPermissions } from "../../helpers/utils";

type categorySchema = z.infer<typeof groupCategorySchema>;

const defaultCategoryData: categorySchema = {
	name: "",
};
function Group() {
	const { groupId } = useParams();
	const [isModalOpen, setIsModalOpen] = useState(false);

	const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState<
		{ id: number; name: string } | undefined
	>();
	const [mode, setMode] = useState<"Edit" | "Add">();

	const {
		data: group,
		isLoading,
		error,
		isFetching,
	} = useGetGroupByIdQuery(groupId);

	const {
		data: groupMembersResponse,
		isLoading: membersLoading,
		error: memberError,
		isFetching: memberFetching,
	} = useGetGroupMembersQuery(groupId);

	const [createCategory] = useCreateCategoryMutation();
	const [updateCategory] = useUpdateCategoryMutation();

	const {
		data: categories,
		isLoading: categoriesLoading,
		error: categoriesError,
		isFetching: categoriesFetching,
	} = useGetCategoriesQuery(groupId);

	const location = useLocation();

	function closeModal() {
		setIsModalOpen(false);
	}

	function openCategoryModal() {
		setMode("Add");
		setIsCategoryModalOpen(true);
	}

	function openEditModal(id: number, name: string) {
		setSelectedCategory({ id, name });
		setMode("Edit");
		setIsCategoryModalOpen(true);
	}

	function closeCategoryModal() {
		setSelectedCategory(undefined);
		setIsCategoryModalOpen(false);
	}

	const role = group?.role;
	const { ownerPermission, canCreateEdit } = getPermissions(role);
	const isEditing = mode === "Edit";

	if (extractErrorMessage(error) === "Group not found")
		return <ErrorText error={extractErrorMessage(error)} />;

	return (
		<>
			<h2 className={styles.title}>Group: {group?.name}</h2>

			{isLoading || isFetching ? (
				<Loading />
			) : error ? (
				<ErrorText error={extractErrorMessage(error)} />
			) : (
				<div className="buttonsContainer">
					{ownerPermission && (
						<IconButton
							icon={<IoMdPersonAdd />}
							title="Add a person to a group"
							onClick={() => setIsModalOpen(true)}
						/>
					)}
					{canCreateEdit && (
						<IconButton
							icon={<IoMdAddCircleOutline />}
							title="Create a category"
							onClick={openCategoryModal}
							variant="dark"
						/>
					)}
				</div>
			)}

			{isCategoryModalOpen && (
				<Modal
					title={`${isEditing ? "Edit category" : "Create a category"}`}
					closeModal={closeCategoryModal}
					children={
						<GroupCategoryAddEditForm
							initialValue={
								selectedCategory?.id
									? { name: selectedCategory.name }
									: defaultCategoryData
							}
							label="Category"
							groupId={Number(groupId)}
							categoryId={isEditing ? selectedCategory?.id : undefined}
							schema={groupCategorySchema}
							onCreate={createCategory}
							onUpdate={updateCategory}
							closeModal={closeCategoryModal}
							mode={mode}
						/>
					}
				/>
			)}

			{isModalOpen && (
				<Modal
					title="Add a person to group"
					closeModal={closeModal}
					children={
						<AddMemberForm groupId={Number(groupId)} closeModal={closeModal} />
					}
				/>
			)}

			<h3>Members</h3>
			{membersLoading || memberFetching ? (
				<Loading />
			) : memberError ? (
				<ErrorText error="An error occurred while fetching the group members." />
			) : (
				groupMembersResponse?.groupMembers.length &&
				groupMembersResponse?.groupMembers.map((groupMember: GroupMember) => (
					<UserInfoCard
						key={groupMember.email}
						groupId={Number(groupId)}
						user={groupMember}
						myRole={groupMembersResponse.myRole}
					/>
				))
			)}

			<h3>Categories</h3>
			{categoriesLoading || categoriesFetching ? (
				<Loading />
			) : categoriesError ? (
				<ErrorText error={"An error occured while fetching categories"} />
			) : categories?.length ? (
				categories.map((category: Category) => (
					<GroupCard
						key={category.categoryId}
						id={category.categoryId}
						name={category.name}
						type="Category"
						role={group?.role}
						groupId={Number(groupId)}
						navigateLink={`/groups/${groupId}/category/${category.categoryId}`}
						highlight={location.state?.categoryId === category.categoryId}
						openEditModal={openEditModal}
					/>
				))
			) : (
				<p>No categories yet</p>
			)}
		</>
	);
}

export default Group;
