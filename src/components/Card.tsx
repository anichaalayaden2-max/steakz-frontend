type Props = {
  title: string;
  value: string | number;
};

function Card({
  title,
  value,
}: Props) {
  return (
    <div
      style={{
        background:
          "linear-gradient(135deg,#1f2937,#111827)",
        padding: "25px",
        borderRadius: "20px",
        border: "1px solid #374151",
        boxShadow:
          "0 10px 25px rgba(0,0,0,0.2)",
        transition: "0.3s",
      }}
    >
      <h3
        style={{
          color: "#9ca3af",
          marginBottom: "15px",
        }}
      >
        {title}
      </h3>

      <h1
        style={{
          color: "#f59e0b",
          fontSize: "42px",
          margin: 0,
        }}
      >
        {value}
      </h1>
    </div>
  );
}

export default Card;