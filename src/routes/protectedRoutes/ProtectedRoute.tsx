import { Navigate, Outlet } from "react-router-dom";
import DashboardHeader from "../../components/header/dashboardHeader/DashboardHeader";
import Sidebar from "../../components/sidebar/Sidebar";
import styles from "./protectRoute.module.css";
import Loading from "../../components/loading/Loading";
import OfflineText from "../../components/offlineText/OfflineText";
import useOnlineStatus from "../../hooks/useOnlineStatus";
import { useSelector } from "react-redux";
import { selectAuthStatus, selectCurrentUser } from "../../features/authSlice";

function ProtectedRoute() {
  const userName = useSelector(selectCurrentUser);
  const status = useSelector(selectAuthStatus);

  const isOnline = useOnlineStatus();

  if (status === "loading" || (status === "unknown" && isOnline))
    return <Loading />;

  if (status === "guest" || !userName) {
    return (
      <Navigate
        to="/login"
        state={{ message: "Please login to access the dashboard" }}
        replace
      />
    );
  }

  return (
    <div className={styles.layoutContainer}>
      <DashboardHeader />
      <div className={styles.container}>
        <Sidebar />
        <main className={styles.main}>
          {!isOnline && <OfflineText />}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default ProtectedRoute;
