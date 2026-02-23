import { useState } from "react";
import { RiDeleteBin6Line, RiEditLine } from "react-icons/ri";
import Modal from "../modal/Modal";
import ItemForm from "../itemForm/ItemForm";

type ItemCardProps = {
	groupId: number;
	categoryId: number;
	itemId: number;
	name: string;
	quantity: number;
};

function ItemCard({
	groupId,
	categoryId,
	itemId,
	name,
	quantity,
}: ItemCardProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<div>
			<h3>{name}</h3>
			<p>{quantity}</p>
			<button onClick={() => setIsModalOpen(true)}>
				<RiEditLine /> Edit
			</button>
			{/* <button
				onClick={() => openModal("Delete")}
			>
				<RiDeleteBin6Line />
				Delete
			</button> */}
			{isModalOpen && (
				<Modal
					title="Edit item"
					closeModal={() => setIsModalOpen(false)}
					children={
						<ItemForm
							mode="Edit"
							groupId={groupId}
							categoryId={categoryId}
							itemId={itemId}
							closeModal={() => setIsModalOpen(false)}
							initialValues={{
								name,
								quantity,
							}}
						/>
					}
				/>
			)}
		</div>
	);
}

export default ItemCard;
