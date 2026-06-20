"use client";

import Link from "next/link";

interface LogoProps {
  size?: number;
  onClick?: () => void;
}

export default function Logo({ size = 18, onClick }: LogoProps) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className="mono"
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        gap: 1,
        fontFamily: "var(--font-mono)",
        fontWeight: 700,
        fontSize: size,
        letterSpacing: "0.04em",
        color: "var(--text)",
        textDecoration: "none",
      }}
    >
      <span style={{ color: "var(--accent)" }}>imk&rsquo;s</span>
      <span>&nbsp;Playground</span>
    </Link>
  );
}
