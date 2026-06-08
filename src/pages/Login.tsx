import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });
      const role = response.data.user.role;

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", role);
      localStorage.setItem("branchId", String(response.data.branchId || ""));
      localStorage.setItem("branchName", response.data.branchName || "");
      localStorage.setItem("userId", String(response.data.user.id));

      if (role === "WAITER" || role === "CHEF" || role === "CASHIER") {
        navigate("/orders");
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      fontFamily: "Georgia, serif",
    }}>

      {/* LEFT SIDE — IMAGE */}
      <div style={{
        position: "relative",
        background: "#1c1007",
        overflow: "hidden",
      }}>
        <img
          src="https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80"
          alt="Steakz Restaurant"
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to right, rgba(0,0,0,0.3), rgba(28,16,7,0.8))",
          display: "flex", flexDirection: "column",
          justifyContent: "space-between", padding: "60px",
        }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <h1 style={{ color: "#D4AF37", fontSize: "36px", margin: 0, letterSpacing: "6px", fontWeight: "700" }}>STEAKZ</h1>
            <p style={{ color: "#a8896c", fontSize: "10px", margin: 0, letterSpacing: "3px", fontFamily: "Arial, sans-serif" }}>PREMIUM STEAKHOUSE</p>
          </Link>

          <div>
            <div style={{ width: "50px", height: "2px", background: "#D4AF37", marginBottom: "25px" }} />
            <h2 style={{ color: "white", fontSize: "42px", fontWeight: "400", margin: "0 0 15px", lineHeight: "1.2" }}>
              Welcome Back
            </h2>
            <p style={{ color: "#a8896c", fontSize: "15px", fontFamily: "Arial, sans-serif", lineHeight: "1.8", margin: "0 0 30px", maxWidth: "320px" }}>
              Sign in to access the Steakz Management Information System.
            </p>
            <p style={{ color: "#57534e", fontSize: "12px", fontFamily: "Arial, sans-serif", letterSpacing: "1px" }}>
              © 2025 Steakz Restaurant Group
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE — FORM */}
      <div style={{
        background: "#faf8f5",
        display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        padding: "60px",
      }}>
        <div style={{ width: "100%", maxWidth: "420px" }}>

          <p style={{ color: "#a8896c", letterSpacing: "5px", fontSize: "11px", marginBottom: "15px", fontFamily: "Arial, sans-serif" }}>
            STAFF ACCESS
          </p>
          <h2 style={{ color: "#1c1007", fontSize: "40px", fontWeight: "400", margin: "0 0 10px" }}>
            Sign In
          </h2>
          <div style={{ width: "50px", height: "2px", background: "#D4AF37", marginBottom: "40px" }} />

          {error && (
            <div style={{
              background: "#fef2f2", border: "1px solid #fecaca",
              color: "#991b1b", padding: "14px 18px",
              borderRadius: "3px", marginBottom: "25px",
              fontSize: "14px", fontFamily: "Arial, sans-serif",
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{
                display: "block", color: "#57534e",
                fontSize: "11px", letterSpacing: "2px",
                fontFamily: "Arial, sans-serif", fontWeight: "600",
                marginBottom: "8px",
              }}>
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%", padding: "14px 16px",
                  borderRadius: "3px", border: "1px solid #d6d3d1",
                  background: "white", color: "#1c1007",
                  fontSize: "15px", fontFamily: "Arial, sans-serif",
                  boxSizing: "border-box", outline: "none",
                }}
              />
            </div>

            <div style={{ marginBottom: "35px" }}>
              <label style={{
                display: "block", color: "#57534e",
                fontSize: "11px", letterSpacing: "2px",
                fontFamily: "Arial, sans-serif", fontWeight: "600",
                marginBottom: "8px",
              }}>
                PASSWORD
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%", padding: "14px 16px",
                  borderRadius: "3px", border: "1px solid #d6d3d1",
                  background: "white", color: "#1c1007",
                  fontSize: "15px", fontFamily: "Arial, sans-serif",
                  boxSizing: "border-box", outline: "none",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "16px",
                background: loading ? "#a8896c" : "#7c2d12",
                color: "white", border: "none",
                borderRadius: "3px", fontSize: "12px",
                letterSpacing: "3px", fontFamily: "Arial, sans-serif",
                fontWeight: "700", cursor: loading ? "not-allowed" : "pointer",
                marginBottom: "25px",
              }}
            >
              {loading ? "SIGNING IN..." : "SIGN IN"}
            </button>

            <div style={{ textAlign: "center" }}>
              <Link to="/" style={{
                color: "#a8896c", fontSize: "12px",
                fontFamily: "Arial, sans-serif", letterSpacing: "1px",
                textDecoration: "none",
              }}>
                ← Back to Website
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;