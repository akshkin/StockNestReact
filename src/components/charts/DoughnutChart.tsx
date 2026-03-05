import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import type { ChartProps } from "./BarChart";
import { useNavigate } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend);

function DoughnutChart({ labels, datasets }: ChartProps) {
	const navigate = useNavigate();

	const data = {
		labels: labels,
		datasets: datasets,
	};

	const options = {
		onClick: (_: any, elements: any) => {
			if (!elements.length) return;

			const { datasetIndex, index } = elements[0];

			const group = datasets[datasetIndex].groupIds[index]; // group id
			const category = datasets[datasetIndex].categoryIds[index]; // category ids

			navigate(`/groups/${group}/category/${category}`);
		},
	};
	return <Doughnut options={options} data={data} />;
}

export default DoughnutChart;
