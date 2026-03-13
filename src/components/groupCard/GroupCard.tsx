import { useState } from "react";
import { useDeleteGroupMutation, type Group } from "../../api/groupsApi";
import Modal from "../modal/Modal";
import styles from "./groupCard.module.scss";
import { Link } from "react-router-dom";
import { RiDeleteBin6Line, RiEditLine } from "react-icons/ri";
import {
	useDeleteCategoryMutation,
	type Category,
} from "../../api/categoriesApi";
import ConfirmDelete from "../confirmDelete/ConfirmDelete";
import ErrorText from "../errorText/ErrorText";
import { toast } from "react-toastify";
import { getPermissions } from "../../helpers/utils";
import { formatDistanceToNow } from "date-fns";

type BaseCardProps = {
	highlight?: boolean;
	openEditModal: (id: number, name: string) => void;
};

type GroupCardProps = BaseCardProps & {
	type: "Group";
	data: Group;
	navigateLink: string;
};

type CategoryCardProps = BaseCardProps & {
	type: "Category";
	data: Category;
	role: string;
	groupId: number;
	navigateLink: string;
};

type CardProps = GroupCardProps | CategoryCardProps;

function GroupCard(props: CardProps) {
	const { data, type, navigateLink, highlight, openEditModal } = props;

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
			res = await deleteGroup({ id: data.groupId });
		} else {
			res = await deleteCategory({
				groupId: props.groupId,
				categoryId: data.categoryId,
			});
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

	const myRole = isGroup ? data?.role : props?.role;
	const { ownerPermission, canCreateEdit } = getPermissions(myRole);

	return (
		<div className={`${styles.groupCard} ${highlight ? styles.highlight : ""}`}>
			<header>
				<Link to={navigateLink}>
					<h3>{data?.name}</h3>
				</Link>
				{isGroup && <span className={styles.role}>{data?.role}</span>}
			</header>
			<p className={styles.updatedText}>
				{data?.updatedBy
					? `Updated by ${data.updatedBy} ${formatDistanceToNow(new Date(data.updatedAt))} ago`
					: `Created by ${data.createdBy} ${formatDistanceToNow(new Date(data.createdAt))} ago`}
			</p>
			{canCreateEdit && (
				<div className={styles.buttonsContainer}>
					<button
						className="action-btn"
						onClick={() =>
							openEditModal(
								isGroup ? data?.groupId : data?.categoryId,
								data?.name,
							)
						}
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
