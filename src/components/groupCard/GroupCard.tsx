import type { Group } from "../../api/groupsApi";
import styles from "./groupCard.module.scss";

function GroupCard({ group }: { group: Group }) {
	return (
		<div className={styles.groupCard}>
			<h3>{group.name}</h3>
		</div>
	);
}

export default GroupCard;
