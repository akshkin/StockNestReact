import { Outlet, useNavigate } from "react-router-dom";
import { MoveLeft } from "lucide-react";
import Breadcrumb from "../../components/breadcrumb/Breadcrumb";

function GroupLayout() {
  const navigate = useNavigate();

  return (
    <>
      <button className="back-button" onClick={() => navigate(-1)}>
        <MoveLeft />
        Back
      </button>
      <Breadcrumb />
      <Outlet />
    </>
  );
}

export default GroupLayout;
