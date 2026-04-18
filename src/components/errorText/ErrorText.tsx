import styles from "./errorText.module.scss";

function ErrorText({ error }: { error?: string }) {
  return <div className={styles.error}>{error}</div>;
}

export default ErrorText;
