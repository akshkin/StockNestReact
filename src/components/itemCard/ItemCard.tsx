import { useState } from "react";
import { RiEditLine } from "react-icons/ri";
import Modal from "../modal/Modal";
import ItemForm from "../itemForm/ItemForm";

type ItemCardProps = {
	groupId: number;
	categoryId: number;
	itemId: number;
	name: string;
	quantity: number;
	setSelectedItems: React.Dispatch<React.SetStateAction<number[]>>;
};

function ItemCard({
	groupId,
	categoryId,
	itemId,
	name,
	quantity,
	setSelectedItems,
}: ItemCardProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isChecked, setIsChecked] = useState(false);

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		setIsChecked(e.target.checked);

		setSelectedItems((prev) =>
			prev.includes(itemId)
				? prev.filter((item) => item !== itemId)
				: [...prev, Number(itemId)],
		);
	}

	return (
		<div>
			<input
				type="checkbox"
				name="isChecked"
				checked={isChecked}
				onChange={(e) => handleChange(e)}
			/>
			<h3>{name}</h3>
			<p>{quantity}</p>
			<button onClick={() => setIsModalOpen(true)}>
				<RiEditLine /> Edit
			</button>
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
