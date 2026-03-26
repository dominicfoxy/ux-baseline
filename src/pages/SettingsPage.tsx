import { useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { FolderOpen } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { BUILT_IN_THEMES } from "../lib/themes";
import { useStore } from "../store";

export default function SettingsPage() {
  const { settings, setSettings } = useStore();
  const { activeTheme, themeFile, uiScale, ezMode } = settings;
  const [localScale, setLocalScale] = useState(uiScale ?? 1.0);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <PageHeader title="Settings" subtitle="Theme, display scale, and EZ Mode — functional demo of the standard Settings page" />

      <div style={{ flex: 1, overflow: "auto", padding: "28px" }}>
        <div style={{ maxWidth: "560px" }}>

          {/* ─── Display ─── */}
          <section style={{ marginBottom: "32px" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px", paddingBottom: "8px", borderBottom: "1px solid var(--border)" }}>
              Display
            </div>

            {/* Theme */}
            <div style={{ marginBottom: "24px" }}>
              <div className="section-label">Theme</div>
              <div style={{ fontFamily: "var(--font-body)", fontStyle: "italic", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "10px" }}>
                Every color in the app is a CSS variable. Themes override the full palette at runtime — no page reload.
              </div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {BUILT_IN_THEMES.map((t) => {
                  // "Colorblind Friendly" is an accessibility escape hatch — hardcoded blue,
                  // bypasses all CSS vars so it's always findable regardless of the active theme.
                  const isSafe = t.id === "colorblind";
                  const selected = activeTheme === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSettings({ activeTheme: t.id })}
                      style={{
                        padding: "5px 14px", fontSize: "12px",
                        fontFamily: "var(--font-display)", fontWeight: 600,
                        borderRadius: "5px", cursor: "pointer",
                        border:      isSafe ? "1px solid #3b82f6"          : selected ? "1px solid var(--accent)"     : "1px solid var(--border)",
                        background:  isSafe ? "rgba(29, 78, 216, 0.20)"    : selected ? "var(--accent-glow)"          : "transparent",
                        color:       isSafe ? "#93c5fd"                    : selected ? "var(--accent-bright)"        : "var(--text-secondary)",
                        transition: "all 0.15s",
                      }}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>

              {/* Escape hatch explanation */}
              <div style={{ marginTop: "12px", padding: "10px 12px", background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "5px" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" }}>Escape Hatch Pattern</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                  Two elements are always hardcoded blue regardless of theme: <strong style={{ color: "var(--text-primary)" }}>the Settings nav item</strong> and <strong style={{ color: "var(--text-primary)" }}>the Colorblind Friendly button</strong> above. This ensures they remain visually findable even in a broken or extreme theme (e.g. Colorblind Hell).
                </div>
              </div>
            </div>

            {/* Custom theme file */}
            <div style={{ marginBottom: "24px" }}>
              <div className="section-label">Custom Theme File</div>
              <div style={{ fontFamily: "var(--font-body)", fontStyle: "italic", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "8px" }}>
                A JSON file of CSS variable overrides, layered on top of the selected built-in theme.
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  style={{ flex: 1 }}
                  value={themeFile}
                  onChange={(e) => setSettings({ themeFile: e.target.value })}
                  placeholder="/path/to/theme.json"
                />
                <button className="btn-ghost" style={{ flexShrink: 0 }} onClick={async () => {
                  const selected = await open({ multiple: false, filters: [{ name: "Theme JSON", extensions: ["json"] }] });
                  if (selected) setSettings({ themeFile: selected as string });
                }}>
                  <FolderOpen size={13} style={{ display: "inline", marginRight: "5px", verticalAlign: "middle" }} />
                  Browse
                </button>
                {themeFile && (
                  <button className="btn-ghost" onClick={() => setSettings({ themeFile: "" })} style={{ flexShrink: 0 }}>
                    Clear
                  </button>
                )}
              </div>
              <div style={{ marginTop: "8px", padding: "8px 10px", background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "4px", fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                {`{ "--accent": "#ff6600", "--accent-bright": "#ff8833", "--accent-glow": "rgba(255,102,0,0.15)" }`}
              </div>
            </div>

            {/* UI Scale */}
            <div>
              <div className="section-label">UI Scale</div>
              <div style={{ fontFamily: "var(--font-body)", fontStyle: "italic", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "8px" }}>
                Applied via <code style={{ fontFamily: "var(--font-mono)", fontSize: "11px", background: "var(--bg-3)", padding: "1px 5px", borderRadius: "3px" }}>document.documentElement.style.zoom</code> — scales the entire UI uniformly.
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <input
                  type="range" min="0.7" max="1.5" step="0.05"
                  value={localScale}
                  onChange={(e) => setLocalScale(parseFloat(e.target.value))}
                  onPointerUp={(e) => setSettings({ uiScale: parseFloat((e.target as HTMLInputElement).value) })}
                  style={{ flex: 1, padding: 0, border: "none", background: "transparent", cursor: "pointer", accentColor: "var(--accent)" }}
                />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--accent-bright)", width: "42px", textAlign: "right", flexShrink: 0 }}>
                  {Math.round(localScale * 100)}%
                </span>
                <button className="btn-ghost" onClick={() => { setLocalScale(1.0); setSettings({ uiScale: 1.0 }); }} style={{ padding: "4px 10px", fontSize: "11px", flexShrink: 0 }}>
                  Reset
                </button>
              </div>
            </div>
          </section>

          {/* ─── EZ Mode ─── */}
          <section style={{ marginBottom: "32px" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px", paddingBottom: "8px", borderBottom: "1px solid var(--border)" }}>
              EZ Mode
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", marginBottom: "16px" }}>
              <button
                onClick={() => setSettings({ ezMode: !ezMode })}
                style={{
                  padding: "7px 20px", cursor: "pointer", flexShrink: 0,
                  fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "12px", letterSpacing: "0.08em",
                  borderRadius: "5px",
                  border: `1px solid ${ezMode ? "var(--accent-bright)" : "var(--border)"}`,
                  background: ezMode ? "var(--accent-glow)" : "var(--bg-2)",
                  color: ezMode ? "var(--accent-bright)" : "var(--text-muted)",
                  boxShadow: ezMode ? "0 0 12px var(--accent-dim), inset 0 0 8px var(--accent-glow)" : "none",
                  transition: "all 0.2s",
                }}
              >
                {ezMode ? "⚡ EZ MODE ON" : "EZ MODE OFF"}
              </button>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
                Same toggle as the sidebar footer. Both read from and write to the same Zustand store key — single source of truth.
              </div>
            </div>

            <div style={{ padding: "14px 16px", background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "6px" }}>
              <div className="section-label" style={{ marginBottom: "8px" }}>What EZ Mode does in every app</div>
              <ul style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.9, paddingLeft: "16px", margin: 0 }}>
                <li>Locks advanced fields (<code style={{ fontFamily: "var(--font-mono)", fontSize: "11px", background: "var(--bg-3)", padding: "1px 5px", borderRadius: "3px" }}>opacity: 0.45; pointer-events: none</code>)</li>
                <li>Shows a banner: "⚡ EZ Mode active — optimal defaults applied"</li>
                <li>Replaces raw logs / verbose state with a summary card or progress bar</li>
                <li>Auto-sets sensible values for all locked fields on toggle</li>
                <li>Sidebar footer glows amber when active</li>
                <li>Status bar shows <code style={{ fontFamily: "var(--font-mono)", fontSize: "11px", background: "var(--bg-3)", padding: "1px 5px", borderRadius: "3px" }}>mode: EZ</code></li>
              </ul>
              <div style={{ marginTop: "12px", fontFamily: "var(--font-body)", fontStyle: "italic", fontSize: "12px", color: "var(--text-secondary)" }}>
                Goal: an "idiot-proof" path through the app that produces good results without expertise. Power users turn it off.
              </div>
            </div>
          </section>

          {/* ─── About ─── */}
          <section>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px", paddingBottom: "8px", borderBottom: "1px solid var(--border)" }}>
              About This Demo
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                ["Stack",       "React 19 · TypeScript · Vite · Zustand · Lucide React"],
                ["Fonts",       "Syne (Display) · IBM Plex Mono · Newsreader (Body)"],
                ["Styling",     "Inline style={{}} props only — no CSS modules, no Tailwind"],
                ["Themes",      `${BUILT_IN_THEMES.length} built-in themes · custom JSON overlay`],
                ["State",       "Zustand with persist middleware — survives page reload"],
                ["Tauri",       "plugin-dialog (folder/file picker) · plugin-fs (theme file) · window close event"],
              ].map(([label, value]) => (
                <div key={label} style={{ display: "flex", gap: "12px", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-muted)", width: "100px", flexShrink: 0, paddingTop: "1px" }}>{label}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-secondary)", lineHeight: 1.6 }}>{value}</div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
