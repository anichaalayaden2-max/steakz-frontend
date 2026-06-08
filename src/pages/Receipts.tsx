import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";

interface Receipt {
  id: number; createdAt: string;
  Payment: {
    id: number; amount: number; method: string;
    Order: {
      id: number; totalAmount: number;
      Customer?: { name: string }; Table?: { tableNumber: string }; Branch?: { name: string };
      OrderItem?: { quantity: number; price: number; MenuItem: { name: string } }[];
    };
  };
}

function Receipts() {
  const role = localStorage.getItem("role");
  const branchId = localStorage.getItem("branchId");
  const branchName = localStorage.getItem("branchName") || "Steakz Restaurant";
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [selectedPaymentId, setSelectedPaymentId] = useState("");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const params = role === "ADMIN" ? {} : branchId ? { branchId } : {};
      const [receiptsRes, paymentsRes] = await Promise.all([
        api.get("/receipts", { headers, params }),
        api.get("/payments", { headers, params }),
      ]);
      setReceipts(receiptsRes.data);
      const usedIds = new Set(receiptsRes.data.map((r: Receipt) => r.Payment?.id));
      setPayments(paymentsRes.data.filter((p: any) => !usedIds.has(p.id) && p.status === "PAID"));
    } catch (error) { console.error(error); }
  };

  const createReceipt = async () => {
    if (!selectedPaymentId) { alert("Please select a payment."); return; }
    try {
      await api.post("/receipts", { paymentId: Number(selectedPaymentId) }, { headers });
      setSelectedPaymentId(""); fetchData();
    } catch (error) { console.error(error); alert("Failed to create receipt"); }
  };

  const downloadPDF = (receipt: Receipt) => {
    const payment = receipt.Payment;
    const order = payment?.Order;
    const items = order?.OrderItem || [];
    const date = new Date(receipt.createdAt).toLocaleDateString("en-GB");
    const branch = order?.Branch?.name || branchName;

    const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"/><title>Receipt #${receipt.id}</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Courier New',monospace;background:white;color:#111;padding:40px;max-width:400px;margin:0 auto}.header{text-align:center;margin-bottom:20px}.logo{font-size:32px;font-weight:bold;letter-spacing:4px}.subtitle{color:#666;font-size:12px;margin-top:4px}.divider{border-top:1px dashed #999;margin:15px 0}.row{display:flex;justify-content:space-between;margin:6px 0;font-size:13px}.label{color:#666}.total-row{display:flex;justify-content:space-between;font-weight:bold;font-size:16px;margin-top:8px}.footer{text-align:center;margin-top:25px;font-size:11px;color:#999}</style>
</head><body>
<div class="header"><div class="logo">STEAKZ</div><div class="subtitle">RESTAURANT</div><div class="subtitle">${branch}</div></div>
<div class="divider"></div>
<div class="row"><span class="label">Receipt #</span><span>${receipt.id}</span></div>
<div class="row"><span class="label">Date</span><span>${date}</span></div>
<div class="row"><span class="label">Order #</span><span>${order?.id || "—"}</span></div>
<div class="row"><span class="label">Customer</span><span>${order?.Customer?.name || "—"}</span></div>
<div class="row"><span class="label">Table</span><span>${order?.Table?.tableNumber || "—"}</span></div>
<div class="divider"></div>
<div style="font-weight:bold;margin-bottom:8px;font-size:13px">ITEMS ORDERED</div>
${items.map((i) => `<div class="row"><span>${i.MenuItem.name} × ${i.quantity}</span><span>£${(i.price * i.quantity).toFixed(2)}</span></div>`).join("")}
<div class="divider"></div>
<div class="total-row"><span>TOTAL</span><span>£${Number(order?.totalAmount || 0).toFixed(2)}</span></div>
<div class="row" style="margin-top:8px"><span class="label">Payment</span><span>${payment?.method || "—"}</span></div>
<div class="divider"></div>
<div class="footer"><p>Thank you for dining at Steakz!</p></div>
</body></html>`;

    const win = window.open("", "_blank");
    if (win) { win.document.write(html); win.document.close(); win.focus(); setTimeout(() => win.print(), 500); }
  };

  return (
    <MainLayout>
      <div style={{ marginBottom: "35px" }}>
        <p style={{ color: "#a8896c", letterSpacing: "4px", fontSize: "11px", fontFamily: "Arial, sans-serif", margin: "0 0 10px" }}>CASHIER</p>
        <h1 style={{ color: "#1c1007", fontSize: "38px", fontWeight: "400", margin: "0 0 8px", fontFamily: "Georgia, serif" }}>Receipts</h1>
        <div style={{ width: "50px", height: "2px", background: "#D4AF37" }} />
      </div>

      {/* Generate Receipt */}
      <div style={{ background: "#1c1007", padding: "30px", borderRadius: "4px", marginBottom: "40px", border: "1px solid rgba(212,175,55,0.2)" }}>
        <p style={{ color: "#D4AF37", letterSpacing: "4px", fontSize: "11px", fontFamily: "Arial, sans-serif", marginBottom: "20px" }}>GENERATE RECEIPT</p>
        <div style={{ display: "flex", gap: "15px", alignItems: "flex-end" }}>
          <div style={{ flex: 1 }}>
            <label style={formLabel}>SELECT PAYMENT</label>
            <select value={selectedPaymentId} onChange={(e) => setSelectedPaymentId(e.target.value)} style={formSelect}>
              <option value="">-- Select Payment --</option>
              {payments.map((p) => (
                <option key={p.id} value={p.id}>Payment #{p.id} — Order #{p.orderId} — £{Number(p.amount).toFixed(2)} ({p.method})</option>
              ))}
            </select>
          </div>
          <button onClick={createReceipt} disabled={!selectedPaymentId} style={{
            background: selectedPaymentId ? "#D4AF37" : "rgba(212,175,55,0.2)",
            color: selectedPaymentId ? "#1c1007" : "#a8896c",
            border: "none", padding: "11px 24px", borderRadius: "3px",
            fontWeight: "700", fontSize: "11px", letterSpacing: "2px",
            fontFamily: "Arial, sans-serif", cursor: selectedPaymentId ? "pointer" : "not-allowed", whiteSpace: "nowrap",
          }}>
            CREATE RECEIPT
          </button>
        </div>
      </div>

      {/* Receipts List */}
      <p style={{ color: "#a8896c", letterSpacing: "4px", fontSize: "11px", fontFamily: "Arial, sans-serif", marginBottom: "20px" }}>RECEIPTS</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "15px" }}>
        {receipts.map((receipt) => {
          const order = receipt.Payment?.Order;
          const items = order?.OrderItem || [];
          return (
            <div key={receipt.id} style={{ background: "white", borderRadius: "4px", border: "1px solid #e8e0d0", borderTop: "3px solid #D4AF37", padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <p style={{ color: "#1c1007", fontSize: "16px", fontFamily: "Georgia, serif", margin: 0 }}>Receipt #{receipt.id}</p>
                <span style={{ color: "#a8896c", fontSize: "12px", fontFamily: "Arial, sans-serif" }}>{new Date(receipt.createdAt).toLocaleDateString("en-GB")}</span>
              </div>
              <p style={{ color: "#78716c", fontSize: "13px", fontFamily: "Arial, sans-serif", margin: "4px 0" }}>Order #{order?.id}</p>
              <p style={{ color: "#78716c", fontSize: "13px", fontFamily: "Arial, sans-serif", margin: "4px 0" }}>{order?.Customer?.name || "—"}</p>
              <p style={{ color: "#78716c", fontSize: "13px", fontFamily: "Arial, sans-serif", margin: "4px 0" }}>{receipt.Payment?.method}</p>
              {items.length > 0 && (
                <div style={{ background: "#faf8f5", borderRadius: "3px", padding: "10px", margin: "12px 0" }}>
                  {items.map((oi, idx) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", color: "#57534e", fontSize: "12px", fontFamily: "Arial, sans-serif", marginBottom: "4px" }}>
                      <span>{oi.MenuItem.name} × {oi.quantity}</span>
                      <span>£{(oi.price * oi.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
              <p style={{ color: "#D4AF37", fontSize: "22px", fontFamily: "Georgia, serif", margin: "10px 0 15px" }}>£{Number(receipt.Payment?.amount).toFixed(2)}</p>
              <button onClick={() => downloadPDF(receipt)} style={{ background: "#1c1007", color: "#D4AF37", border: "none", padding: "12px", borderRadius: "3px", fontWeight: "700", fontSize: "11px", letterSpacing: "2px", fontFamily: "Arial, sans-serif", cursor: "pointer", width: "100%" }}>
                DOWNLOAD PDF
              </button>
            </div>
          );
        })}
      </div>
    </MainLayout>
  );
}

const formLabel: React.CSSProperties = { color: "#a8896c", display: "block", marginBottom: "8px", fontSize: "10px", letterSpacing: "2px", fontFamily: "Arial, sans-serif" };
const formSelect: React.CSSProperties = { width: "100%", padding: "10px", borderRadius: "3px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "white", fontFamily: "Arial, sans-serif" };

export default Receipts;