import {
	MdOutlineKeyboardArrowLeft,
	MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import styles from "./pagination.module.scss";

type PaginationProps = {
	currentPage: number;
	hasNextPage: boolean;
	onPageChange: (newPage: number) => void;
	totalPagesCount: number;
};

function Pagination({
	currentPage,
	hasNextPage,
	onPageChange,
	totalPagesCount,
}: PaginationProps) {
	return (
		<div className={styles.paginationContainer}>
			<button
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
				className={styles.paginatedButton}
			>
				<MdOutlineKeyboardArrowLeft />
			</button>
			<span>{`Page ${currentPage} of ${totalPagesCount}`}</span>
			<button
				onClick={() => onPageChange(currentPage + 1)}
				disabled={!hasNextPage}
				className={styles.paginatedButton}
			>
				<MdOutlineKeyboardArrowRight />
			</button>
		</div>
	);
}

export default Pagination;
