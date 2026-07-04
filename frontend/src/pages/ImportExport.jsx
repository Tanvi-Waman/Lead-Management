import { useState, useEffect } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function ImportExport() {
  const token = localStorage.getItem("token");

  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const importExcel = async () => {
    if (!file) {
      alert("Please select an Excel file");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      await axios.post("http://localhost:5000/api/leads/import", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Excel Imported Successfully");
      setFile(null);
    } catch (error) {
      alert(error.response?.data?.message || "Import Failed");
    }
  };

  const exportExcel = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/leads/export",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },

          params: {
            status,
            source,
            assignedTo,
            startDate,
            endDate,
          },

          responseType: "blob",
        },
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");

      link.href = url;

      link.download = "FilteredLeads.xlsx";

      document.body.appendChild(link);

      link.click();

      link.remove();
    } catch (error) {
      alert("Export Failed");
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
          <h2>Import / Export Leads</h2>

          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,.08)",
              marginTop: "20px",
            }}
          >
            <h3>Import Excel</h3>

            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <br />
            <br />

            <button
              onClick={importExcel}
              style={{
                background: "#2563EB",
                color: "white",
                border: "none",
                padding: "10px 18px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Import Excel
            </button>

            <hr style={{ margin: "30px 0" }} />

            <h3>Export Leads</h3>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={inputStyle}
            >
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="closed">Closed</option>
            </select>

            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              style={inputStyle}
            >
              <option value="">All Sources</option>
              <option value="Website">Website</option>
              <option value="Instagram">Instagram</option>
              <option value="Facebook">Facebook</option>
              <option value="Referral">Referral</option>
            </select>

            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              style={inputStyle}
            >
              <option value="">All Users</option>

              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={inputStyle}
            />

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={inputStyle}
            />

            <button
              onClick={exportExcel}
              style={{
                background: "#198754",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor: "pointer",
                marginTop: "20px",
              }}
            >
              Export Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "250px",
  padding: "10px",
  margin: "10px 10px 10px 0",
  border: "1px solid #ccc",
  borderRadius: "5px",
};

export default ImportExport;
