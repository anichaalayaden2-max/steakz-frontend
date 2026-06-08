import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/PageHeader";
import api from "../services/api";

function BranchRevenueDetails() {
  const { id } = useParams();

  const [branch, setBranch] =
    useState<any>(null);

  useEffect(() => {
    fetchBranch();
  }, []);

  const fetchBranch = async () => {
    try {
      const response =
        await api.get("/dashboard/hq");

      const found =
        response.data.find(
          (b: any) =>
            b.id === Number(id)
        );

      setBranch(found);
    } catch (error) {
      console.error(error);
    }
  };

  if (!branch) {
    return (
      <MainLayout>
        <h2>Loading...</h2>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageHeader
        title={branch.name}
        subtitle="Branch Revenue Details"
      />

      <div
        style={{
          background: "#1f2937",
          padding: "25px",
          borderRadius: "15px",
          color: "white",
        }}
      >
        <h2>🏢 {branch.name}</h2>

        <p>
          📍 {branch.location}
        </p>

        <hr
          style={{
            margin: "20px 0",
          }}
        />

        <p>
          💰 Revenue: £
          {Number(
            branch.revenue || 0
          ).toFixed(2)}
        </p>

        <p>
          📦 Orders:
          {" "}
          {branch.orders}
        </p>

        <p>
          📅 Reservations:
          {" "}
          {branch.reservations}
        </p>
      </div>
    </MainLayout>
  );
}

export default BranchRevenueDetails;