import { PiBellFill, PiBellLight } from "react-icons/pi";
import styles from "./notificationIcon.module.scss";
import { useGetUnreadNotificationsCountQuery } from "../../api/notificationsApi";

function NotificationIcon() {
	const { data: unreadCount } = useGetUnreadNotificationsCountQuery();

	return (
		<span className={styles.notificationsLink}>
			{unreadCount && unreadCount > 0 ? (
				<PiBellFill className={styles.bellIcon} />
			) : (
				<PiBellLight className={styles.bellIcon} />
			)}

			{unreadCount && unreadCount > 0 ? (
				<span className={styles.notificationBadge}>{unreadCount}</span>
			) : null}
		</span>
	);
}

export default NotificationIcon;
