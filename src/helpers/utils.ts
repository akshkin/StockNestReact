import { ZodError } from "zod";
import type { NotificationItemType } from "../api/notificationsApi";
import type { NavigateFunction } from "react-router-dom";

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
			navigate(`/groups/${n.groupId}/category/${n.categoryId}`, {
				state: { itemId: n.itemId },
			}),

		ItemUpdated: () =>
			navigate(`/groups/${n.groupId}/category/${n.categoryId}`, {
				state: { itemId: n.itemId },
			}),

		ItemDeleted: () =>
			navigate(`/groups/${n.groupId}/category/${n.categoryId}`),

		CategoryCreated: () =>
			navigate(`/groups/${n.groupId}`, {
				state: { categoryId: n.categoryId },
			}),

		CategoryUpdated: () =>
			navigate(`/groups/${n.groupId}`, {
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

export function getPermissions(role?: string) {
	const ownerPermission = role === "Owner" || role === "Co-Owner";
	const canCreateEdit = role !== "Viewer";

	return { ownerPermission, canCreateEdit };
}

export function extractErrorMessage(error: unknown): string {
	if (typeof error === "object" && error !== null && "data" in error) {
		const err = error as { data?: unknown };

		if (err.data && typeof err.data === "object" && "message" in err.data) {
			return err.data.message as string;
		}
	}

	return "An unexpected error occurred";
}
