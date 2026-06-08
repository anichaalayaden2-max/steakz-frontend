import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";

interface Order {
  id: number; totalAmount: number; status: string;
  Customer?: { name: string }; Table?: { tableNumber: string };
  OrderItem?: { id: number; quantity: number; price: number; MenuItem: { name: string } }[];
}
interface Payment { id: number; amount: number; method: string; status: string; orderId: number; }

function Payments() {
  const role = localStorage.getItem("role");
  const branchId = localStorage.getItem("branchId");
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [payments, setPayments] = useState<Payment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [method, setMethod] = useState("CARD");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const params = role === "ADMIN" ? {} : branchId ? { branchId } : {};
      const [paymentsRes, ordersRes] = await Promise.all([
        api.get("/payments", { headers, params }),
        api.get("/orders", { headers, params }),
      ]);
      setPayments(paymentsRes.data);
      const paidOrderIds = new Set(paymentsRes.data.map((p: Payment) => p.orderId));
      setOrders(ordersRes.data.filter((o: Order) => o.status === "DELIVERED" && !paidOrderIds.has(o.id)));
    } catch (error) { console.error(error); }
  };

  const handleOrderSelect = (orderId: string) => {
    setSelectedOrder(orders.find((o) => o.id === Number(orderId)) || null);
  };

  const createPayment = async () => {
    if (!selectedOrder) { alert("Please select an order."); return; }
    try {
      await api.post("/payments", { amount: selectedOrder.totalAmount, method, status: "PAID", orderId: selectedOrder.id }, { headers });
      setSelectedOrder(null); setMethod("CARD"); fetchData();
    } catch (error) { console.error(error); alert("Failed to create payment"); }
  };

  const deletePayment = async (id: number) => {
    if (!window.confirm("Delete payment?")) return;
    try { await api.delete(`/payments/${id}`, { headers }); fetchData(); }
    catch (error) { console.error(error); alert("Failed to delete payment"); }
  };

  return (
    <MainLayout>
      <div style={{ marginBottom: "35px" }}>
        <p style={{ color: "#a8896c", letterSpacing: "4px", fontSize: "11px", fontFamily: "Arial, sans-serif", margin: "0 0 10px" }}>CASHIER</p>
        <h1 style={{ color: "#1c1007", fontSize: "38px", fontWeight: "400", margin: "0 0 8px", fontFamily: "Georgia, serif" }}>Payments</h1>
        <div style={{ width: "50px", height: "2px", background: "#D4AF37" }} />
      </div>

      {/* New Payment */}
      <div style={{ background: "#1c1007", padding: "30px", borderRadius: "4px", marginBottom: "40px", border: "1px solid rgba(212,175,55,0.2)" }}>
        <p style={{ color: "#D4AF37", letterSpacing: "4px", fontSize: "11px", fontFamily: "Arial, sans-serif", marginBottom: "20px" }}>NEW PAYMENT</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }}>
          <div>
            <label style={formLabel}>SELECT ORDER</label>
            <select value={selectedOrder?.id || ""} onChange={(e) => handleOrderSelect(e.target.value)} style={formSelect}>
              <option value="">-- Select Delivered Order --</option>
              {orders.map((o) => (
                <option key={o.id} value={o.id}>Order #{o.id} — {o.Customer?.name || "Unknown"} — £{Number(o.totalAmount).toFixed(2)}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={formLabel}>PAYMENT METHOD</label>
            <select value={method} onChange={(e) => setMethod(e.target.value)} style={formSelect}>
              <option value="CARD">Card</option>
              <option value="CASH">Cash</option>
            </select>
          </div>
        </div>

        {selectedOrder && (
          <div style={{ background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "4px", padding: "20px", marginBottom: "20px" }}>
            <p style={{ color: "#D4AF37", letterSpacing: "3px", fontSize: "11px", fontFamily: "Arial, sans-serif", marginBottom: "12px" }}>ORDER #{selectedOrder.id}</p>
            <p style={{ color: "#a8896c", fontSize: "13px", fontFamily: "Arial, sans-serif", margin: "0 0 4px" }}>Customer: {selectedOrder.Customer?.name || "—"}</p>
            <p style={{ color: "#a8896c", fontSize: "13px", fontFamily: "Arial, sans-serif", margin: "0 0 15px" }}>Table: {selectedOrder.Table?.tableNumber || "—"}</p>
            {selectedOrder.OrderItem && selectedOrder.OrderItem.length > 0 && (
              <div style={{ borderTop: "1px solid rgba(212,175,55,0.1)", paddingTop: "12px", marginBottom: "12px" }}>
                {selectedOrder.OrderItem.map((oi) => (
                  <div key={oi.id} style={{ display: "flex", justifyContent: "space-between", color: "#d1d5db", fontSize: "13px", fontFamily: "Arial, sans-serif", marginBottom: "6px" }}>
                    <span>{oi.MenuItem.name} × {oi.quantity}</span>
                    <span>£{(oi.price * oi.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
            <div style={{ borderTop: "1px solid rgba(212,175,55,0.2)", paddingTop: "12px", display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#D4AF37", letterSpacing: "2px", fontSize: "11px", fontFamily: "Arial, sans-serif", fontWeight: "600" }}>TOTAL TO CHARGE</span>
              <span style={{ color: "#D4AF37", fontSize: "24px", fontFamily: "Georgia, serif" }}>£{Number(selectedOrder.totalAmount).toFixed(2)}</span>
            </div>
          </div>
        )}

        <button onClick={createPayment} disabled={!selectedOrder} style={{
          background: selectedOrder ? "#D4AF37" : "rgba(212,175,55,0.2)",
          color: selectedOrder ? "#1c1007" : "#a8896c",
          border: "none", padding: "14px 30px", borderRadius: "3px",
          fontWeight: "700", fontSize: "11px", letterSpacing: "2px",
          fontFamily: "Arial, sans-serif", cursor: selectedOrder ? "pointer" : "not-allowed", width: "100%",
        }}>
          {selectedOrder ? `CONFIRM PAYMENT — £${Number(selectedOrder.totalAmount).toFixed(2)}` : "SELECT AN ORDER"}
        </button>
      </div>

      {/* Payment History */}
      <p style={{ color: "#a8896c", letterSpacing: "4px", fontSize: "11px", fontFamily: "Arial, sans-serif", marginBottom: "20px" }}>PAYMENT HISTORY</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "15px" }}>
        {payments.map((payment) => (
          <div key={payment.id} style={{ background: "white", borderRadius: "4px", border: "1px solid #e8e0d0", borderLeft: "3px solid #D4AF37", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <p style={{ color: "#1c1007", fontSize: "16px", fontFamily: "Georgia, serif", margin: 0 }}>Payment #{payment.id}</p>
              <span style={{ background: payment.status === "PAID" ? "#14532d" : "#92400e", color: "white", padding: "3px 10px", borderRadius: "2px", fontSize: "10px", fontFamily: "Arial, sans-serif", letterSpacing: "1px", fontWeight: "600" }}>
                {payment.status}
              </span>
            </div>
            <p style={{ color: "#78716c", fontSize: "13px", fontFamily: "Arial, sans-serif", margin: "4px 0" }}>Order #{payment.orderId}</p>
            <p style={{ color: "#78716c", fontSize: "13px", fontFamily: "Arial, sans-serif", margin: "4px 0" }}>{payment.method}</p>
            <p style={{ color: "#D4AF37", fontSize: "24px", fontFamily: "Georgia, serif", margin: "10px 0 15px" }}>£{Number(payment.amount).toFixed(2)}</p>
            <button onClick={() => deletePayment(payment.id)} style={{ background: "transparent", color: "#dc2626", border: "1px solid rgba(220,38,38,0.3)", padding: "8px", borderRadius: "3px", cursor: "pointer", fontWeight: "600", width: "100%", fontSize: "11px", letterSpacing: "1px", fontFamily: "Arial, sans-serif" }}>
              DELETE
            </button>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}

const formLabel: React.CSSProperties = { color: "#a8896c", display: "block", marginBottom: "8px", fontSize: "10px", letterSpacing: "2px", fontFamily: "Arial, sans-serif" };
const formSelect: React.CSSProperties = { width: "100%", padding: "10px", borderRadius: "3px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "white", fontFamily: "Arial, sans-serif" };

export default Payments;