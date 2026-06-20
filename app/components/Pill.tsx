"use client";

import { useState, type ReactNode } from "react";

interface PillProps {
  active?: boolean;
  children: ReactNode;
  onClick?: () => void;
}

export default function Pill({ active, children, onClick }: PillProps) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      className="mono"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 11.5,
        fontWeight: 700,
        letterSpacing: "0.1em",
        padding: "8px 16px",
        borderRadius: 99,
        cursor: "pointer",
        transition: "all 0.18s",
        background: active
          ? "var(--accent-soft)"
          : hover
          ? "var(--surface-2)"
          : "transparent",
        color: active ? "var(--accent)" : "var(--text-muted)",
        border: active
          ? "1px solid var(--accent-line)"
          : "1px solid var(--border)",
      }}
    >
      {children}
    </button>
  );
}
