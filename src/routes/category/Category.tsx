import { useNavigate, useParams } from "react-router-dom";
import { useGetCategoryByIdQuery } from "../../api/categoriesApi";
import ErrorText from "../../components/errorText/ErrorText";
import Loading from "../../components/loading/Loading";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useState } from "react";
import Modal from "../../components/modal/Modal";
import ItemForm from "../../components/itemForm/ItemForm";
import {
	useDeleteItemsMutation,
	useGetItemsQuery,
	type Item,
} from "../../api/itemsApi";
import ItemCard from "../../components/itemCard/ItemCard";

function Category() {
	const { groupId, categoryId } = useParams();
	const navigate = useNavigate();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedItems, setSelectedItems] = useState<number[]>([]);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	const {
		data: category,
		isLoading: categoryLoading,
		error,
	} = useGetCategoryByIdQuery({
		groupId,
		categoryId,
	});
	const { data: items } = useGetItemsQuery({ groupId, categoryId });
	const [deleteItems] = useDeleteItemsMutation();

	async function handleDelete() {
		const response = await deleteItems({
			groupId,
			categoryId,
			itemIds: selectedItems,
		});
		if (!("error" in response)) {
			setSelectedItems([]);
		}
	}

	if (categoryLoading) return <Loading />;
	return (
		<div>
			<button className="back-button" onClick={() => navigate(-1)}>
				<IoIosArrowRoundBack />
				Back to group
			</button>
			<button onClick={() => setIsModalOpen(true)}>Add an item</button>
			{selectedItems?.length > 0 && (
				<button onClick={() => setIsDeleteModalOpen(true)}>
					Delete selected items
				</button>
			)}
			<h2>Category {category?.name}</h2>
			{error && (
				<ErrorText error={"An error occured while fetching category"} />
			)}
			{items && items.length > 0 ? (
				items.map((item: Item) => (
					<ItemCard
						key={item.itemId}
						groupId={Number(groupId)}
						categoryId={Number(categoryId)}
						itemId={Number(item.itemId)}
						name={item.name}
						quantity={item.quantity}
						setSelectedItems={setSelectedItems}
					/>
				))
			) : (
				<p>No items yet</p>
			)}
			{isModalOpen && (
				<Modal
					title="Add an item"
					closeModal={() => setIsModalOpen(false)}
					children={
						<ItemForm
							mode="Add"
							groupId={Number(groupId)}
							categoryId={Number(categoryId)}
							closeModal={() => setIsModalOpen(false)}
						/>
					}
				/>
			)}
			{isDeleteModalOpen && (
				<Modal
					title="Are you sure you want to delete these items from this category?"
					closeModal={() => setIsDeleteModalOpen(false)}
					children={<button onClick={handleDelete}>Confirm</button>}
				/>
			)}
		</div>
	);
}

export default Category;
