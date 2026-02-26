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

const defaultGroupData = {
	name: "",
};

function Groups() {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const { data: groups, isLoading, error } = useGetGroupsQuery({});
	const [createNewGroup] = useCreateNewGroupMutation();
	const [updateGroup] = useUpdateGroupMutation();

	function closeModal() {
		setIsModalOpen(false);
	}

	return (
		<section>
			{isLoading && <Loading />}

			{error && <ErrorText error={"An error occuring while fetching groups"} />}

			<IconButton
				icon={<IoMdAddCircleOutline />}
				title="Create a new group"
				onClick={() => setIsModalOpen(true)}
			/>

			{isModalOpen && (
				<Modal
					title="Create a new group"
					closeModal={closeModal}
					children={
						<GroupCategoryAddEditForm
							label="Group"
							initialValue={defaultGroupData}
							schema={groupCategorySchema}
							onCreate={createNewGroup}
							onUpdate={updateGroup}
							closeModal={closeModal}
						/>
					}
				/>
			)}

			{groups && groups.length > 0 ? (
				groups.map((group: Group) => (
					<GroupCard
						key={group.groupId}
						id={group.groupId}
						type="Group"
						name={group.name}
						role={group.role}
						navigateLink={`/groups/${group.groupId}`}
					/>
				))
			) : (
				<p>No groups available</p>
			)}
		</section>
	);
}

export default Groups;
