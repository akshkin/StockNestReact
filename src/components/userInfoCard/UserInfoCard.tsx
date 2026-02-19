import type { GroupMember } from "../../api/groupsApi";
import { RiDeleteBin6Line, RiEditLine } from "react-icons/ri";
import styles from "./userInfoCard.module.scss";

function UserInfoCard({ user }: { user: GroupMember }) {
	const { fullName, role, isMe } = user;
	return (
		<div className={styles.userCard}>
			<span className={styles.avatar}></span>
			<p className={styles.name}>{fullName}</p>
			<p className={styles.role}>{role}</p>
			{role !== "Owner" && isMe && (
				<div className={styles.iconsContainer}>
					<button>
						<RiEditLine color="blue" />
					</button>{" "}
					<button>
						<RiDeleteBin6Line color="red" />{" "}
					</button>
				</div>
			)}
		</div>
	);
}

export default UserInfoCard;
