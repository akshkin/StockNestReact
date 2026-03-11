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
import ConfirmDelete from "../confirmDelete/ConfirmDelete";
import ErrorText from "../errorText/ErrorText";
import { toast } from "react-toastify";
import { getPermissions } from "../../helpers/utils";

type Mode = "Edit" | "Delete";

type CardProps = {
	id: number;
	name: string;
	role?: string;
	type: "Group" | "Category";
	navigateLink: string;
	groupId?: number; // needed for category
	highlight?: boolean; // whether the card is the one that was just created or updated, used to highlight the card
};

function GroupCard({
	id,
	name,
	role,
	type,
	navigateLink,
	groupId,
	highlight = false,
}: CardProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [mode, setMode] = useState<Mode>("Edit");
	const [error, setError] = useState<string | null>(null);

	const [deleteGroup, { isLoading: deleteGroupLoading }] =
		useDeleteGroupMutation();
	const [updateGroup] = useUpdateGroupMutation();
	const [updateCategory] = useUpdateCategoryMutation();
	const [deleteCategory, { isLoading: deleteCategoryLoading }] =
		useDeleteCategoryMutation();

	const isGroup = type === "Group";

	function openModal(mode: Mode) {
		setMode(mode);
		setIsModalOpen(true);
	}

	async function handleDelete() {
		let res;
		if (isGroup) {
			res = await deleteGroup({ id: id });
		} else {
			res = await deleteCategory({ groupId, categoryId: id });
		}

		if (!("error" in res)) {
			setIsModalOpen(false);
			if (isGroup) {
				toast.success("Successfully deleted group");
			} else {
				toast.success("Successfully deleted category");
			}
		} else if ("error" in res) {
			const error = res?.error;
			if (error && "data" in error) {
				if (typeof error?.data === "string") {
					setError(error?.data);
				} else {
					setError("An error occured!");
				}
			}
		}
	}

	const modalTitle =
		mode === "Delete"
			? `Are you sure you want to delete this ${type}?`
			: `Edit ${type} Name`;

	const childContent =
		mode === "Delete" ? (
			<>
				<ConfirmDelete
					handleDelete={handleDelete}
					closeModal={() => setIsModalOpen(false)}
					isLoading={isGroup ? deleteGroupLoading : deleteCategoryLoading}
				/>
				{error && <ErrorText error={error} />}
			</>
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

	const { ownerPermission, canCreateEdit } = getPermissions(role);

	return (
		<div className={`${styles.groupCard} ${highlight ? styles.highlight : ""}`}>
			<header>
				<Link to={navigateLink}>
					<h3>{name}</h3>
				</Link>
				{isGroup && <span className={styles.role}>{role}</span>}
			</header>
			{canCreateEdit && (
				<div className={styles.buttonsContainer}>
					<button className="action-btn" onClick={() => openModal("Edit")}>
						<RiEditLine /> <span className="label">Edit</span>
					</button>
					{ownerPermission && (
						<button
							className="action-btn danger"
							onClick={() => openModal("Delete")}
						>
							<RiDeleteBin6Line />
							<span className="label">Delete</span>
						</button>
					)}
				</div>
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
