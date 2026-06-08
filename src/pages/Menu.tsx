import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";

function Menu() {
  const role = localStorage.getItem("role");
  const branchId = localStorage.getItem("branchId");
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("STEAK");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchMenuItems(); }, []);

  const fetchMenuItems = async () => {
    try {
      const params = role === "ADMIN" ? {} : branchId ? { branchId } : {};
      const response = await api.get("/menu-items", { headers, params });
      setMenuItems(response.data);
    } catch (error) { console.error(error); }
  };

  const createMenuItem = async () => {
    if (!name || !price || !category) { alert("Please fill in all fields."); return; }
    try {
      await api.post("/menu-items", { name, description, price: Number(price), image: "", category, branchId: Number(branchId) }, { headers });
      clearForm(); fetchMenuItems();
    } catch (error) { console.error(error); alert("Failed to create menu item"); }
  };

  const updateMenuItem = async () => {
    try {
      await api.put(`/menu-items/${editingId}`, { name, description, price: Number(price), image: "", category, branchId: Number(branchId) }, { headers });
      clearForm(); fetchMenuItems();
    } catch (error) { console.error(error); alert("Failed to update menu item"); }
  };

  const deleteMenuItem = async (id: number) => {
    if (!window.confirm("Delete this menu item?")) return;
    try { await api.delete(`/menu-items/${id}`, { headers }); fetchMenuItems(); }
    catch (error) { console.error(error); alert("Failed to delete menu item"); }
  };

  const startEdit = (item: any) => { setEditingId(item.id); setName(item.name); setDescription(item.description); setPrice(item.price.toString()); setCategory(item.category); setShowForm(true); };
  const clearForm = () => { setEditingId(null); setName(""); setDescription(""); setPrice(""); setCategory("STEAK"); setShowForm(false); };

  const categoryBorder: Record<string, string> = { STEAK: "#dc2626", BURGER: "#D4AF37", SIDE: "#14532d", DRINK: "#1e3a8a", DESSERT: "#7c3aed" };

  return (
    <MainLayout>
      <div style={{ marginBottom: "35px" }}>
        <p style={{ color: "#a8896c", letterSpacing: "4px", fontSize: "11px", fontFamily: "Arial, sans-serif", margin: "0 0 10px" }}>KITCHEN</p>
        <h1 style={{ color: "#1c1007", fontSize: "38px", fontWeight: "400", margin: "0 0 8px", fontFamily: "Georgia, serif" }}>Menu Management</h1>
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
        {showForm ? "CANCEL" : "+ ADD MENU ITEM"}
      </button>

      {showForm && (
        <div style={{ background: "#1c1007", padding: "30px", borderRadius: "4px", marginBottom: "30px", border: "1px solid rgba(212,175,55,0.2)" }}>
          <p style={{ color: "#D4AF37", letterSpacing: "4px", fontSize: "11px", fontFamily: "Arial, sans-serif", marginBottom: "20px" }}>
            {editingId ? "EDIT ITEM" : "NEW MENU ITEM"}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", marginBottom: "20px" }}>
            <div>
              <label style={formLabel}>NAME</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ribeye Steak" style={formInput} />
            </div>
            <div>
              <label style={formLabel}>PRICE (£)</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="28.90" style={formInput} />
            </div>
            <div>
              <label style={formLabel}>CATEGORY</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={formInput}>
                <option value="STEAK">Steak</option>
                <option value="BURGER">Burger</option>
                <option value="SIDE">Side</option>
                <option value="DRINK">Drink</option>
                <option value="DESSERT">Dessert</option>
              </select>
            </div>
            <div>
              <label style={formLabel}>DESCRIPTION</label>
              <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description..." style={formInput} />
            </div>
          </div>
          <button onClick={editingId ? updateMenuItem : createMenuItem} style={{ background: "#D4AF37", color: "#1c1007", border: "none", padding: "14px 30px", borderRadius: "3px", fontWeight: "700", fontSize: "11px", letterSpacing: "2px", fontFamily: "Arial, sans-serif", cursor: "pointer", width: "100%" }}>
            {editingId ? "UPDATE ITEM" : "ADD ITEM"}
          </button>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
        {menuItems.map((item) => (
          <div key={item.id} style={{ background: "white", borderRadius: "4px", border: "1px solid #e8e0d0", borderTop: `3px solid ${categoryBorder[item.category] || "#D4AF37"}`, overflow: "hidden" }}>
            <div style={{ padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                <span style={{ background: "#faf8f5", color: "#78716c", padding: "3px 10px", borderRadius: "2px", fontSize: "10px", fontFamily: "Arial, sans-serif", letterSpacing: "1px", fontWeight: "600" }}>
                  {item.category}
                </span>
                <span style={{ color: "#D4AF37", fontSize: "20px", fontFamily: "Georgia, serif" }}>£{Number(item.price).toFixed(2)}</span>
              </div>
              <h3 style={{ color: "#1c1007", fontSize: "18px", fontFamily: "Georgia, serif", fontWeight: "400", margin: "0 0 8px" }}>{item.name}</h3>
              <p style={{ color: "#78716c", fontSize: "13px", fontFamily: "Arial, sans-serif", margin: 0, lineHeight: "1.6" }}>{item.description}</p>
            </div>
            <div style={{ borderTop: "1px solid #f0ece6", padding: "12px 20px", display: "flex", gap: "8px" }}>
              <button onClick={() => startEdit(item)} style={{ background: "#1e3a8a", color: "white", border: "none", padding: "8px", borderRadius: "2px", cursor: "pointer", fontWeight: "600", flex: 1, fontSize: "11px", letterSpacing: "1px", fontFamily: "Arial, sans-serif" }}>EDIT</button>
              <button onClick={() => deleteMenuItem(item.id)} style={{ background: "transparent", color: "#dc2626", border: "1px solid rgba(220,38,38,0.3)", padding: "8px", borderRadius: "2px", cursor: "pointer", fontWeight: "600", flex: 1, fontSize: "11px", letterSpacing: "1px", fontFamily: "Arial, sans-serif" }}>DELETE</button>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}

const formLabel: React.CSSProperties = { color: "#a8896c", display: "block", marginBottom: "8px", fontSize: "10px", letterSpacing: "2px", fontFamily: "Arial, sans-serif" };
const formInput: React.CSSProperties = { width: "100%", padding: "10px", borderRadius: "3px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "white", fontFamily: "Arial, sans-serif", boxSizing: "border-box" };

export default Menu;