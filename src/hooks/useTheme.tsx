import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

function useTheme() {
	const [theme, setTheme] = useState(
		(localStorage.getItem("theme") as Theme) ?? "system",
	);

	useEffect(() => {
		const htmlDocument = document.documentElement;
		if (theme === "light") {
			htmlDocument.classList.remove("dark");
			htmlDocument.classList.add("light");
		} else if (theme === "dark") {
			htmlDocument.classList.remove("light");
			htmlDocument.classList.add("dark");
		} else if (theme === "system") {
			htmlDocument.classList.remove("light");
			htmlDocument.classList.remove("dark");
		}
	}, [theme]);

	function setUserPreferedTheme(theme: Theme) {
		setTheme(theme);
		localStorage.setItem("theme", theme);
	}

	return { theme, setUserPreferedTheme };
}

export default useTheme;
