import { Outlet, useNavigate } from "react-router-dom";

import { IoIosArrowRoundBack } from "react-icons/io";

function GroupLayout() {
	const navigate = useNavigate();

	return (
		<>
			<button className="back-button" onClick={() => navigate(-1)}>
				<IoIosArrowRoundBack />
				Back
			</button>
			<Outlet />
		</>
	);
}

export default GroupLayout;
