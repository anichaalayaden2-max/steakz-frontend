import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/PageHeader";
import api from "../services/api";

function RevenueAnalysis() {
  const [branches, setBranches] =
    useState<any[]>([]);

  const navigate =
    useNavigate();

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const response =
        await api.get("/dashboard/hq");

      setBranches(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <MainLayout>
      <PageHeader
        title="Revenue Analysis"
        subtitle="Headquarters Revenue Monitoring"
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill,minmax(300px,1fr))",
          gap: "20px",
        }}
      >
        {branches.map((branch) => (
          <div
            key={branch.id}
            style={{
              background: "#1f2937",
              padding: "20px",
              borderRadius: "15px",
              color: "white",
            }}
          >
            <h2>
              🏢 {branch.name}
            </h2>

            <p>
              📍 {branch.location}
            </p>

            <button
              onClick={() =>
                navigate(
                  `/revenue-analysis/${branch.id}`
                )
              }
              style={{
                marginTop: "10px",
                padding: "10px",
                border: "none",
                borderRadius: "8px",
                background: "#f59e0b",
                color: "white",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}

export default RevenueAnalysis;