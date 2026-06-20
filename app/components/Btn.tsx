"use client";

import { useState, type ReactNode } from "react";
import Ico from "./Ico";

type BtnVariant = "solid" | "line" | "ghost" | "surface";
type BtnSize = "sm" | "md" | "lg";

interface BtnProps {
  children: ReactNode;
  variant?: BtnVariant;
  size?: BtnSize;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  full?: boolean;
  style?: React.CSSProperties;
  leftIcon?: string;
}

export default function Btn({
  children,
  variant = "line",
  size = "md",
  onClick,
  type,
  disabled,
  full,
  style,
  leftIcon,
}: BtnProps) {
  const [press, setPress] = useState(false);
  const [hover, setHover] = useState(false);

  const sizes = {
    sm: { padding: "7px 14px", fontSize: 12 },
    md: { padding: "11px 20px", fontSize: 13 },
    lg: { padding: "15px 28px", fontSize: 15 },
  };

  const base: React.CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontWeight: 700,
    letterSpacing: "0.08em",
    borderRadius: "var(--radius-btn)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    width: full ? "100%" : "auto",
    transition:
      "transform 0.12s cubic-bezier(.34,1.56,.64,1), background 0.18s, border-color 0.18s, color 0.18s, box-shadow 0.18s",
    transform: press ? "scale(0.955)" : "scale(1)",
    opacity: disabled ? 0.45 : 1,
    pointerEvents: disabled ? "none" : "auto",
    cursor: "pointer",
    whiteSpace: "nowrap",
    ...sizes[size],
  };

  const variants: Record<BtnVariant, React.CSSProperties> = {
    solid: {
      background: "var(--accent)",
      color: "var(--accent-ink)",
      border: "1px solid var(--accent)",
    },
    line: {
      background: "transparent",
      color: "var(--text)",
      border: "1px solid var(--accent-line)",
    },
    ghost: {
      background: "transparent",
      color: "var(--text-muted)",
      border: "1px solid var(--border-2)",
    },
    surface: {
      background: "var(--surface-2)",
      color: "var(--text)",
      border: "1px solid var(--border)",
    },
  };

  const hoverStyle: React.CSSProperties =
    hover && !disabled
      ? variant === "solid"
        ? { boxShadow: "0 8px 24px -8px var(--accent-glow)", filter: "brightness(1.04)" }
        : variant === "line"
        ? { background: "var(--accent)", color: "var(--accent-ink)", border: "1px solid var(--accent)" }
        : variant === "ghost"
        ? { color: "var(--text)", border: "1px solid var(--text-faint)" }
        : { border: "1px solid var(--accent-line)" }
      : {};

  return (
    <button
      type={type ?? "button"}
      onClick={onClick}
      disabled={disabled}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPress(false); }}
      style={{ ...base, ...variants[variant], ...hoverStyle, ...style }}
    >
      {leftIcon && <Ico name={leftIcon} size={size === "lg" ? 18 : 15} />}
      {children}
    </button>
  );
}
