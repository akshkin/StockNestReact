import {
	MdOutlineKeyboardArrowLeft,
	MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import styles from "./pagination.module.scss";

type PaginationProps = {
	currentPage: number;
	hasNextPage: boolean;
	onPageChange: (newPage: number) => void;
	searchParams: URLSearchParams;
	setSearchParams: (params: URLSearchParams) => void;
};

function Pagination({
	currentPage,
	hasNextPage,
	onPageChange,
	setSearchParams,
	searchParams,
}: PaginationProps) {
	function gotToPage(newPage: number) {
		onPageChange(newPage);
		const params = new URLSearchParams(searchParams.toString());
		params.set("page", newPage.toString());
		setSearchParams(params);
	}

	return (
		<div className={styles.paginationContainer}>
			<button
				onClick={() => gotToPage(currentPage - 1)}
				disabled={currentPage === 1}
				className={styles.paginatedButton}
			>
				<MdOutlineKeyboardArrowLeft />
			</button>
			<span>{`Page ${currentPage}`}</span>
			<button
				onClick={() => gotToPage(currentPage + 1)}
				disabled={!hasNextPage}
				className={styles.paginatedButton}
			>
				<MdOutlineKeyboardArrowRight />
			</button>
		</div>
	);
}

export default Pagination;
