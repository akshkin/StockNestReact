import { useState } from "react";
import { useDeleteGroupMutation, type Group } from "../../api/groupsApi";
import Modal from "../modal/Modal";
import styles from "./groupCard.module.scss";
import { Link } from "react-router-dom";
import { RiDeleteBin6Line, RiEditLine } from "react-icons/ri";
import GroupCategoryAddEditForm from "../groupCategoryForm/GroupCategoryAddEditForm";

type Mode = "edit" | "delete";

function GroupCard({ group }: { group: Group }) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [mode, setMode] = useState<Mode>("edit");

	const [deleteGroup] = useDeleteGroupMutation();

	function openModal(mode: Mode) {
		setMode(mode);
		setIsModalOpen(true);
	}

	async function handleDelete() {
		await deleteGroup({ id: group.groupId });
		setIsModalOpen(false);
	}

	const deleteModalContent = () => (
		<div className={styles.buttonsContainer}>
			<button className={styles.deleteButton} onClick={handleDelete}>
				Confirm Delete
			</button>

			<button type="button" onClick={() => setIsModalOpen(false)}>
				Cancel
			</button>
		</div>
	);

	const modalTitle =
		mode === "delete"
			? "Are you sure you want to delete this group?"
			: "Edit Group Name";

	const childContent =
		mode === "delete" ? (
			deleteModalContent()
		) : (
			<GroupCategoryAddEditForm
				id={group.groupId}
				name="Group name"
				closeModal={() => setIsModalOpen(false)}
				value={group.name}
			/>
		);

	return (
		<div className={styles.groupCard}>
			<header>
				<Link to={`/dashboard/group/${group.groupId}`}>
					<h3>{group.name}</h3>
				</Link>
				<span className={styles.role}>{group.role}</span>
			</header>
			{group.role === "Owner" || group.role === "Co-Owner" ? (
				<div className={styles.buttonsContainer}>
					<button onClick={() => openModal("edit")}>
						<RiEditLine /> Edit
					</button>
					<button
						className={styles.deleteButton}
						onClick={() => openModal("delete")}
					>
						<RiDeleteBin6Line />
						Delete
					</button>
				</div>
			) : (
				group.role === "Member" && (
					<button onClick={() => openModal("edit")}>
						<RiEditLine /> Edit
					</button>
				)
			)}
			{isModalOpen && (
				<Modal
					title={modalTitle}
					closeModal={() => setIsModalOpen(false)}
					children={childContent}
				/>
			)}{" "}
		</div>
	);
}

export default GroupCard;
