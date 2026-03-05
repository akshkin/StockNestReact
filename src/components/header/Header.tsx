import logo from "@/assets/images/logo.svg";
import styles from "./header.module.scss";
import { Link } from "react-router-dom";


function Header() {
  return (
    <header className={styles.header}>
      <Link to="/"><img src={logo} alt="Logo" className={styles.logo} /></Link>
      <nav>
        <ul>
            <li><Link to="/" className={styles.navLink} >Home</Link></li>
            <li><Link to="/login" className={styles.navLink} >Login</Link></li>
            <li><Link className={styles.register} to="/register">Register</Link></li>
        </ul>
      </nav>
    </header>

  )
}

export default Header