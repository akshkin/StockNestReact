import { useState } from "react";
import { useDeleteGroupMutation } from "../../api/groupsApi";
import Modal from "../modal/Modal";
import styles from "./groupCard.module.scss";
import { Link } from "react-router-dom";
import { RiDeleteBin6Line, RiEditLine } from "react-icons/ri";
import { useDeleteCategoryMutation } from "../../api/categoriesApi";
import ConfirmDelete from "../confirmDelete/ConfirmDelete";
import ErrorText from "../errorText/ErrorText";
import { toast } from "react-toastify";
import { getPermissions } from "../../helpers/utils";

type CardProps = {
	id: number;
	name: string;
	role?: string;
	type: "Group" | "Category";
	navigateLink: string;
	groupId?: number; // needed for category
	highlight?: boolean; // whether the card is the one that was just created or updated, used to highlight the card
	openEditModal: (id: number, name: string) => void;
};

function GroupCard({
	id,
	name,
	role,
	type,
	navigateLink,
	groupId,
	highlight = false,
	openEditModal,
}: CardProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [deleteGroup, { isLoading: deleteGroupLoading }] =
		useDeleteGroupMutation();
	const [deleteCategory, { isLoading: deleteCategoryLoading }] =
		useDeleteCategoryMutation();

	const isGroup = type === "Group";

	function openModal() {
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
					<button
						className="action-btn"
						onClick={() => openEditModal(id, name)}
					>
						<RiEditLine /> <span className="label">Edit</span>
					</button>
					{ownerPermission && (
						<button className="action-btn danger" onClick={openModal}>
							<RiDeleteBin6Line />
							<span className="label">Delete</span>
						</button>
					)}
				</div>
			)}
			{isModalOpen && (
				<Modal
					title={`Are you sure you want to delete this ${type}?`}
					closeModal={() => setIsModalOpen(false)}
					children={
						<>
							<ConfirmDelete
								handleDelete={handleDelete}
								closeModal={() => setIsModalOpen(false)}
								isLoading={isGroup ? deleteGroupLoading : deleteCategoryLoading}
							/>
							{error && <ErrorText error={error} />}
						</>
					}
				/>
			)}{" "}
		</div>
	);
}

export default GroupCard;
