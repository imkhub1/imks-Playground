"use client";

import { useEffect, useState } from "react";
import Btn from "@/app/components/Btn";

// ── scroll-reveal ──────────────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// ── pixel icons ────────────────────────────────────────────────────────────────
function HighlightIcon({ kind }: { kind: string }) {
  const C = "currentColor";
  if (kind === "HEART") return (
    <svg className="hl-icon" viewBox="0 0 16 16" width="36" height="36" fill={C}>
      <rect x="2" y="3" width="4" height="2" /><rect x="10" y="3" width="4" height="2" />
      <rect x="1" y="4" width="2" height="4" /><rect x="13" y="4" width="2" height="4" />
      <rect x="2" y="8" width="2" height="2" /><rect x="12" y="8" width="2" height="2" />
      <rect x="3" y="9" width="10" height="2" />
      <rect x="4" y="11" width="8" height="2" />
      <rect x="5" y="12" width="6" height="2" />
      <rect x="6" y="13" width="4" height="1" />
      <rect x="7" y="14" width="2" height="1" />
    </svg>
  );
  if (kind === "BROWSER") return (
    <svg className="hl-icon" viewBox="0 0 16 16" width="36" height="36">
      <g fill={C}>
        <rect x="1" y="2" width="14" height="12" fill="none" stroke={C} strokeWidth="1.4" />
        <rect x="1" y="2" width="14" height="3" />
        <rect x="3" y="3" width="1" height="1" fill="#050507" />
        <rect x="5" y="3" width="1" height="1" fill="#050507" />
        <rect x="7" y="3" width="1" height="1" fill="#050507" />
        <rect x="3" y="7" width="4" height="1" /><rect x="3" y="9" width="6" height="1" /><rect x="3" y="11" width="3" height="1" />
      </g>
    </svg>
  );
  if (kind === "PLANT") return (
    <svg className="hl-icon" viewBox="0 0 16 16" width="36" height="36" fill={C}>
      <rect x="7" y="2" width="2" height="10" />
      <rect x="4" y="4" width="3" height="2" /><rect x="9" y="6" width="3" height="2" />
      <rect x="3" y="3" width="2" height="2" /><rect x="11" y="5" width="2" height="2" />
      <rect x="3" y="12" width="10" height="2" />
      <rect x="4" y="14" width="8" height="1" />
    </svg>
  );
  return null;
}

// ── field ──────────────────────────────────────────────────────────────────────
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
  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "var(--bg)",
    borderRadius: "var(--radius-btn)",
    padding: "12px 14px",
    color: "var(--text)",
    fontSize: 14,
    fontFamily: "var(--font-mono)",
    outline: "none",
    border: `1px solid ${focused ? "var(--accent-line)" : "var(--border)"}`,
    boxShadow: focused ? "0 0 0 3px var(--accent-soft)" : "none",
    transition: "border-color 0.18s, box-shadow 0.18s",
  };
  return (
    <label style={{ display: "block" }}>
      <span
        className="mono"
        style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.14em",
          color: "var(--text-faint)",
          display: "block",
          marginBottom: 7,
          textTransform: "uppercase",
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
        style={inputStyle}
      />
    </label>
  );
}

// ── main ───────────────────────────────────────────────────────────────────────
type Status = "idle" | "sending" | "success" | "error";

