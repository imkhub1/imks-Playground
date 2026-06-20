"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppState } from "@/app/components/AppStateProvider";
import Logo from "@/app/components/Logo";
import Btn from "@/app/components/Btn";
import Ico from "@/app/components/Ico";

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="mono"
      style={{
        flex: 1,
        background: "none",
        border: "none",
        padding: "12px 0",
        fontSize: 12.5,
        fontWeight: 700,
        letterSpacing: "0.08em",
        color: active ? "var(--text)" : "var(--text-faint)",
        borderBottom: `2px solid ${active ? "var(--accent)" : "transparent"}`,
        cursor: "pointer",
        transition: "color 0.18s, border-color 0.18s",
      }}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <label style={{ display: "block" }}>
      <span
        className="mono"
        style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.12em",
          color: "var(--text-faint)",
          display: "block",
          marginBottom: 7,
        }}
      >
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        style={{
          width: "100%",
          background: "var(--surface-2)",
          borderRadius: 8,
          padding: "12px 14px",
          color: "var(--text)",
          fontSize: 14,
          outline: "none",
          border: `1px solid ${focused ? "var(--accent-line)" : "var(--border)"}`,
          boxShadow: focused ? "0 0 0 3px var(--accent-soft)" : "none",
          transition: "border-color 0.18s, box-shadow 0.18s",
        }}
      />
    </label>
  );
}

export default function AuthView() {
  const router = useRouter();
  const { signIn } = useAppState();
  const [tab, setTab] = useState<"signin" | "register">("signin");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const valid =
    username.trim() &&
    password.trim() &&
    (tab === "signin" || email.trim());

  const handleLogin = (name: string) => {
    signIn(name.trim().slice(0, 14) || "PLAYER");
    router.push("/library");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (valid) handleLogin(username);
  };


  return (
    <div
      className="view-enter"
      style={{
        minHeight: "calc(100vh - 70px)",
        display: "grid",
        placeItems: "center",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          width: "min(420px, 100%)",
          background: "var(--surface-1)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-card)",
          padding: "30px 28px",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Logo size={18} />
          <p
            className="mono"
            style={{
              margin: "10px 0 0",
              fontSize: 10.5,
              letterSpacing: "0.16em",
              color: "var(--text-faint)",
            }}
          >
            SIGN IN TO SAVE YOUR SCORES
          </p>
        </div>

        <div
          style={{
            display: "flex",
            borderBottom: "1px solid var(--border)",
            marginBottom: 22,
          }}
        >
          <TabBtn active={tab === "signin"} onClick={() => setTab("signin")}>SIGN IN</TabBtn>
          <TabBtn active={tab === "register"} onClick={() => setTab("register")}>CREATE ACCOUNT</TabBtn>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          <Field
            label="USERNAME"
            value={username}
            onChange={setUsername}
            placeholder="player_one"
          />
          {tab === "register" && (
            <Field
              label="EMAIL"
              value={email}
              onChange={setEmail}
              type="email"
              placeholder="you@example.com"
            />
          )}
          <Field
            label="PASSWORD"
            value={password}
            onChange={setPassword}
            type="password"
            placeholder="••••••••"
          />
          <Btn
            variant="solid"
            full
            type="submit"
            disabled={!valid}
            style={{ marginTop: 2 }}
          >
            {tab === "signin" ? "SIGN IN" : "CREATE ACCOUNT"}
          </Btn>
        </form>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            margin: "20px 0",
          }}
        >
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          <span
            className="mono"
            style={{
              fontSize: 10,
              color: "var(--text-faint)",
              letterSpacing: "0.1em",
            }}
          >
            OR
          </span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Btn
            variant="ghost"
            full
            onClick={() => handleLogin("Player")}
            style={{ justifyContent: "center" }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Ico name="google" size={16} /> CONTINUE WITH GOOGLE
            </span>
          </Btn>
          <Btn
            variant="ghost"
            full
            onClick={() => handleLogin("Player")}
            style={{ justifyContent: "center" }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Ico name="github" size={16} /> CONTINUE WITH GITHUB
            </span>
          </Btn>
          <Btn
            variant="line"
            full
            leftIcon="user"
            onClick={() => router.push("/library")}
          >
            PLAY AS GUEST
          </Btn>
        </div>

        <p
          className="mono"
          style={{
            textAlign: "center",
            margin: "18px 0 0",
            fontSize: 9.5,
            color: "var(--text-faint)",
            letterSpacing: "0.04em",
            lineHeight: 1.6,
          }}
        >
          DEMO AUTH — NO BACKEND. CONNECTS TO REST / SUPABASE IN PRODUCTION.
        </p>
      </div>
    </div>
  );
}
