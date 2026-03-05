import { VscLoading } from "react-icons/vsc";
import styles from "./loading.module.scss";

function Loading() {
	return (
		<div className={styles.loadingContainer}>
			<VscLoading className="loading" />
		</div>
	);
}

export default Loading;
