import styles from "./loading.module.scss";
import { Loader } from "lucide-react";

function Loading() {
  return (
    <div className={styles.loadingContainer}>
      <Loader size={30} className="loading" />
    </div>
  );
}

export default Loading;
