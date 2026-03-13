import { useState } from "react";
import { RiEditLine } from "react-icons/ri";
import styles from "./itemCard.module.scss";
import { getPermissions } from "../../helpers/utils";
import type { Item } from "../../api/itemsApi";
import { formatDistanceToNow } from "date-fns";

type ItemCardProps = {
	item: Item;
	setSelectedItems: React.Dispatch<React.SetStateAction<number[]>>;
	isMainChecked: boolean; // main checkbox in the table header
	role: string;
	highlight?: boolean; // whether the item is the one that was just created or updated, used to highlight the item card
	openEditItemModal: (id: number, name: string, quantity: number) => void;
};

function ItemCard({
	item,
	setSelectedItems,
	isMainChecked,
	role,
	openEditItemModal,
	highlight = false,
}: ItemCardProps) {
	const [isChecked, setIsChecked] = useState(false);

	const { itemId, name, quantity, createdAt, createdBy, updatedAt, updatedBy } =
		item;
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

	const { ownerPermission, canCreateEdit } = getPermissions(role);

	return (
		<tr className={`${styles.itemCard} ${highlight && styles.highlight}`}>
			{ownerPermission && (
				<td>
					<input
						type="checkbox"
						name="isChecked"
						checked={isMainChecked ? true : isChecked} // set checked to true if main checkbox is checked
						onChange={(e) => handleChange(e)}
					/>
				</td>
			)}
			<td className={styles.nameColumn}>
				<span className={styles.nameWithColor}>
					<span
						className={styles.colorAccent}
						style={{ backgroundColor: stringToColor(name) }}
					/>
					<h4 className={styles.name}>{name}</h4>
				</span>
				<p className={styles.updatedText}>
					{updatedAt
						? `Updated by ${updatedBy} ${formatDistanceToNow(new Date(updatedAt))}`
						: `Created by ${createdBy} ${formatDistanceToNow(new Date(createdAt))}  `}
				</p>
			</td>
			<td className={styles.quantity}>
				<p>{quantity}</p>
			</td>
			{canCreateEdit && (
				<td className={styles.edit}>
					<button
						className="action-btn"
						onClick={() => openEditItemModal(itemId, name, quantity)}
					>
						<RiEditLine /> <span className="label">Edit</span>
					</button>
				</td>
			)}
		</tr>
	);
}

export default ItemCard;
