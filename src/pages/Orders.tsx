import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";

interface MenuItem { id: number; name: string; price: number; category: string; }
interface OrderItem { menuItemId: number; name: string; price: number; quantity: number; }
interface Order {
  id: number; status: string; totalAmount: number;
  Customer?: { name: string }; Table?: { tableNumber: string };
  OrderItem?: { id: number; quantity: number; price: number; MenuItem: { name: string } }[];
}
interface Table { id: number; tableNumber: string; capacity: number; status: string; }

function Orders() {
  const role = localStorage.getItem("role");
  const branchId = localStorage.getItem("branchId");
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const isChef = role === "CHEF";
  const isWaiter = role === "WAITER" || role === "BRANCH_MANAGER";
  const headers = { Authorization: `Bearer ${token}` };

  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [tableId, setTableId] = useState("");
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const params = role === "ADMIN" ? {} : branchId ? { branchId } : {};
      const [ordersRes, menuRes, customersRes, tablesRes] = await Promise.all([
        api.get("/orders", { headers, params }),
        api.get("/menu-items", { headers, params }),
        api.get("/customers", { headers, params }),
        api.get("/tables", { headers, params }),
      ]);
      setOrders(ordersRes.data);
      setMenuItems(menuRes.data);
      setCustomers(customersRes.data);
      setTables(tablesRes.data);
    } catch (error) { console.error(error); }
  };

  const addItem = (menuItem: MenuItem) => {
    setSelectedItems((prev) => {
      const existing = prev.find((i) => i.menuItemId === menuItem.id);
      if (existing) return prev.map((i) => i.menuItemId === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { menuItemId: menuItem.id, name: menuItem.name, price: menuItem.price, quantity: 1 }];
    });
  };

  const removeItem = (menuItemId: number) => {
    setSelectedItems((prev) => prev.map((i) => i.menuItemId === menuItemId ? { ...i, quantity: i.quantity - 1 } : i).filter((i) => i.quantity > 0));
  };

  const totalAmount = selectedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const createOrder = async () => {
    if (!customerId || !tableId || selectedItems.length === 0) { alert("Please select a customer, table, and at least one item."); return; }
    try {
      await api.post("/orders", {
        status: "PENDING", totalAmount,
        customerId: Number(customerId), tableId: Number(tableId),
        branchId: Number(branchId), waiterId: Number(userId),
        items: selectedItems.map((i) => ({ menuItemId: i.menuItemId, quantity: i.quantity, price: i.price })),
      }, { headers });
      setCustomerId(""); setTableId(""); setSelectedItems([]); setShowForm(false);
      fetchAll();
    } catch (error) { console.error(error); alert("Failed to create order"); }
  };

  const updateStatus = async (id: number, status: string, totalAmount: number) => {
    try { await api.put(`/orders/${id}`, { status, totalAmount }, { headers }); fetchAll(); }
    catch (error) { console.error(error); alert("Failed to update order"); }
  };

  const deleteOrder = async (id: number) => {
    if (!window.confirm("Delete this order?")) return;
    try { await api.delete(`/orders/${id}`, { headers }); fetchAll(); }
    catch (error) { console.error(error); alert("Failed to delete order"); }
  };

  const statusBg: Record<string, string> = {
    PENDING: "#92400e", PREPARING: "#1e3a8a", READY: "#14532d", DELIVERED: "#374151", CANCELLED: "#7f1d1d",
  };
  const chefNextStatus = (s: string) => s === "PENDING" ? "PREPARING" : s === "PREPARING" ? "READY" : null;

  return (
    <MainLayout>
      <div style={{ marginBottom: "35px" }}>
        <p style={{ color: "#a8896c", letterSpacing: "4px", fontSize: "11px", fontFamily: "Arial, sans-serif", margin: "0 0 10px" }}>
          {isChef ? "KITCHEN VIEW" : "RESTAURANT OPERATIONS"}
        </p>
        <h1 style={{ color: "#1c1007", fontSize: "38px", fontWeight: "400", margin: "0 0 8px", fontFamily: "Georgia, serif" }}>Orders</h1>
        <div style={{ width: "50px", height: "2px", background: "#D4AF37" }} />
      </div>

      {/* Tables Overview */}
      {isWaiter && (
        <div style={{ marginBottom: "30px" }}>
          <p style={{ color: "#a8896c", letterSpacing: "3px", fontSize: "10px", fontFamily: "Arial, sans-serif", marginBottom: "12px" }}>TABLE STATUS</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "10px" }}>
            {tables.map((t) => (
              <div key={t.id} style={{
                background: t.status === "AVAILABLE" ? "#faf8f5" : "#1c1007",
                border: t.status === "AVAILABLE" ? "1px solid #D4AF37" : "1px solid rgba(212,175,55,0.3)",
                borderRadius: "4px", padding: "12px", textAlign: "center",
              }}>
                <p style={{ color: t.status === "AVAILABLE" ? "#D4AF37" : "#a8896c", fontSize: "10px", letterSpacing: "2px", fontFamily: "Arial, sans-serif", margin: "0 0 6px" }}>
                  {t.status === "AVAILABLE" ? "AVAILABLE" : "OCCUPIED"}
                </p>
                <p style={{ color: t.status === "AVAILABLE" ? "#1c1007" : "white", fontSize: "18px", fontFamily: "Georgia, serif", fontWeight: "400", margin: "0 0 4px" }}>
                  {t.tableNumber}
                </p>
                <p style={{ color: "#a8896c", fontSize: "11px", fontFamily: "Arial, sans-serif", margin: 0 }}>cap. {t.capacity}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Order Button */}
      {isWaiter && (
        <button onClick={() => setShowForm(!showForm)} style={{
          background: showForm ? "transparent" : "#1c1007",
          color: showForm ? "#7c2d12" : "white",
          border: showForm ? "1px solid #7c2d12" : "none",
          padding: "12px 28px", borderRadius: "3px",
          fontSize: "11px", letterSpacing: "2px",
          fontFamily: "Arial, sans-serif", fontWeight: "600",
          cursor: "pointer", marginBottom: "25px",
        }}>
          {showForm ? "CANCEL" : "+ NEW ORDER"}
        </button>
      )}

      {/* New Order Form */}
      {isWaiter && showForm && (
        <div style={{ background: "#1c1007", padding: "30px", borderRadius: "4px", marginBottom: "30px", border: "1px solid rgba(212,175,55,0.2)" }}>
          <p style={{ color: "#D4AF37", letterSpacing: "4px", fontSize: "11px", fontFamily: "Arial, sans-serif", marginBottom: "20px" }}>NEW ORDER</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "25px" }}>
            <div>
              <label style={formLabel}>CUSTOMER</label>
              <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} style={formSelect}>
                <option value="">Select Customer</option>
                {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label style={formLabel}>TABLE</label>
              <select value={tableId} onChange={(e) => setTableId(e.target.value)} style={formSelect}>
                <option value="">Select Table</option>
                {tables.filter((t) => t.status === "AVAILABLE").map((t) => (
                  <option key={t.id} value={t.id}>Table {t.tableNumber} (cap. {t.capacity})</option>
                ))}
              </select>
            </div>
          </div>

          <p style={{ color: "#a8896c", letterSpacing: "3px", fontSize: "10px", fontFamily: "Arial, sans-serif", marginBottom: "15px" }}>MENU ITEMS</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "10px", marginBottom: "20px" }}>
            {menuItems.map((item) => {
              const selected = selectedItems.find((i) => i.menuItemId === item.id);
              return (
                <div key={item.id} style={{
                  background: selected ? "rgba(212,175,55,0.1)" : "rgba(255,255,255,0.03)",
                  border: selected ? "1px solid #D4AF37" : "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "4px", padding: "12px",
                }}>
                  <p style={{ color: "white", fontSize: "13px", fontFamily: "Arial, sans-serif", margin: "0 0 4px", fontWeight: "600" }}>{item.name}</p>
                  <p style={{ color: "#D4AF37", fontSize: "14px", fontFamily: "Georgia, serif", margin: "0 0 10px" }}>£{Number(item.price).toFixed(2)}</p>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <button onClick={() => removeItem(item.id)} style={{ background: "#7c2d12", color: "white", border: "none", width: "26px", height: "26px", borderRadius: "3px", cursor: "pointer", fontSize: "16px" }}>−</button>
                    <span style={{ color: "white", fontFamily: "Arial, sans-serif", minWidth: "20px", textAlign: "center" }}>{selected?.quantity || 0}</span>
                    <button onClick={() => addItem(item)} style={{ background: "#14532d", color: "white", border: "none", width: "26px", height: "26px", borderRadius: "3px", cursor: "pointer", fontSize: "16px" }}>+</button>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedItems.length > 0 && (
            <div style={{ background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "4px", padding: "20px", marginBottom: "20px" }}>
              <p style={{ color: "#a8896c", letterSpacing: "3px", fontSize: "10px", fontFamily: "Arial, sans-serif", marginBottom: "12px" }}>ORDER SUMMARY</p>
              {selectedItems.map((i) => (
                <div key={i.menuItemId} style={{ display: "flex", justifyContent: "space-between", color: "#d1d5db", fontSize: "13px", fontFamily: "Arial, sans-serif", marginBottom: "6px" }}>
                  <span>{i.name} × {i.quantity}</span>
                  <span>£{(i.price * i.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div style={{ borderTop: "1px solid rgba(212,175,55,0.2)", marginTop: "10px", paddingTop: "10px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#D4AF37", fontSize: "14px", fontFamily: "Arial, sans-serif", fontWeight: "600", letterSpacing: "2px" }}>TOTAL</span>
                <span style={{ color: "#D4AF37", fontSize: "20px", fontFamily: "Georgia, serif" }}>£{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          )}

          <button onClick={createOrder} style={{ background: "#D4AF37", color: "#1c1007", border: "none", padding: "14px 30px", borderRadius: "3px", fontWeight: "700", fontSize: "11px", letterSpacing: "2px", fontFamily: "Arial, sans-serif", cursor: "pointer", width: "100%" }}>
            PLACE ORDER
          </button>
        </div>
      )}

      {/* Orders List */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "20px" }}>
        {orders.map((order) => (
          <div key={order.id} style={{ background: "white", borderRadius: "4px", border: "1px solid #e8e0d0", borderTop: "3px solid #D4AF37", overflow: "hidden" }}>
            <div style={{ padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                <p style={{ color: "#1c1007", fontSize: "18px", fontFamily: "Georgia, serif", margin: 0 }}>Order #{order.id}</p>
                <span style={{ background: statusBg[order.status] || "#374151", color: "white", padding: "4px 12px", borderRadius: "2px", fontSize: "10px", fontFamily: "Arial, sans-serif", letterSpacing: "1px", fontWeight: "600" }}>
                  {order.status}
                </span>
              </div>

              <p style={{ color: "#78716c", fontSize: "13px", fontFamily: "Arial, sans-serif", margin: "4px 0" }}>Customer: {order.Customer?.name || "—"}</p>
              <p style={{ color: "#78716c", fontSize: "13px", fontFamily: "Arial, sans-serif", margin: "4px 0" }}>Table: {order.Table?.tableNumber || "—"}</p>

              {order.OrderItem && order.OrderItem.length > 0 && (
                <div style={{ background: "#faf8f5", borderRadius: "3px", padding: "10px", margin: "12px 0" }}>
                  {order.OrderItem.map((oi) => (
                    <div key={oi.id} style={{ display: "flex", justifyContent: "space-between", color: "#57534e", fontSize: "13px", fontFamily: "Arial, sans-serif", marginBottom: "4px" }}>
                      <span>{oi.MenuItem.name} × {oi.quantity}</span>
                      <span>£{(oi.price * oi.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

              <p style={{ color: "#D4AF37", fontSize: "22px", fontFamily: "Georgia, serif", margin: "10px 0 0" }}>
                £{Number(order.totalAmount).toFixed(2)}
              </p>
            </div>

            {isChef && chefNextStatus(order.status) && (
              <div style={{ borderTop: "1px solid #e8e0d0", padding: "12px 20px" }}>
                <button onClick={() => updateStatus(order.id, chefNextStatus(order.status)!, order.totalAmount)}
                  style={{ background: "#1c1007", color: "#D4AF37", border: "none", padding: "10px", borderRadius: "3px", cursor: "pointer", fontWeight: "600", width: "100%", fontSize: "11px", letterSpacing: "2px", fontFamily: "Arial, sans-serif" }}>
                  MARK AS {chefNextStatus(order.status)}
                </button>
              </div>
            )}

            {(isWaiter || role === "ADMIN") && (
              <div style={{ borderTop: "1px solid #e8e0d0", padding: "12px 20px", display: "flex", gap: "10px" }}>
                {order.status === "READY" && isWaiter && (
                  <button onClick={() => updateStatus(order.id, "DELIVERED", order.totalAmount)}
                    style={{ background: "#14532d", color: "white", border: "none", padding: "10px", borderRadius: "3px", cursor: "pointer", fontWeight: "600", flex: 1, fontSize: "11px", letterSpacing: "1px", fontFamily: "Arial, sans-serif" }}>
                    DELIVERED
                  </button>
                )}
                <button onClick={() => deleteOrder(order.id)}
                  style={{ background: "transparent", color: "#dc2626", border: "1px solid rgba(220,38,38,0.3)", padding: "10px", borderRadius: "3px", cursor: "pointer", fontWeight: "600", flex: 1, fontSize: "11px", letterSpacing: "1px", fontFamily: "Arial, sans-serif" }}>
                  DELETE
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </MainLayout>
  );
}

const formLabel: React.CSSProperties = { color: "#a8896c", display: "block", marginBottom: "8px", fontSize: "10px", letterSpacing: "2px", fontFamily: "Arial, sans-serif" };
const formSelect: React.CSSProperties = { width: "100%", padding: "10px", borderRadius: "3px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "white", fontFamily: "Arial, sans-serif" };

export default Orders;