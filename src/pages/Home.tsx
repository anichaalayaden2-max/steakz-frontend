import { Link } from "react-router-dom";
import hero from "../assets/hero.jpg";
import branch1 from "../assets/branch1.jpg";
import branch2 from "../assets/branch2.jpg";
import branch3 from "../assets/branch3.jpg";
import ReservationSection from "../components/ReservationSection";

function Home() {
  return (
    <div style={{ minHeight: "100vh", background: "#faf8f5", fontFamily: "'Georgia', serif" }}>

      {/* NAVBAR */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        height: "80px",
        background: "rgba(255,255,255,0.97)",
        backdropFilter: "blur(10px)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0 80px",
        borderBottom: "1px solid #e8e0d0",
        boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
      }}>
        <div>
          <h1 style={{ color: "#7c2d12", fontSize: "32px", margin: 0, letterSpacing: "4px", fontWeight: "700" }}>STEAKZ</h1>
          <p style={{ color: "#a8896c", fontSize: "9px", margin: 0, letterSpacing: "3px", fontFamily: "Arial, sans-serif" }}>PREMIUM STEAKHOUSE</p>
        </div>

        <div style={{ display: "flex", gap: "40px", alignItems: "center" }}>
          {[
            { label: "HOME", href: "#" },
            { label: "MENU", href: "/menu" },
            { label: "LOCATIONS", href: "#locations" },
            { label: "RESERVATION", href: "#reservation" },
          ].map((item) => (
            <a key={item.label} href={item.href}
              style={{ textDecoration: "none", color: "#44403c", fontSize: "12px", letterSpacing: "2px", fontFamily: "Arial, sans-serif", fontWeight: "600" }}>
              {item.label}
            </a>
          ))}
          <Link to="/login" style={{
            background: "#7c2d12", color: "white", padding: "10px 24px",
            borderRadius: "3px", textDecoration: "none",
            fontSize: "11px", letterSpacing: "2px", fontFamily: "Arial, sans-serif", fontWeight: "600",
          }}>
            STAFF LOGIN
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position: "relative", height: "100vh", marginTop: 0 }}>
        <img src={hero} alt="Steakz Restaurant" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to right, rgba(0,0,0,0.75) 45%, rgba(0,0,0,0.15) 100%)",
          display: "flex", flexDirection: "column", justifyContent: "center",
          paddingLeft: "100px", paddingTop: "80px",
        }}>
          <p style={{ color: "#D4AF37", letterSpacing: "6px", fontSize: "12px", marginBottom: "25px", fontFamily: "Arial, sans-serif", fontWeight: "400" }}>
            EST. 2004 · UNITED KINGDOM
          </p>
          <h1 style={{ color: "white", fontSize: "78px", maxWidth: "650px", margin: "0 0 25px", lineHeight: "1.05", fontWeight: "400" }}>
            Artistry in Every Cut
          </h1>
          <div style={{ width: "70px", height: "2px", background: "#D4AF37", marginBottom: "30px" }} />
          <p style={{ color: "#e5e7eb", maxWidth: "480px", fontSize: "18px", lineHeight: "1.9", fontFamily: "Arial, sans-serif", fontWeight: "300", marginBottom: "45px" }}>
            World's finest wagyu and dry-aged selections, crafted by master artisans across the UK.
          </p>
          <div style={{ display: "flex", gap: "20px" }}>
            <Link to="/menu" style={{
              background: "#D4AF37", color: "#1c0a00", padding: "16px 40px",
              borderRadius: "3px", textDecoration: "none", fontWeight: "700",
              fontSize: "12px", letterSpacing: "2px", fontFamily: "Arial, sans-serif",
            }}>
              VIEW MENU
            </Link>
            <a href="#reservation" style={{
              background: "transparent", color: "white", padding: "16px 40px",
              borderRadius: "3px", textDecoration: "none",
              fontSize: "12px", letterSpacing: "2px", fontFamily: "Arial, sans-serif", fontWeight: "600",
              border: "1px solid rgba(255,255,255,0.6)",
            }}>
              RESERVE A TABLE
            </a>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section style={{
        background: "#1c1007", padding: "50px 100px",
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
        gap: "20px", borderTop: "3px solid #D4AF37",
      }}>
        {[
          { number: "20+", label: "Years of Excellence" },
          { number: "3", label: "UK Locations" },
          { number: "50+", label: "Premium Cuts" },
          { number: "10K+", label: "Happy Guests" },
        ].map((stat) => (
          <div key={stat.label} style={{ textAlign: "center" }}>
            <p style={{ color: "#D4AF37", fontSize: "42px", margin: "0 0 8px", fontWeight: "300" }}>{stat.number}</p>
            <p style={{ color: "#a8896c", fontSize: "11px", letterSpacing: "2px", margin: 0, fontFamily: "Arial, sans-serif" }}>{stat.label.toUpperCase()}</p>
          </div>
        ))}
      </section>

      {/* SIGNATURE SECTION */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "600px" }}>
        <div style={{ background: "#faf8f5", display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px 80px" }}>
          <p style={{ color: "#a8896c", letterSpacing: "5px", fontSize: "11px", marginBottom: "20px", fontFamily: "Arial, sans-serif" }}>THE STEAKZ EXPERIENCE</p>
          <h2 style={{ color: "#1c1007", fontSize: "48px", fontWeight: "400", margin: "0 0 25px", lineHeight: "1.2" }}>
            More Than Just a Meal
          </h2>
          <div style={{ width: "50px", height: "2px", background: "#D4AF37", marginBottom: "30px" }} />
          <p style={{ color: "#57534e", fontSize: "16px", lineHeight: "1.9", fontFamily: "Arial, sans-serif", marginBottom: "20px" }}>
            At Steakz, we believe every cut tells a story. From our hand-selected wagyu to our 28-day aged ribeyes, each dish is a celebration of quality and craftsmanship.
          </p>
          <p style={{ color: "#57534e", fontSize: "16px", lineHeight: "1.9", fontFamily: "Arial, sans-serif", marginBottom: "40px" }}>
            Our master chefs bring decades of experience to every plate, ensuring an unforgettable dining experience at all three of our UK locations.
          </p>
          <Link to="/menu" style={{
            color: "#7c2d12", textDecoration: "none", fontSize: "12px",
            letterSpacing: "3px", fontFamily: "Arial, sans-serif", fontWeight: "700",
            borderBottom: "2px solid #7c2d12", paddingBottom: "4px", width: "fit-content",
          }}>
            EXPLORE OUR MENU →
          </Link>
        </div>
        <div style={{ overflow: "hidden" }}>
          <img src={branch1} alt="Steakz Experience" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      </section>

      {/* LOCATIONS */}
      <section id="locations" style={{ background: "#1c1007", padding: "100px" }}>
        <div style={{ textAlign: "center", marginBottom: "70px" }}>
          <p style={{ color: "#D4AF37", letterSpacing: "6px", fontSize: "11px", marginBottom: "15px", fontFamily: "Arial, sans-serif" }}>WHERE TO FIND US</p>
          <h2 style={{ color: "white", fontSize: "48px", fontWeight: "400", margin: 0 }}>Our UK Locations</h2>
          <div style={{ width: "60px", height: "2px", background: "#D4AF37", margin: "25px auto 0" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "3px" }}>
          {[
            { img: branch1, city: "London", address: "12 Mayfair Street, W1K 2PQ", hours: "Mon–Sun: 12:00–23:00" },
            { img: branch2, city: "Manchester", address: "45 Deansgate, M3 2EQ", hours: "Mon–Sun: 12:00–23:00" },
            { img: branch3, city: "Liverpool", address: "8 Albert Dock, L3 4AF", hours: "Mon–Sun: 12:00–22:00" },
          ].map((loc) => (
            <div key={loc.city} style={{ position: "relative", overflow: "hidden", height: "450px", cursor: "pointer" }}>
              <img src={loc.img} alt={loc.city} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.1) 60%)",
                display: "flex", flexDirection: "column", justifyContent: "flex-end",
                padding: "35px",
              }}>
                <p style={{ color: "#D4AF37", fontSize: "11px", letterSpacing: "4px", margin: "0 0 10px", fontFamily: "Arial, sans-serif" }}>STEAKZ</p>
                <h3 style={{ color: "white", fontSize: "30px", margin: "0 0 10px", fontWeight: "400", letterSpacing: "2px" }}>{loc.city}</h3>
                <p style={{ color: "#d1d5db", fontSize: "13px", margin: "0 0 5px", fontFamily: "Arial, sans-serif" }}>{loc.address}</p>
                <p style={{ color: "#a8896c", fontSize: "12px", margin: 0, fontFamily: "Arial, sans-serif" }}>{loc.hours}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RESERVATION */}
      <section id="reservation" style={{ background: "#faf8f5", padding: "100px" }}>
        <div style={{ textAlign: "center", marginBottom: "70px" }}>
          <p style={{ color: "#a8896c", letterSpacing: "6px", fontSize: "11px", marginBottom: "15px", fontFamily: "Arial, sans-serif" }}>BOOK YOUR EXPERIENCE</p>
          <h2 style={{ color: "#1c1007", fontSize: "48px", fontWeight: "400", margin: 0 }}>Reserve a Table</h2>
          <div style={{ width: "60px", height: "2px", background: "#D4AF37", margin: "25px auto 0" }} />
        </div>
        <ReservationSection />
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#0d0602", borderTop: "3px solid #D4AF37", padding: "70px 100px 40px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "60px", marginBottom: "50px" }}>
          <div>
            <h2 style={{ color: "#D4AF37", fontSize: "28px", fontWeight: "700", letterSpacing: "4px", marginBottom: "20px" }}>STEAKZ</h2>
            <p style={{ color: "#78716c", fontSize: "14px", lineHeight: "1.9", fontFamily: "Arial, sans-serif", maxWidth: "320px" }}>
              Premium steakhouse experiences across London, Manchester and Liverpool since 2004. Celebrating the art of the perfect cut.
            </p>
          </div>
          <div>
            <h4 style={{ color: "#D4AF37", fontSize: "11px", letterSpacing: "3px", marginBottom: "25px", fontFamily: "Arial, sans-serif" }}>NAVIGATE</h4>
            {["Home", "Menu", "Locations", "Reservation"].map((link) => (
              <p key={link} style={{ margin: "0 0 12px" }}>
                <a href="#" style={{ color: "#78716c", textDecoration: "none", fontSize: "14px", fontFamily: "Arial, sans-serif" }}>{link}</a>
              </p>
            ))}
          </div>
          <div>
            <h4 style={{ color: "#D4AF37", fontSize: "11px", letterSpacing: "3px", marginBottom: "25px", fontFamily: "Arial, sans-serif" }}>OPENING HOURS</h4>
            <p style={{ color: "#78716c", fontSize: "14px", fontFamily: "Arial, sans-serif", lineHeight: "2.2", margin: 0 }}>
              Mon – Thu: 12:00 – 22:00<br />
              Fri – Sat: 12:00 – 23:00<br />
              Sunday: 12:00 – 21:00
            </p>
          </div>
        </div>
        <div style={{ borderTop: "1px solid #2c2018", paddingTop: "30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ color: "#57534e", fontSize: "13px", margin: 0, fontFamily: "Arial, sans-serif" }}>© 2025 Steakz Restaurant Group. All rights reserved.</p>
          <Link to="/login" style={{ color: "#a8896c", fontSize: "11px", textDecoration: "none", fontFamily: "Arial, sans-serif", letterSpacing: "2px" }}>STAFF LOGIN</Link>
        </div>
      </footer>
    </div>
  );
}

export default Home;