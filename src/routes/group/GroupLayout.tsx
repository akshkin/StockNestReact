import { Outlet, useNavigate } from "react-router-dom";
import { MoveLeft } from "lucide-react";

function GroupLayout() {
  const navigate = useNavigate();

  return (
    <>
      <button className="back-button" onClick={() => navigate(-1)}>
        <MoveLeft />
        Back
      </button>
      <Outlet />
    </>
  );
}

export default GroupLayout;
