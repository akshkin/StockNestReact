import { useState } from "react";
import {
	useDeleteGroupMutation,
	useUpdateGroupMutation,
} from "../../api/groupsApi";
import Modal from "../modal/Modal";
import styles from "./groupCard.module.scss";
import { Link } from "react-router-dom";
import { RiDeleteBin6Line, RiEditLine } from "react-icons/ri";
import GroupCategoryAddEditForm from "../groupCategoryForm/GroupCategoryAddEditForm";
import { groupCategorySchema } from "../../schemas";
import {
	useDeleteCategoryMutation,
	useUpdateCategoryMutation,
} from "../../api/categoriesApi";

type Mode = "Edit" | "Delete";

type CardProps = {
	id: number;
	name: string;
	role?: string;
	type: "Group" | "Category";
	navigateLink: string;
	groupId?: number; // needed for category
};

function GroupCard({ id, name, role, type, navigateLink, groupId }: CardProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [mode, setMode] = useState<Mode>("Edit");

	const [deleteGroup] = useDeleteGroupMutation();
	const [updateGroup] = useUpdateGroupMutation();
	const [updateCategory] = useUpdateCategoryMutation();
	const [deleteCategory] = useDeleteCategoryMutation();

	const isGroup = type === "Group";

	function openModal(mode: Mode) {
		setMode(mode);
		setIsModalOpen(true);
	}

	async function handleDelete() {
		if (isGroup) {
			await deleteGroup({ id: id });
		} else {
			await deleteCategory({ groupId, categoryId: id });
		}
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
		mode === "Delete"
			? `Are you sure you want to delete this ${type}?`
			: `Edit ${type} Name`;

	const childContent =
		mode === "Delete" ? (
			deleteModalContent()
		) : (
			// edit group or category
			<GroupCategoryAddEditForm
				groupId={isGroup ? id : groupId}
				categoryId={isGroup ? undefined : id}
				label={type}
				schema={groupCategorySchema}
				onUpdate={isGroup ? updateGroup : updateCategory}
				closeModal={() => setIsModalOpen(false)}
				initialValue={{ name: name }}
				mode="Edit"
			/>
		);

	return (
		<div className={styles.groupCard}>
			<header>
				<Link to={navigateLink}>
					<h3>{name}</h3>
				</Link>
				{isGroup && <span className={styles.role}>{role}</span>}
			</header>
			{(role && role === "Owner") || role === "Co-Owner" ? (
				<div className={styles.buttonsContainer}>
					<button onClick={() => openModal("Edit")}>
						<RiEditLine /> Edit
					</button>
					<button
						className={styles.deleteButton}
						onClick={() => openModal("Delete")}
					>
						<RiDeleteBin6Line />
						Delete
					</button>
				</div>
			) : (
				role &&
				role === "Member" && (
					<button onClick={() => openModal("Edit")}>
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
