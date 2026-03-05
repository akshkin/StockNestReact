import { Outlet } from "react-router-dom"
import Footer from "../../components/footer/Footer"
import Header from "../../components/header/Header"
import styles from "./layout.module.scss"


function Layout() {
  return (
    <div className={styles.layout}>
        <Header />
        <main className={styles.main}>
            <Outlet />
        </main>
        <Footer />
    </div>
  )
}

export default Layout