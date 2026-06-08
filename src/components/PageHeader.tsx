type Props = {
  title: string;
  subtitle: string;
};

function PageHeader({
  title,
  subtitle,
}: Props) {
  return (
    <div
      style={{
        marginBottom: "35px",
      }}
    >
      <h1
        style={{
          fontSize: "48px",
          marginBottom: "10px",
          color: "#111827",
        }}
      >
        {title}
      </h1>

      <p
        style={{
          color: "#576278",
          fontSize: "18px",
        }}
      >
        {subtitle}
      </p>
    </div>
  );
}

export default PageHeader;