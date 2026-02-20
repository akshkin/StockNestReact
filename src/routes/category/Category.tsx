import { useParams } from "react-router-dom";
import { useGetCategoryByIdQuery } from "../../api/categoriesApi";
import ErrorText from "../../components/errorText/ErrorText";
import Loading from "../../components/loading/Loading";

function Category() {
	const { groupId, categoryId } = useParams();

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
			<h2>Category {category?.name}</h2>
			{error && (
				<ErrorText error={"An error occured while fetching category"} />
			)}
		</div>
	);
}

export default Category;
