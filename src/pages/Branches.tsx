import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";

function Branches() {
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [branches, setBranches] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchBranches(); }, []);

  const fetchBranches = async () => {
    try {
      const response = await api.get("/branches", { headers });
      setBranches(response.data);
    } catch (error) { console.error(error); }
  };

  const createBranch = async () => {
    if (!name || !location || !phone) { alert("Please fill in all fields."); return; }
    try {
      await api.post("/branches", { name, location, phone }, { headers });
      clearForm(); fetchBranches();
    } catch (error) { console.error(error); alert("Failed to create branch"); }
  };

  const updateBranch = async () => {
    try {
      await api.put(`/branches/${editingId}`, { name, location, phone }, { headers });
      clearForm(); fetchBranches();
    } catch (error) { console.error(error); alert("Failed to update branch"); }
  };

  const deleteBranch = async (id: number) => {
    if (!window.confirm("Delete this branch?")) return;
    try {
      await api.delete(`/branches/${id}`, { headers });
      fetchBranches();
    } catch (error) { console.error(error); alert("Failed to delete branch"); }
  };

  const startEdit = (branch: any) => {
    setEditingId(branch.id);
    setName(branch.name);
    setLocation(branch.location);
    setPhone(branch.phone);
    setShowForm(true);
  };

  const clearForm = () => {
    setEditingId(null);
    setName(""); setLocation(""); setPhone("");
    setShowForm(false);
  };

  const cityImages: Record<string, string> = {
    london: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80",
    manchester: "https://images.unsplash.com/photo-1519098901909-b1553a1190af?w=600&q=80",
    liverpool: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  };

  const getImage = (location: string) => {
    const key = location?.toLowerCase();
    return cityImages[key] || "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80";
  };

  return (
    <MainLayout>
      <div style={{ marginBottom: "35px" }}>
        <p style={{ color: "#a8896c", letterSpacing: "4px", fontSize: "11px", fontFamily: "Arial, sans-serif", margin: "0 0 10px" }}>MANAGEMENT</p>
        <h1 style={{ color: "#1c1007", fontSize: "38px", fontWeight: "400", margin: "0 0 8px", fontFamily: "Georgia, serif" }}>Branches</h1>
        <div style={{ width: "50px", height: "2px", background: "#D4AF37" }} />
      </div>

      <button onClick={() => showForm ? clearForm() : setShowForm(true)} style={{
        background: showForm ? "transparent" : "#1c1007",
        color: showForm ? "#7c2d12" : "white",
        border: showForm ? "1px solid #7c2d12" : "none",
        padding: "12px 28px", borderRadius: "3px",
        fontSize: "11px", letterSpacing: "2px",
        fontFamily: "Arial, sans-serif", fontWeight: "600",
        cursor: "pointer", marginBottom: "25px",
      }}>
        {showForm ? "CANCEL" : "+ ADD BRANCH"}
      </button>

      {showForm && (
        <div style={{ background: "#1c1007", padding: "30px", borderRadius: "4px", marginBottom: "35px", border: "1px solid rgba(212,175,55,0.2)" }}>
          <p style={{ color: "#D4AF37", letterSpacing: "4px", fontSize: "11px", fontFamily: "Arial, sans-serif", marginBottom: "20px" }}>
            {editingId ? "EDIT BRANCH" : "NEW BRANCH"}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", marginBottom: "20px" }}>
            <div>
              <label style={formLabel}>BRANCH NAME</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Steakz London" style={formInput} />
            </div>
            <div>
              <label style={formLabel}>LOCATION</label>
              <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="London" style={formInput} />
            </div>
            <div>
              <label style={formLabel}>PHONE</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+44 20 0000 0000" style={formInput} />
            </div>
          </div>
          <button onClick={editingId ? updateBranch : createBranch} style={{
            background: "#D4AF37", color: "#1c1007", border: "none",
            padding: "14px 30px", borderRadius: "3px", fontWeight: "700",
            fontSize: "11px", letterSpacing: "2px", fontFamily: "Arial, sans-serif",
            cursor: "pointer", width: "100%",
          }}>
            {editingId ? "UPDATE BRANCH" : "CREATE BRANCH"}
          </button>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "25px" }}>
        {branches.map((branch) => (
          <div key={branch.id} style={{ background: "white", borderRadius: "4px", border: "1px solid #e8e0d0", overflow: "hidden" }}>
            <div style={{ position: "relative", height: "180px", overflow: "hidden" }}>
              <img
                src={getImage(branch.location)}
                alt={branch.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(28,16,7,0.85) 0%, rgba(0,0,0,0) 60%)",
                display: "flex", flexDirection: "column", justifyContent: "flex-end",
                padding: "20px",
              }}>
                <p style={{ color: "#D4AF37", fontSize: "10px", letterSpacing: "3px", margin: "0 0 5px", fontFamily: "Arial, sans-serif" }}>STEAKZ</p>
                <h2 style={{ color: "white", fontSize: "22px", margin: 0, fontWeight: "400", fontFamily: "Georgia, serif" }}>{branch.name}</h2>
              </div>
            </div>

            <div style={{ padding: "20px" }}>
              <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
                <div>
                  <p style={{ color: "#a8896c", fontSize: "10px", letterSpacing: "2px", fontFamily: "Arial, sans-serif", margin: "0 0 4px" }}>LOCATION</p>
                  <p style={{ color: "#1c1007", fontSize: "14px", fontFamily: "Arial, sans-serif", margin: 0 }}>{branch.location}</p>
                </div>
                <div>
                  <p style={{ color: "#a8896c", fontSize: "10px", letterSpacing: "2px", fontFamily: "Arial, sans-serif", margin: "0 0 4px" }}>PHONE</p>
                  <p style={{ color: "#1c1007", fontSize: "14px", fontFamily: "Arial, sans-serif", margin: 0 }}>{branch.phone}</p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => startEdit(branch)} style={{
                  background: "#1c1007", color: "#D4AF37", border: "none",
                  padding: "10px", borderRadius: "3px", cursor: "pointer",
                  fontWeight: "600", flex: 1, fontSize: "11px",
                  letterSpacing: "2px", fontFamily: "Arial, sans-serif",
                }}>
                  EDIT
                </button>
                <button onClick={() => deleteBranch(branch.id)} style={{
                  background: "transparent", color: "#dc2626",
                  border: "1px solid rgba(220,38,38,0.3)",
                  padding: "10px", borderRadius: "3px", cursor: "pointer",
                  fontWeight: "600", flex: 1, fontSize: "11px",
                  letterSpacing: "2px", fontFamily: "Arial, sans-serif",
                }}>
                  DELETE
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}

const formLabel: React.CSSProperties = { color: "#a8896c", display: "block", marginBottom: "8px", fontSize: "10px", letterSpacing: "2px", fontFamily: "Arial, sans-serif" };
const formInput: React.CSSProperties = { width: "100%", padding: "10px", borderRadius: "3px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "white", fontFamily: "Arial, sans-serif", boxSizing: "border-box" };

export default Branches;