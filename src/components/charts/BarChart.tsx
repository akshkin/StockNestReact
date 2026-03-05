import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
);

export type ChartProps = {
	labels: string[];
	datasets: {
		label: string;
		data: number[];
		backgroundColor: string[];
		categoryIds: number[];
		groupIds: number[];
	}[];
};

function BarChart({ labels, datasets }: ChartProps) {
	const navigate = useNavigate();
	const data = {
		labels,
		datasets,
	};

	const isMobile = window.innerWidth < 600;

	const options = {
		indexAxis: isMobile ? ("y" as const) : ("x" as const),
		responsive: true,
		maintainAspectRatio: isMobile ? false : true,
		plugins: {
			legend: {
				position: "top" as const,
			},
			title: {
				display: true,
				text: "Items in a category per group",
			},
		},
		onClick: (_: any, elements: any) => {
			if (!elements.length) return;

			const { datasetIndex, index } = elements[0];

			const group = datasets[datasetIndex].groupIds[0]; // group id
			const category = datasets[datasetIndex].categoryIds[index]; // category ids

			navigate(`/groups/${group}/category/${category}`);
		},
	};
	return <Bar options={options} data={data} />;
}

export default BarChart;
