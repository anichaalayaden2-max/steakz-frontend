import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/PageHeader";
import api from "../services/api";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  branchId: number;
};

function Users() {
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("WAITER");
  const [branchId, setBranchId] = useState(1);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("WAITER");
  const [editBranchId, setEditBranchId] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users", { headers });
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/users", { name, email, password, role, branchId }, { headers });
      setName(""); setEmail(""); setPassword(""); setRole("WAITER"); setBranchId(1);
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert("Failed to create user — email may already exist!");
    }
  };

  const startEdit = (user: User) => {
    setEditingId(user.id);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role);
    setEditBranchId(user.branchId);
  };

  const updateUser = async () => {
    try {
      await api.put(`/users/${editingId}`, { name: editName, email: editEmail, role: editRole, branchId: editBranchId }, { headers });
      setEditingId(null);
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert("Failed to update user");
    }
  };

  const deleteUser = async (id: number) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await api.delete(`/users/${id}`, { headers });
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert("Failed to delete user");
    }
  };

  const roleColor: Record<string, string> = {
    ADMIN: "#dc2626",
    HQ_MANAGER: "#7c3aed",
    BRANCH_MANAGER: "#2563eb",
    WAITER: "#16a34a",
    CHEF: "#f59e0b",
    CASHIER: "#0891b2",
  };

  return (
    <MainLayout>
      <PageHeader title="Users" subtitle="Manage system users" />

      {/* ── Create User Form ── */}
      <form onSubmit={createUser} style={{ background: "#1f2937", padding: "25px", borderRadius: "15px", marginBottom: "25px", border: "1px solid #374151" }}>
        <h3 style={{ color: "white", marginBottom: "15px" }}>Create User</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px", marginBottom: "15px" }}>
          <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} required />
          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} required />
          <select value={role} onChange={(e) => setRole(e.target.value)} style={inputStyle}>
            <option value="ADMIN">ADMIN</option>
            <option value="HQ_MANAGER">HQ_MANAGER</option>
            <option value="BRANCH_MANAGER">BRANCH_MANAGER</option>
            <option value="CHEF">CHEF</option>
            <option value="WAITER">WAITER</option>
            <option value="CASHIER">CASHIER</option>
          </select>
          <input type="number" placeholder="Branch ID" value={branchId} onChange={(e) => setBranchId(Number(e.target.value))} style={inputStyle} />
        </div>
        <button type="submit" style={{ background: "#f59e0b", color: "white", border: "none", padding: "12px 24px", borderRadius: "10px", fontWeight: "bold", cursor: "pointer", width: "100%" }}>
          Create User
        </button>
      </form>

      {/* ── Edit User Form ── */}
      {editingId && (
        <div style={{ background: "#1f2937", padding: "25px", borderRadius: "15px", marginBottom: "25px", border: "1px solid #374151" }}>
          <h3 style={{ color: "white", marginBottom: "15px" }}>Edit User</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px", marginBottom: "15px" }}>
            <input value={editName} onChange={(e) => setEditName(e.target.value)} style={inputStyle} />
            <input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} style={inputStyle} />
            <select value={editRole} onChange={(e) => setEditRole(e.target.value)} style={inputStyle}>
              <option value="ADMIN">ADMIN</option>
              <option value="HQ_MANAGER">HQ_MANAGER</option>
              <option value="BRANCH_MANAGER">BRANCH_MANAGER</option>
              <option value="CHEF">CHEF</option>
              <option value="WAITER">WAITER</option>
              <option value="CASHIER">CASHIER</option>
            </select>
            <input type="number" value={editBranchId} onChange={(e) => setEditBranchId(Number(e.target.value))} style={inputStyle} />
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={updateUser} style={{ background: "#2563eb", color: "white", border: "none", padding: "12px 24px", borderRadius: "10px", fontWeight: "bold", cursor: "pointer", flex: 1 }}>Save Changes</button>
            <button onClick={() => setEditingId(null)} style={{ background: "#6b7280", color: "white", border: "none", padding: "12px 24px", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* ── Users Table ── */}
      {loading ? (
        <h2 style={{ color: "#111827" }}>Loading...</h2>
      ) : (
        <div style={{ background: "#1f2937", borderRadius: "15px", overflow: "hidden", border: "1px solid #374151" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#111827", color: "white" }}>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Role</th>
                <th style={thStyle}>Branch</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} style={{ borderBottom: "1px solid #374151" }}>
                  <td style={tdStyle}>{user.id}</td>
                  <td style={tdStyle}>{user.name}</td>
                  <td style={tdStyle}>{user.email}</td>
                  <td style={tdStyle}>
                    <span style={{ background: roleColor[user.role] || "#6b7280", color: "white", padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={tdStyle}>{user.branchId}</td>
                  <td style={tdStyle}>
                    <button onClick={() => startEdit(user)} style={{ background: "#2563eb", color: "white", border: "none", padding: "8px 12px", borderRadius: "8px", marginRight: "8px", cursor: "pointer", fontWeight: "bold" }}>
                      Edit
                    </button>
                    <button onClick={() => deleteUser(user.id)} style={{ background: "#dc2626", color: "white", border: "none", padding: "8px 12px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </MainLayout>
  );
}

const inputStyle: React.CSSProperties = { padding: "10px", borderRadius: "8px", border: "1px solid #374151", background: "#111827", color: "white", width: "100%", boxSizing: "border-box" };
const thStyle: React.CSSProperties = { padding: "14px 16px", textAlign: "left", fontWeight: "600", fontSize: "13px" };
const tdStyle: React.CSSProperties = { padding: "14px 16px", fontSize: "14px", color: "white" };

export default Users;