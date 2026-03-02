import { formatDistanceToNow } from "date-fns";
import styles from "./notificationCard.module.scss";
import {
	MdGroup,
	MdOutlineCreateNewFolder,
	MdOutlineGroupAdd,
	MdOutlineGroupRemove,
} from "react-icons/md";
import { RxUpdate } from "react-icons/rx";
import { CgFileRemove, CgFolderRemove } from "react-icons/cg";
import { IoCreateOutline } from "react-icons/io5";

type NotificationCardProps = {
	id: number;
	message: string;
	type: string;
	seen: boolean;
	createdAt: string;
	groupId?: number | null;
	categoryId?: number | null;
	itemId?: number | null;
};

function NotificationCard({
	id,
	message,
	type,
	seen,
	createdAt,
	groupId,
	categoryId,
	itemId,
}: NotificationCardProps) {
	const icon = () => {
		switch (type) {
			case "UserJoinedGroup":
				return <MdOutlineGroupAdd />;
			case "UserRemovedFromGroup":
				return <MdOutlineGroupRemove />;
			case "GroupUpdated":
			case "GroupDeleted":
				return <MdGroup />;
			case "ItemUpdated":
			case "CategoryUpdated":
				return <RxUpdate />;
			case "CategoryCreated":
				return <MdOutlineCreateNewFolder />;
			case "CategoryDeleted":
				return <CgFolderRemove />;
			case "ItemCreated":
				return <IoCreateOutline />;
			case "ItemDeleted":
				return <CgFileRemove />;
			default:
				return "🔔";
		}
	};

	return (
		<div
			className={`${styles.notificationCard} ${seen ? styles.seen : styles.unseen}`}
		>
			<span className={styles.avatar}>{icon()}</span>
			<div className={styles.content}>
				<p>{message}</p>
				<span className={styles.timestamp}>
					{formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
				</span>
			</div>
		</div>
	);
}

export default NotificationCard;
