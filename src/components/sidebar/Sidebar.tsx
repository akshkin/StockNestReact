import React from "react";
import styles from "./sidebar.module.scss";
import { Link } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { HiUserGroup } from "react-icons/hi2";
import { MdCategory } from "react-icons/md";

function Sidebar() {
	return (
		<section className={styles.sidebar}>
			<ul className={styles.dashlinks}>
				<li>
					<Link to="/dashboard" className={styles.dashlink}>
						<RxDashboard className={styles.icon} />
						<span className={styles.text}>Dashboard</span>
					</Link>
				</li>
				<li>
					<Link to="/groups" className={styles.dashlink}>
						<HiUserGroup className={styles.icon} />
						<span className={styles.text}>Groups</span>
					</Link>
				</li>
				<li>
					<Link to="/categories" className={styles.dashlink}>
						<MdCategory className={styles.icon} />
						<span className={styles.text}>Categories</span>
					</Link>
				</li>
			</ul>
		</section>
	);
}

export default Sidebar;
