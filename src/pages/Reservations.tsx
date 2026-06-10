import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";

interface Reservation {
  id: number; customerName: string; phone: string; guests: number;
  reservationDate: string; status: string;
  Table?: { tableNumber: string; capacity: number };
}

function Reservations() {
  const role = localStorage.getItem("role");
  const branchId = localStorage.getItem("branchId");
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState("");
  const [reservationDate, setReservationDate] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchReservations(); }, []);

  const fetchReservations = async () => {
    try {
      const params = role === "ADMIN" ? {} : branchId ? { branchId } : {};
      const response = await api.get("/reservations", { headers, params });
      setReservations(response.data);
    } catch (error) { console.error(error); }
  };

  const createReservation = async () => {
    if (!customerName || !phone || !guests || !reservationDate) { alert("Please fill in all fields."); return; }
    try {
      await api.post("/reservations", { customerName, phone, guests: Number(guests), reservationDate, status: "PENDING", branchId: Number(branchId) }, { headers });
      clearForm(); fetchReservations();
    } catch (error) { console.error(error); alert("Failed to create reservation"); }
  };

  const updateReservation = async () => {
    if (!editingId) return;
    try {
      await api.put(`/reservations/${editingId}`, { customerName, phone, guests: Number(guests), reservationDate, status }, { headers });
      clearForm(); fetchReservations();
    } catch (error) { console.error(error); alert("Failed to update reservation"); }
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try { await api.put(`/reservations/${id}`, { status: newStatus }, { headers }); fetchReservations(); }
    catch (error) { console.error(error); }
  };

  const editReservation = (r: Reservation) => {
    setEditingId(r.id); setCustomerName(r.customerName); setPhone(r.phone);
    setGuests(String(r.guests)); setReservationDate(r.reservationDate.slice(0, 16));
    setStatus(r.status); setShowForm(true);
  };

  const deleteReservation = async (id: number) => {
    if (!window.confirm("Delete this reservation?")) return;
    try { await api.delete(`/reservations/${id}`, { headers }); fetchReservations(); }
    catch (error) { console.error(error); }
  };

  const clearForm = () => {
    setEditingId(null); setCustomerName(""); setPhone(""); setGuests("");
    setReservationDate(""); setStatus("PENDING"); setShowForm(false);
  };

  const statusBg: Record<string, string> = { PENDING: "#92400e", CONFIRMED: "#14532d", CANCELLED: "#7f1d1d" };

  return (
    <MainLayout>
      <div style={{ marginBottom: "35px" }}>
        <p style={{ color: "#a8896c", letterSpacing: "4px", fontSize: "11px", fontFamily: "Arial, sans-serif", margin: "0 0 10px" }}>RESTAURANT OPERATIONS</p>
        <h1 style={{ color: "#1c1007", fontSize: "38px", fontWeight: "400", margin: "0 0 8px", fontFamily: "Georgia, serif" }}>Reservations</h1>
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
        {showForm ? "CANCEL" : "+ NEW RESERVATION"}
      </button>

      {showForm && (
        <div style={{ background: "#1c1007", padding: "30px", borderRadius: "4px", marginBottom: "30px", border: "1px solid rgba(212,175,55,0.2)" }}>
          <p style={{ color: "#D4AF37", letterSpacing: "4px", fontSize: "11px", fontFamily: "Arial, sans-serif", marginBottom: "20px" }}>
            {editingId ? "EDIT RESERVATION" : "NEW RESERVATION"}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", marginBottom: "20px" }}>
            {[
              { label: "CUSTOMER NAME", value: customerName, onChange: setCustomerName, placeholder: "John Smith", type: "text" },
              { label: "PHONE", value: phone, onChange: setPhone, placeholder: "+44 7700 000000", type: "text" },
              { label: "GUESTS", value: guests, onChange: setGuests, placeholder: "2", type: "number" },
            ].map((field) => (
              <div key={field.label}>
                <label style={formLabel}>{field.label}</label>
                <input type={field.type} value={field.value} onChange={(e) => field.onChange(e.target.value)} placeholder={field.placeholder} style={formInput} />
              </div>
            ))}
            <div>
              <label style={formLabel}>DATE & TIME</label>
              <input type="datetime-local" value={reservationDate} onChange={(e) => setReservationDate(e.target.value)} style={formInput} />
            </div>
            {editingId && (
              <div>
                <label style={formLabel}>STATUS</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} style={formInput}>
                  <option value="PENDING">PENDING</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
            )}
          </div>
          <button onClick={editingId ? updateReservation : createReservation} style={{ background: "#D4AF37", color: "#1c1007", border: "none", padding: "14px 30px", borderRadius: "3px", fontWeight: "700", fontSize: "11px", letterSpacing: "2px", fontFamily: "Arial, sans-serif", cursor: "pointer", width: "100%" }}>
            {editingId ? "UPDATE RESERVATION" : "CREATE RESERVATION"}
          </button>
        </div>
      )}

      <div style={{ background: "white", borderRadius: "4px", border: "1px solid #e8e0d0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#1c1007" }}>
              {["Customer", "Phone", "Guests", "Table", "Date", "Status", "Actions"].map((h) => (
                <th key={h} style={{ padding: "14px 16px", textAlign: "left", color: "#a8896c", fontSize: "10px", letterSpacing: "2px", fontFamily: "Arial, sans-serif", fontWeight: "600" }}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reservations.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: "40px", textAlign: "center", color: "#a8896c", fontFamily: "Arial, sans-serif", fontSize: "13px" }}>
                  No reservations found
                </td>
              </tr>
            ) : (
              reservations.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #f0ece6" }}>
                  <td style={td}>{r.customerName}</td>
                  <td style={td}>{r.phone}</td>
                  <td style={td}>{r.guests}</td>
                  <td style={td}>
                    {r.Table ? (
                      <span style={{ background: "#1c1007", color: "#D4AF37", padding: "3px 10px", borderRadius: "2px", fontSize: "11px", fontFamily: "Arial, sans-serif", letterSpacing: "1px" }}>
                        {r.Table.tableNumber}
                      </span>
                    ) : (
                      <span style={{ color: "#dc2626", fontSize: "12px", fontFamily: "Arial, sans-serif" }}>No table</span>
                    )}
                  </td>
                  <td style={td}>{new Date(r.reservationDate).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</td>
                  <td style={td}>
                    <span style={{ background: statusBg[r.status] || "#374151", color: "white", padding: "3px 10px", borderRadius: "2px", fontSize: "10px", fontFamily: "Arial, sans-serif", letterSpacing: "1px", fontWeight: "600" }}>
                      {r.status}
                    </span>
                  </td>
                  <td style={{ ...td, display: "flex", gap: "6px" }}>
                    {r.status === "PENDING" && (
                      <>
                        <button onClick={() => updateStatus(r.id, "CONFIRMED")} style={actionBtn("#14532d")}>✓</button>
                        <button onClick={() => updateStatus(r.id, "CANCELLED")} style={actionBtn("#92400e")}>✕</button>
                      </>
                    )}
                    <button onClick={() => editReservation(r)} style={actionBtn("#1e3a8a")}>Edit</button>
                    <button onClick={() => deleteReservation(r.id)} style={actionBtn("#7f1d1d")}>Del</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </MainLayout>
  );
}

const formLabel: React.CSSProperties = { color: "#a8896c", display: "block", marginBottom: "8px", fontSize: "10px", letterSpacing: "2px", fontFamily: "Arial, sans-serif" };
const formInput: React.CSSProperties = { width: "100%", padding: "10px", borderRadius: "3px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "white", fontFamily: "Arial, sans-serif", boxSizing: "border-box" };
const td: React.CSSProperties = { padding: "14px 16px", fontSize: "13px", color: "#44403c", fontFamily: "Arial, sans-serif" };
const actionBtn = (bg: string): React.CSSProperties => ({ background: bg, color: "white", border: "none", padding: "6px 10px", borderRadius: "2px", cursor: "pointer", fontSize: "11px", fontFamily: "Arial, sans-serif", fontWeight: "600" });

export default Reservations;