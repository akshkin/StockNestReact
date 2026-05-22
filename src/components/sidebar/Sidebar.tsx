import styles from "./sidebar.module.scss";
import { NavLink } from "react-router-dom";
import NotificationIcon from "../notification/NotificationIcon";
import { LayoutDashboard, UserRoundCog, UsersRound } from "lucide-react";

function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <nav>
        <ul className={styles.dashlinks}>
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `${styles.dashlink} ${isActive ? styles.active : ""}`
              }
              aria-label="Go to dashboard"
            >
              <LayoutDashboard className={styles.icon} />
              <span className={styles.text}>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/groups"
              className={({ isActive }) =>
                `${styles.dashlink} ${isActive ? styles.active : ""}`
              }
              aria-label="Go to groups"
            >
              <UsersRound className={styles.icon} />
              <span className={styles.text}>Groups</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/notifications?page=1&tab=unread"
              className={({ isActive }) =>
                `${styles.dashlink} ${isActive ? styles.active : ""}`
              }
              aria-label="Go to notifications"
            >
              <NotificationIcon />
              <span className={`${styles.text} ${styles.notificationText}`}>
                Notifications
              </span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `${styles.dashlink} ${isActive ? styles.active : ""}`
              }
              aria-label="Go to profile"
            >
              <UserRoundCog className={styles.icon} />
              <span className={styles.text}>Profile</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
