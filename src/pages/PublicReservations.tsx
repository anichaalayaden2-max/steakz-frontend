import { useState } from "react";
import api from "../services/api";

function PublicReservations() {
  const [customerName, setCustomerName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [guests, setGuests] =
    useState(2);

  const [reservationDate,
    setReservationDate] =
    useState("");

  const submitReservation =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      try {
        await api.post(
          "/reservations",
          {
            customerName,
            phone,
            guests,
            reservationDate,
            branchId: 1,
          }
        );

        alert(
          "Reservation created successfully!"
        );

        setCustomerName("");
        setPhone("");
        setGuests(2);
        setReservationDate("");
      } catch (error) {
        console.error(error);

        alert(
          "Failed to create reservation"
        );
      }
    };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "80px",
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          background: "white",
          padding: "40px",
          borderRadius: "20px",
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1
          style={{
            fontSize: "52px",
            marginBottom: "10px",
            color: "#111827",
          }}
        >
          Reserve a Table
        </h1>

        <p
          style={{
            color: "#6b7280",
            marginBottom: "30px",
          }}
        >
          Book your Steakz experience.
        </p>

        <form
          onSubmit={
            submitReservation
          }
        >
          <input
            type="text"
            placeholder="Full Name"
            value={customerName}
            onChange={(e) =>
              setCustomerName(
                e.target.value
              )
            }
            required
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) =>
              setPhone(
                e.target.value
              )
            }
            required
            style={inputStyle}
          />

          <input
            type="number"
            placeholder="Guests"
            value={guests}
            onChange={(e) =>
              setGuests(
                Number(
                  e.target.value
                )
              )
            }
            required
            style={inputStyle}
          />

          <input
            type="datetime-local"
            value={reservationDate}
            onChange={(e) =>
              setReservationDate(
                e.target.value
              )
            }
            required
            style={inputStyle}
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "15px",
              border: "none",
              borderRadius: "10px",
              background:
                "#92400e",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
              marginTop: "20px",
            }}
          >
            Reserve Table
          </button>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "15px",
  marginBottom: "15px",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  fontSize: "16px",
};

export default PublicReservations;