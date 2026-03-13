import { useState } from "react";
import {
	useCreateNewGroupMutation,
	useGetGroupsQuery,
	useUpdateGroupMutation,
	type Group,
} from "../../api/groupsApi";
import Loading from "../../components/loading/Loading";
import ErrorText from "../../components/errorText/ErrorText";
import IconButton from "../../components/iconButton/IconButton";
import { IoMdAddCircleOutline } from "react-icons/io";
import Modal from "../../components/modal/Modal";
import GroupCategoryAddEditForm from "../../components/groupCategoryForm/GroupCategoryAddEditForm";
import { groupCategorySchema } from "../../schemas";
import GroupCard from "../../components/groupCard/GroupCard";
import { useLocation } from "react-router-dom";

const defaultGroupData = {
	name: "",
};

function Groups() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedGroup, setSelectedGroup] = useState<
		{ id: number; name: string } | undefined
	>(undefined);
	const [mode, setMode] = useState<"Add" | "Edit">();

	const { data: groups, isLoading, error } = useGetGroupsQuery({});
	const [createNewGroup] = useCreateNewGroupMutation();
	const [updateGroup] = useUpdateGroupMutation();
	const location = useLocation();

	function openEditModal(id: number, name: string) {
		setMode("Edit");
		setSelectedGroup({ id, name });
		setIsModalOpen(true);
	}

	function openModal() {
		setMode("Add");
		setIsModalOpen(true);
	}

	function closeModal() {
		setSelectedGroup(undefined);
		setIsModalOpen(false);
	}

	const isEditing = mode === "Edit";

	return (
		<section>
			{isLoading && <Loading />}

			{error && <ErrorText error={"An error occuring while fetching groups"} />}

			<IconButton
				icon={<IoMdAddCircleOutline />}
				title="Create a new group"
				onClick={openModal}
			/>

			{isModalOpen && (
				<Modal
					title={`${isEditing ? "Edit group" : "Create a new group"}`}
					closeModal={closeModal}
					children={
						<GroupCategoryAddEditForm
							label="Group"
							groupId={isEditing ? selectedGroup?.id : undefined}
							initialValue={
								selectedGroup?.id
									? { name: selectedGroup.name }
									: defaultGroupData
							}
							schema={groupCategorySchema}
							onCreate={createNewGroup}
							onUpdate={updateGroup}
							closeModal={closeModal}
							mode={mode}
						/>
					}
				/>
			)}

			{groups && groups.length > 0 ? (
				groups.map((group: Group) => (
					<GroupCard
						data={group}
						type="Group"
						navigateLink={`/groups/${group.groupId}`}
						highlight={location.state?.groupId === group.groupId}
						openEditModal={openEditModal}
					/>
				))
			) : (
				<p>No groups available</p>
			)}
		</section>
	);
}

export default Groups;
