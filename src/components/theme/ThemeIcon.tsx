import { useState } from "react";
import type { Theme } from "../../hooks/useTheme";
import useTheme from "../../hooks/useTheme";
import styles from "./theme.module.scss";
import { PiMoonFill, PiMoonLight, PiSun, PiSunDimFill } from "react-icons/pi";
import { RiComputerFill, RiComputerLine } from "react-icons/ri";

function ThemeIcon() {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const { theme, setUserPreferredTheme } = useTheme();

	function getThemeIcons() {
		switch (theme) {
			case "light":
				return (
					<div className={styles.menuIcons}>
						<span className={`${styles.icon} ${styles.activeTheme}`}>
							<PiSunDimFill />
							Light
						</span>
						<span className={styles.icon} onClick={() => setTheme("dark")}>
							<PiMoonLight /> Dark
						</span>
						<span className={styles.icon} onClick={() => setTheme("system")}>
							<RiComputerLine />
							System
						</span>
					</div>
				);
			case "dark":
				return (
					<div className={styles.menuIcons}>
						<span className={styles.icon} onClick={() => setTheme("light")}>
							<PiSun />
							Light
						</span>
						<span className={`${styles.icon} ${styles.activeTheme}`}>
							<PiMoonFill />
							Dark
						</span>
						<span className={styles.icon} onClick={() => setTheme("system")}>
							<RiComputerLine />
							System
						</span>
					</div>
				);
			case "system":
				return (
					<div className={styles.menuIcons}>
						<span className={styles.icon} onClick={() => setTheme("light")}>
							<PiSun />
							Light
						</span>

						<span className={styles.icon} onClick={() => setTheme("dark")}>
							<PiMoonLight />
							Dark
						</span>
						<span className={`${styles.icon} ${styles.activeTheme}`}>
							<RiComputerFill />
							System
						</span>
					</div>
				);
		}
	}

	function setTheme(choice: Theme) {
		setUserPreferredTheme(choice);
		setIsDropdownOpen(false);
	}
	return (
		<div className={styles.themeDropdown}>
			<button
				className={styles.trigger}
				onClick={() => setIsDropdownOpen(true)}
			>
				{theme === "light" && <PiSunDimFill />}
				{theme === "dark" && <PiMoonFill />}
				{theme === "system" && <RiComputerFill />}
			</button>
			{isDropdownOpen && <div className={styles.menu}>{getThemeIcons()}</div>}
		</div>
	);
}

export default ThemeIcon;
