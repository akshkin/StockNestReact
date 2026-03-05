import { useNavigate, useParams } from "react-router-dom";
import { useGetCategoryByIdQuery } from "../../api/categoriesApi";
import ErrorText from "../../components/errorText/ErrorText";
import Loading from "../../components/loading/Loading";
import { IoIosArrowRoundBack } from "react-icons/io";

function Category() {
	const { groupId, categoryId } = useParams();
	const navigate = useNavigate();

	const {
		data: category,
		isLoading: categoryLoading,
		error,
	} = useGetCategoryByIdQuery({
		groupId,
		categoryId,
	});

	if (categoryLoading) return <Loading />;
	return (
		<div>
			<button className="back-button" onClick={() => navigate(-1)}>
				<IoIosArrowRoundBack />
				Back to group
			</button>
			<h2>Category {category?.name}</h2>
			{error && (
				<ErrorText error={"An error occured while fetching category"} />
			)}
		</div>
	);
}

export default Category;
