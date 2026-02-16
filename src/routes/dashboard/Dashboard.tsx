function Dashboard() {
	const date = new Date();
	const today = date.toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});

	return (
		<section>
			<p>Today is {today}</p>
			<h1>Welcome!</h1>
		</section>
	);
}

export default Dashboard;
