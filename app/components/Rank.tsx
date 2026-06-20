interface RankProps {
  n: number;
}

export default function Rank({ n }: RankProps) {
  const metal =
    n === 1
      ? "var(--gold)"
      : n === 2
      ? "var(--silver)"
      : n === 3
      ? "var(--bronze)"
      : null;
  return (
    <span
      className="mono"
      style={{
        fontSize: 14,
        fontWeight: 700,
        color: metal ?? "var(--text-faint)",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {String(n).padStart(2, "0")}
    </span>
  );
}
