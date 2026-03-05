import React, { useCallback, useEffect, useRef, useState } from "react";
import InputField from "../inputField/InputField";
import { useSearchParams } from "react-router-dom";
import { useGetSearchResultsQuery } from "../../api/searchApi";
import SearchResults from "./SearchResults";
import styles from "./searchResults.module.scss";
import queryString from "query-string";

function Searchbar() {
	const [searchParams, setSearchParams] = useSearchParams();
	const initialQuery = searchParams.get("q") || "";
	const [searchQuery, setSearchQuery] = useState(initialQuery);
	const [isSearchResultsOpen, setIsSearchResultsOpen] = useState(false);
	const searchInputRef = useRef<HTMLDivElement | null>(null);

	const { data: searchResults } = useGetSearchResultsQuery(searchQuery, {
		skip: !searchQuery.trim(),
	});

	useEffect(() => {
		const delayDebounceFubction = setTimeout(() => {
			if (searchQuery) {
				const parsed = queryString.parse(window.location.search);
				const newQuery = queryString.stringify({
					...parsed,
					q: searchQuery,
				});
				const params = new URLSearchParams(newQuery);
				setSearchParams(params, { replace: true });
				setIsSearchResultsOpen(true);
			}
		}, 300);
		return () => clearTimeout(delayDebounceFubction);
	}, [searchQuery, setSearchParams]);

	const resetSearch = useCallback(() => {
		setSearchQuery("");
		setIsSearchResultsOpen(false);
		if (searchParams.get("q")) {
			setSearchParams({});
		}
	}, [setSearchParams, searchParams]);

	// close the results dropdown when clicking outside of the search input or pressing escape
	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			const inputElement = searchInputRef.current;

			if (!inputElement) return;
			const target = e.target as Node;
			const clickedInput = inputElement?.contains(target);

			if (!clickedInput) {
				setIsSearchResultsOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [resetSearch]);

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") {
				setIsSearchResultsOpen(false);
			}
		}

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [resetSearch]);

	function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
		setSearchQuery(e.target.value);
	}

	return (
		<div className={styles.searchContainer} ref={searchInputRef}>
			<InputField
				type="search"
				placeholder="Search..."
				label=""
				name="searchQuery"
				value={searchQuery}
				onChange={(e) => handleSearch(e)}
			/>

			{isSearchResultsOpen && (
				<SearchResults
					results={searchResults || []}
					resetSearch={resetSearch}
				/>
			)}
		</div>
	);
}

export default Searchbar;
