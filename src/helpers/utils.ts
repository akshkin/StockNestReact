import { ZodError } from "zod";
import type { NotificationItemType } from "../api/notificationsApi";
import type { NavigateFunction } from "react-router-dom";
import queryString from "query-string";

export function zodErrorsToObject<T extends object>(error: ZodError<T>) {
	const errors: Partial<Record<keyof T, string>> = {};

	for (const issue of error.issues) {
		const key = issue.path[0] as keyof T;
		errors[key] = issue.message;
	}

	return errors;
}

export function navigateFromNotification(
	n: NotificationItemType,
	navigate: NavigateFunction,
) {
	const routes = {
		ItemCreated: () =>
			navigate(`/groups/${n.groupId}/category/${n.categoryId}#${n.itemId}`, {
				state: { itemId: n.itemId },
			}),

		ItemUpdated: () =>
			navigate(`/groups/${n.groupId}/category/${n.categoryId}#${n.itemId}`, {
				state: { itemId: n.itemId },
			}),

		ItemDeleted: () =>
			navigate(`/groups/${n.groupId}/category/${n.categoryId}`),

		CategoryCreated: () =>
			navigate(`/groups/${n.groupId}#${n.categoryId}`, {
				state: { categoryId: n.categoryId },
			}),

		CategoryUpdated: () =>
			navigate(`/groups/${n.groupId}#${n.categoryId}`, {
				state: { categoryId: n.categoryId },
			}),

		CategoryDeleted: () => navigate(`/groups/${n.groupId}`),

		UserJoinedGroup: () => navigate(`/groups/${n.groupId}`),

		UserRemovedFromGroup: () => navigate(`/groups/${n.groupId}`),

		GroupUpdated: () =>
			navigate(`/groups`, {
				state: { groupId: n.groupId },
			}),
		GroupDeleted: () => navigate(`/groups`),
	};

	routes[n.type]?.();
}

type URLQueryProps = {
	params: string;
	key: string;
	value: string | null;
};

export function formUrlQuery({ params, key, value }: URLQueryProps) {
	const currentUrl = queryString.parse(params);
	currentUrl[key] = value;

	return queryString.stringifyUrl(
		{
			url: window.location.pathname,
			query: currentUrl,
		},
		{
			skipNull: true,
		},
	);
}

type RemoveUrlProps = {
	params: string;
	keysToRemove: string[];
};

export function removeUrlKeys({ params, keysToRemove }: RemoveUrlProps) {
	const currentUrl = queryString.parse(params);
	keysToRemove.forEach((key) => delete currentUrl[key]);

	return queryString.stringifyUrl(
		{
			url: window.location.pathname,
			query: currentUrl,
		},
		{
			skipNull: true,
		},
	);
}
