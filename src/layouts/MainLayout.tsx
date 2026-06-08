import type { ReactNode } from "react";
import Sidebar from "../components/Sidebar";

type Props = {
  children: ReactNode;
};

function MainLayout({ children }: Props) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#faf8f5" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "40px 50px", overflow: "auto" }}>
        {children}
      </div>
    </div>
  );
}

export default MainLayout;