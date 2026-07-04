import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function ActivityLogs() {
  const token = localStorage.getItem("token");

  const [logs, setLogs] = useState([]);

  useEffect(() => {
    getLogs();
  }, []);

  const getLogs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/activitylogs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLogs(res.data);
    } catch (error) {
      console.log(error);
      alert("Unable to fetch activity logs");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        background: "#f5f7fb",
        minHeight: "100vh",
      }}
    >
      <Sidebar />

      <div style={{ flex: 1 }}>
        <Header />

        <div style={{ padding: "25px" }}>
          <h2>Activity Logs</h2>

          <div
            style={{
              background: "white",
              marginTop: "20px",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#2563EB",
                    color: "white",
                  }}
                >
                  <th style={thStyle}>User</th>
                  <th style={thStyle}>Action</th>
                  <th style={thStyle}>Details</th>
                  <th style={thStyle}>Date</th>
                </tr>
              </thead>

              <tbody>
                {logs.map((log) => (
                  <tr key={log._id}>
                    <td style={tdStyle}>{log.user?.name || "N/A"}</td>

                    <td style={tdStyle}>{log.action}</td>

                    <td style={tdStyle}>{log.details}</td>

                    <td style={tdStyle}>
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}

                {logs.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      style={{
                        textAlign: "center",
                        padding: "20px",
                      }}
                    >
                      No Activity Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const thStyle = {
  padding: "12px",
  textAlign: "left",
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #ddd",
};

export default ActivityLogs;
