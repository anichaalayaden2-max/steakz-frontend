import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";

type TableType = { id: number; tableNumber: string; capacity: number; branchId: number; status: string; };

function Tables() {
  const role = localStorage.getItem("role");
  const branchId = localStorage.getItem("branchId");
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [tables, setTables] = useState<TableType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tableNumber, setTableNumber] = useState("");
  const [capacity, setCapacity] = useState("");

  useEffect(() => { fetchTables(); }, []);

  const fetchTables = async () => {
    try {
      const params = role === "ADMIN" ? {} : branchId ? { branchId } : {};
      const response = await api.get("/tables", { headers, params });
      setTables(response.data);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const resetForm = () => { setEditingId(null); setTableNumber(""); setCapacity(""); };

  const createTable = async () => {
    try {
      await api.post("/tables", { tableNumber, capacity: Number(capacity), branchId: Number(branchId) }, { headers });
      resetForm(); fetchTables();
    } catch (error) { console.error(error); alert("Failed to create table"); }
  };

  const updateTable = async () => {
    if (!editingId) return;
    try {
      await api.put(`/tables/${editingId}`, { tableNumber, capacity: Number(capacity), branchId: Number(branchId) }, { headers });
      resetForm(); fetchTables();
    } catch (error) { console.error(error); alert("Failed to update table"); }
  };

  const editTable = (table: TableType) => { setEditingId(table.id); setTableNumber(table.tableNumber); setCapacity(String(table.capacity)); };

  const deleteTable = async (id: number) => {
    if (!window.confirm("Delete this table?")) return;
    try { await api.delete(`/tables/${id}`, { headers }); fetchTables(); }
    catch (error) { console.error(error); alert("Failed to delete table"); }
  };

  return (
    <MainLayout>
      <div style={{ marginBottom: "35px" }}>
        <p style={{ color: "#a8896c", letterSpacing: "4px", fontSize: "11px", fontFamily: "Arial, sans-serif", margin: "0 0 10px" }}>RESTAURANT OPERATIONS</p>
        <h1 style={{ color: "#1c1007", fontSize: "38px", fontWeight: "400", margin: "0 0 8px", fontFamily: "Georgia, serif" }}>Tables</h1>
        <div style={{ width: "50px", height: "2px", background: "#D4AF37" }} />
      </div>

      <div style={{ background: "#1c1007", padding: "25px 30px", borderRadius: "4px", marginBottom: "30px", border: "1px solid rgba(212,175,55,0.2)" }}>
        <p style={{ color: "#D4AF37", letterSpacing: "4px", fontSize: "11px", fontFamily: "Arial, sans-serif", marginBottom: "15px" }}>
          {editingId ? "UPDATE TABLE" : "CREATE TABLE"}
        </p>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "flex-end" }}>
          <div>
            <label style={formLabel}>TABLE NUMBER</label>
            <input placeholder="T1" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} style={formInput} />
          </div>
          <div>
            <label style={formLabel}>CAPACITY</label>
            <input type="number" placeholder="4" value={capacity} onChange={(e) => setCapacity(e.target.value)} style={formInput} />
          </div>
          {editingId ? (
            <>
              <button onClick={updateTable} style={goldBtn}>UPDATE</button>
              <button onClick={resetForm} style={ghostBtn}>CANCEL</button>
            </>
          ) : (
            <button onClick={createTable} style={goldBtn}>CREATE</button>
          )}
        </div>
      </div>

      {loading ? (
        <p style={{ color: "#a8896c", fontFamily: "Arial, sans-serif" }}>Loading...</p>
      ) : (
        <div style={{ background: "white", borderRadius: "4px", border: "1px solid #e8e0d0", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#1c1007" }}>
                {["ID", "Table", "Capacity", "Status", "Actions"].map((h) => (
                  <th key={h} style={{ padding: "14px 16px", textAlign: "left", color: "#a8896c", fontSize: "10px", letterSpacing: "2px", fontFamily: "Arial, sans-serif", fontWeight: "600" }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tables.map((table) => (
                <tr key={table.id} style={{ borderBottom: "1px solid #f0ece6" }}>
                  <td style={td}>{table.id}</td>
                  <td style={{ ...td, fontWeight: "600", color: "#1c1007", fontFamily: "Georgia, serif", fontSize: "16px" }}>{table.tableNumber}</td>
                  <td style={td}>{table.capacity}</td>
                  <td style={td}>
                    <span style={{ background: table.status === "AVAILABLE" ? "#14532d" : "#7f1d1d", color: "white", padding: "4px 12px", borderRadius: "2px", fontSize: "10px", fontFamily: "Arial, sans-serif", letterSpacing: "1px", fontWeight: "600" }}>
                      {table.status === "AVAILABLE" ? "AVAILABLE" : "OCCUPIED"}
                    </span>
                  </td>
                  <td style={{ ...td, display: "flex", gap: "8px" }}>
                    <button onClick={() => editTable(table)} style={{ background: "#1e3a8a", color: "white", border: "none", padding: "6px 14px", borderRadius: "2px", cursor: "pointer", fontSize: "11px", fontFamily: "Arial, sans-serif", fontWeight: "600" }}>EDIT</button>
                    <button onClick={() => deleteTable(table.id)} style={{ background: "transparent", color: "#dc2626", border: "1px solid rgba(220,38,38,0.3)", padding: "6px 14px", borderRadius: "2px", cursor: "pointer", fontSize: "11px", fontFamily: "Arial, sans-serif", fontWeight: "600" }}>DELETE</button>
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

const formLabel: React.CSSProperties = { color: "#a8896c", display: "block", marginBottom: "6px", fontSize: "10px", letterSpacing: "2px", fontFamily: "Arial, sans-serif" };
const formInput: React.CSSProperties = { padding: "10px 14px", borderRadius: "3px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "white", fontFamily: "Arial, sans-serif", fontSize: "13px" };
const goldBtn: React.CSSProperties = { background: "#D4AF37", color: "#1c1007", border: "none", padding: "10px 24px", borderRadius: "3px", cursor: "pointer", fontWeight: "700", fontSize: "11px", letterSpacing: "2px", fontFamily: "Arial, sans-serif" };
const ghostBtn: React.CSSProperties = { background: "transparent", color: "#a8896c", border: "1px solid rgba(255,255,255,0.1)", padding: "10px 24px", borderRadius: "3px", cursor: "pointer", fontSize: "11px", letterSpacing: "2px", fontFamily: "Arial, sans-serif" };
const td: React.CSSProperties = { padding: "14px 16px", fontSize: "13px", color: "#44403c", fontFamily: "Arial, sans-serif" };

export default Tables;