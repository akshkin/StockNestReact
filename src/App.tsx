import "./App.scss";
import { HashRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./routes/protectedRoutes/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import { lazy, Suspense } from "react";
import Loading from "./components/loading/Loading";
import AuthInitializer from "./routes/auth/AuthInitializer";
// import RootRedirect from "./routes/home/RootRedirect";
import Home from "./routes/home/Home";

const Layout = lazy(() => import("./routes/layout/Layout"));
const Login = lazy(() => import("./routes/auth/Login"));
const Dashboard = lazy(() => import("./routes/dashboard/Dashboard"));
const SignUp = lazy(() => import("./routes/auth/SignUp"));
const GroupLayout = lazy(() => import("./routes/group/GroupLayout"));
const Groups = lazy(() => import("./routes/group/Groups"));
const Group = lazy(() => import("./routes/group/Group"));
const Category = lazy(() => import("./routes/category/Category"));
const Notifications = lazy(
  () => import("./routes/notifications/Notifications"),
);
const Profile = lazy(() => import("./routes/profile/Profile"));

function App() {
  return (
    <>
      <AuthInitializer />
      <Suspense fallback={<Loading />}>
        <HashRouter>
          <Routes>
            {/* <Route element={<RootRedirect />}> */}
            <Route path="/" element={<Layout />}>
              <Route path="/" index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<SignUp />} />
            </Route>
            <Route element={<ProtectedRoute />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="groups" element={<GroupLayout />}>
                <Route index element={<Groups />} />
                <Route path=":groupId" element={<Group />} />
                <Route
                  path=":groupId/category/:categoryId"
                  element={<Category />}
                />
              </Route>
              <Route path="notifications" element={<Notifications />} />
              <Route path="profile" element={<Profile />} />
              <Route path="*" element={<h1>404 Not Found</h1>} />
            </Route>
            {/* </Route> */}
          </Routes>
        </HashRouter>
      </Suspense>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
