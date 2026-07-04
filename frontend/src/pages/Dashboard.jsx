import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    getDashboardData();
  }, []);

  const getDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const usersRes = await axios.get(
        "http://localhost:5000/api/users",
        config,
      );

      const leadsRes = await axios.get(
        "http://localhost:5000/api/leads",
        config,
      );

      const tagsRes = await axios.get("http://localhost:5000/api/tags", config);

      setUsers(usersRes.data);
      setLeads(leadsRes.data);
      setTags(tagsRes.data);
    } catch (error) {
      console.log(error);
      alert("Unable to load dashboard");
    }
  };

  const newLeads = leads.filter(
    (lead) => lead.status?.toLowerCase() === "new",
  ).length;

  const assignedLeads = leads.filter((lead) => lead.assignedTo).length;

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

        <div
          style={{
            padding: "25px",
          }}
        >
          <h2>Dashboard</h2>

          {/* Cards */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            <div style={cardStyle}>
              <p>Total Leads</p>

              <h1 style={numberStyle}>{leads.length}</h1>
            </div>

            <div style={cardStyle}>
              <p>New Leads</p>

              <h1 style={numberStyle}>{newLeads}</h1>
            </div>

            <div style={cardStyle}>
              <p>Assigned Leads</p>

              <h1 style={numberStyle}>{assignedLeads}</h1>
            </div>

            <div style={cardStyle}>
              <p>Total Users</p>

              <h1 style={numberStyle}>{users.length}</h1>
            </div>
          </div>

          {/* Tables */}

          <div
            style={{
              display: "flex",
              gap: "20px",
              marginTop: "30px",
            }}
          >
            {/* Lead Status */}

            <div
              style={{
                flex: 1,
                background: "white",
                borderRadius: "8px",
                padding: "20px",
                boxShadow: "0 2px 8px rgba(0,0,0,.08)",
              }}
            >
              <h3>Lead By Status</h3>

              <table
                style={{
                  width: "100%",
                  marginTop: "20px",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr>
                    <th align="left">Status</th>
                    <th align="right">Count</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>New</td>
                    <td align="right">
                      {leads.filter((l) => l.status === "new").length}
                    </td>
                  </tr>

                  <tr>
                    <td>Contacted</td>
                    <td align="right">
                      {leads.filter((l) => l.status === "contacted").length}
                    </td>
                  </tr>

                  <tr>
                    <td>Qualified</td>
                    <td align="right">
                      {leads.filter((l) => l.status === "qualified").length}
                    </td>
                  </tr>

                  <tr>
                    <td>Closed</td>
                    <td align="right">
                      {leads.filter((l) => l.status === "closed").length}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Recent Leads */}

            <div
              style={{
                flex: 1,
                background: "white",
                borderRadius: "8px",
                padding: "20px",
                boxShadow: "0 2px 8px rgba(0,0,0,.08)",
              }}
            >
              <h3>Recent Leads</h3>

              <table
                style={{
                  width: "100%",
                  marginTop: "20px",
                }}
              >
                <tbody>
                  {leads.slice(0, 5).map((lead) => (
                    <tr key={lead._id}>
                      <td>{lead.name}</td>

                      <td
                        style={{
                          textAlign: "right",
                          color: "#2563EB",
                        }}
                      >
                        {lead.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,.08)",
};

const numberStyle = {
  color: "#2563EB",
  marginTop: "10px",
};

export default Dashboard;
