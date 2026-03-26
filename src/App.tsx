import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Palette, Box, FileText, Layers, Settings, ChevronRight } from "lucide-react";
import { readTextFile } from "@tauri-apps/plugin-fs";
import { BUILT_IN_THEMES, applyTheme, resetTheme } from "./lib/themes";
import { useStore } from "./store";
import OverviewPage from "./pages/OverviewPage";
import ComponentsPage from "./pages/ComponentsPage";
import FormsPage from "./pages/FormsPage";
import OverlaysPage from "./pages/OverlaysPage";
import SettingsPage from "./pages/SettingsPage";

const NAV_ITEMS = [
  { to: "/",           icon: Palette,  label: "Design Language", sub: "colors & typography"    },
  { to: "/components", icon: Box,      label: "Components",      sub: "buttons, inputs, tags"  },
  { to: "/forms",      icon: FileText, label: "Form Patterns",   sub: "fields, defaults, ez"   },
  { to: "/overlays",   icon: Layers,   label: "Banners & Overlays", sub: "feedback & modals"   },
  { to: "/settings",   icon: Settings, label: "Settings",        sub: "theme & display"        },
];

function StatusItem({ label, value, dim }: { label: string; value: string; dim?: boolean }) {
  return (
    <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.06em", color: dim ? "var(--text-muted)" : "var(--text-secondary)", whiteSpace: "nowrap" }}>
      <span style={{ color: "var(--text-muted)", opacity: 0.6 }}>{label}: </span>{value}
    </span>
  );
}
function StatusSep() {
  return <span style={{ color: "var(--border-light)", fontSize: "9px", userSelect: "none" }}>|</span>;
}

