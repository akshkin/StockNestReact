import styles from "./sidebar.module.scss";
import { NavLink } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { HiUserGroup } from "react-icons/hi2";
import NotificationIcon from "../notification/NotificationIcon";

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
						>
							<RxDashboard className={styles.icon} />
							<span className={styles.text}>Dashboard</span>
						</NavLink>
					</li>
					<li>
						<NavLink
							to="/groups"
							className={({ isActive }) =>
								`${styles.dashlink} ${isActive ? styles.active : ""}`
							}
						>
							<HiUserGroup className={styles.icon} />
							<span className={styles.text}>Groups</span>
						</NavLink>
					</li>
					<li>
						<NavLink
							to="/notifications?page=1"
							className={({ isActive }) =>
								`${styles.dashlink} ${isActive ? styles.active : ""}`
							}
						>
							<NotificationIcon />
							<span className={styles.text}>Notifications</span>
						</NavLink>
					</li>
				</ul>
			</nav>
		</aside>
	);
}

export default Sidebar;
