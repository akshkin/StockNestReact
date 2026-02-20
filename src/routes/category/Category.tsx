import { useParams } from "react-router-dom";

function Category() {
	const { groupId, categoryId } = useParams();

	return <div>Category : {categoryId}</div>;
}

export default Category;
