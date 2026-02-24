import { Navigate, Outlet } from "react-router-dom";
import DashboardHeader from "../../components/header/dashboardHeader/DashboardHeader";
import Sidebar from "../../components/sidebar/Sidebar";
import styles from "./protectRoute.module.css";
import { useGetMeQuery } from "../../api/authApi";
import Loading from "../../components/loading/Loading";

function ProtectedRoute() {
	const { error: getMeError, isLoading, isFetching } = useGetMeQuery({});

	if (isLoading || isFetching) return <Loading />;

	if (getMeError && "status" in getMeError && getMeError.status === 401) {
		return (
			<Navigate
				to="/login"
				state={{ message: "Please login to access the dashboard" }}
			/>
		);
	}

	return (
		<div className={styles.layoutContainer}>
			<DashboardHeader />
			<div className={styles.container}>
				<Sidebar />
				<main className={styles.main}>
					<Outlet />
				</main>
			</div>
		</div>
	);
}

export default ProtectedRoute;
