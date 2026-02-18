import { useParams } from "react-router-dom";
import { useGetGroupByIdQuery } from "../../api/groupsApi";
import ErrorText from "../../components/errorText/ErrorText";
import Loading from "../../components/loading/Loading";

function Group() {
	const { id } = useParams();

	const { data: group, isLoading, error } = useGetGroupByIdQuery(id);

	if (isLoading) return <Loading />;

	if (error) return <ErrorText error={error.toString()} />;

	return <div>Group group: {group?.name}</div>;
}

export default Group;
