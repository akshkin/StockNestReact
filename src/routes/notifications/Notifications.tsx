import { useState } from "react";
import {
	useGetNotificationsQuery,
	useGetUnreadNotificationsCountQuery,
	useGetUnreadNotificationsQuery,
	useSetAllNotificationsAsSeenMutation,
} from "../../api/notificationsApi";
import NotificationCard from "../../components/notification/NotificationCard";
import Loading from "../../components/loading/Loading";
import styles from "./notifications.module.scss";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../components/pagination/Pagination";
import ErrorText from "../../components/errorText/ErrorText";

function Notifications() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [page, setPage] = useState(1);

	const tab = searchParams.get("tab") as "unread" | "all";
	const currentPage = Number(searchParams.get("page") ?? page);

	const [initialTab, setInitialTab] = useState<"unread" | "all">(
		tab || "unread",
	);

	const {
		data: notifications,
		isLoading,
		isError,
		isFetching,
	} = useGetNotificationsQuery(currentPage);
	const {
		data: unreadNotifications,
		isLoading: unreadLoading,
		isError: unreadIsError,
		isFetching: unreadIsFetching,
	} = useGetUnreadNotificationsQuery(currentPage);

	const [setNotificationsAsSeen] = useSetAllNotificationsAsSeenMutation();
	const { data: unreadNotificationsCount } =
		useGetUnreadNotificationsCountQuery();

	const notificationsToDisplay =
		initialTab === "unread" ? unreadNotifications?.items : notifications?.items;

	function setActiveTab(tab: "unread" | "all") {
		setInitialTab(tab);
		setSearchParams((prev) => {
			prev.set("tab", tab);
			prev.set("page", "1");
			return prev;
		});
	}

	function onPageChange(newPage: number) {
		setPage(newPage);
		const params = new URLSearchParams(searchParams.toString());
		params.set("page", newPage.toString());
		setSearchParams(params);
	}

	let isCountMoreThanPageSize;
	if (initialTab === "unread") {
		isCountMoreThanPageSize =
			unreadNotifications?.totalCount && unreadNotifications?.totalCount > 10;
	} else {
		isCountMoreThanPageSize =
			notifications?.totalCount && notifications?.totalCount > 10;
	}

	const loadingState =
		isLoading || unreadLoading || isFetching || unreadIsFetching;

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
							{unreadNotificationsCount})
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

				{unreadNotifications && unreadNotifications?.items?.length > 0 && (
					<button onClick={setNotificationsAsSeen}>Mark all as read</button>
				)}
			</nav>

			<section className={styles.notificationsContainer}>
				{isError || unreadIsError ? (
					<ErrorText error="Error loading notifications" />
				) : null}

				{loadingState && <Loading />}

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

				{/* display pagination component only when total count is more than page size which is 10 */}
				{isCountMoreThanPageSize ? (
					<Pagination
						currentPage={currentPage}
						hasNextPage={!!notifications?.hasNextPage}
						onPageChange={onPageChange}
					/>
				) : null}

				{isFetching && <Loading />}
			</section>
		</>
	);
}

export default Notifications;
