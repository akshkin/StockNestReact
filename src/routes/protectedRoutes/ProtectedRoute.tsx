import type { RootState } from "../../store";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
	const currentUser = useSelector((state: RootState) => state.auth.token);

	if (!currentUser) {
		return (
			<Navigate
				to="/login"
				state={{ message: "Please login to access the dashboard" }}
			/>
		);
	}

	return (
		<>
			<Outlet />
		</>
	);
}

export default ProtectedRoute;