export default function App() {
  const location = useLocation();
  const { settings, setSettings } = useStore();
  const { activeTheme, themeFile, uiScale, ezMode } = settings;

  // Apply theme: built-in vars + optional custom file overrides
  useEffect(() => {
    const builtIn = BUILT_IN_THEMES.find((t) => t.id === activeTheme);
    const builtInVars = builtIn?.vars ?? {};

    if (themeFile) {
      readTextFile(themeFile)
        .then((raw) => {
          try {
            const customVars = JSON.parse(raw);
            applyTheme({ ...builtInVars, ...customVars });
          } catch {
            // Malformed JSON — fall back to built-in only
            if (Object.keys(builtInVars).length > 0) applyTheme(builtInVars);
            else resetTheme();
          }
        })
        .catch(() => {
          // File unreadable — fall back to built-in only
          if (Object.keys(builtInVars).length > 0) applyTheme(builtInVars);
          else resetTheme();
        });
    } else {
      if (Object.keys(builtInVars).length > 0) applyTheme(builtInVars);
      else resetTheme();
    }
  }, [activeTheme, themeFile]);

  useEffect(() => {
    document.documentElement.style.zoom = String(uiScale ?? 1.0);
  }, [uiScale]);


  const currentThemeLabel = BUILT_IN_THEMES.find((t) => t.id === activeTheme)?.label ?? "Default Dark";

  return (
    <div style={{ display: "flex", height: "100vh", background: "var(--bg-0)" }}>

      {/* ─── Sidebar ─── */}
      <aside style={{
        width: "var(--sidebar-width)",
        background: "var(--bg-1)",
        borderRight: "1px solid var(--border)",
        display: "flex", flexDirection: "column", flexShrink: 0,
      }}>

        {/* Logo */}
        <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "18px", fontWeight: 800, color: "var(--accent-bright)", letterSpacing: "-0.02em" }}>
            UX<br />Baseline
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-muted)", marginTop: "2px", letterSpacing: "0.08em" }}>
            design system demo
          </div>
        </div>

        {/* Active theme pill — demonstrates the "context pill" pattern */}
        <div style={{ margin: "12px 12px 0", padding: "8px 10px", background: "var(--accent-glow)", border: "1px solid var(--accent-dim)", borderRadius: "6px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Active Theme</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, color: "var(--accent-bright)", marginTop: "2px" }}>{currentThemeLabel}</div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-muted)", marginTop: "1px" }}>{BUILT_IN_THEMES.length} built-in themes</div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 8px", display: "flex", flexDirection: "column", gap: "2px" }}>
          {NAV_ITEMS.map(({ to, icon: Icon, label, sub }) => {
            const active = to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);
            // Settings always blue — hardcoded escape hatch that bypasses all CSS vars
            const isSafe = to === "/settings";
            const SAFE_BG     = "rgba(29, 78, 216, 0.20)";
            const SAFE_BORDER = "#3b82f6";
            const SAFE_TEXT   = "#93c5fd";
            const SAFE_MUTED  = "#6ea8f7";
            return (
              <NavLink key={to} to={to} style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "8px 10px", borderRadius: "6px", textDecoration: "none",
                background:   isSafe ? SAFE_BG   : active ? "var(--bg-3)"    : "transparent",
                borderLeft:   isSafe ? `2px solid ${SAFE_BORDER}` : active ? "2px solid var(--accent)" : "2px solid transparent",
                transition: "all 0.12s",
              }}>
                <Icon size={15}
                  color={isSafe ? SAFE_BORDER : active ? "var(--accent-bright)" : "var(--text-muted)"}
                  strokeWidth={active ? 2.5 : 1.5}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: active ? 700 : 500, color: isSafe ? SAFE_TEXT : active ? "var(--accent-bright)" : "var(--text-secondary)", letterSpacing: "0.01em" }}>
                    {label}
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: isSafe ? SAFE_MUTED : "var(--text-muted)", letterSpacing: "0.04em" }}>
                    {sub}
                  </div>
                </div>
                {active && <ChevronRight size={11} color="var(--accent-dim)" />}
              </NavLink>
            );
          })}
        </nav>

        {/* EZ Mode toggle footer */}
        <div style={{
          padding: "10px 16px 12px",
          borderTop: `1px solid ${ezMode ? "var(--accent-dim)" : "var(--border)"}`,
          background: ezMode ? "var(--accent-glow)" : "transparent",
          transition: "background 0.3s, border-color 0.3s",
        }}>
          <button
            onClick={() => setSettings({ ezMode: !ezMode })}
            style={{
              width: "100%", padding: "5px 8px", marginBottom: "8px", cursor: "pointer",
              fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "10px", letterSpacing: "0.1em",
              borderRadius: "5px",
              border: `1px solid ${ezMode ? "var(--accent-bright)" : "var(--border)"}`,
              background: ezMode ? "var(--accent-glow)" : "var(--bg-2)",
              color: ezMode ? "var(--accent-bright)" : "var(--text-muted)",
              boxShadow: ezMode ? "0 0 10px var(--accent-dim), inset 0 0 8px var(--accent-glow)" : "none",
              transition: "all 0.2s",
            }}
          >
            {ezMode ? "⚡ EZ MODE ON" : "EZ MODE"}
          </button>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: ezMode ? "var(--accent-dim)" : "var(--text-muted)", letterSpacing: "0.06em", transition: "color 0.3s" }}>
            REACT · VITE · ZUSTAND
          </div>
        </div>
      </aside>

      {/* ─── Main ─── */}
      <main style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <Routes>
          <Route path="/"           element={<OverviewPage />}    />
          <Route path="/components" element={<ComponentsPage />}  />
          <Route path="/forms"      element={<FormsPage />}       />
          <Route path="/overlays"   element={<OverlaysPage />}    />
          <Route path="/settings"   element={<SettingsPage />}    />
        </Routes>

        {/* Status bar */}
        <div style={{
          flexShrink: 0, height: "22px",
          borderTop: "1px solid var(--border)", background: "var(--bg-1)",
          display: "flex", alignItems: "center", padding: "0 12px", gap: "16px", overflow: "hidden",
        }}>
          <StatusItem label="theme" value={currentThemeLabel} />
          <StatusSep />
          <StatusItem label="scale" value={`${Math.round((uiScale ?? 1) * 100)}%`} />
          <StatusSep />
          <StatusItem label="mode" value={ezMode ? "EZ" : "pro"} dim={!ezMode} />
          <div style={{ flex: 1 }} />
          <StatusItem label="stack" value="react · vite · zustand" dim />
        </div>
      </main>

    </div>
  );
}
