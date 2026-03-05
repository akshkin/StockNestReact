import { Link } from "react-router-dom";
import styles from "./home.module.scss";

function Home() {
	return (
		<div>
			<div className={styles.hero}>
				<h2 className={styles.title}>
					Organize your items. Share a group with friends or family
				</h2>
				<Link to="/register" className={styles.getStartedButton}>
					Get started
				</Link>
			</div>
		</div>
	);
}

export default Home;
