export default function UnderMaintenance() {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          backgroundColor: "#f9f9f9",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "3rem", marginBottom: "1rem", color: "#333" }}>
          🚧 Website Under Maintenance 🚧
        </h1>
        <p style={{ fontSize: "1.2rem", color: "#555" }}>
          We’re currently working on improvements. Please check back later. Thank you for your
          patience!
        </p>
      </div>
    );
  }
  