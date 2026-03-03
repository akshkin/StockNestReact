import { useState } from "react";
import { RiEditLine } from "react-icons/ri";
import Modal from "../modal/Modal";
import ItemForm from "../itemForm/ItemForm";
import styles from "./itemCard.module.scss";

type ItemCardProps = {
	groupId: number;
	categoryId: number;
	itemId: number;
	name: string;
	quantity: number;
	setSelectedItems: React.Dispatch<React.SetStateAction<number[]>>;
	isMainChecked: boolean; // main checkbox in the table header
	highlight?: boolean; // whether the item is the one that was just created or updated, used to highlight the item card
};

function ItemCard({
	groupId,
	categoryId,
	itemId,
	name,
	quantity,
	setSelectedItems,
	isMainChecked,
	highlight = false,
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

	// show a small circle with dynamic colors based on the name of the item
	function stringToColor(str: string) {
		let hash = 0;
		for (let i = 0; i < str.length; i++) {
			hash = str.charCodeAt(i) + ((hash << 5) - hash);
		}
		const hue = Math.abs(hash % 360);
		return `hsl(${hue}, 70%, 80%)`;
	}

	console.log(styles.highlight);

	return (
		<tr className={`${styles.itemCard} ${highlight && styles.highlight}`}>
			<td>
				<input
					type="checkbox"
					name="isChecked"
					checked={isMainChecked ? true : isChecked} // set checked to true if main checkbox is checked
					onChange={(e) => handleChange(e)}
				/>
			</td>
			<td className={styles.nameColumn}>
				<span
					className={styles.colorAccent}
					style={{ backgroundColor: stringToColor(name) }}
				/>
				<h4 className={styles.name}>{name}</h4>
			</td>
			<td className={styles.quantity}>
				<p>{quantity}</p>
			</td>
			<td className={styles.edit}>
				<button className="action-btn" onClick={() => setIsModalOpen(true)}>
					<RiEditLine /> <span className="label">Edit</span>
				</button>
			</td>

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
		</tr>
	);
}

export default ItemCard;
