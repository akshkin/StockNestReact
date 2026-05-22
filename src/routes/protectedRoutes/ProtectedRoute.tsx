import { Navigate, Outlet } from "react-router-dom";
import DashboardHeader from "../../components/header/dashboardHeader/DashboardHeader";
import Sidebar from "../../components/sidebar/Sidebar";
import styles from "./protectRoute.module.css";
import { useGetMeQuery } from "../../api/authApi";
import Loading from "../../components/loading/Loading";
import OfflineText from "../../components/offlineText/OfflineText";
import useOnlineStatus from "../../hooks/useOnlineStatus";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../features/authSlice";

function ProtectedRoute() {
  const userName = useSelector(selectCurrentUser);
  const {
    error: getMeError,
    isLoading,
    isFetching,
  } = useGetMeQuery(undefined, {
    // refetch on mount to restore session
    refetchOnMountOrArgChange: true,
  });
  const isOnline = useOnlineStatus();

  if (isLoading || (isFetching && isOnline)) return <Loading />;

  if (getMeError && "status" in getMeError && getMeError.status === 401) {
    return (
      <Navigate
        to="/login"
        state={{ message: "Please login to access the dashboard" }}
        replace
      />
    );
  }

  if (!userName) return <Navigate to="login" replace />;

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
