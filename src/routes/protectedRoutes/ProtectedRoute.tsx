import { Navigate, Outlet } from "react-router-dom";
import { useGetGroupsQuery } from "../../api/groupsApi";
import DashboardHeader from "../../components/header/dashboardHeader/DashboardHeader";
import Sidebar from "../../components/sidebar/Sidebar";
import styles from "./protectRoute.module.css";

function ProtectedRoute() {
	const { data: groups, isLoading, error } = useGetGroupsQuery({});

	console.log(
		"ProtectedRoute: groups =",
		groups,
		"isLoading =",
		isLoading,
		"isError =",
		error,
	);

	if (error && "status" in error && error?.status === 401) {
		return (
			<Navigate
				to="/login"
				state={{ message: "Please login to access the dashboard" }}
			/>
		);
	}

	return (
		<>
			<DashboardHeader />
			<div className={styles.container}>
				<Sidebar />
				<main className={styles.main}>
					<Outlet />
				</main>
			</div>
		</>
	);
}

export default ProtectedRoute;
