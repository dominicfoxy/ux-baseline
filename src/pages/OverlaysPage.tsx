import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import PageHeader from "../components/PageHeader";

type TestState = "idle" | "testing" | "ok" | "fail";

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 700,
      color: "var(--text-primary)", marginBottom: "16px",
      paddingBottom: "8px", borderBottom: "1px solid var(--border)",
    }}>{children}</div>
  );
}
function Divider() { return <div style={{ height: "1px", background: "var(--border)" }} />; }

// ─── Inline banner specimens ──────────────────────────────────────────────────
function BannerSpecimen({ type }: { type: "info" | "warning" | "danger" }) {
  const styles = {
    info:    { bg: "var(--accent-glow)",  border: "var(--accent-dim)", text: "var(--accent-bright)",  icon: <Info size={13} color="var(--accent-bright)" /> },
    warning: { bg: "rgba(74, 122, 154, 0.12)", border: "var(--blue)",  text: "var(--blue)",            icon: <AlertTriangle size={13} color="var(--blue)" /> },
    danger:  { bg: "var(--red-dim)",      border: "var(--red)",        text: "#d47070",               icon: <AlertTriangle size={13} color="#d47070" /> },
  }[type];

  const labels = {
    info:    ["Info / State Change", "Something changed that the user should know about. Confirm or dismiss."],
    warning: ["Warning", "A condition requires attention but doesn't block the current action."],
    danger:  ["Destructive Confirmation", "This action cannot be undone. Confirm before proceeding."],
  }[type];

  return (
    <div style={{
      padding: "10px 16px", marginBottom: "6px",
      background: styles.bg, border: `1px solid ${styles.border}`,
      borderRadius: "6px", display: "flex", alignItems: "center", gap: "12px",
    }}>
      <div style={{ flexShrink: 0 }}>{styles.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "12px", fontWeight: 700, color: styles.text, letterSpacing: "0.04em", marginBottom: "2px" }}>{labels[0]}</div>
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: styles.text, opacity: 0.8 }}>{labels[1]}</div>
      </div>
      <button style={{ background: "transparent", border: `1px solid ${styles.border}`, borderRadius: "4px", padding: "4px 12px", cursor: "pointer", fontFamily: "var(--font-display)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.04em", color: styles.text, flexShrink: 0 }}>
        Action
      </button>
      <button style={{ background: "transparent", border: "none", padding: "4px", cursor: "pointer", color: styles.text, opacity: 0.6, display: "flex", alignItems: "center" }}>
        <X size={12} />
      </button>
    </div>
  );
}

// ─── Status icon pattern ──────────────────────────────────────────────────────
function StatusIcon({ state }: { state: TestState }) {
  if (state === "ok")      return <CheckCircle size={14} color="var(--green)" />;
  if (state === "fail")    return <XCircle size={14} color="var(--red)" />;
  if (state === "testing") return <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--accent)" }}>testing…</span>;
  return <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-muted)" }}>—</span>;
}

