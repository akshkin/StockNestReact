import { useSelector } from "react-redux";
import { selectAuthStatus, selectCurrentUser } from "../../features/authSlice";
import Loading from "../../components/loading/Loading";
import { Navigate } from "react-router-dom";
import Home from "./Home";

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

  return <Home />;
}
export default RootRedirect;
