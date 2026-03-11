import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { useGetCategoryByIdQuery } from "../../api/categoriesApi";
import ErrorText from "../../components/errorText/ErrorText";
import Loading from "../../components/loading/Loading";
import { IoMdAddCircleOutline } from "react-icons/io";
import React, { useState } from "react";
import Modal from "../../components/modal/Modal";
import ItemForm from "../../components/itemForm/ItemForm";
import {
	useDeleteItemsMutation,
	useGetItemsQuery,
	type Item,
} from "../../api/itemsApi";
import ItemCard from "../../components/itemCard/ItemCard";
import IconButton from "../../components/iconButton/IconButton";
import { RiDeleteBin6Line } from "react-icons/ri";
import ConfirmDelete from "../../components/confirmDelete/ConfirmDelete";
import styles from "./category.module.scss";
import Pagination from "../../components/pagination/Pagination";
import { toast } from "react-toastify";
import { getPermissions } from "../../helpers/utils";

function Category() {
	const { groupId, categoryId } = useParams();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedItems, setSelectedItems] = useState<number[]>([]);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isMainChecked, setIsMainChecked] = useState(false);
	const location = useLocation();
	const [searchParams, setSearchParams] = useSearchParams();
	const [selectedItem, setSelectedItem] = useState<
		{ id: number; name: string; quantity: number } | undefined
	>(undefined);
	const [mode, setMode] = useState<"Add" | "Edit">();

	const initialPage = Number(searchParams.get("page") ?? 1);

	const {
		data: category,
		isLoading: categoryLoading,
		error: categoryError,
		isFetching: categoryFetching,
	} = useGetCategoryByIdQuery({
		groupId,
		categoryId,
	});

	const {
		data: itemsResponse,
		isLoading: itemsLoading,
		isFetching: itemsFetching,
		isError: itemsError,
	} = useGetItemsQuery({
		groupId: Number(groupId),
		categoryId: Number(categoryId),
		page: initialPage,
	});

	const [
		deleteItems,
		{ isLoading: deleteItemsLoading, isError: deleteItemsError },
	] = useDeleteItemsMutation();

	// handle change for main checkbox to select/unselect all items
	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		setIsMainChecked(e.target.checked);
		if (e.target.checked) {
			setSelectedItems(
				itemsResponse?.items.map((item: Item) => item.itemId) || [],
			);
		} else {
			setSelectedItems([]);
		}
	}

	async function handleDelete() {
		const response = await deleteItems({
			groupId,
			categoryId,
			itemIds: selectedItems,
		});
		if (!("error" in response)) {
			setSelectedItems([]);
			setIsDeleteModalOpen(false);
			toast.success("Successfully deleted item(s)!");
		}
	}

	function openModal() {
		setMode("Add");
		setIsModalOpen(true);
	}

	function openEditItemModal(id: number, name: string, quantity: number) {
		setSelectedItem({
			id,
			name,
			quantity,
		});
		setMode("Edit");
		setIsModalOpen(true);
	}

	function closeModal() {
		setSelectedItem(undefined);
		setIsModalOpen(false);
	}

	function onPageChange(newPage: number) {
		const params = new URLSearchParams(searchParams.toString());
		params.set("page", newPage.toString());
		setSearchParams(params);
	}

	const items = itemsResponse?.items || [];

	const { ownerPermission, canCreateEdit } = getPermissions(
		itemsResponse?.myRole,
	);

	const isEditing = mode === "Edit";

	return (
		<div>
			{categoryLoading || categoryFetching ? (
				<Loading />
			) : categoryError ? (
				<ErrorText error={"An error occured while fetching category"} />
			) : (
				<div className="buttonsContainer">
					{canCreateEdit && (
						<IconButton
							icon={<IoMdAddCircleOutline />}
							title="Add an item"
							onClick={openModal}
						/>
					)}

					{selectedItems?.length > 0 && ownerPermission && (
						<IconButton
							icon={<RiDeleteBin6Line />}
							title="Delete selected items"
							variant="danger"
							onClick={() => setIsDeleteModalOpen(true)}
						/>
					)}
				</div>
			)}

			<h2>Category {category?.name}</h2>

			{itemsLoading || itemsFetching ? (
				<Loading />
			) : itemsError ? (
				<ErrorText error="An error occured while loading items" />
			) : items && items?.length > 0 ? (
				<>
					<table className={styles.table}>
						<thead>
							<tr>
								{canCreateEdit && (
									<th className={styles.columnOne}>
										<input
											type="checkbox"
											checked={isMainChecked}
											onChange={(e) => handleChange(e)}
										/>
									</th>
								)}
								<th>Item Name</th>
								<th className={styles.qty}>Qty</th>
								{canCreateEdit && <th className={styles.edit}>Edit</th>}
							</tr>
						</thead>
						<tbody>
							{items?.map((item: Item) => (
								<ItemCard
									key={item.itemId}
									groupId={Number(groupId)}
									categoryId={Number(categoryId)}
									itemId={Number(item.itemId)}
									name={item.name}
									quantity={item.quantity}
									setSelectedItems={setSelectedItems}
									isMainChecked={isMainChecked}
									highlight={location.state?.itemId === item.itemId}
									role={itemsResponse?.myRole || "Viewer"}
									openEditItemModal={openEditItemModal}
								/>
							))}
						</tbody>
					</table>

					{itemsResponse && itemsResponse?.totalCount > 10 && (
						<Pagination
							currentPage={initialPage}
							hasNextPage={!!itemsResponse?.hasNextPage}
							onPageChange={onPageChange}
						/>
					)}
				</>
			) : (
				<p>No items yet</p>
			)}

			{isModalOpen && (
				<Modal
					title={`${isEditing ? "Edit item" : "Add an item"}`}
					closeModal={closeModal}
					children={
						<ItemForm
							mode={mode!}
							groupId={Number(groupId)}
							categoryId={Number(categoryId)}
							closeModal={closeModal}
							initialValues={
								selectedItem?.id
									? {
											name: selectedItem?.name,
											quantity: selectedItem?.quantity,
										}
									: undefined
							}
							itemId={selectedItem?.id}
						/>
					}
				/>
			)}
			{isDeleteModalOpen && (
				<Modal
					title="Are you sure you want to delete these items from this category?"
					closeModal={() => setIsDeleteModalOpen(false)}
					children={
						<>
							<ConfirmDelete
								handleDelete={handleDelete}
								closeModal={() => setIsDeleteModalOpen(false)}
								isLoading={deleteItemsLoading}
							/>
							{deleteItemsError && (
								<ErrorText error="An error occured while deleting items" />
							)}
						</>
					}
				/>
			)}
		</div>
	);
}

export default Category;
