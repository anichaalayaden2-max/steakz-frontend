import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import api from "../services/api";

function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const role = localStorage.getItem("role");
  const branchName = localStorage.getItem("branchName");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const endpoint = role === "HQ_MANAGER" ? "/dashboard" : "/dashboard/branch";
      const response = await api.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!stats) {
    return (
      <MainLayout>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "50vh" }}>
          <p style={{ color: "#a8896c", fontFamily: "Arial, sans-serif", letterSpacing: "3px", fontSize: "13px" }}>LOADING...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>

      {/* HEADER */}
      <div style={{ marginBottom: "40px" }}>
        <p style={{ color: "#a8896c", letterSpacing: "4px", fontSize: "11px", fontFamily: "Arial, sans-serif", margin: "0 0 10px" }}>
          {role === "HQ_MANAGER" ? "HEADQUARTERS" : branchName?.toUpperCase()}
        </p>
        <h1 style={{ color: "#1c1007", fontSize: "42px", fontWeight: "400", margin: "0 0 8px", fontFamily: "Georgia, serif" }}>
          {role === "HQ_MANAGER" ? "Overview" : "Dashboard"}
        </h1>
        <div style={{ width: "50px", height: "2px", background: "#D4AF37" }} />
      </div>

      {/* MAIN STATS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "40px" }}>

        <StatCard
          label="TOTAL REVENUE"
          value={`£${Number(stats.totalRevenue || 0).toFixed(2)}`}
          color="#D4AF37"
          icon="💰"
        />
        <StatCard
          label="TOTAL ORDERS"
          value={stats.totalOrders || 0}
          color="#7c2d12"
          icon="📦"
        />

        {role === "HQ_MANAGER" ? (
          <>
            <StatCard label="CUSTOMERS" value={stats.totalCustomers || 0} color="#1c1007" icon="👥" />
            <StatCard label="BRANCHES" value={stats.totalBranches || 0} color="#a8896c" icon="🏢" />
          </>
        ) : (
          <>
            <StatCard label="TABLES" value={stats.totalTables || 0} color="#1c1007" icon="🪑" />
            <StatCard label="RESERVATIONS" value={stats.reservations || 0} color="#a8896c" icon="📅" />
          </>
        )}
      </div>

      {/* SECTION TITLE */}
      <div style={{ marginBottom: "25px" }}>
        <p style={{ color: "#a8896c", letterSpacing: "4px", fontSize: "11px", fontFamily: "Arial, sans-serif", margin: "0 0 8px" }}>
          QUICK OVERVIEW
        </p>
        <div style={{ width: "30px", height: "1px", background: "#D4AF37" }} />
      </div>

      {/* SECONDARY STATS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px", marginBottom: "40px" }}>
        <MiniCard label="Paid Payments" value={stats.paidPayments || 0} />
        <MiniCard label="Pending Orders" value={stats.pendingOrders || 0} />
        <MiniCard label="Today's Reservations" value={stats.todayReservations || 0} />
      </div>

      {/* SUMMARY BOX */}
      <div style={{
        background: "#1c1007", borderRadius: "4px",
        padding: "35px 40px", border: "1px solid rgba(212,175,55,0.2)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "25px" }}>
          <div style={{ width: "3px", height: "24px", background: "#D4AF37" }} />
          <h2 style={{ color: "white", fontSize: "20px", fontWeight: "400", margin: 0, fontFamily: "Georgia, serif" }}>
            {role === "HQ_MANAGER" ? "Headquarters Summary" : `${branchName} Summary`}
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "20px" }}>
          {role === "HQ_MANAGER" ? (
            <>
              <SummaryItem label="Total Branches" value={stats.totalBranches} />
              <SummaryItem label="Total Customers" value={stats.totalCustomers} />
              <SummaryItem label="Total Orders" value={stats.totalOrders} />
              <SummaryItem label="Total Revenue" value={`£${Number(stats.totalRevenue || 0).toFixed(2)}`} highlight />
            </>
          ) : (
            <>
              <SummaryItem label="Revenue" value={`£${Number(stats.totalRevenue || 0).toFixed(2)}`} highlight />
              <SummaryItem label="Orders" value={stats.totalOrders} />
              <SummaryItem label="Tables" value={stats.totalTables} />
              <SummaryItem label="Reservations" value={stats.reservations} />
              <SummaryItem label="Paid Payments" value={stats.paidPayments} />
            </>
          )}
        </div>
      </div>

    </MainLayout>
  );
}

function StatCard({ label, value, color, icon }: { label: string; value: any; color: string; icon: string }) {
  return (
    <div style={{
      background: "white", borderRadius: "4px",
      padding: "25px 30px", border: "1px solid #e8e0d0",
      borderTop: `3px solid ${color}`,
    }}>
      <p style={{ color: "#a8896c", fontSize: "11px", letterSpacing: "2px", fontFamily: "Arial, sans-serif", margin: "0 0 12px" }}>
        {label}
      </p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ color: "#1c1007", fontSize: "32px", fontWeight: "300", margin: 0, fontFamily: "Georgia, serif" }}>
          {value}
        </p>
        <span style={{ fontSize: "28px" }}>{icon}</span>
      </div>
    </div>
  );
}

function MiniCard({ label, value }: { label: string; value: any }) {
  return (
    <div style={{
      background: "white", borderRadius: "4px",
      padding: "20px 25px", border: "1px solid #e8e0d0",
      display: "flex", justifyContent: "space-between", alignItems: "center",
    }}>
      <p style={{ color: "#78716c", fontSize: "13px", fontFamily: "Arial, sans-serif", margin: 0 }}>{label}</p>
      <p style={{ color: "#1c1007", fontSize: "22px", fontWeight: "400", margin: 0, fontFamily: "Georgia, serif" }}>{value}</p>
    </div>
  );
}

function SummaryItem({ label, value, highlight }: { label: string; value: any; highlight?: boolean }) {
  return (
    <div style={{ borderBottom: "1px solid rgba(212,175,55,0.15)", paddingBottom: "15px" }}>
      <p style={{ color: "#78716c", fontSize: "11px", letterSpacing: "2px", fontFamily: "Arial, sans-serif", margin: "0 0 6px" }}>
        {label.toUpperCase()}
      </p>
      <p style={{ color: highlight ? "#D4AF37" : "white", fontSize: "20px", fontWeight: "400", margin: 0, fontFamily: "Georgia, serif" }}>
        {value}
      </p>
    </div>
  );
}

export default Dashboard;