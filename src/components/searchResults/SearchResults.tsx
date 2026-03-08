import { useNavigate } from "react-router-dom";
import styles from "./searchResults.module.scss";
import { useLazyGetItemPageIndexQuery } from "../../api/itemsApi";

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
	const [triggerPageIndex] = useLazyGetItemPageIndexQuery();
	const navigate = useNavigate();

	async function handleClick(result: SearchResultType) {
		const { type, groupId, categoryId, itemId } = result;
		resetSearch();

		switch (type) {
			case "Group":
				navigate("/groups", { state: groupId });
				return;

			case "Category":
				navigate(`/groups/${groupId}`, { state: categoryId });
				return;

			case "Item": {
				// get page number for item in the category
				const response = await triggerPageIndex({
					groupId: Number(groupId),
					categoryId: Number(categoryId),
					itemId: Number(itemId),
				}).unwrap();

				navigate(`/groups/${groupId}/category/${categoryId}?page=${response}`, {
					state: itemId,
				});

				return;
			}
			default:
				return "/groups";
		}
	}

	return (
		<div className={styles.searchResultsContainer}>
			{results.length > 0 ? (
				results.map((result) => {
					const { type, name, groupId, categoryId, itemId } = result;
					return (
						<div
							key={`${type}-${groupId}-${categoryId}-${itemId}`}
							className={styles.searchResult}
							onClick={() => handleClick(result)}
						>
							<p>{name}</p>
							<span
								className={`${styles.type} ${styles[type.toLocaleLowerCase()]}`}
							>
								{" "}
								{type}
							</span>
						</div>
					);
				})
			) : (
				<p>No results found</p>
			)}
		</div>
	);
}

export default SearchResults;
