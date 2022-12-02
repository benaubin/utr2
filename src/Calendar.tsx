export function Calendar() {
  return (
    <div
      style={{
        height: "500px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
      }}>
      {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day) => {
        return (
          <div key={day}>
            <h2 style={{ textAlign: "center" }}>{day}</h2>
          </div>
        );
      })}
    </div>
  );
}
