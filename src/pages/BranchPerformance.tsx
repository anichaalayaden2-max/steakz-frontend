import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";

function BranchPerformance() {
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };
  const [branches, setBranches] = useState<any[]>([]);

  useEffect(() => { fetchPerformance(); }, []);

  const fetchPerformance = async () => {
    try {
      const response = await api.get("/dashboard/hq", { headers });
      setBranches(response.data);
    } catch (error) { console.error(error); }
  };

  const totalRevenue = branches.reduce((sum, b) => sum + (b.revenue || 0), 0);
  const totalOrders = branches.reduce((sum, b) => sum + (b.orders || 0), 0);
  const totalReservations = branches.reduce((sum, b) => sum + (b.reservations || 0), 0);

  const cityImages: Record<string, string> = {
    london: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80",
    manchester: "https://images.unsplash.com/photo-1519098901909-b1553a1190af?w=600&q=80",
    liverpool: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  };

  const getImage = (location: string) =>
    cityImages[location?.toLowerCase()] || "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80";

  const topBranch = branches.reduce((top, b) => (!top || b.revenue > top.revenue) ? b : top, null);

  return (
    <MainLayout>
      {/* HEADER */}
      <div style={{ marginBottom: "35px" }}>
        <p style={{ color: "#a8896c", letterSpacing: "4px", fontSize: "11px", fontFamily: "Arial, sans-serif", margin: "0 0 10px" }}>HEADQUARTERS</p>
        <h1 style={{ color: "#1c1007", fontSize: "38px", fontWeight: "400", margin: "0 0 8px", fontFamily: "Georgia, serif" }}>Branch Performance</h1>
        <div style={{ width: "50px", height: "2px", background: "#D4AF37" }} />
      </div>

      {/* SUMMARY STRIP */}
      <div style={{ background: "#1c1007", borderRadius: "4px", padding: "30px 40px", marginBottom: "40px", border: "1px solid rgba(212,175,55,0.2)", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#a8896c", fontSize: "10px", letterSpacing: "3px", fontFamily: "Arial, sans-serif", margin: "0 0 8px" }}>TOTAL REVENUE</p>
          <p style={{ color: "#D4AF37", fontSize: "36px", fontFamily: "Georgia, serif", fontWeight: "300", margin: 0 }}>£{totalRevenue.toFixed(2)}</p>
        </div>
        <div style={{ textAlign: "center", borderLeft: "1px solid rgba(212,175,55,0.2)", borderRight: "1px solid rgba(212,175,55,0.2)" }}>
          <p style={{ color: "#a8896c", fontSize: "10px", letterSpacing: "3px", fontFamily: "Arial, sans-serif", margin: "0 0 8px" }}>TOTAL ORDERS</p>
          <p style={{ color: "white", fontSize: "36px", fontFamily: "Georgia, serif", fontWeight: "300", margin: 0 }}>{totalOrders}</p>
        </div>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#a8896c", fontSize: "10px", letterSpacing: "3px", fontFamily: "Arial, sans-serif", margin: "0 0 8px" }}>TOTAL RESERVATIONS</p>
          <p style={{ color: "white", fontSize: "36px", fontFamily: "Georgia, serif", fontWeight: "300", margin: 0 }}>{totalReservations}</p>
        </div>
      </div>

      {/* BRANCH CARDS */}
      <p style={{ color: "#a8896c", letterSpacing: "4px", fontSize: "11px", fontFamily: "Arial, sans-serif", marginBottom: "20px" }}>ALL BRANCHES</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "25px" }}>
        {branches.map((branch) => (
          <div key={branch.id} style={{ background: "white", borderRadius: "4px", border: "1px solid #e8e0d0", overflow: "hidden" }}>
            {/* Image */}
            <div style={{ position: "relative", height: "160px", overflow: "hidden" }}>
              <img src={getImage(branch.location)} alt={branch.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(28,16,7,0.9) 0%, rgba(0,0,0,0) 60%)",
                display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "20px",
              }}>
                {topBranch && branch.id === topBranch.id && (
                  <span style={{ background: "#D4AF37", color: "#1c1007", padding: "3px 10px", borderRadius: "2px", fontSize: "10px", fontFamily: "Arial, sans-serif", fontWeight: "700", letterSpacing: "1px", marginBottom: "8px", width: "fit-content" }}>
                    TOP PERFORMER
                  </span>
                )}
                <h2 style={{ color: "white", fontSize: "20px", margin: 0, fontWeight: "400", fontFamily: "Georgia, serif" }}>{branch.name}</h2>
                <p style={{ color: "#a8896c", fontSize: "12px", margin: "4px 0 0", fontFamily: "Arial, sans-serif" }}>{branch.location}</p>
              </div>
            </div>

            {/* Stats */}
            <div style={{ padding: "20px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "15px", marginBottom: "0" }}>
                <div style={{ textAlign: "center", padding: "15px 10px", background: "#faf8f5", borderRadius: "3px" }}>
                  <p style={{ color: "#a8896c", fontSize: "9px", letterSpacing: "2px", fontFamily: "Arial, sans-serif", margin: "0 0 6px" }}>REVENUE</p>
                  <p style={{ color: "#D4AF37", fontSize: "18px", fontFamily: "Georgia, serif", fontWeight: "400", margin: 0 }}>£{Number(branch.revenue || 0).toFixed(0)}</p>
                </div>
                <div style={{ textAlign: "center", padding: "15px 10px", background: "#faf8f5", borderRadius: "3px" }}>
                  <p style={{ color: "#a8896c", fontSize: "9px", letterSpacing: "2px", fontFamily: "Arial, sans-serif", margin: "0 0 6px" }}>ORDERS</p>
                  <p style={{ color: "#1c1007", fontSize: "18px", fontFamily: "Georgia, serif", fontWeight: "400", margin: 0 }}>{branch.orders}</p>
                </div>
                <div style={{ textAlign: "center", padding: "15px 10px", background: "#faf8f5", borderRadius: "3px" }}>
                  <p style={{ color: "#a8896c", fontSize: "9px", letterSpacing: "2px", fontFamily: "Arial, sans-serif", margin: "0 0 6px" }}>RESERVATIONS</p>
                  <p style={{ color: "#1c1007", fontSize: "18px", fontFamily: "Georgia, serif", fontWeight: "400", margin: 0 }}>{branch.reservations}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}

export default BranchPerformance;