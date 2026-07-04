import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function Users() {
  const token = localStorage.getItem("token");

  const [users, setUsers] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("supportagent");

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    getUsers();
  }, []);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const getUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users", config);

      setUsers(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const saveUser = async () => {
    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/users/${editingId}`,
          {
            name,
            email,
            role,
          },
          config,
        );

        alert("User Updated");
      } else {
        await axios.post(
          "http://localhost:5000/api/users",
          {
            name,
            email,
            password,
            role,
          },
          config,
        );

        alert("User Added");
      }

      clearForm();
      getUsers();
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  const editUser = (user) => {
    setEditingId(user._id);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setPassword("");
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, config);

      alert("User Deleted");
      getUsers();
    } catch (error) {
      console.log(error);
    }
  };

  const clearForm = () => {
    setEditingId(null);
    setName("");
    setEmail("");
    setPassword("");
    setRole("supportagent");
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
          <h2>Users</h2>

          {/* Form */}

          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,.08)",
              marginBottom: "30px",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
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
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
              />

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={inputStyle}
              >
                <option value="supportagent">Support Agent</option>
                <option value="subadmin">Sub Admin</option>
                <option value="superadmin">Super Admin</option>
              </select>
            </div>

            <div style={{ marginTop: "20px" }}>
              <button onClick={saveUser} style={buttonStyle}>
                {editingId ? "Update User" : "Add User"}
              </button>

              <button
                onClick={clearForm}
                style={{
                  ...buttonStyle,
                  background: "#6c757d",
                  marginLeft: "10px",
                }}
              >
                Clear
              </button>
            </div>
          </div>

          {/* Table */}

          <div
            style={{
              background: "white",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,.08)",
              padding: "20px",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr style={{ background: "#2563EB", color: "white" }}>
                  <th style={thStyle}>Name</th>
                  <th style={thStyle}>Email</th>
                  <th style={thStyle}>Role</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td style={tdStyle}>{user.name}</td>
                    <td style={tdStyle}>{user.email}</td>
                    <td style={tdStyle}>{user.role}</td>

                    <td style={tdStyle}>
                      <button
                        onClick={() => editUser(user)}
                        style={{
                          ...buttonStyle,
                          padding: "6px 12px",
                          marginRight: "10px",
                        }}
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteUser(user._id)}
                        style={{
                          ...buttonStyle,
                          padding: "6px 12px",
                          background: "#dc3545",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "5px",
};

const buttonStyle = {
  background: "#2563EB",
  color: "white",
  border: "none",
  padding: "10px 20px",
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

export default Users;
