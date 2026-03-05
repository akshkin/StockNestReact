import logo from "@/assets/images/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import styles from "../header.module.scss";
import { useLogoutMutation } from "../../../api/authApi";
import { PiBellFill, PiBellLight } from "react-icons/pi";
import { useGetUnreadNotificationsCountQuery } from "../../../api/notificationsApi";

function DashboardHeader() {
	const navigate = useNavigate();

	const [logout] = useLogoutMutation();
	const { data: unreadCount } = useGetUnreadNotificationsCountQuery();

	async function handleLogout() {
		await logout(null);
		navigate("/");
	}

	return (
		<header className={`${styles.header} ${styles.dashheader}`}>
			<Link to="/">
				<img src={logo} alt="Logo" className={styles.logo} />
			</Link>
			<nav>
				<ul>
					<li>
						<Link
							to="/notifications?tab=unread"
							className={styles.notificationsLink}
						>
							{unreadCount && unreadCount > 0 ? (
								<PiBellFill className={styles.bellIcon} />
							) : (
								<PiBellLight className={styles.bellIcon} />
							)}

							{unreadCount && unreadCount > 0 ? (
								<span className={styles.notificationBadge}>{unreadCount}</span>
							) : null}
						</Link>
					</li>
					<li>
						<button
							type="button"
							className={styles.register}
							onClick={handleLogout}
						>
							Logout
						</button>
					</li>
				</ul>
			</nav>
		</header>
	);
}

export default DashboardHeader;
