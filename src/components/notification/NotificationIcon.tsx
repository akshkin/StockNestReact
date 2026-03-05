import { PiBellFill, PiBellLight } from "react-icons/pi";
import { Link } from "react-router-dom";
import styles from "./notificationIcon.module.scss";
import { useGetUnreadNotificationsCountQuery } from "../../api/notificationsApi";

function NotificationIcon() {
	const { data: unreadCount } = useGetUnreadNotificationsCountQuery();

	return (
		<Link to="/notifications?tab=unread" className={styles.notificationsLink}>
			{unreadCount && unreadCount > 0 ? (
				<PiBellFill className={styles.bellIcon} />
			) : (
				<PiBellLight className={styles.bellIcon} />
			)}

			{unreadCount && unreadCount > 0 ? (
				<span className={styles.notificationBadge}>{unreadCount}</span>
			) : null}
		</Link>
	);
}

export default NotificationIcon;
