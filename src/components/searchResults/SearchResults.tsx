import { Link } from "react-router-dom";
import styles from "./searchResults.module.scss";

type SearchResultType = {
	type: string;
	name: string;
	groupId: number;
	categoryId?: number;
	itemId?: number;
};

type SearchResultsProps = {
	results: SearchResultType[];
	resetSearch: () => void;
};

function SearchResults({ results, resetSearch }: SearchResultsProps) {
	function handleClick(result: SearchResultType) {
		const { type, groupId, categoryId, itemId } = result;
		switch (type) {
			case "Group":
				return { pathname: `/groups`, hash: `#${groupId}`, state: { groupId } };

			case "Category":
				return {
					pathname: `/groups/${groupId}`,
					hash: `#${categoryId}`,
					state: { categoryId },
				};

			case "Item":
				return {
					pathname: `/groups/${groupId}/category/${categoryId}`,
					hash: `#${itemId}`,
					state: { itemId },
				};
			default:
				return "/groups";
		}
	}

	return (
		<div className={styles.searchResultsContainer}>
			{results.map((result) => {
				const { type, name, groupId, categoryId, itemId } = result;
				return (
					<Link
						key={`${type}-${groupId}-${categoryId}-${itemId}`}
						className={styles.searchResult}
						to={handleClick(result)}
						onClick={resetSearch}
					>
						<p>{name}</p>
						<span
							className={`${styles.type} ${styles[type.toLocaleLowerCase()]}`}
						>
							{" "}
							{type}
						</span>
					</Link>
				);
			})}
		</div>
	);
}

export default SearchResults;
