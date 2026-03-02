import { useState } from "react";
import {
	useGetNotificationsQuery,
	useGetUnreadNotificationsQuery,
	useSetAllNotificationsAsSeenMutation,
} from "../../api/notificationsApi";
import NotificationCard from "../../components/notification/NotificationCard";
import Loading from "../../components/loading/Loading";
import styles from "./notifications.module.scss";
import { useSearchParams } from "react-router-dom";

function Notifications() {
	const [searchParams, setSearchParams] = useSearchParams();

	const tab = searchParams.get("tab") as "unread" | "all" | null;

	const [initialTab, setInitialTab] = useState<"unread" | "all">(
		tab || "unread",
	);

	const {
		data: notifications,
		isLoading,
		isError,
		isFetching,
	} = useGetNotificationsQuery();
	const {
		data: unreadNotifications,
		isLoading: unreadLoading,
		isError: unreadIsError,
		isFetching: unreadIsFetching,
	} = useGetUnreadNotificationsQuery();

	const [setNotificationsAsSeen] = useSetAllNotificationsAsSeenMutation();

	const notificationsToDisplay =
		initialTab === "unread" ? unreadNotifications : notifications;

	function setActiveTab(tab: "unread" | "all") {
		setInitialTab(tab);
		setSearchParams((prev) => {
			prev.set("tab", tab);
			return prev;
		});
	}

	if (isLoading || unreadLoading || isFetching || unreadIsFetching)
		return <Loading />;

	return (
		<>
			<nav aria-label="Notifications" className={styles.notificationsNav}>
				<ul
					className={styles.notificationsTabGroup}
					aria-label="Notification filters"
					role="tablist"
				>
					<li
						role="presentation"
						className={`${styles.tab} ${initialTab === "unread" ? styles.active : ""}`}
					>
						<button
							type="button"
							role="tab"
							aria-selected={initialTab === "unread"}
							onClick={() => setActiveTab("unread")}
						>
							Unread <span className={styles.hide}>notifications</span>(
							{unreadNotifications?.length || 0})
						</button>
					</li>
					<li
						role="presentation"
						className={`${styles.tab} ${initialTab === "all" ? styles.active : ""}`}
					>
						<button
							type="button"
							role="tab"
							aria-selected={initialTab === "all"}
							onClick={() => setActiveTab("all")}
						>
							All <span className={styles.hide}>notifications</span>
						</button>
					</li>
				</ul>

				{unreadNotifications && unreadNotifications?.length > 0 && (
					<button onClick={setNotificationsAsSeen}>Mark all as read</button>
				)}
			</nav>

			<section className={styles.notificationsContainer}>
				{isError || unreadIsError ? <p>Error loading notifications</p> : null}
				{notificationsToDisplay && notificationsToDisplay?.length > 0 ? (
					notificationsToDisplay?.map((notification) => (
						<NotificationCard key={notification.id} {...notification} />
					))
				) : (
					<p>
						No {initialTab === "unread" ? "unread" : ""} notifications to
						display.
					</p>
				)}
			</section>
		</>
	);
}

export default Notifications;