export default function AboutPage() {
  useReveal();

  const [form, setForm] = useState({ name: "", email: "", msg: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [senderName, setSenderName] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [shake, setShake] = useState(false);
  const [msgFocused, setMsgFocused] = useState(false);

  const resetForm = () => {
    setForm({ name: "", email: "", msg: "" });
    setStatus("idle");
    setSenderName("");
    setErrMsg("");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.msg.trim()) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.ok) {
        setSenderName(form.name.trim());
        setStatus("success");
      } else {
        setErrMsg(data.error ?? "Server error");
        setStatus("error");
      }
    } catch {
      setErrMsg("Network error. Please try again.");
      setStatus("error");
    }
  };

  const highlights = [
    { kind: "HEART",   color: "#ff006e", text: "MADE WITH ❤️ FOR PLAYERS" },
    { kind: "BROWSER", color: "#00f5ff", text: "HTML GAMES — RUNS IN ANY BROWSER" },
    { kind: "PLANT",   color: "#00ff88", text: "A PROJECT THAT KEEPS GROWING" },
  ];

  return (
    <div className="about view-enter">

      {/* ── ABOUT HERO ──────────────────────────────────────────────────────── */}
      <section
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "80px 24px 40px",
          textAlign: "center",
        }}
      >
        <div
          className="mono"
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.28em",
            color: "var(--accent)",
            marginBottom: 18,
          }}
        >
          ▸ ABOUT
        </div>

        <h1
          className="mono"
          style={{
            margin: 0,
            fontSize: "clamp(26px, 5vw, 52px)",
            fontWeight: 800,
            letterSpacing: "-0.01em",
            color: "var(--text)",
          }}
        >
          ABOUT IMK&apos;S PLAYGROUND
        </h1>

        <p
          style={{
            maxWidth: 720,
            margin: "28px auto 0",
            fontSize: 15,
            lineHeight: 1.8,
            color: "var(--text-muted)",
            letterSpacing: "0.02em",
          }}
        >
          IMK&apos;s Playground was born out of a love for classic video games. Our mission
          is to preserve and celebrate the arcades that defined a generation, making them
          accessible to everyone, anywhere, at no cost.
        </p>

        <div className="highlight-row">
          {highlights.map((h, i) => (
            <div
              key={i}
              className="highlight"
              style={{ color: h.color, transitionDelay: `${i * 80}ms` }}
            >
              <HighlightIcon kind={h.kind} />
              <div
                className="mono"
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  lineHeight: 1.5,
                  color: "var(--text)",
                }}
              >
                {h.text}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PIXEL DIVIDER ───────────────────────────────────────────────────── */}
      <div
        className="reveal"
        aria-hidden="true"
        style={{
          maxWidth: 1200,
          margin: "60px auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, #ff006e, transparent)" }} />
        <div className="div-pixels">
          {Array.from({ length: 24 }).map((_, i) => (
            <span key={i} style={{ animationDelay: `${i * 80}ms` }} />
          ))}
        </div>
        <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, #ff006e, transparent)" }} />
      </div>

      {/* ── CONTACT ─────────────────────────────────────────────────────────── */}
      <section
        className="reveal"
        style={{ maxWidth: 1200, margin: "0 auto 80px", padding: "0 24px" }}
      >
        <div
          className="contact-grid"
          style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 40, alignItems: "start" }}
        >
          {/* intro */}
          <div>
            <div
              className="mono"
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.28em",
                color: "var(--accent)",
                marginBottom: 14,
              }}
            >
              ▸ CONTACT
            </div>
            <h2
              className="mono"
              style={{
                margin: 0,
                fontSize: "clamp(22px, 3.5vw, 36px)",
                fontWeight: 800,
                letterSpacing: "-0.01em",
                color: "var(--text)",
              }}
            >
              CONTACT US
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.7, margin: "18px 0 24px" }}>
              Have a suggestion, want to propose a game, or just want to say hello?
              Write to us.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { color: "#00ff88", label: "RESPONSE IN 24-48H" },
                { color: "#f5ff00", label: "SUGGESTIONS WELCOME" },
                { color: "#ff006e", label: "NO SPAM. EVER." },
              ].map((tip, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: tip.color,
                      boxShadow: `0 0 6px ${tip.color}`,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    className="mono"
                    style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: "var(--text-muted)" }}
                  >
                    {tip.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* form */}
          <form
            className={`contact-form${shake ? " shake" : ""}`}
            onSubmit={onSubmit}
            noValidate
          >
            {status === "success" ? (
              <div className="terminal-box success">
                <div className="term-bar">
                  <span className="dot r" /><span className="dot y" /><span className="dot g" />
                  <span className="term-title">VAULT-OS // TERMINAL</span>
                </div>
                <div className="term-body">
                  <div className="t-line">
                    <span className="t-prompt">imk@playground:~$</span>./send_message --to=team
                  </div>
                  <div className="t-dim">[OK] Connecting to server…</div>
                  <div className="t-dim">[OK] Validating content…</div>
                  <div className="t-dim">[OK] Transmitting packet…</div>
                  <div className="t-success">
                    &gt; MESSAGE RECEIVED. WE&apos;LL GET BACK TO YOU SOON. THANKS, {senderName.toUpperCase()}.<span className="t-caret">_</span>
                  </div>
                  <div style={{ marginTop: 18 }}>
                    <Btn variant="ghost" onClick={resetForm}>SEND ANOTHER MESSAGE</Btn>
                  </div>
                </div>
              </div>
            ) : status === "error" ? (
              <div className="terminal-box error">
                <div className="term-bar">
                  <span className="dot r" /><span className="dot y" /><span className="dot g" />
                  <span className="term-title">VAULT-OS // TERMINAL</span>
                </div>
                <div className="term-body">
                  <div className="t-line">
                    <span className="t-prompt">imk@playground:~$</span>./send_message --to=team
                  </div>
                  <div className="t-dim">[ERR] Something went wrong…</div>
                  <div className="t-err">
                    &gt; TRANSMISSION FAILED: {errMsg.toUpperCase()}<span className="t-caret">_</span>
                  </div>
                  <div style={{ marginTop: 18 }}>
                    <Btn variant="ghost" onClick={resetForm}>TRY AGAIN</Btn>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Field
                  label="Name"
                  value={form.name}
                  onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                  placeholder="px_kai"
                />
                <Field
                  label="Email Address"
                  type="email"
                  value={form.email}
                  onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                  placeholder="player@imksplayground.gg"
                />
                <label style={{ display: "block" }}>
                  <span
                    className="mono"
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "0.14em",
                      color: "var(--text-faint)",
                      display: "block",
                      marginBottom: 7,
                      textTransform: "uppercase",
                    }}
                  >
                    Message
                  </span>
                  <textarea
                    value={form.msg}
                    onChange={(e) => setForm((f) => ({ ...f, msg: e.target.value }))}
                    onFocus={() => setMsgFocused(true)}
                    onBlur={() => setMsgFocused(false)}
                    rows={5}
                    placeholder="Tell us what's on your mind…"
                    style={{
                      border: `1px solid ${msgFocused ? "var(--accent-line)" : "var(--border)"}`,
                      boxShadow: msgFocused ? "0 0 0 3px var(--accent-soft)" : "none",
                    }}
                  />
                </label>
                <Btn
                  variant="line"
                  size="lg"
                  type="submit"
                  full
                  disabled={status === "sending"}
                >
                  {status === "sending" ? "▶  SENDING..." : "▶  SEND MESSAGE"}
                </Btn>
              </div>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}
