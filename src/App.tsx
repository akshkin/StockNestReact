import "./App.scss";
import { HashRouter, Route, Routes } from "react-router-dom";
import Layout from "./routes/layout/Layout";
import Login from "./routes/auth/Login";
import Dashboard from "./routes/dashboard/Dashboard";
import SignUp from "./routes/auth/SignUp";
import ProtectedRoute from "./routes/protectedRoutes/ProtectedRoute";
import Group from "./routes/group/Group";
import Category from "./routes/category/Category";
import GroupLayout from "./routes/group/GroupLayout";
import Groups from "./routes/group/Groups";
import Notifications from "./routes/notifications/Notifications";
import Profile from "./routes/profile/Profile";
import Home from "./routes/home/Home";

function App() {
	return (
		<HashRouter>
			<Routes>
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
			</Routes>
		</HashRouter>
	);
}

export default App;
