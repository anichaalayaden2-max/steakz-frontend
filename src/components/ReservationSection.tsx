import { useEffect, useState } from "react";
import api from "../services/api";

function ReservationSection() {
  const [branches, setBranches] = useState<any[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState(2);
  const [reservationDate, setReservationDate] = useState("");
  const [branchId, setBranchId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await api.get("/branches");
      setBranches(response.data);
      if (response.data.length > 0) {
        setBranchId(String(response.data[0].id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const createReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/reservations", {
        customerName,
        phone,
        guests,
        reservationDate,
        branchId: Number(branchId),
      });

      setMessage("✅ Reservation created successfully!");
      setCustomerName("");
      setPhone("");
      setGuests(2);
      setReservationDate("");
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to create reservation.");
    }
  };

  return (
    <section id="reservation" style={{ padding: "100px 80px", background: "white" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: "58px", color: "#111827", marginBottom: "20px" }}>
            Reserve Your Table
          </h2>
          <p style={{ fontSize: "20px", lineHeight: "1.8", color: "#6b7280" }}>
            Reserve your luxury dining experience at Steakz in seconds.
          </p>
        </div>

        <form onSubmit={createReservation} style={{ background: "#f8fafc", padding: "40px", borderRadius: "20px", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
          <input
            placeholder="Full Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="Guests"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            required
            style={inputStyle}
          />
          <select
            value={branchId}
            onChange={(e) => setBranchId(e.target.value)}
            style={inputStyle}
          >
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
          <input
            type="datetime-local"
            value={reservationDate}
            onChange={(e) => setReservationDate(e.target.value)}
            required
            style={inputStyle}
          />
          <button
            type="submit"
            style={{ width: "100%", padding: "15px", background: "#92400e", color: "white", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}
          >
            Reserve Table
          </button>

          {message && (
            <p style={{ marginTop: "15px", textAlign: "center", fontWeight: "bold", color: message.includes("✅") ? "#16a34a" : "#dc2626" }}>
              {message}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

const inputStyle = {
  width: "100%",
  padding: "15px",
  marginBottom: "15px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  fontSize: "16px",
  boxSizing: "border-box" as const,
};

export default ReservationSection;