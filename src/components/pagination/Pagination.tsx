import styles from "./pagination.module.scss";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
        {/* <MdOutlineKeyboardArrowLeft /> */}
        <ChevronLeft />
      </button>
      <span>{`Page ${currentPage} of ${totalPagesCount}`}</span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className={styles.paginatedButton}
      >
        {/* <MdOutlineKeyboardArrowRight /> */}
        <ChevronRight />
      </button>
    </div>
  );
}

export default Pagination;
