import logo from "@/assets/images/app-logo.svg";
import mobileLogo from "@/assets/images/logo-mobile.svg";
import styles from "./header.module.scss";
import { Link } from "react-router-dom";

function Header() {
	return (
		<header className={styles.header}>
			<nav>
				<Link to="/">
					<img src={logo} alt="Logo" className={styles.logoDesktop} />
					<img src={mobileLogo} alt="Logo" className={styles.logoMobile} />
				</Link>
				<ul>
					<li>
						<Link to="/" className={styles.navLink}>
							Home
						</Link>
					</li>

					<li>
						<Link to="/login" className={styles.navLink}>
							Login
						</Link>
					</li>
					<li>
						<Link className="button" to="/register">
							Register
						</Link>
					</li>
				</ul>
			</nav>
		</header>
	);
}

export default Header;
