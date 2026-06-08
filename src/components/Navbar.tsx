import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav
      style={{
        height: "80px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
        background: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <h2
        style={{
          color: "#7c2d12",
          fontSize: "30px",
        }}
      >
        Steakz
      </h2>

      <div
        style={{
          display: "flex",
          gap: "30px",
        }}
      >
        <Link to="/">Home</Link>

        <Link to="/login">
          Login
        </Link>

        <Link to="/dashboard">
          Management
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;