// ─── page ─────────────────────────────────────────────────────────────────────
export default function OverlaysPage() {
  const [liveType, setLiveType] = useState<"info" | "warning" | "danger" | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmState, setConfirmState] = useState<"idle" | "confirming" | "done">("idle");
  const [testState, setTestState] = useState<TestState>("idle");
  const [testUrl, setTestUrl] = useState("http://localhost:7860");

  const runTest = async () => {
    setTestState("testing");
    try {
      const ok = await invoke<boolean>("test_connection", { url: testUrl });
      setTestState(ok ? "ok" : "fail");
    } catch {
      setTestState("fail");
    }
  };

  const handleConfirm = () => {
    setConfirmState("done");
    setTimeout(() => { setModalOpen(false); setConfirmState("idle"); }, 1000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <PageHeader
        title="Banners & Overlays"
        subtitle="Inline feedback over modal dialogs — except when the user must respond before anything else can happen"
      />

      {/* Live banner area */}
      {liveType && (
        <div style={{
          padding: "10px 28px", flexShrink: 0,
          background: liveType === "danger" ? "var(--red-dim)" : liveType === "warning" ? "rgba(74, 122, 154, 0.12)" : "var(--accent-glow)",
          borderBottom: `1px solid ${liveType === "danger" ? "var(--red)" : liveType === "warning" ? "var(--blue)" : "var(--accent-dim)"}`,
          display: "flex", alignItems: "center", gap: "16px",
        }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: liveType === "danger" ? "#d47070" : liveType === "warning" ? "var(--blue)" : "var(--accent-bright)", flex: 1 }}>
            {liveType === "info" && "Trigger word changed from \"sablefox_v1\" to \"sablefox_v2\". Update 48 existing captions?"}
            {liveType === "warning" && "Forge is unreachable at http://localhost:7860 — check that it's running with the --api flag."}
            {liveType === "danger" && "This will permanently delete 12 images and their captions. This cannot be undone."}
          </span>
          <button onClick={() => setLiveType(null)} style={{
            padding: "5px 14px", fontSize: "11px", cursor: "pointer",
            background: liveType === "danger" ? "var(--red)" : "var(--accent)",
            border: "none", color: "white", borderRadius: "4px",
            fontFamily: "var(--font-display)", fontWeight: 700, letterSpacing: "0.04em", flexShrink: 0,
          }}>
            {liveType === "info" ? "Update" : liveType === "warning" ? "Retry" : "Delete"}
          </button>
          <button onClick={() => setLiveType(null)} style={{
            padding: "5px 14px", fontSize: "11px", cursor: "pointer",
            background: "transparent", border: "1px solid var(--border)", color: "var(--text-muted)",
            borderRadius: "4px", fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: "0.04em", flexShrink: 0,
          }}>Dismiss</button>
        </div>
      )}

      <div style={{ flex: 1, overflow: "auto", padding: "28px" }}>
        <div style={{ maxWidth: "680px", display: "flex", flexDirection: "column", gap: "36px" }}>

          {/* ─── Banner Specimens ─── */}
          <section>
            <SectionHeader>Banner Types</SectionHeader>
            <div style={{ fontFamily: "var(--font-body)", fontStyle: "italic", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px" }}>
              Banners sit between the PageHeader and the scrollable content area. They appear and disappear inline — no toasts, no floating notifications.
            </div>
            <BannerSpecimen type="info" />
            <BannerSpecimen type="warning" />
            <BannerSpecimen type="danger" />

            <div style={{ marginTop: "16px" }}>
              <div className="section-label" style={{ marginBottom: "8px" }}>Live Demo — triggers the actual banner above the content</div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button className="btn-ghost" onClick={() => setLiveType("info")} style={{ fontSize: "11px", padding: "5px 14px" }}>
                  Show Info Banner
                </button>
                <button className="btn-ghost" onClick={() => setLiveType("warning")} style={{ fontSize: "11px", padding: "5px 14px", borderColor: "var(--blue)", color: "var(--blue)" }}>
                  Show Warning
                </button>
                <button className="btn-ghost" onClick={() => setLiveType("danger")} style={{ fontSize: "11px", padding: "5px 14px", borderColor: "var(--red)", color: "#d47070" }}>
                  Show Destructive
                </button>
              </div>
            </div>
          </section>

          <Divider />

          {/* ─── Status Pattern ─── */}
          <section>
            <SectionHeader>Connection Status Pattern</SectionHeader>
            <div style={{ fontFamily: "var(--font-body)", fontStyle: "italic", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "8px" }}>
              Use this pattern anywhere the app needs to verify an external service is reachable — a local inference server, an API endpoint, a database. The check is always on-demand (button-triggered), never automatic.
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontStyle: "italic", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px" }}>
              The pattern composes three elements: an endpoint input, a Test button, and a status indicator. The indicator cycles through four states:
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "8px" }}>
              {([
                { state: "idle",    label: "idle",       desc: "No test run yet, or URL changed since last test" },
                { state: "testing", label: "testing…",   desc: "TCP probe in flight — button should be disabled" },
                { state: "ok",      label: "connected",  desc: "Port responded within the timeout (3 s)" },
                { state: "fail",    label: "failed",     desc: "Timed out, refused, or host unreachable" },
              ] as { state: TestState; label: string; desc: string }[]).map(({ state, label, desc }) => (
                <div key={state} style={{ padding: "12px 14px", background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "6px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <StatusIcon state={state} />
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color:
                      state === "ok" ? "var(--green)" : state === "fail" ? "var(--red)" :
                      state === "testing" ? "var(--accent)" : "var(--text-muted)"
                    }}>{label}</span>
                    <span className="tag" style={{ marginLeft: "auto" }}>{state}</span>
                  </div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "var(--text-secondary)", lineHeight: 1.5 }}>{desc}</div>
                </div>
              ))}
            </div>

            <div style={{ fontFamily: "var(--font-body)", fontStyle: "italic", fontSize: "11px", color: "var(--text-secondary)", marginBottom: "20px" }}>
              Reset to <code style={{ fontFamily: "var(--font-mono)", fontSize: "10px", background: "var(--bg-3)", padding: "1px 5px", borderRadius: "3px" }}>idle</code> whenever the URL input changes, so stale results don't linger.
            </div>

            <div style={{ padding: "12px 14px", background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "6px" }}>
              <div className="section-label" style={{ marginBottom: "4px" }}>Live Demo</div>
              <div style={{ fontFamily: "var(--font-body)", fontStyle: "italic", fontSize: "11px", color: "var(--text-secondary)", marginBottom: "10px" }}>
                Real TCP probe via <code style={{ fontFamily: "var(--font-mono)", fontSize: "10px", background: "var(--bg-3)", padding: "1px 5px", borderRadius: "3px" }}>invoke("test_connection")</code> — try any host:port. Defaults to a local Forge/A1111 instance.
              </div>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <input style={{ flex: 1 }} value={testUrl} onChange={(e) => { setTestUrl(e.target.value); setTestState("idle"); }} />
                <button className="btn-ghost" onClick={runTest} disabled={testState === "testing"} style={{ flexShrink: 0 }}>Test</button>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", width: "100px" }}>
                  <StatusIcon state={testState} />
                  {testState === "ok" && <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--green)" }}>connected</span>}
                  {testState === "fail" && <span style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--red)" }}>failed</span>}
                </div>
              </div>
            </div>
          </section>

          <Divider />

          {/* ─── Modal Dialog ─── */}
          <section>
            <SectionHeader>Modal Dialog</SectionHeader>
            <div style={{ fontFamily: "var(--font-body)", fontStyle: "italic", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px" }}>
              Modals are reserved for cases where the user <em>must</em> respond before anything else can happen — e.g. unsaved changes on close. Everything else uses inline banners.
            </div>

            <div style={{ padding: "14px 16px", background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "6px", marginBottom: "16px" }}>
              <div className="section-label" style={{ marginBottom: "8px" }}>When to use a modal</div>
              <ul style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.9, paddingLeft: "16px", margin: 0 }}>
                <li>Unsaved changes on app close</li>
                <li>Irreversible action that requires explicit intent (not just a banner)</li>
                <li>A required decision that blocks the entire application</li>
              </ul>
              <div style={{ borderTop: "1px solid var(--border)", marginTop: "10px", paddingTop: "10px" }}>
                <div className="section-label" style={{ marginBottom: "6px" }}>When NOT to use a modal</div>
                <ul style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.9, paddingLeft: "16px", margin: 0 }}>
                  <li>Confirmations for reversible actions → use a banner</li>
                  <li>Error messages → surface inline near the button</li>
                  <li>Informational alerts → use a banner</li>
                </ul>
              </div>
            </div>

            <button className="btn-ghost" onClick={() => setModalOpen(true)}>Open Example Modal</button>
          </section>

        </div>
      </div>

      {/* ─── Modal ─── */}
      {modalOpen && (
        <div style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000,
        }}>
          <div style={{
            background: "var(--bg-1)", border: "1px solid var(--border)",
            borderRadius: "10px", padding: "28px 32px", maxWidth: "380px", width: "100%",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "16px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>
              Unsaved Changes
            </div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "24px", lineHeight: 1.6 }}>
              You have unsaved changes. Save before closing, or discard them?
            </div>
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <button onClick={() => setModalOpen(false)} style={{
                padding: "7px 16px", fontSize: "12px", cursor: "pointer",
                background: "transparent", border: "1px solid var(--border)", color: "var(--text-muted)",
                borderRadius: "5px", fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: "0.05em",
              }}>Cancel</button>
              <button onClick={() => setModalOpen(false)} style={{
                padding: "7px 16px", fontSize: "12px", cursor: "pointer",
                background: "transparent", border: "1px solid var(--red)", color: "var(--red)",
                borderRadius: "5px", fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: "0.05em",
              }}>Discard & Close</button>
              <button onClick={handleConfirm} style={{
                padding: "7px 16px", fontSize: "12px", cursor: "pointer",
                background: "var(--accent)", border: "none", color: "white",
                borderRadius: "5px", fontFamily: "var(--font-display)", fontWeight: 700, letterSpacing: "0.05em",
              }}>
                {confirmState === "done" ? "✓ Saved" : "Save & Close"}
              </button>
            </div>
            <div style={{ marginTop: "16px", padding: "10px 12px", background: "var(--bg-2)", borderRadius: "5px", fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--text-muted)", lineHeight: 1.7 }}>
              Style: bg-1 background · border-radius 10px · padding 28px 32px<br />
              Overlay: rgba(0,0,0,0.6) + backdropFilter blur(2px) · z-index 1000<br />
              Buttons: Cancel → ghost · Discard → red ghost · Confirm → btn-primary
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
