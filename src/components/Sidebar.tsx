import { Link, useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem("role");
  const branchName = localStorage.getItem("branchName");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("branchId");
    localStorage.removeItem("branchName");
    localStorage.removeItem("userId");
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  const navLink = (to: string, label: string) => (
    <Link
      key={to}
      to={to}
      style={{
        display: "flex", alignItems: "center",
        color: isActive(to) ? "#D4AF37" : "#9ca3af",
        textDecoration: "none",
        padding: "11px 16px",
        borderRadius: "4px",
        fontSize: "12px",
        letterSpacing: "1.5px",
        fontFamily: "Arial, sans-serif",
        fontWeight: isActive(to) ? "700" : "400",
        background: isActive(to) ? "rgba(212,175,55,0.08)" : "transparent",
        borderLeft: isActive(to) ? "2px solid #D4AF37" : "2px solid transparent",
        transition: "all 0.2s",
      }}
    >
      {label}
    </Link>
  );

  const roleLabel: Record<string, string> = {
    ADMIN: "Administrator",
    HQ_MANAGER: "HQ Manager",
    BRANCH_MANAGER: "Branch Manager",
    WAITER: "Waiter",
    CHEF: "Chef",
    CASHIER: "Cashier",
  };

  return (
    <div style={{
      width: "250px",
      minHeight: "100vh",
      background: "#1c1007",
      display: "flex",
      flexDirection: "column",
      borderRight: "1px solid rgba(212,175,55,0.15)",
      flexShrink: 0,
    }}>

      {/* LOGO */}
      <div style={{ padding: "30px 25px 25px", borderBottom: "1px solid rgba(212,175,55,0.15)" }}>
        <h1 style={{ color: "#D4AF37", fontSize: "26px", margin: "0 0 3px", letterSpacing: "5px", fontFamily: "Georgia, serif", fontWeight: "700" }}>
          STEAKZ
        </h1>
        <p style={{ color: "#a8896c", fontSize: "9px", margin: 0, letterSpacing: "2px", fontFamily: "Arial, sans-serif" }}>
          MANAGEMENT SYSTEM
        </p>
      </div>

      {/* USER INFO */}
      <div style={{ padding: "20px 25px", borderBottom: "1px solid rgba(212,175,55,0.1)" }}>
        <div style={{
          width: "40px", height: "40px", borderRadius: "50%",
          background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: "10px",
          color: "#D4AF37", fontSize: "18px",
        }}>
          {role === "ADMIN" ? "👑" : role === "HQ_MANAGER" ? "📊" : role === "BRANCH_MANAGER" ? "🏢" : role === "WAITER" ? "🍽️" : role === "CHEF" ? "👨‍🍳" : "💳"}
        </div>
        <p style={{ color: "white", fontSize: "13px", margin: "0 0 3px", fontFamily: "Arial, sans-serif", fontWeight: "600" }}>
          {roleLabel[role || ""] || role}
        </p>
        {branchName && (
          <p style={{ color: "#a8896c", fontSize: "11px", margin: 0, fontFamily: "Arial, sans-serif", letterSpacing: "1px" }}>
            {branchName}
          </p>
        )}
      </div>

      {/* NAV LINKS */}
      <div style={{ flex: 1, padding: "20px 15px", display: "flex", flexDirection: "column", gap: "4px" }}>

        {role === "ADMIN" && (
          <>
            <SectionLabel label="OVERVIEW" />
            {navLink("/dashboard", "Dashboard")}
            <SectionLabel label="MANAGEMENT" />
            {navLink("/branches", "Branches")}
            {navLink("/users", "Users")}
            {navLink("/customers", "Customers")}
            <SectionLabel label="OPERATIONS" />
            {navLink("/orders", "Orders")}
            {navLink("/payments", "Payments")}
            {navLink("/receipts", "Receipts")}
            {navLink("/menu-management", "Menu")}
            {navLink("/tables", "Tables")}
            {navLink("/reservations", "Reservations")}
          </>
        )}

        {role === "HQ_MANAGER" && (
          <>
            <SectionLabel label="OVERVIEW" />
            {navLink("/dashboard", "Dashboard")}
            <SectionLabel label="ANALYTICS" />
            {navLink("/branch-performance", "Branch Performance")}
            {navLink("/revenue-analysis", "Revenue Analysis")}
            {navLink("/reports", "Reports")}
          </>
        )}

        {role === "BRANCH_MANAGER" && (
          <>
            <SectionLabel label="OVERVIEW" />
            {navLink("/dashboard", "Dashboard")}
            <SectionLabel label="OPERATIONS" />
            {navLink("/orders", "Orders")}
            {navLink("/tables", "Tables")}
            {navLink("/reservations", "Reservations")}
            {navLink("/customers", "Customers")}
          </>
        )}

        {role === "WAITER" && (
          <>
            <SectionLabel label="MY TASKS" />
            {navLink("/orders", "Orders")}
            {navLink("/customers", "Customers")}
            {navLink("/reservations", "Reservations")}
          </>
        )}

        {role === "CHEF" && (
          <>
            <SectionLabel label="KITCHEN" />
            {navLink("/orders", "Orders")}
            {navLink("/menu-management", "Menu")}
          </>
        )}

        {role === "CASHIER" && (
          <>
            <SectionLabel label="CASHIER" />
            {navLink("/orders", "Orders")}
            {navLink("/payments", "Payments")}
            {navLink("/receipts", "Receipts")}
          </>
        )}
      </div>

      {/* LOGOUT */}
      <div style={{ padding: "20px 25px", borderTop: "1px solid rgba(212,175,55,0.15)" }}>
        <button
          onClick={logout}
          style={{
            width: "100%", padding: "12px",
            background: "transparent",
            color: "#ef4444",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: "4px", cursor: "pointer",
            fontSize: "11px", letterSpacing: "2px",
            fontFamily: "Arial, sans-serif", fontWeight: "600",
          }}
        >
          LOGOUT
        </button>
      </div>
    </div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <p style={{
      color: "#57534e", fontSize: "10px", letterSpacing: "2px",
      fontFamily: "Arial, sans-serif", margin: "12px 0 4px 16px",
    }}>
      {label}
    </p>
  );
}

export default Sidebar;