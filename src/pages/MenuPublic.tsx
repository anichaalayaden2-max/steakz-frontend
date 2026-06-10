import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const categoryEmoji: Record<string, string> = {
  STEAK: "🥩", BURGER: "🍔", SIDE: "🥗", DRINK: "🥤", DESSERT: "🍮",
};

const itemImages: Record<string, string> = {
  // STEAKS
  "Ribeye Steak": "https://images.unsplash.com/photo-1558030006-450675393462?w=400&q=80",
  "Sirloin Steak": "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&q=80",
  "Fillet Steak": "https://images.unsplash.com/photo-1607116667981-ff148a5bfe2a?w=400&q=80",
  "T-Bone Steak": "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80",
  // BURGERS
  "Classic Burger": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
  "BBQ Burger": "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&q=80",
  // SIDES
  "Fries": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80",
  "Onion Rings": "https://images.unsplash.com/photo-1639024471283-03518883512d?w=400&q=80",
  "Salad": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80",
  // DRINKS
  "Coke": "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80",
  "Water": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80",
  "Beer": "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&q=80",
  "Wine": "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&q=80",
  // DESSERTS
  "Cheesecake": "https://images.unsplash.com/photo-1567171466295-4afa63d45416?w=400&q=80",
  "Chocolate Lava": "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&q=80",
};

const categoryImages: Record<string, string> = {
  STEAK: "https://images.unsplash.com/photo-1558030006-450675393462?w=400&q=80",
  BURGER: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80",
  SIDE: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80",
  DRINK: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80",
  DESSERT: "https://images.unsplash.com/photo-1567171466295-4afa63d45416?w=400&q=80",
};

const getImage = (item: any) =>
  item.image || itemImages[item.name] || categoryImages[item.category] || categoryImages["STEAK"];

