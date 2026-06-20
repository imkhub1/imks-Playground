interface ScorePillProps {
  label: string;
  value: string;
}

export default function ScorePill({ label, value }: ScorePillProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <span
        className="mono"
        style={{
          fontSize: 9,
          fontWeight: 600,
          letterSpacing: "0.14em",
          color: "var(--text-faint)",
        }}
      >
        {label}
      </span>
      <span
        className="mono"
        style={{
          alignSelf: "flex-start",
          fontSize: 12.5,
          fontWeight: 700,
          color: "var(--accent)",
          background: "var(--accent-soft)",
          borderRadius: 6,
          padding: "3px 9px",
        }}
      >
        {value}
      </span>
    </div>
  );
}
