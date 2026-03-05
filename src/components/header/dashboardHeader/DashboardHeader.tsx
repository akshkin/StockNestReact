import logo from "@/assets/images/logo.svg";
import { Link, useNavigate } from "react-router-dom";
import styles from "../header.module.scss";
import { useLogoutMutation } from "../../../api/authApi";

function DashboardHeader() {
	const navigate = useNavigate();

	const [logout] = useLogoutMutation();

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
