import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/PageHeader";
import api from "../services/api";

function BranchPerformance() {
  const [branches, setBranches] =
    useState<any[]>([]);

  useEffect(() => {
    fetchPerformance();
  }, []);

  const fetchPerformance =
    async () => {
      try {
        const response =
          await api.get(
            "/dashboard/hq"
          );

        setBranches(
          response.data
        );
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <MainLayout>
      <PageHeader
        title="Branch Performance"
        subtitle="Headquarters Overview of All Branches"
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill,minmax(350px,1fr))",
          gap: "20px",
        }}
      >
        {branches.map(
          (branch) => (
            <div
              key={branch.id}
              style={{
                background:
                  "#1f2937",
                padding: "20px",
                borderRadius:
                  "15px",
                border:
                  "1px solid #374151",
                color:
                  "white",
              }}
            >
              <h2>
                🏢{" "}
                {
                  branch.name
                }
              </h2>

              <p>
                📍{" "}
                {
                  branch.location
                }
              </p>

              <hr
                style={{
                  margin:
                    "15px 0",
                }}
              />

              <p>
                💰 Revenue:
                £
                {Number(
                  branch.revenue ||
                    0
                ).toFixed(
                  2
                )}
              </p>

              <p>
                📦 Orders:
                {" "}
                {
                  branch.orders
                }
              </p>

              <p>
                📅 Reservations:
                {" "}
                {
                  branch.reservations
                }
              </p>
            </div>
          )
        )}
      </div>
    </MainLayout>
  );
}

export default BranchPerformance;