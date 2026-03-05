import { useLocation } from "react-router-dom";

function Dashboard() {
	const date = new Date();
	const today = date.toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});

	const location = useLocation();
	const message = location.state?.message;

	return (
		<section>
			<p>Today is {today}</p>
			<h1>Welcome!</h1>
			{message && <p>{message}</p>}
		</section>
	);
}

export default Dashboard;
