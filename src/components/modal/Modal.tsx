import React from "react";
import styles from "./modal.module.scss";

type ModalProps = {
	title: string;
	children?: React.ReactNode;
	closeModal: () => void;
};

function Modal({ title, children, closeModal }: ModalProps) {
	return (
		<div className={styles.backdrop}>
			<div className={styles.modal}>
				<h2>{title}</h2>
				<button onClick={closeModal}>X</button>
				{children}
			</div>
		</div>
	);
}

export default Modal;
