import { useLocation } from "react-router-dom";
import {
	useCreateNewGroupMutation,
	useGetGroupsQuery,
	useUpdateGroupMutation,
	type Group,
} from "../../api/groupsApi";
import ErrorText from "../../components/errorText/ErrorText";
import GroupCard from "../../components/groupCard/GroupCard";
import Loading from "../../components/loading/Loading";
import { useState } from "react";
import Modal from "../../components/modal/Modal";
import GroupCategoryAddEditForm from "../../components/groupCategoryForm/GroupCategoryAddEditForm";
import { groupSchema } from "../../schemas";

const defaultGroupData = {
	name: "",
};

function Dashboard() {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const date = new Date();
	const today = date.toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});

	const location = useLocation();
	const message = location.state?.message;
	const { data: groups, isLoading, error, refetch } = useGetGroupsQuery({});
	const [createNewGroup] = useCreateNewGroupMutation();
	const [updateGroup] = useUpdateGroupMutation();

	function closeModal() {
		setIsModalOpen(false);
		refetch(); // Refetch groups after closing the modal to get the updated list
	}

	return (
		<section>
			<p>Today is {today}</p>
			<h1 style={{ fontSize: "2em" }}>Welcome!</h1>
			{message && <p>{message}</p>}

			{isLoading && <Loading />}

			{error && <ErrorText error={"An error occuring while fetching groups"} />}

			<button onClick={() => setIsModalOpen(true)}>Create a new group</button>
			{isModalOpen && (
				<Modal
					title="Create a new group"
					closeModal={closeModal}
					children={
						<GroupCategoryAddEditForm
							label="Group"
							initialValue={defaultGroupData}
							schema={groupSchema}
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
						navigateLink={`/dashboard/group/${group.groupId}`}
					/>
				))
			) : (
				<p>No groups available</p>
			)}
		</section>
	);
}

export default Dashboard;
