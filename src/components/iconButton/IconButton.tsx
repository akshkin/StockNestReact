import type { ReactNode } from "react";
import styles from "./iconButton.module.scss";

type IconButtonProps = {
	icon: ReactNode;
	onClick: () => void;
	title: string;
	variant?: "default" | "danger" | "dark";
};

function IconButton({
	icon,
	onClick,
	title,
	variant = "default",
}: IconButtonProps) {
	return (
		<button
			className={`${styles.iconBtn} ${styles[variant]}`}
			onClick={onClick}
			aria-label={title}
			title={title}
		>
			<span className={styles.icon}>{icon}</span>
			<span>{title}</span>
		</button>
	);
}

export default IconButton;
