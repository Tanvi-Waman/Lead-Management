import { Link, useLocation, useNavigate } from "react-router-dom";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const menuStyle = (path) => ({
    display: "block",
    padding: "12px 15px",
    marginBottom: "8px",
    textDecoration: "none",
    color: location.pathname === path ? "white" : "#333",
    backgroundColor: location.pathname === path ? "#2563EB" : "transparent",
    borderRadius: "5px",
    fontSize: "14px",
  });

  return (
    <div
      style={{
        width: "220px",
        backgroundColor: "white",
        minHeight: "100vh",
        borderRight: "1px solid #ddd",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <h3
        style={{
          marginBottom: "30px",
          fontSize: "18px",
        }}
      >
        Lead Management
      </h3>

      <Link to="/dashboard" style={menuStyle("/dashboard")}>
        Dashboard
      </Link>

      <Link to="/leads" style={menuStyle("/leads")}>
        Leads
      </Link>

      <Link to="/users" style={menuStyle("/users")}>
        Users
      </Link>

      <Link to="/tags" style={menuStyle("/tags")}>
        Tags
      </Link>

      <Link to="/import-export" style={menuStyle("/import-export")}>
        Import / Export
      </Link>

      <Link to="/activitylogs" style={menuStyle("/activitylogs")}>
        Activity Logs
      </Link>
      <button
        onClick={logout}
        style={{
          marginTop: "20px",
          width: "100%",
          padding: "10px",
          backgroundColor: "#dc3545",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Sidebar;
