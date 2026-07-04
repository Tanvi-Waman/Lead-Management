function Header() {
  const role = localStorage.getItem("role");

  return (
    <div
      style={{
        height: "60px",
        backgroundColor: "white",
        borderBottom: "1px solid #ddd",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 25px",
      }}
    >
      <h3 style={{ margin: 0 }}>Dashboard</h3>

      <div
        style={{
          fontSize: "15px",
          color: "#555",
        }}
      >
        {role}
      </div>
    </div>
  );
}

export default Header;
