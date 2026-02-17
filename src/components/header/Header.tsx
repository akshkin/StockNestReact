import logo from "@/assets/images/logo.svg";
import styles from "./header.module.scss";
import { Link } from "react-router-dom";
import type { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../features/authSlice";

function Header() {
	const currentUser = useSelector((state: RootState) => state.auth.token);
	const dispatch = useDispatch();

	function handleLogout() {
		dispatch(logOut());
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
