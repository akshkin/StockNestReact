import { Link, useLocation } from "react-router-dom";
import { useGetStatsQuery } from "../../api/statsApi";
import MetricsCard from "../../components/metricsCard/MetricsCard";
import styles from "./dashboard.module.scss";
import BarChart from "../../components/charts/BarChart";
import Loading from "../../components/loading/Loading";
import ErrorText from "../../components/errorText/ErrorText";
import DoughnutChart from "../../components/charts/DoughnutChart";
import useDashboardCharts from "../../hooks/useDashboardCharts";
import NotificationCard from "../../components/notification/NotificationCard";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../features/authSlice";
import { FilePen, FilePlus, Files, FolderOpen, UsersRound } from "lucide-react";

function Dashboard() {
  const userName = useSelector(selectCurrentUser);

  const { data: stats, isLoading, isError, isFetching } = useGetStatsQuery();

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
      icon: <UsersRound size={35} />,
      backgroundColor: "#FE9F43",
      value: stats?.totalGroups ?? 0,
    },
    categories: {
      title: "Total Categories",
      icon: <FolderOpen size={35} />,
      backgroundColor: "#092C4C",
      value: stats?.totalCategories ?? 0,
    },
    items: {
      title: "Total Items",
      icon: <Files size={35} />,
      backgroundColor: "#0E9384",
      value: stats?.totalItems ?? 0,
    },
    userCreated: {
      title: "Items created by you",
      icon: <FilePlus size={35} />,
      backgroundColor: "#1976d2",
      value: stats?.userCreatedItems ?? 0,
    },
    userUpdated: {
      title: "Items updated by you",
      icon: <FilePen size={35} />,
      backgroundColor: "#1976d2",
      value: stats?.userCreatedItems ?? 0,
    },
  };

  return (
    <section>
      <p>Today is {today}</p>
      <h1 style={{ fontSize: "2em" }}>Welcome, {userName}!</h1>
      {message && <p>{message}</p>}

      {isLoading || isFetching ? (
        <Loading />
      ) : isError ? (
        <ErrorText error={"An error occurred"} />
      ) : uniqueGroups?.length > 0 ? (
        <>
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
            <h2>Groups</h2>
            <div>
              {uniqueGroups.map((g) => (
                <span
                  className={styles.tab}
                  key={g.groupId}
                  onClick={() => setSelectedGroupId(g.groupId)}
                  style={{
                    backgroundColor:
                      selectedGroupId === g.groupId ? "#FE9F43" : "",
                  }}
                >
                  {g.groupName}
                </span>
              ))}
            </div>
          </div>

          {barChart.datasets && (
            <div className={styles.chartWrapper}>
              <BarChart labels={barChart.labels} datasets={barChart.datasets} />
            </div>
          )}
        </>
      ) : (
        <>
          <p>
            Create group(s) with categories and items to get some data displayed
          </p>
          <Link className={styles.startHere} to="/groups">
            Start here
          </Link>
        </>
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
          <h2 className={styles.notificationsTitle}>Recent Notifications</h2>
          {isLoading || isFetching ? (
            <Loading />
          ) : isError ? (
            <ErrorText error={"Failed to load notifications"} />
          ) : stats?.latestNotifications &&
            stats?.latestNotifications.length > 0 ? (
            <>
              {stats?.latestNotifications?.map((notification) => (
                <NotificationCard key={notification.id} {...notification} />
              ))}
              <Link to="/notifications?tab=all&page=1">
                Read all notifications
              </Link>
            </>
          ) : (
            <p>No notifications yet</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default Dashboard;
