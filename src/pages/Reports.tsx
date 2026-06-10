import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";

function Reports() {
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => { fetchReports(); }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get("/dashboard/hq", { headers });
      setStats(response.data);
    } catch (error) { console.error(error); }
  };

  const totalRevenue = stats.reduce((sum, b) => sum + (b.revenue || 0), 0);
  const totalOrders = stats.reduce((sum, b) => sum + (b.orders || 0), 0);
  const totalReservations = stats.reduce((sum, b) => sum + (b.reservations || 0), 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const sorted = [...stats].sort((a, b) => (b.revenue || 0) - (a.revenue || 0));
  const topBranch = sorted[0] || null;
  const lowestBranch = sorted[sorted.length - 1] || null;
  const highestRevenue = Math.max(...stats.map((b) => b.revenue || 0), 1);

  const printReport = () => {
    window.print();
  };

  return (
    <MainLayout>
      {/* HEADER */}
      <div style={{ marginBottom: "35px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <p style={{ color: "#a8896c", letterSpacing: "4px", fontSize: "11px", fontFamily: "Arial, sans-serif", margin: "0 0 10px" }}>HEADQUARTERS</p>
          <h1 style={{ color: "#1c1007", fontSize: "38px", fontWeight: "400", margin: "0 0 8px", fontFamily: "Georgia, serif" }}>Reports</h1>
          <div style={{ width: "50px", height: "2px", background: "#D4AF37" }} />
        </div>
        <button onClick={printReport} style={{ background: "#1c1007", color: "#D4AF37", border: "1px solid rgba(212,175,55,0.3)", padding: "12px 24px", borderRadius: "3px", cursor: "pointer", fontSize: "11px", letterSpacing: "2px", fontFamily: "Arial, sans-serif", fontWeight: "600" }}>
          PRINT REPORT
        </button>
      </div>

      {/* KPI CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "40px" }}>
        {[
          { label: "TOTAL REVENUE", value: `£${totalRevenue.toFixed(2)}`, color: "#D4AF37" },
          { label: "TOTAL ORDERS", value: totalOrders, color: "#7c2d12" },
          { label: "RESERVATIONS", value: totalReservations, color: "#1c1007" },
          { label: "AVG ORDER VALUE", value: `£${avgOrderValue.toFixed(2)}`, color: "#a8896c" },
        ].map((kpi) => (
          <div key={kpi.label} style={{ background: "white", borderRadius: "4px", padding: "25px 30px", border: "1px solid #e8e0d0", borderTop: `3px solid ${kpi.color}` }}>
            <p style={{ color: "#a8896c", fontSize: "10px", letterSpacing: "2px", fontFamily: "Arial, sans-serif", margin: "0 0 12px" }}>{kpi.label}</p>
            <p style={{ color: "#1c1007", fontSize: "30px", fontFamily: "Georgia, serif", fontWeight: "300", margin: 0 }}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* TOP & LOWEST */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "40px" }}>
        {topBranch && (
          <div style={{ background: "#1c1007", borderRadius: "4px", padding: "25px 30px", border: "1px solid rgba(212,175,55,0.2)" }}>
            <p style={{ color: "#D4AF37", fontSize: "10px", letterSpacing: "3px", fontFamily: "Arial, sans-serif", margin: "0 0 15px" }}>TOP PERFORMER</p>
            <h2 style={{ color: "white", fontSize: "22px", fontFamily: "Georgia, serif", fontWeight: "400", margin: "0 0 8px" }}>{topBranch.name}</h2>
            <p style={{ color: "#a8896c", fontSize: "12px", fontFamily: "Arial, sans-serif", margin: "0 0 15px" }}>{topBranch.location}</p>
            <p style={{ color: "#D4AF37", fontSize: "32px", fontFamily: "Georgia, serif", fontWeight: "300", margin: "0 0 10px" }}>£{Number(topBranch.revenue || 0).toFixed(2)}</p>
            <div style={{ display: "flex", gap: "20px" }}>
              <div>
                <p style={{ color: "#57534e", fontSize: "10px", letterSpacing: "2px", fontFamily: "Arial, sans-serif", margin: "0 0 4px" }}>ORDERS</p>
                <p style={{ color: "white", fontSize: "16px", fontFamily: "Georgia, serif", margin: 0 }}>{topBranch.orders}</p>
              </div>
              <div>
                <p style={{ color: "#57534e", fontSize: "10px", letterSpacing: "2px", fontFamily: "Arial, sans-serif", margin: "0 0 4px" }}>RESERVATIONS</p>
                <p style={{ color: "white", fontSize: "16px", fontFamily: "Georgia, serif", margin: 0 }}>{topBranch.reservations}</p>
              </div>
            </div>
          </div>
        )}

        {lowestBranch && lowestBranch.id !== topBranch?.id && (
          <div style={{ background: "white", borderRadius: "4px", padding: "25px 30px", border: "1px solid #e8e0d0", borderLeft: "3px solid #dc2626" }}>
            <p style={{ color: "#dc2626", fontSize: "10px", letterSpacing: "3px", fontFamily: "Arial, sans-serif", margin: "0 0 15px" }}>NEEDS ATTENTION</p>
            <h2 style={{ color: "#1c1007", fontSize: "22px", fontFamily: "Georgia, serif", fontWeight: "400", margin: "0 0 8px" }}>{lowestBranch.name}</h2>
            <p style={{ color: "#a8896c", fontSize: "12px", fontFamily: "Arial, sans-serif", margin: "0 0 15px" }}>{lowestBranch.location}</p>
            <p style={{ color: "#1c1007", fontSize: "32px", fontFamily: "Georgia, serif", fontWeight: "300", margin: "0 0 10px" }}>£{Number(lowestBranch.revenue || 0).toFixed(2)}</p>
            <div style={{ display: "flex", gap: "20px" }}>
              <div>
                <p style={{ color: "#a8896c", fontSize: "10px", letterSpacing: "2px", fontFamily: "Arial, sans-serif", margin: "0 0 4px" }}>ORDERS</p>
                <p style={{ color: "#1c1007", fontSize: "16px", fontFamily: "Georgia, serif", margin: 0 }}>{lowestBranch.orders}</p>
              </div>
              <div>
                <p style={{ color: "#a8896c", fontSize: "10px", letterSpacing: "2px", fontFamily: "Arial, sans-serif", margin: "0 0 4px" }}>RESERVATIONS</p>
                <p style={{ color: "#1c1007", fontSize: "16px", fontFamily: "Georgia, serif", margin: 0 }}>{lowestBranch.reservations}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* BRANCH COMPARISON */}
      <p style={{ color: "#a8896c", letterSpacing: "4px", fontSize: "11px", fontFamily: "Arial, sans-serif", marginBottom: "20px" }}>BRANCH COMPARISON</p>
      <div style={{ background: "white", borderRadius: "4px", border: "1px solid #e8e0d0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#1c1007" }}>
              {["Branch", "Location", "Revenue", "Orders", "Reservations", "Avg Order"].map((h) => (
                <th key={h} style={{ padding: "14px 16px", textAlign: "left", color: "#a8896c", fontSize: "10px", letterSpacing: "2px", fontFamily: "Arial, sans-serif", fontWeight: "600" }}>{h.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((branch, index) => (
              <tr key={branch.id} style={{ borderBottom: "1px solid #f0ece6" }}>
                <td style={td}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ background: index === 0 ? "#D4AF37" : "#faf8f5", color: index === 0 ? "#1c1007" : "#a8896c", width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontFamily: "Georgia, serif", flexShrink: 0 }}>
                      {index + 1}
                    </span>
                    <span style={{ fontWeight: "600", color: "#1c1007" }}>{branch.name}</span>
                  </div>
                </td>
                <td style={td}>{branch.location}</td>
                <td style={{ ...td, color: "#D4AF37", fontFamily: "Georgia, serif", fontSize: "16px" }}>£{Number(branch.revenue || 0).toFixed(2)}</td>
                <td style={td}>{branch.orders}</td>
                <td style={td}>{branch.reservations}</td>
                <td style={td}>£{branch.orders > 0 ? (branch.revenue / branch.orders).toFixed(2) : "0.00"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Revenue Bar Chart */}
        <div style={{ padding: "25px 30px", borderTop: "1px solid #f0ece6" }}>
          <p style={{ color: "#a8896c", fontSize: "10px", letterSpacing: "2px", fontFamily: "Arial, sans-serif", marginBottom: "15px" }}>REVENUE DISTRIBUTION</p>
          {sorted.map((branch) => (
            <div key={branch.id} style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                <span style={{ color: "#44403c", fontSize: "12px", fontFamily: "Arial, sans-serif" }}>{branch.name}</span>
                <span style={{ color: "#D4AF37", fontSize: "12px", fontFamily: "Georgia, serif" }}>£{Number(branch.revenue || 0).toFixed(2)}</span>
              </div>
              <div style={{ background: "#f0ece6", borderRadius: "2px", height: "8px", overflow: "hidden" }}>
                <div style={{ background: "#D4AF37", height: "100%", width: `${highestRevenue > 0 ? ((branch.revenue || 0) / highestRevenue) * 100 : 0}%`, borderRadius: "2px" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}

const td: React.CSSProperties = { padding: "14px 16px", fontSize: "13px", color: "#44403c", fontFamily: "Arial, sans-serif" };

export default Reports;