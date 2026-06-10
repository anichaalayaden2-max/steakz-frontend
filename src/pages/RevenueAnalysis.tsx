import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";

function RevenueAnalysis() {
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };
  const [branches, setBranches] = useState<any[]>([]);

  useEffect(() => { fetchBranches(); }, []);

  const fetchBranches = async () => {
    try {
      const response = await api.get("/dashboard/hq", { headers });
      setBranches(response.data);
    } catch (error) { console.error(error); }
  };

  const totalRevenue = branches.reduce((sum, b) => sum + (b.revenue || 0), 0);
  const highestRevenue = Math.max(...branches.map((b) => b.revenue || 0), 1);

  const cityImages: Record<string, string> = {
    london: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80",
    manchester: "https://images.unsplash.com/photo-1519098901909-b1553a1190af?w=600&q=80",
    liverpool: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  };

  const getImage = (location: string) =>
    cityImages[location?.toLowerCase()] || "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80";

  return (
    <MainLayout>
      {/* HEADER */}
      <div style={{ marginBottom: "35px" }}>
        <p style={{ color: "#a8896c", letterSpacing: "4px", fontSize: "11px", fontFamily: "Arial, sans-serif", margin: "0 0 10px" }}>HEADQUARTERS</p>
        <h1 style={{ color: "#1c1007", fontSize: "38px", fontWeight: "400", margin: "0 0 8px", fontFamily: "Georgia, serif" }}>Revenue Analysis</h1>
        <div style={{ width: "50px", height: "2px", background: "#D4AF37" }} />
      </div>

      {/* TOTAL REVENUE */}
      <div style={{ background: "#1c1007", borderRadius: "4px", padding: "35px 40px", marginBottom: "40px", border: "1px solid rgba(212,175,55,0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ color: "#a8896c", fontSize: "10px", letterSpacing: "4px", fontFamily: "Arial, sans-serif", margin: "0 0 10px" }}>TOTAL GROUP REVENUE</p>
          <p style={{ color: "#D4AF37", fontSize: "52px", fontFamily: "Georgia, serif", fontWeight: "300", margin: 0 }}>£{totalRevenue.toFixed(2)}</p>
          <p style={{ color: "#57534e", fontSize: "12px", fontFamily: "Arial, sans-serif", margin: "8px 0 0" }}>Across {branches.length} locations</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ color: "#a8896c", fontSize: "10px", letterSpacing: "3px", fontFamily: "Arial, sans-serif", margin: "0 0 8px" }}>AVG PER BRANCH</p>
          <p style={{ color: "white", fontSize: "28px", fontFamily: "Georgia, serif", fontWeight: "300", margin: 0 }}>
            £{branches.length > 0 ? (totalRevenue / branches.length).toFixed(2) : "0.00"}
          </p>
        </div>
      </div>

      {/* BRANCH REVENUE BREAKDOWN */}
      <p style={{ color: "#a8896c", letterSpacing: "4px", fontSize: "11px", fontFamily: "Arial, sans-serif", marginBottom: "20px" }}>REVENUE BY BRANCH</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "40px" }}>
        {branches
          .sort((a, b) => (b.revenue || 0) - (a.revenue || 0))
          .map((branch, index) => {
            const percentage = totalRevenue > 0 ? ((branch.revenue || 0) / totalRevenue) * 100 : 0;
            const barWidth = highestRevenue > 0 ? ((branch.revenue || 0) / highestRevenue) * 100 : 0;
            return (
              <div key={branch.id} style={{ background: "white", borderRadius: "4px", border: "1px solid #e8e0d0", padding: "25px 30px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                    <span style={{ background: "#1c1007", color: "#D4AF37", width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontFamily: "Georgia, serif", fontWeight: "400", flexShrink: 0 }}>
                      {index + 1}
                    </span>
                    <div>
                      <p style={{ color: "#1c1007", fontSize: "16px", fontFamily: "Georgia, serif", fontWeight: "400", margin: "0 0 3px" }}>{branch.name}</p>
                      <p style={{ color: "#a8896c", fontSize: "11px", fontFamily: "Arial, sans-serif", margin: 0 }}>{branch.location}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ color: "#D4AF37", fontSize: "24px", fontFamily: "Georgia, serif", fontWeight: "300", margin: "0 0 3px" }}>£{Number(branch.revenue || 0).toFixed(2)}</p>
                    <p style={{ color: "#a8896c", fontSize: "11px", fontFamily: "Arial, sans-serif", margin: 0 }}>{percentage.toFixed(1)}% of total</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{ background: "#f0ece6", borderRadius: "2px", height: "6px", overflow: "hidden" }}>
                  <div style={{ background: "#D4AF37", height: "100%", width: `${barWidth}%`, borderRadius: "2px", transition: "width 0.5s" }} />
                </div>

                {/* Mini Stats */}
                <div style={{ display: "flex", gap: "25px", marginTop: "15px" }}>
                  <div>
                    <p style={{ color: "#a8896c", fontSize: "10px", letterSpacing: "2px", fontFamily: "Arial, sans-serif", margin: "0 0 3px" }}>ORDERS</p>
                    <p style={{ color: "#1c1007", fontSize: "16px", fontFamily: "Georgia, serif", margin: 0 }}>{branch.orders}</p>
                  </div>
                  <div>
                    <p style={{ color: "#a8896c", fontSize: "10px", letterSpacing: "2px", fontFamily: "Arial, sans-serif", margin: "0 0 3px" }}>RESERVATIONS</p>
                    <p style={{ color: "#1c1007", fontSize: "16px", fontFamily: "Georgia, serif", margin: 0 }}>{branch.reservations}</p>
                  </div>
                  <div>
                    <p style={{ color: "#a8896c", fontSize: "10px", letterSpacing: "2px", fontFamily: "Arial, sans-serif", margin: "0 0 3px" }}>AVG ORDER</p>
                    <p style={{ color: "#1c1007", fontSize: "16px", fontFamily: "Georgia, serif", margin: 0 }}>
                      £{branch.orders > 0 ? (branch.revenue / branch.orders).toFixed(2) : "0.00"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* BRANCH IMAGES */}
      <p style={{ color: "#a8896c", letterSpacing: "4px", fontSize: "11px", fontFamily: "Arial, sans-serif", marginBottom: "20px" }}>OUR LOCATIONS</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
        {branches.map((branch) => (
          <div key={branch.id} style={{ position: "relative", height: "180px", borderRadius: "4px", overflow: "hidden" }}>
            <img src={getImage(branch.location)} alt={branch.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(28,16,7,0.85) 0%, rgba(0,0,0,0.1) 60%)",
              display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "20px",
            }}>
              <p style={{ color: "#D4AF37", fontSize: "20px", fontFamily: "Georgia, serif", margin: "0 0 4px" }}>£{Number(branch.revenue || 0).toFixed(2)}</p>
              <p style={{ color: "white", fontSize: "14px", fontFamily: "Arial, sans-serif", margin: 0 }}>{branch.name}</p>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}

export default RevenueAnalysis;