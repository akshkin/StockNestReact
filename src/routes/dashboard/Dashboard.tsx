import { useLocation } from "react-router-dom";
import { useGetStatsQuery } from "../../api/statsApi";
import MetricsCard from "../../components/metricsCard/MetricsCard";
import { HiDocumentPlus, HiDocumentText, HiUserGroup } from "react-icons/hi2";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { AiFillProduct } from "react-icons/ai";
import styles from "./dashboard.module.scss";

function Dashboard() {
	const date = new Date();
	const today = date.toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});

	const location = useLocation();
	const message = location.state?.message;

	const { data: stats } = useGetStatsQuery({});

	const metricsMap = {
		groups: {
			title: "Total Groups",
			icon: <HiUserGroup />,
			backgroundColor: "#FE9F43",
			value: stats?.totalGroups ?? 0,
		},
		categories: {
			title: "Total Categories",
			icon: <BiSolidCategoryAlt />,
			backgroundColor: "#092C4C",
			value: stats?.totalCategories ?? 0,
		},
		items: {
			title: "Total Items",
			icon: <AiFillProduct />,
			backgroundColor: "#0E9384",
			value: stats?.totalItems ?? 0,
		},
		userCreated: {
			title: "Items created by you",
			icon: <HiDocumentPlus />,
			backgroundColor: "#1976d2",
			value: stats?.userCreatedItems ?? 0,
		},
		userUpdated: {
			title: "Items updated by you",
			icon: <HiDocumentText />,
			backgroundColor: "#1976d2",
			value: stats?.userCreatedItems ?? 0,
		},
	};

	console.log(stats);

	return (
		<section>
			<p>Today is {today}</p>
			<h1 style={{ fontSize: "2em" }}>Welcome!</h1>
			{message && <p>{message}</p>}
			<div className={styles.metricGrid}>
				{Object.values(metricsMap).map((metric) => (
					<MetricsCard
						key={metric.title}
						title={metric.title}
						value={metric.value}
						icon={metric.icon}
						backgroundColor={metric.backgroundColor}
					/>
				))}
			</div>
		</section>
	);
}

export default Dashboard;
