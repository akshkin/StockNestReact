import { Link, useLocation } from "react-router-dom";
import { useGetStatsQuery } from "../../api/statsApi";
import MetricsCard from "../../components/metricsCard/MetricsCard";
import { HiDocumentPlus, HiDocumentText, HiUserGroup } from "react-icons/hi2";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { AiFillProduct } from "react-icons/ai";
import styles from "./dashboard.module.scss";
import BarChart from "../../components/charts/BarChart";
import Loading from "../../components/loading/Loading";
import ErrorText from "../../components/errorText/ErrorText";
import DoughnutChart from "../../components/charts/DoughnutChart";
import useDashboardCharts from "../../hooks/useDashboardCharts";
import { useGetNotificationsQuery } from "../../api/notificationsApi";
import NotificationCard from "../../components/notification/NotificationCard";

function Dashboard() {
	const { data: stats, isLoading, isError, isFetching } = useGetStatsQuery({});
	const {
		data: notifications,
		isLoading: notificationsLoading,
		isError: notificationsError,
		isFetching: notificationsFetching,
	} = useGetNotificationsQuery();

	const {
		selectedGroupId,
		setSelectedGroupId,
		uniqueGroups,
		barChart,
		doughnutChart,
	} = useDashboardCharts(stats);

	const date = new Date();
	const today = date.toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
	});

	const location = useLocation();
	const message = location.state?.message;

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

	return (
		<section>
			<p>Today is {today}</p>
			<h1 style={{ fontSize: "2em" }}>Welcome!</h1>
			{message && <p>{message}</p>}

			{(isLoading || isFetching) && <Loading />}

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

			<div className={styles.groupTab}>
				<h4>Groups</h4>
				<div>
					{uniqueGroups.map((g) => (
						<span
							className={styles.tab}
							key={g.groupId}
							onClick={() => setSelectedGroupId(g.groupId)}
							style={{
								backgroundColor: selectedGroupId === g.groupId ? "#FE9F43" : "",
							}}
						>
							{g.groupName}
						</span>
					))}
				</div>
			</div>
			{!isLoading && (
				<div className={styles.chartWrapper}>
					<BarChart labels={barChart.labels} datasets={barChart.datasets} />
				</div>
			)}
			<div className={styles.chartWithNotification}>
				{!isLoading && (
					<div className={styles.doughnutWrapper}>
						<DoughnutChart
							labels={doughnutChart.labels}
							datasets={doughnutChart.datasets}
						/>
					</div>
				)}
				<div className={styles.notifications}>
					<h3 className={styles.notificationsTitle}>Recent Notifications</h3>
					{notificationsLoading || notificationsFetching ? <Loading /> : null}
					{notificationsError ? (
						<ErrorText error={"Failed to load notifications"} />
					) : null}
					{notifications?.map((notification) => (
						<NotificationCard key={notification.id} {...notification} />
					))}
					<Link to="/notifications?tab=all">Read all notifications</Link>
				</div>
			</div>

			{isError && <ErrorText error={"An error occurred"} />}
		</section>
	);
}

export default Dashboard;
