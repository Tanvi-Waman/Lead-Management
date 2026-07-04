import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function Leads() {
  const token = localStorage.getItem("token");

  const [leads, setLeads] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [source, setSource] = useState("Website");
  const [status, setStatus] = useState("new");

  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    getLeads();
  }, []);

  const getLeads = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/leads", config);

      setLeads(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const saveLead = async () => {
    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/leads/${editingId}`,
          {
            name,
            email,
            phone,
            source,
            status,
          },
          config,
        );

        alert("Lead Updated");
      } else {
        await axios.post(
          "http://localhost:5000/api/leads",
          {
            name,
            email,
            phone,
            source,
            status,
          },
          config,
        );

        alert("Lead Added");
      }

      clearForm();
      getLeads();
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  const editLead = (lead) => {
    setEditingId(lead._id);
    setName(lead.name);
    setEmail(lead.email);
    setPhone(lead.phone);
    setSource(lead.source);
    setStatus(lead.status);
  };

  const deleteLead = async (id) => {
    if (!window.confirm("Delete this lead?")) return;

    await axios.delete(`http://localhost:5000/api/leads/${id}`, config);

    getLeads();
  };

  const clearForm = () => {
    setEditingId(null);
    setName("");
    setEmail("");
    setPhone("");
    setSource("Website");
    setStatus("new");
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = filterStatus === "" || lead.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

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
          <h2>Leads</h2>

          {/* Search */}

          <div
            style={{
              display: "flex",
              gap: "15px",
              marginBottom: "20px",
            }}
          >
            <input
              placeholder="Search Lead"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={inputStyle}
            />

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={inputStyle}
            >
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Form */}

          <div style={cardStyle}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: "15px",
              }}
            >
              <input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
              />

              <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
              />

              <input
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={inputStyle}
              />

              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                style={inputStyle}
              >
                <option>Website</option>
                <option>Instagram</option>
                <option>Facebook</option>
                <option>Referral</option>
              </select>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={inputStyle}
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div style={{ marginTop: "20px" }}>
              <button onClick={saveLead} style={buttonStyle}>
                {editingId ? "Update Lead" : "Add Lead"}
              </button>

              <button
                onClick={clearForm}
                style={{
                  ...buttonStyle,
                  marginLeft: "10px",
                  background: "#6c757d",
                }}
              >
                Clear
              </button>
            </div>
          </div>

          {/* Table */}

          <div
            style={{
              ...cardStyle,
              marginTop: "25px",
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
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Phone</th>
                  <th style={thStyle}>Source</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredLeads.map((lead) => (
                  <tr key={lead._id}>
                    <td style={tdStyle}>{lead.name}</td>
                    <td style={tdStyle}>{lead.email}</td>
                    <td style={tdStyle}>{lead.phone}</td>
                    <td style={tdStyle}>{lead.source}</td>
                    <td style={tdStyle}>{lead.status}</td>

                    <td style={tdStyle}>
                      <button
                        onClick={() => editLead(lead)}
                        style={buttonStyleSmall}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteLead(lead._id)}
                        style={{
                          ...buttonStyleSmall,
                          background: "#dc3545",
                          marginLeft: "8px",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredLeads.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      style={{
                        textAlign: "center",
                        padding: "20px",
                      }}
                    >
                      No Leads Found
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

const cardStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,.08)",
};

const inputStyle = {
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "5px",
};

const buttonStyle = {
  background: "#2563EB",
  color: "white",
  border: "none",
  padding: "10px 18px",
  borderRadius: "5px",
  cursor: "pointer",
};

const buttonStyleSmall = {
  background: "#2563EB",
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: "5px",
  cursor: "pointer",
};

const thStyle = {
  padding: "12px",
  textAlign: "left",
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #ddd",
};

export default Leads;
