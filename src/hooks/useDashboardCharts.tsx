import { useEffect, useMemo, useState } from "react";
import type { StatsReponseType } from "../api/statsApi";
import { COLORS } from "../constants";

function useDashboardCharts(stats: StatsReponseType | undefined) {
	const itemsPerGroup = stats?.itemsPerGroup ?? [];

	const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

	useEffect(() => {
		if (selectedGroupId == null && itemsPerGroup?.length > 0) {
			Promise.resolve().then(() => {
				setSelectedGroupId(itemsPerGroup[0].groupId);
			});
		}
	}, [stats, selectedGroupId]);

	const uniqueGroups = useMemo(() => {
		return Array.from(
			new Map(
				itemsPerGroup.map((s) => [
					s.groupId,
					{
						groupId: s.groupId,
						groupName: s.groupName,
						// categoryId: s.categoryId,
						// categoryName: s.categoryName,
						// count: s.count,
					},
				]),
			).values(),
		);
	}, [itemsPerGroup]);

	//selected group
	const groupData = useMemo(() => {
		if (!selectedGroupId) return [];
		return itemsPerGroup?.filter((s) => s.groupId === selectedGroupId);
	}, [itemsPerGroup, selectedGroupId]);

	const barChart = useMemo(() => {
		const labels = groupData.map((g) => g.categoryName);
		const data = groupData.map((g) => g.count);

		return {
			labels,
			datasets: [
				{
					label: "Items",
					data,
					backgroundColor: groupData.map((_, i) => COLORS[i % COLORS.length]),
					groupIds: [selectedGroupId ?? groupData[0]?.groupId],
					categoryIds: groupData.map((g) => g.categoryId),
				},
			],
		};
	}, [groupData, selectedGroupId]);

	const doughnutChart = useMemo(() => {
		const top = stats?.topCategories ?? [];

		return {
			labels: top.map((c) => c.categoryName),
			datasets: [
				{
					label: "Items",
					data: top.map((c) => c.count),
					backgroundColor: top.map((_, i) => COLORS[i % COLORS.length]),
					groupIds: top.map((c) => c.groupId),
					categoryIds: top.map((c) => c.categoryId),
				},
			],
		};
	}, [stats]);

	return {
		selectedGroupId,
		setSelectedGroupId,
		uniqueGroups,
		barChart,
		doughnutChart,
	};
}

export default useDashboardCharts;
