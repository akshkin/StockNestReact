import { useSelector } from "react-redux";
import { selectAuthStatus, selectCurrentUser } from "../../features/authSlice";
import Loading from "../../components/loading/Loading";
import { Navigate, Outlet } from "react-router-dom";

function RootRedirect() {
  // check for user and user's status to show appropriate page
  const user = useSelector(selectCurrentUser);
  const status = useSelector(selectAuthStatus);

  if (status === "loading") {
    return <Loading />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  // else {
  //   <Navigate to="/" replace />;
  // }

  return <Outlet />;
}
export default RootRedirect;
