import React, { useCallback, useEffect, useRef, useState } from "react";
import InputField from "../inputField/InputField";
import { useSearchParams } from "react-router-dom";
import { useGetSearchResultsQuery } from "../../api/searchApi";
import SearchResults from "./SearchResults";
import styles from "./searchResults.module.scss";

function Searchbar() {
	const [searchParams, setSearchParams] = useSearchParams();
	const initialQuery = searchParams.get("q") || "";
	const [searchQuery, setSearchQuery] = useState(initialQuery);
	const [isSearchResultsOpen, setIsSearchResultsOpen] = useState(false);
	const searchInputRef = useRef<HTMLDivElement | null>(null);

	const { data: searchResults } = useGetSearchResultsQuery(searchQuery);

	useEffect(() => {
		const delayDebounceFubction = setTimeout(() => {
			const params = new URLSearchParams(searchParams);
			if (searchQuery.trim() === "") {
				setIsSearchResultsOpen(false);
				params.delete("q");
			} else {
				params.set("q", searchQuery);
				setIsSearchResultsOpen(true);
			}
			setSearchParams(params);
		}, 300);
		return () => clearTimeout(delayDebounceFubction);
	}, [searchQuery, searchParams, setSearchParams]);

	const resetSearch = useCallback(() => {
		setSearchQuery("");
		setIsSearchResultsOpen(false);
		const params = new URLSearchParams(searchParams);
		params.delete("q");
		setSearchParams(params);
	}, [searchParams, setSearchParams]);

	// close the results dropdown when clicking outside of the search input or pressing escape
	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			const inputElement = searchInputRef.current;

			if (!inputElement) return;
			const target = e.target as Node;
			const clickedInput = inputElement?.contains(target);

			if (!clickedInput) {
				setIsSearchResultsOpen(false);
				resetSearch();
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [resetSearch]);

	useEffect(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (e.key === "Escape") {
				resetSearch();
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
