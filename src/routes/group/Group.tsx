import { useLocation, useNavigate, useParams } from "react-router-dom";
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
import {
	IoIosArrowRoundBack,
	IoMdPersonAdd,
	IoMdAddCircleOutline,
} from "react-icons/io";
import IconButton from "../../components/iconButton/IconButton";
import AddMemberForm from "./AddMemberForm";

type categorySchema = z.infer<typeof groupCategorySchema>;

const defaultCategoryData: categorySchema = {
	name: "",
};
function Group() {
	const { groupId } = useParams();
	const [isModalOpen, setIsModalOpen] = useState(false);

	const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

	const { data: group, isLoading, error } = useGetGroupByIdQuery(groupId);

	const {
		data: groupMembersResponse,
		isLoading: membersLoading,
		error: memberError,
	} = useGetGroupMembersQuery(groupId);

	const [createCategory] = useCreateCategoryMutation();
	const [updateCategory] = useUpdateCategoryMutation();
	const { data: categories, error: categoriesError } =
		useGetCategoriesQuery(groupId);

	const navigate = useNavigate();
	const location = useLocation();

	function closeModal() {
		setIsModalOpen(false);
	}

	if (isLoading) return <Loading />;

	return (
		<>
			{error && (
				<ErrorText error="An error occurred while fetching the group details." />
			)}
			{memberError && (
				<ErrorText error="An error occurred while fetching the group members." />
			)}
			<button className="back-button" onClick={() => navigate(-1)}>
				<IoIosArrowRoundBack />
				Back to Dashboard
			</button>
			<h2 className={styles.title}>Group: {group?.name}</h2>

			<div className="buttonsContainer">
				{group?.role === "Owner" && (
					<IconButton
						icon={<IoMdPersonAdd />}
						title="Add a person to a group"
						onClick={() => setIsModalOpen(true)}
					/>
				)}
				<IconButton
					icon={<IoMdAddCircleOutline />}
					title="Create a category"
					onClick={() => setIsCategoryModalOpen(true)}
					variant="dark"
				/>
			</div>

			{isCategoryModalOpen && (
				<Modal
					title="Add a category"
					closeModal={() => setIsCategoryModalOpen(false)}
					children={
						<GroupCategoryAddEditForm
							initialValue={defaultCategoryData}
							label="Category"
							groupId={Number(groupId)}
							schema={groupCategorySchema}
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
					children={
						<AddMemberForm groupId={Number(groupId)} closeModal={closeModal} />
					}
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

			<h3>Categories</h3>
			{categories?.length ? (
				categories.map((category: Category) => (
					<GroupCard
						key={category.categoryId}
						id={category.categoryId}
						name={category.name}
						type="Category"
						role={group.role}
						groupId={Number(groupId)}
						navigateLink={`/groups/${groupId}/category/${category.categoryId}`}
						highlight={location.state?.categoryId === category.categoryId}
					/>
				))
			) : (
				<p>No categories yet</p>
			)}
			{categoriesError && (
				<ErrorText error={"An error occured while fetching categories"} />
			)}
		</>
	);
}

export default Group;
