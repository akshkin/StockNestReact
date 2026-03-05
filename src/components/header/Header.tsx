import logo from "@/assets/images/logo.svg";
import styles from "./header.module.scss";
import { Link, useNavigate } from "react-router-dom";
import type { RootState } from "../../store";
import { useSelector } from "react-redux";
import { useLogoutMutation } from "../../api/authApi";

function Header() {
	const currentUser = useSelector((state: RootState) => state.auth.token);
	const navigate = useNavigate();

	const [logout] = useLogoutMutation();

	async function handleLogout() {
		await logout(null);
		navigate("/");
	}

	return (
		<header className={styles.header}>
			<Link to="/">
				<img src={logo} alt="Logo" className={styles.logo} />
			</Link>
			<nav>
				<ul>
					<li>
						<Link to="/" className={styles.navLink}>
							Home
						</Link>
					</li>
					{currentUser ? (
						<>
							<li>
								<Link to="/dashboard" className={styles.navLink}>
									Dashboard
								</Link>
							</li>
							<li>
								<Link
									to="/logout"
									className={styles.navLink}
									onClick={handleLogout}
								>
									Logout
								</Link>
							</li>
						</>
					) : (
						<>
							<li>
								<Link to="/login" className={styles.navLink}>
									Login
								</Link>
							</li>
							<li>
								<Link className={styles.register} to="/register">
									Register
								</Link>
							</li>
						</>
					)}
				</ul>
			</nav>
		</header>
	);
}

export default Header;
