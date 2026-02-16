import logo from "@/assets/images/logo.svg";
import styles from './footer.module.scss'

function Footer() {
  return (
    <footer className={styles.footer}>
      <img src={logo} alt="Logo" className={styles.logo} />
      <p>© {new Date().getFullYear()} StockNest</p>
    </footer>

  )
}

export default Footer