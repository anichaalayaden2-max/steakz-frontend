import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";
import Menu from "./pages/Menu";
import MenuPublic from "./pages/MenuPublic";
import Branches from "./pages/Branches";
import BranchPerformance from "./pages/BranchPerformance";
import Reports from "./pages/Reports";
import RevenueAnalysis from "./pages/RevenueAnalysis";
import BranchRevenueDetails from "./pages/BranchRevenueDetails";
import Users from "./pages/Users";
import Tables from "./pages/Tables";
import Payments from "./pages/Payments";
import Receipts from "./pages/Receipts";
import Reservations from "./pages/Reservations";
import PublicReservations from "./pages/PublicReservations";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Públicas ── */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/menu" element={<MenuPublic />} />
        <Route path="/reservations/public" element={<PublicReservations />} />

        {/* ── Dashboard — só managers ── */}
        <Route path="/dashboard" element={
          <ProtectedRoute roles={["ADMIN", "HQ_MANAGER", "BRANCH_MANAGER"]}>
            <Dashboard />
          </ProtectedRoute>
        } />

        {/* ── HQ_MANAGER ── */}
        <Route path="/branch-performance" element={
          <ProtectedRoute roles={["ADMIN", "HQ_MANAGER"]}>
            <BranchPerformance />
          </ProtectedRoute>
        } />
        <Route path="/revenue-analysis" element={
          <ProtectedRoute roles={["ADMIN", "HQ_MANAGER"]}>
            <RevenueAnalysis />
          </ProtectedRoute>
        } />
        <Route path="/revenue-analysis/:id" element={
          <ProtectedRoute roles={["ADMIN", "HQ_MANAGER"]}>
            <BranchRevenueDetails />
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute roles={["ADMIN", "HQ_MANAGER"]}>
            <Reports />
          </ProtectedRoute>
        } />

        {/* ── ADMIN ── */}
        <Route path="/branches" element={
          <ProtectedRoute roles={["ADMIN"]}>
            <Branches />
          </ProtectedRoute>
        } />
        <Route path="/users" element={
          <ProtectedRoute roles={["ADMIN"]}>
            <Users />
          </ProtectedRoute>
        } />

        {/* ── Orders ── */}
        <Route path="/orders" element={
          <ProtectedRoute roles={["ADMIN", "BRANCH_MANAGER", "WAITER", "CHEF", "CASHIER"]}>
            <Orders />
          </ProtectedRoute>
        } />

        {/* ── Customers ── */}
        <Route path="/customers" element={
          <ProtectedRoute roles={["ADMIN", "BRANCH_MANAGER", "WAITER"]}>
            <Customers />
          </ProtectedRoute>
        } />

        {/* ── Reservations ── */}
        <Route path="/reservations" element={
          <ProtectedRoute roles={["ADMIN", "BRANCH_MANAGER", "WAITER"]}>
            <Reservations />
          </ProtectedRoute>
        } />

        {/* ── Tables ── */}
        <Route path="/tables" element={
          <ProtectedRoute roles={["ADMIN", "BRANCH_MANAGER"]}>
            <Tables />
          </ProtectedRoute>
        } />

        {/* ── Menu ── */}
        <Route path="/menu-management" element={
          <ProtectedRoute roles={["ADMIN", "BRANCH_MANAGER", "CHEF"]}>
            <Menu />
          </ProtectedRoute>
        } />

       

        {/* ── Payments ── */}
        <Route path="/payments" element={
          <ProtectedRoute roles={["ADMIN", "BRANCH_MANAGER", "CASHIER"]}>
            <Payments />
          </ProtectedRoute>
        } />

        {/* ── Receipts ── */}
        <Route path="/receipts" element={
          <ProtectedRoute roles={["ADMIN", "BRANCH_MANAGER", "CASHIER"]}>
            <Receipts />
          </ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  );
}

export default App;