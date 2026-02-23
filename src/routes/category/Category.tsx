import { useNavigate, useParams } from "react-router-dom";
import { useGetCategoryByIdQuery } from "../../api/categoriesApi";
import ErrorText from "../../components/errorText/ErrorText";
import Loading from "../../components/loading/Loading";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useState } from "react";
import Modal from "../../components/modal/Modal";
import ItemForm from "../../components/itemForm/ItemForm";

function Category() {
	const { groupId, categoryId } = useParams();
	const navigate = useNavigate();
	const [isModalOpen, setIsModalOpen] = useState(false);

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
			<button onClick={() => setIsModalOpen(true)}>Add an item</button>
			<h2>Category {category?.name}</h2>
			{error && (
				<ErrorText error={"An error occured while fetching category"} />
			)}
			{isModalOpen && (
				<Modal
					title="Add an item"
					closeModal={() => setIsModalOpen(false)}
					children={
						<ItemForm
							mode="Add"
							groupId={Number(groupId)}
							categoryId={Number(categoryId)}
							closeModal={() => setIsModalOpen(false)}
						/>
					}
				/>
			)}
		</div>
	);
}

export default Category;
