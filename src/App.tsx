import "./App.scss";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./routes/layout/Layout";
import Login from "./routes/auth/Login";
import Dashboard from "./routes/dashboard/Dashboard";

import SignUp from "./routes/auth/SignUp";
import ProtectedRoute from "./routes/protectedRoutes/ProtectedRoute";
function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route path="/" index element={<h1>Home</h1>} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<SignUp />} />
					<Route path="/dashboard" element={<ProtectedRoute />}>
						<Route index element={<Dashboard />} />
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