function MenuPublic() {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("ALL");

  useEffect(() => { fetchMenu(); }, []);

  const fetchMenu = async () => {
    try {
      const response = await api.get("/menu-items", { params: { branchId: 1 } });
      setMenuItems(response.data);
    } catch (error) { console.error(error); }
  };

  const categories = ["ALL", "STEAK", "BURGER", "SIDE", "DRINK", "DESSERT"];
  const filtered = activeCategory === "ALL" ? menuItems : menuItems.filter((item) => item.category === activeCategory);

  return (
    <div style={{ minHeight: "100vh", background: "#faf8f5", fontFamily: "Georgia, serif" }}>

      {/* NAVBAR */}
      <nav style={{
        background: "rgba(255,255,255,0.97)", height: "80px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0 80px", borderBottom: "1px solid #e8e0d0",
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
      }}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <h1 style={{ color: "#7c2d12", fontSize: "28px", margin: 0, letterSpacing: "4px", fontWeight: "700" }}>STEAKZ</h1>
          <p style={{ color: "#a8896c", fontSize: "9px", margin: 0, letterSpacing: "3px", fontFamily: "Arial, sans-serif" }}>PREMIUM STEAKHOUSE</p>
        </Link>
        <div style={{ display: "flex", gap: "30px", alignItems: "center" }}>
          <Link to="/" style={{ textDecoration: "none", color: "#44403c", fontSize: "12px", letterSpacing: "2px", fontFamily: "Arial, sans-serif", fontWeight: "600" }}>HOME</Link>
          <Link to="/#locations" style={{ textDecoration: "none", color: "#44403c", fontSize: "12px", letterSpacing: "2px", fontFamily: "Arial, sans-serif", fontWeight: "600" }}>LOCATIONS</Link>
          <Link to="/#reservation" style={{ textDecoration: "none", color: "#44403c", fontSize: "12px", letterSpacing: "2px", fontFamily: "Arial, sans-serif", fontWeight: "600" }}>RESERVATION</Link>
          <Link to="/login" style={{ background: "#7c2d12", color: "white", padding: "10px 24px", borderRadius: "3px", textDecoration: "none", fontSize: "11px", letterSpacing: "2px", fontFamily: "Arial, sans-serif", fontWeight: "600" }}>
            STAFF LOGIN
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ background: "#1c1007", padding: "80px 80px 60px", textAlign: "center", borderBottom: "3px solid #D4AF37" }}>
        <p style={{ color: "#D4AF37", letterSpacing: "6px", fontSize: "11px", marginBottom: "15px", fontFamily: "Arial, sans-serif" }}>STEAKZ RESTAURANT</p>
        <h1 style={{ color: "white", fontSize: "64px", fontWeight: "400", margin: "0 0 20px" }}>Our Menu</h1>
        <div style={{ width: "60px", height: "2px", background: "#D4AF37", margin: "0 auto 25px" }} />
        <p style={{ color: "#a8896c", fontSize: "16px", fontFamily: "Arial, sans-serif", margin: 0 }}>
          Discover our premium steakhouse selection, crafted with the finest ingredients
        </p>
      </div>

      {/* CATEGORY FILTER */}
      <div style={{
        background: "white", padding: "25px 80px",
        display: "flex", gap: "15px", justifyContent: "center",
        borderBottom: "1px solid #e8e0d0", flexWrap: "wrap",
        position: "sticky", top: "80px", zIndex: 99,
        boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
      }}>
        {categories.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{
            background: activeCategory === cat ? "#7c2d12" : "transparent",
            color: activeCategory === cat ? "white" : "#44403c",
            border: activeCategory === cat ? "1px solid #7c2d12" : "1px solid #d6d3d1",
            padding: "10px 24px", borderRadius: "3px", cursor: "pointer",
            fontSize: "11px", letterSpacing: "2px", fontFamily: "Arial, sans-serif", fontWeight: "600",
          }}>
            {cat === "ALL" ? "ALL ITEMS" : `${categoryEmoji[cat]} ${cat}`}
          </button>
        ))}
      </div>

      {/* MENU GRID */}
      <div style={{ padding: "60px 80px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px", color: "#a8896c", fontFamily: "Arial, sans-serif" }}>
            <p style={{ fontSize: "48px", marginBottom: "20px" }}>🍽️</p>
            <p style={{ fontSize: "18px" }}>No items in this category yet.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "30px" }}>
            {filtered.map((item) => (
              <div key={item.id} style={{
                background: "white", borderRadius: "4px",
                overflow: "hidden", border: "1px solid #e8e0d0",
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              }}>
                <div style={{ position: "relative", height: "220px", overflow: "hidden" }}>
                  <img
                    src={getImage(item)}
                    alt={item.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = categoryImages[item.category] || categoryImages["STEAK"];
                    }}
                  />
                  <div style={{
                    position: "absolute", top: "15px", right: "15px",
                    background: "#1c1007", color: "#D4AF37",
                    padding: "6px 14px", borderRadius: "2px",
                    fontSize: "11px", letterSpacing: "2px", fontFamily: "Arial, sans-serif", fontWeight: "700",
                  }}>
                    {categoryEmoji[item.category]} {item.category}
                  </div>
                </div>

                <div style={{ padding: "25px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <h2 style={{ color: "#1c1007", fontSize: "20px", margin: 0, fontWeight: "400" }}>{item.name}</h2>
                    <span style={{ color: "#D4AF37", fontWeight: "700", fontSize: "20px", fontFamily: "Arial, sans-serif", whiteSpace: "nowrap", marginLeft: "15px" }}>
                      £{Number(item.price).toFixed(2)}
                    </span>
                  </div>
                  <p style={{ color: "#78716c", fontSize: "14px", lineHeight: "1.7", fontFamily: "Arial, sans-serif", margin: 0 }}>
                    {item.description}
                  </p>
                </div>

                <div style={{ borderTop: "1px solid #f0ece6", padding: "15px 25px", background: "#faf8f5" }}>
                  <Link to="/#reservation" style={{
                    color: "#7c2d12", textDecoration: "none",
                    fontSize: "11px", letterSpacing: "2px",
                    fontFamily: "Arial, sans-serif", fontWeight: "700",
                  }}>
                    RESERVE A TABLE →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <section style={{ background: "#1c1007", padding: "80px", textAlign: "center", borderTop: "3px solid #D4AF37" }}>
        <p style={{ color: "#D4AF37", letterSpacing: "6px", fontSize: "11px", marginBottom: "15px", fontFamily: "Arial, sans-serif" }}>READY TO DINE?</p>
        <h2 style={{ color: "white", fontSize: "42px", fontWeight: "400", margin: "0 0 20px" }}>Reserve Your Table Today</h2>
        <div style={{ width: "60px", height: "2px", background: "#D4AF37", margin: "0 auto 30px" }} />
        <Link to="/#reservation" style={{
          background: "#D4AF37", color: "#1c1007", padding: "16px 48px",
          borderRadius: "3px", textDecoration: "none", fontWeight: "700",
          fontSize: "12px", letterSpacing: "2px", fontFamily: "Arial, sans-serif",
        }}>
          MAKE A RESERVATION
        </Link>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#0d0602", padding: "30px 80px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ color: "#57534e", fontSize: "13px", margin: 0, fontFamily: "Arial, sans-serif" }}>© 2025 Steakz Restaurant Group</p>
        <Link to="/login" style={{ color: "#a8896c", fontSize: "11px", textDecoration: "none", fontFamily: "Arial, sans-serif", letterSpacing: "2px" }}>STAFF LOGIN</Link>
      </footer>
    </div>
  );
}

export default MenuPublic;