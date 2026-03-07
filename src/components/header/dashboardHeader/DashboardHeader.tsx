import logo from "@/assets/images/logo.svg";
import { useNavigate } from "react-router-dom";
import styles from "../header.module.scss";
import { useLogoutMutation } from "../../../api/authApi";
import Searchbar from "../../searchResults/Searchbar";
import NotificationIcon from "../../notification/NotificationIcon";
import ThemeIcon from "../../theme/ThemeIcon";

function DashboardHeader() {
	const navigate = useNavigate();

	const [logout] = useLogoutMutation();

	async function handleLogout() {
		await logout(null);
		navigate("/");
	}

	return (
		<header className={`${styles.header} ${styles.dashheader}`}>
			<nav>
				<img src={logo} alt="Logo" className={styles.logo} />

				<div className={styles.searchbarDesktop}>
					<Searchbar />
				</div>
				<ul>
					<li>
						<ThemeIcon />
					</li>
					<li>
						<NotificationIcon />
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
			<div className={styles.searchbarMobile}>
				<Searchbar />
			</div>
		</header>
	);
}

export default DashboardHeader;
