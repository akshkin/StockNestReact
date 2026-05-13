import { useState } from "react";
import type { Theme } from "../../hooks/useTheme";
import useTheme from "../../hooks/useTheme";
import styles from "./theme.module.scss";
import { Laptop, Moon, SunMedium } from "lucide-react";

function ThemeIcon() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { theme, setUserPreferredTheme } = useTheme();

  function getThemeIcons() {
    switch (theme) {
      case "light":
        return (
          <div className={styles.menuIcons}>
            <span className={`${styles.icon} ${styles.activeTheme}`}>
              <SunMedium size={20} />
              Light
            </span>
            <span className={styles.icon} onClick={() => setTheme("dark")}>
              <Moon size={20} /> Dark
            </span>
            <span className={styles.icon} onClick={() => setTheme("system")}>
              <Laptop size={20} />
              System
            </span>
          </div>
        );
      case "dark":
        return (
          <div className={styles.menuIcons}>
            <span className={styles.icon} onClick={() => setTheme("light")}>
              <SunMedium size={20} />
              Light
            </span>
            <span className={`${styles.icon} ${styles.activeTheme}`}>
              <Moon size={20} />
              Dark
            </span>
            <span className={styles.icon} onClick={() => setTheme("system")}>
              <Laptop size={20} />
              System
            </span>
          </div>
        );
      case "system":
        return (
          <div className={styles.menuIcons}>
            <span className={styles.icon} onClick={() => setTheme("light")}>
              <SunMedium size={20} />
              Light
            </span>

            <span className={styles.icon} onClick={() => setTheme("dark")}>
              <Moon size={20} />
              Dark
            </span>
            <span className={`${styles.icon} ${styles.activeTheme}`}>
              <Laptop size={20} />
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
        className={`${styles.trigger} button`}
        aria-label="Select theme"
        onClick={() => setIsDropdownOpen((prev) => !prev)}
      >
        {theme === "light" && <SunMedium size={20} />}
        {theme === "dark" && <Moon size={20} />}
        {theme === "system" && <Laptop size={20} />}
      </button>
      {isDropdownOpen && <div className={styles.menu}>{getThemeIcons()}</div>}
    </div>
  );
}

export default ThemeIcon;
