import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";

function Customers() {
  const role = localStorage.getItem("role");
  const branchId = localStorage.getItem("branchId");
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => { fetchCustomers(); }, []);

  const fetchCustomers = async () => {
    try {
      const params = role === "ADMIN" ? {} : branchId ? { branchId } : {};
      const response = await api.get("/customers", { headers, params });
      setCustomers(response.data);
    } catch (error) { console.error(error); }
  };

  const createCustomer = async () => {
    try {
      await api.post("/customers", { name, phone, email, branchId: Number(branchId) }, { headers });
      setName(""); setPhone(""); setEmail(""); setShowModal(false); fetchCustomers();
    } catch (error) { console.error(error); }
  };

  const updateCustomer = async () => {
    try {
      await api.put(`/customers/${editingId}`, { name, phone, email }, { headers });
      setEditingId(null); setName(""); setPhone(""); setEmail(""); setShowModal(false); fetchCustomers();
    } catch (error) { console.error(error); }
  };

  const deleteCustomer = async (id: number) => {
    if (!window.confirm("Delete this customer?")) return;
    try { await api.delete(`/customers/${id}`, { headers }); fetchCustomers(); }
    catch (error) { console.error(error); }
  };

  const openEditModal = (customer: any) => {
    setEditingId(customer.id); setName(customer.name); setPhone(customer.phone);
    setEmail(customer.email || ""); setShowModal(true);
  };

  const filtered = customers.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <MainLayout>
      <div style={{ marginBottom: "35px" }}>
        <p style={{ color: "#a8896c", letterSpacing: "4px", fontSize: "11px", fontFamily: "Arial, sans-serif", margin: "0 0 10px" }}>RESTAURANT OPERATIONS</p>
        <h1 style={{ color: "#1c1007", fontSize: "38px", fontWeight: "400", margin: "0 0 8px", fontFamily: "Georgia, serif" }}>Customers</h1>
        <div style={{ width: "50px", height: "2px", background: "#D4AF37" }} />
      </div>

      <div style={{ display: "flex", gap: "12px", marginBottom: "25px" }}>
        <input
          placeholder="Search customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "10px 16px", borderRadius: "3px", border: "1px solid #e8e0d0", fontFamily: "Arial, sans-serif", fontSize: "13px", width: "280px", background: "white" }}
        />
        <button onClick={() => { setEditingId(null); setName(""); setPhone(""); setEmail(""); setShowModal(true); }}
          style={{ background: "#1c1007", color: "#D4AF37", border: "none", padding: "10px 24px", borderRadius: "3px", cursor: "pointer", fontSize: "11px", letterSpacing: "2px", fontFamily: "Arial, sans-serif", fontWeight: "600" }}>
          + ADD CUSTOMER
        </button>
      </div>

      <div style={{ background: "white", borderRadius: "4px", border: "1px solid #e8e0d0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#1c1007" }}>
              {["ID", "Name", "Phone", "Email", "Actions"].map((h) => (
                <th key={h} style={{ padding: "14px 16px", textAlign: "left", color: "#a8896c", fontSize: "10px", letterSpacing: "2px", fontFamily: "Arial, sans-serif", fontWeight: "600" }}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((customer) => (
              <tr key={customer.id} style={{ borderBottom: "1px solid #f0ece6" }}>
                <td style={td}>{customer.id}</td>
                <td style={{ ...td, fontWeight: "600", color: "#1c1007" }}>{customer.name}</td>
                <td style={td}>{customer.phone}</td>
                <td style={td}>{customer.email || "—"}</td>
                <td style={{ ...td, display: "flex", gap: "8px" }}>
                  <button onClick={() => openEditModal(customer)} style={{ background: "#1e3a8a", color: "white", border: "none", padding: "6px 14px", borderRadius: "2px", cursor: "pointer", fontSize: "11px", fontFamily: "Arial, sans-serif", fontWeight: "600" }}>EDIT</button>
                  <button onClick={() => deleteCustomer(customer.id)} style={{ background: "transparent", color: "#dc2626", border: "1px solid rgba(220,38,38,0.3)", padding: "6px 14px", borderRadius: "2px", cursor: "pointer", fontSize: "11px", fontFamily: "Arial, sans-serif", fontWeight: "600" }}>DELETE</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ background: "#1c1007", padding: "35px", borderRadius: "4px", width: "420px", border: "1px solid rgba(212,175,55,0.2)" }}>
            <p style={{ color: "#D4AF37", letterSpacing: "4px", fontSize: "11px", fontFamily: "Arial, sans-serif", marginBottom: "20px" }}>
              {editingId ? "EDIT CUSTOMER" : "NEW CUSTOMER"}
            </p>
            {[
              { label: "NAME", value: name, onChange: setName, placeholder: "John Smith" },
              { label: "PHONE", value: phone, onChange: setPhone, placeholder: "+44 7700 000000" },
              { label: "EMAIL", value: email, onChange: setEmail, placeholder: "john@email.com" },
            ].map((field) => (
              <div key={field.label} style={{ marginBottom: "15px" }}>
                <label style={{ color: "#a8896c", display: "block", marginBottom: "6px", fontSize: "10px", letterSpacing: "2px", fontFamily: "Arial, sans-serif" }}>{field.label}</label>
                <input value={field.value} onChange={(e) => field.onChange(e.target.value)} placeholder={field.placeholder}
                  style={{ width: "100%", padding: "10px", borderRadius: "3px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "white", fontFamily: "Arial, sans-serif", boxSizing: "border-box" as const }} />
              </div>
            ))}
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button onClick={editingId ? updateCustomer : createCustomer}
                style={{ background: "#D4AF37", color: "#1c1007", border: "none", padding: "12px 20px", borderRadius: "3px", cursor: "pointer", fontWeight: "700", flex: 1, fontSize: "11px", letterSpacing: "2px", fontFamily: "Arial, sans-serif" }}>
                SAVE
              </button>
              <button onClick={() => setShowModal(false)}
                style={{ background: "transparent", color: "#a8896c", border: "1px solid rgba(255,255,255,0.1)", padding: "12px 20px", borderRadius: "3px", cursor: "pointer", fontSize: "11px", letterSpacing: "2px", fontFamily: "Arial, sans-serif" }}>
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

const td: React.CSSProperties = { padding: "14px 16px", fontSize: "13px", color: "#44403c", fontFamily: "Arial, sans-serif" };

export default Customers;