import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import PageHeader from "../components/PageHeader";
import api from "../services/api";

function Branches() {
  const [branches, setBranches] =
    useState<any[]>([]);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [name, setName] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [phone, setPhone] =
    useState("");

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const response =
        await api.get("/branches");

      setBranches(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const createBranch = async () => {
    try {
      await api.post("/branches", {
        name,
        location,
        phone,
      });

      clearForm();

      fetchBranches();
    } catch (error) {
      console.error(error);
    }
  };

  const updateBranch = async () => {
    try {
      await api.put(
        `/branches/${editingId}`,
        {
          name,
          location,
          phone,
        }
      );

      clearForm();

      fetchBranches();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteBranch = async (
    id: number
  ) => {
    try {
      await api.delete(
        `/branches/${id}`
      );

      fetchBranches();
    } catch (error) {
      console.error(error);
    }
  };

  const startEdit = (
    branch: any
  ) => {
    setEditingId(branch.id);

    setName(branch.name);

    setLocation(
      branch.location
    );

    setPhone(branch.phone);
  };

  const clearForm = () => {
    setEditingId(null);

    setName("");

    setLocation("");

    setPhone("");
  };

  return (
    <MainLayout>
      <PageHeader
        title="Branches"
        subtitle="Manage restaurant branches"
      />

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <input
          placeholder="Branch Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <input
          placeholder="Location"
          value={location}
          onChange={(e) =>
            setLocation(
              e.target.value
            )
          }
        />

        <input
          placeholder="Phone"
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value)
          }
        />

        {editingId ? (
          <button
            onClick={
              updateBranch
            }
          >
            Save
          </button>
        ) : (
          <button
            onClick={
              createBranch
            }
          >
            Add Branch
          </button>
        )}
      </div>

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
              border:
                "1px solid #374151",
            }}
          >
            <h2>{branch.name}</h2>

            <p>
              📍 {branch.location}
            </p>

            <p>
              📞 {branch.phone}
            </p>

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "15px",
              }}
            >
              <button
                onClick={() =>
                  startEdit(
                    branch
                  )
                }
              >
                Edit
              </button>

              <button
                onClick={() =>
                  deleteBranch(
                    branch.id
                  )
                }
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}

export default Branches;