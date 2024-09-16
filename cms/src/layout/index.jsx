import "./style.scss";
// import { Outlet } from "react-router-dom";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
export default function Layout() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="sidebar"></div>
      <div className="headerbar">
        <Button
          type="primary"
          block
          className="btn-signin"
          onClick={() => {
            navigate("/login");
          }}
        >
          Login
        </Button>
        <Button type="primary" block>
          Sign Out
        </Button>
      </div>
    </div>
  );
}
