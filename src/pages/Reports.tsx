import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/PageHeader";
import api from "../services/api";

function Reports() {
  const [stats, setStats] =
    useState<any[]>([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response =
        await api.get("/dashboard/hq");

      setStats(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const totalRevenue =
    stats.reduce(
      (sum, branch) =>
        sum + (branch.revenue || 0),
      0
    );

  const totalOrders =
    stats.reduce(
      (sum, branch) =>
        sum + (branch.orders || 0),
      0
    );

  const totalReservations =
    stats.reduce(
      (sum, branch) =>
        sum +
        (branch.reservations || 0),
      0
    );

  const topBranch =
    stats.length > 0
      ? [...stats].sort(
          (a, b) =>
            b.revenue -
            a.revenue
        )[0]
      : null;

  const lowestBranch =
    stats.length > 0
      ? [...stats].sort(
          (a, b) =>
            a.revenue -
            b.revenue
        )[0]
      : null;

  return (
    <MainLayout>
      <PageHeader
        title="Reports"
        subtitle="Headquarters Reports Center"
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <div
          style={cardStyle}
        >
          <h3>
            💰 Total Revenue
          </h3>

          <h1>
            £
            {Number(
              totalRevenue
            ).toFixed(2)}
          </h1>
        </div>

        <div
          style={cardStyle}
        >
          <h3>
            📦 Total Orders
          </h3>

          <h1>
            {totalOrders}
          </h1>
        </div>

        <div
          style={cardStyle}
        >
          <h3>
            📅 Reservations
          </h3>

          <h1>
            {
              totalReservations
            }
          </h1>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(350px,1fr))",
          gap: "20px",
        }}
      >
        <div
          style={cardStyle}
        >
          <h2>
            🏆 Top Branch
          </h2>

          {topBranch && (
            <>
              <h3>
                {
                  topBranch.name
                }
              </h3>

              <p>
                Revenue: £
                {Number(
                  topBranch.revenue
                ).toFixed(
                  2
                )}
              </p>
            </>
          )}
        </div>

        <div
          style={cardStyle}
        >
          <h2>
            ⚠ Lowest Branch
          </h2>

          {lowestBranch && (
            <>
              <h3>
                {
                  lowestBranch.name
                }
              </h3>

              <p>
                Revenue: £
                {Number(
                  lowestBranch.revenue
                ).toFixed(
                  2
                )}
              </p>
            </>
          )}
        </div>
      </div>

      <div
        style={{
          marginTop: "30px",
        }}
      >
        <h2
          style={{
            marginBottom:
              "20px",
          }}
        >
          📊 Branch Revenue
          Comparison
        </h2>

        {stats.map(
          (branch) => (
            <div
              key={
                branch.id
              }
              style={{
                background:
                  "#1f2937",
                color:
                  "white",
                padding:
                  "15px",
                borderRadius:
                  "10px",
                marginBottom:
                  "10px",
              }}
            >
              <strong>
                {
                  branch.name
                }
              </strong>

              <span
                style={{
                  float:
                    "right",
                }}
              >
                £
                {Number(
                  branch.revenue ||
                    0
                ).toFixed(
                  2
                )}
              </span>
            </div>
          )
        )}
      </div>
    </MainLayout>
  );
}

const cardStyle = {
  background: "#1f2937",
  color: "white",
  padding: "25px",
  borderRadius: "15px",
};

export default Reports;