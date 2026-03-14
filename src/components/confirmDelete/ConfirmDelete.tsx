import Loading from "../loading/Loading";

type ConfirmDeleteProps = {
	handleDelete: () => void;
	closeModal: () => void;
	isLoading: boolean;
};

function ConfirmDelete({
	handleDelete,
	closeModal,
	isLoading,
}: ConfirmDeleteProps) {
	return (
		<div className="buttonsContainer">
			<button
				disabled={isLoading}
				className="button danger"
				onClick={handleDelete}
			>
				{isLoading ? <Loading /> : "Confirm Delete"}
			</button>

			<button className="button" type="button" onClick={closeModal}>
				Cancel
			</button>
		</div>
	);
}

export default ConfirmDelete;
