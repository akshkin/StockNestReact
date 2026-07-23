import { Navigate, Outlet } from "react-router-dom";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import styles from "./layout.module.scss";
import Loading from "../../components/loading/Loading";
import useOnlineStatus from "../../hooks/useOnlineStatus";
import { useSelector } from "react-redux";
import { selectAuthStatus, selectCurrentUser } from "../../features/authSlice";

function Layout() {
  const userName = useSelector(selectCurrentUser);
  const status = useSelector(selectAuthStatus);

  const isOnline = useOnlineStatus();

  if (status === "loading" || (status === "unknown" && isOnline))
    return <Loading />;
  if (userName) return <Navigate to="/dashboard" replace />;

  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
