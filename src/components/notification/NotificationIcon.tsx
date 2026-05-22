import styles from "./notificationIcon.module.scss";
import { useGetUnreadNotificationsCountQuery } from "../../api/notificationsApi";
import { Bell, BellDot } from "lucide-react";

function NotificationIcon() {
  const { data: unreadCount } = useGetUnreadNotificationsCountQuery();

  return (
    <span
      className={styles.notificationsLink}
      aria-label="Go to notifications page"
    >
      {unreadCount && unreadCount > 0 ? (
        <BellDot size={20} className={styles.bellIcon} />
      ) : (
        <Bell size={20} className={styles.bellIcon} />
      )}

      {unreadCount && unreadCount > 0 ? (
        <span className={styles.notificationBadge}>{unreadCount}</span>
      ) : null}
    </span>
  );
}

export default NotificationIcon;
