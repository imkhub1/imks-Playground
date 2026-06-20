"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppState } from "./AppStateProvider";
import Ico from "./Ico";
import Logo from "./Logo";
import Btn from "./Btn";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: "home", matchPaths: ["/"] },
  { href: "/library", label: "Library", icon: "grid", matchPaths: ["/library", "/game"] },
  { href: "/hall-of-fame", label: "Hall of Fame", icon: "trophy", matchPaths: ["/hall-of-fame"] },
  { href: "/about", label: "About", icon: "info", matchPaths: ["/about"] },
];

function isLinkActive(pathname: string, matchPaths: string[]): boolean {
  return matchPaths.some((p) =>
    p === "/" ? pathname === "/" : pathname === p || pathname.startsWith(p + "/")
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, user, toggleTheme, signOut } = useAppState();
  const [open, setOpen] = useState(false);

  function handleSignOut() {
    signOut();
    router.push("/library");
  }

  const themeBtn = (
    <button
      onClick={toggleTheme}
      title="Toggle theme"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 38,
        height: 38,
        borderRadius: 8,
        cursor: "pointer",
        background: "var(--surface-1)",
        border: "1px solid var(--border)",
        color: "var(--text-muted)",
      }}
    >
      <Ico name={theme === "dark" ? "sun" : "moon"} size={17} />
    </button>
  );

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "var(--nav-bg)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <nav
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          gap: 18,
        }}
      >
        <Logo size={17} />
        <div className="nav-links" style={{ display: "flex", gap: 26, marginLeft: 26 }}>
          {NAV_LINKS.map((l) => {
            const active = isLinkActive(pathname, l.matchPaths);
            return (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  fontFamily: "var(--font-ui)",
                  fontWeight: 500,
                  fontSize: 14,
                  color: active ? "var(--accent)" : "var(--text-muted)",
                  padding: "6px 2px",
                  borderBottom: active
                    ? "2px solid var(--accent)"
                    : "2px solid transparent",
                  transition: "color 0.18s",
                  textDecoration: "none",
                }}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        <div style={{ flex: 1 }} />

        <div
          className="nav-right"
          style={{ display: "flex", alignItems: "center", gap: 12 }}
        >
          {themeBtn}
          {user ? (
            <button
              onClick={handleSignOut}
              title="Sign out"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                background: "var(--surface-1)",
                border: "1px solid var(--border)",
                borderRadius: 99,
                padding: "5px 14px 5px 5px",
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "var(--accent)",
                  color: "var(--accent-ink)",
                  display: "grid",
                  placeItems: "center",
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  fontSize: 12,
                }}
              >
                {user.name.slice(0, 2).toUpperCase()}
              </span>
              <span
                className="mono"
                style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text)" }}
              >
                {user.name}
              </span>
            </button>
          ) : (
            <Btn variant="line" size="sm" onClick={() => router.push("/auth")}>
              SIGN IN
            </Btn>
          )}
        </div>

        <button
          className="nav-burger"
          onClick={() => setOpen(true)}
          style={{
            display: "none",
            background: "var(--surface-1)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            width: 38,
            height: 38,
            color: "var(--text)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ico name="menu" size={18} />
        </button>
      </nav>

      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "var(--bg)",
            animation: "viewIn 0.25s ease both",
          }}
        >
          <div
            style={{
              padding: "16px 24px",
              display: "flex",
              alignItems: "center",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <Logo size={17} onClick={() => setOpen(false)} />
            <div style={{ flex: 1 }} />
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "var(--surface-1)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                width: 38,
                height: 38,
                color: "var(--text)",
                display: "grid",
                placeItems: "center",
                cursor: "pointer",
              }}
            >
              <Ico name="close" size={18} />
            </button>
          </div>

          <div
            style={{
              padding: "28px 24px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="mono"
                style={{
                  textAlign: "left",
                  color: "var(--text)",
                  fontSize: 22,
                  fontWeight: 700,
                  padding: "14px 0",
                  letterSpacing: "0.02em",
                  textDecoration: "none",
                  display: "block",
                }}
              >
                {l.label}
              </Link>
            ))}
            <div style={{ marginTop: 16 }}>
              {user ? (
                <Btn
                  variant="ghost"
                  full
                  onClick={() => { handleSignOut(); setOpen(false); }}
                >
                  SIGN OUT — {user.name}
                </Btn>
              ) : (
                <Btn
                  variant="solid"
                  full
                  onClick={() => { router.push("/auth"); setOpen(false); }}
                >
                  SIGN IN
                </Btn>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
