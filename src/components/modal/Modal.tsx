import React from "react";
import styles from "./modal.module.scss";
import { IoCloseOutline } from "react-icons/io5";

type ModalProps = {
	title: string;
	children?: React.ReactNode;
	closeModal: () => void;
};

function Modal({ title, children, closeModal }: ModalProps) {
	return (
		<div className={styles.backdrop}>
			<div className={styles.modal}>
				<header className={styles.modalHeader}>
					<h3>{title}</h3>
					<button className={styles.closeBtn} onClick={closeModal}>
						<IoCloseOutline />
					</button>
				</header>
				<div>{children}</div>
			</div>
		</div>
	);
}

export default Modal;
