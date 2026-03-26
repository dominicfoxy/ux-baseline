import PageHeader from "../components/PageHeader";
import { BUILT_IN_THEMES } from "../lib/themes";
import { useStore } from "../store";

// ─── helpers ────────────────────────────────────────────────────────────────

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 700,
      color: "var(--text-primary)", marginBottom: "16px",
      paddingBottom: "8px", borderBottom: "1px solid var(--border)",
    }}>{children}</div>
  );
}

function Divider() {
  return <div style={{ height: "1px", background: "var(--border)" }} />;
}

function ColorSwatch({ name, role }: { name: string; role: string }) {
  return (
    <div>
      <div style={{
        height: "40px", borderRadius: "5px", marginBottom: "7px",
        background: `var(${name})`,
        border: "1px solid rgba(128,128,128,0.18)",
      }} />
      <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--text-secondary)", letterSpacing: "0.03em", marginBottom: "2px" }}>{name}</div>
      <div style={{ fontFamily: "var(--font-body)", fontStyle: "italic", fontSize: "10px", color: "var(--text-secondary)" }}>{role}</div>
    </div>
  );
}

function SwatchGroup({ label, note, cols, swatches }: {
  label: string;
  note?: string;
  cols: number;
  swatches: { name: string; role: string }[];
}) {
  return (
    <div style={{ marginBottom: "24px" }}>
      <div className="section-label" style={{ marginBottom: "10px" }}>{label}</div>
      {note && <div style={{ fontFamily: "var(--font-body)", fontStyle: "italic", fontSize: "11px", color: "var(--text-secondary)", marginBottom: "10px" }}>{note}</div>}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: "10px" }}>
        {swatches.map((s) => <ColorSwatch key={s.name} {...s} />)}
      </div>
    </div>
  );
}

const TYPE_SCALE = [
  { size: "22px", weight: 800, font: "var(--font-display)", tracking: "-0.02em", transform: undefined,   label: "Display 800 · Page Title (h1)",      sample: "Page Title — h1 header" },
  { size: "16px", weight: 800, font: "var(--font-display)", tracking: undefined,  transform: undefined,   label: "Display 800 · Dialog Title",         sample: "Dialog Heading" },
  { size: "14px", weight: 700, font: "var(--font-display)", tracking: undefined,  transform: undefined,   label: "Display 700 · Section Header",        sample: "Section Header" },
  { size: "13px", weight: 700, font: "var(--font-display)", tracking: "0.06em",   transform: "uppercase", label: "Display 700 UC · Section Label",      sample: "Section Label" },
  { size: "12px", weight: 600, font: "var(--font-display)", tracking: "0.05em",   transform: "uppercase", label: "Display 600 UC · Button Text",        sample: "Action Button" },
  { size: "15px", weight: 400, font: "var(--font-body)",    tracking: undefined,  transform: undefined,   label: "Body 400 · Paragraph (base size)",    sample: "The quick brown fox jumps over the lazy dog. Body text is Newsreader, a serif that adds warmth to the otherwise stark interface." },
  { size: "14px", weight: 400, font: "var(--font-body)",    tracking: undefined,  transform: undefined,   label: "Body 400 Italic · Hints",             sample: "A helpful hint explaining what this field expects from the user.", italic: true },
  { size: "14px", weight: 400, font: "var(--font-mono)",    tracking: undefined,  transform: undefined,   label: "Mono 400 · Input Text, Paths",        sample: "/home/user/projects/my-dataset/output" },
  { size: "11px", weight: 400, font: "var(--font-mono)",    tracking: undefined,  transform: undefined,   label: "Mono 400 · Metadata Labels",          sample: "model: illustriousXL_v01 · sampler: DPM++ 2M · steps: 20 · cfg: 7.0" },
  { size: "10px", weight: 400, font: "var(--font-mono)",    tracking: undefined,  transform: undefined,   label: "Mono 400 · Card Secondary Info",      sample: "trigger_word · 48 images · 32 approved · 16 rejected" },
  { size: "9px",  weight: 400, font: "var(--font-mono)",    tracking: "0.06em",   transform: undefined,   label: "Mono 400 · Status Bar",               sample: "theme: Default Dark | mode: pro | scale: 100%" },
];

// ─── component ───────────────────────────────────────────────────────────────

export default function OverviewPage() {
  const { settings } = useStore();
  const currentTheme = BUILT_IN_THEMES.find((t) => t.id === settings.activeTheme);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <PageHeader
        title="Design Language Baseline"
        subtitle="The conventions every new app inherits — match these unless explicitly overriding for a specific project"
        actions={
          <span className="tag" style={{ background: "var(--accent-glow)", border: "1px solid var(--accent-dim)", color: "var(--accent-bright)" }}>
            {currentTheme?.label ?? "Default Dark"}
          </span>
        }
      />

      <div style={{ flex: 1, overflow: "auto", padding: "28px" }}>
        <div style={{ maxWidth: "760px", display: "flex", flexDirection: "column", gap: "36px" }}>

          {/* Hero */}
          <div style={{ padding: "20px 24px", background: "var(--bg-2)", border: "1px solid var(--accent-dim)", borderRadius: "8px" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "14px", fontWeight: 700, color: "var(--accent-bright)", marginBottom: "10px", letterSpacing: "0.01em" }}>
              This is your baseline.
            </div>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.75, marginBottom: "10px" }}>
              Every Tauri 2 + React app starts with this exact design system: the color palette, the three fonts,
              the spacing conventions, the component patterns, and the UX behaviors demonstrated across these five pages.
              Match these conventions in all new work unless a project explicitly overrides them.
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.75, margin: 0 }}>
              Switch themes in Settings — every swatch, component, and specimen on this page uses CSS variables
              and updates live. That's the theme system in action.
            </p>
          </div>

          <Divider />

          {/* ─── Color System ─── */}
          <section>
            <SectionHeader>Color System</SectionHeader>
            <div style={{ fontFamily: "var(--font-body)", fontStyle: "italic", fontSize: "13px", color: "var(--text-secondary)", marginBottom: "20px" }}>
              All values are CSS custom properties on <code style={{ fontFamily: "var(--font-mono)", fontSize: "12px", background: "var(--bg-3)", padding: "1px 6px", borderRadius: "3px", color: "var(--text-secondary)" }}>:root</code>.
              Never hardcode color values — always reference a variable. Swatches below are live.
            </div>

            <SwatchGroup
              label="Background Scale"
              note="Five levels from darkest to lightest. bg-0 is the app canvas; bg-1 is surfaces like the sidebar and headers; bg-2 through bg-4 are for cards, hovers, and elevation."
              cols={5}
              swatches={[
                { name: "--bg-0", role: "App canvas" },
                { name: "--bg-1", role: "Sidebar, headers" },
                { name: "--bg-2", role: "Cards, panels" },
                { name: "--bg-3", role: "Hover, selected" },
                { name: "--bg-4", role: "Elevated elements" },
              ]}
            />

            <SwatchGroup
              label="Borders"
              cols={2}
              swatches={[
                { name: "--border", role: "Default dividers" },
                { name: "--border-light", role: "Subtle separators" },
              ]}
            />

            <SwatchGroup
              label="Text Scale"
              note="Three levels. Primary for content, secondary for labels and captions, muted for hints and disabled states."
              cols={3}
              swatches={[
                { name: "--text-primary",   role: "Content, headings"  },
                { name: "--text-secondary", role: "Labels, captions"   },
                { name: "--text-muted",     role: "Hints, placeholders"},
              ]}
            />

            <SwatchGroup
              label="Accent — Warm Amber (default)"
              note="The single identity color. base for buttons and active states, bright for highlights, dim for borders and outlines, glow for background fills."
              cols={4}
              swatches={[
                { name: "--accent",       role: "Primary CTA" },
                { name: "--accent-bright",role: "Active text, highlights" },
                { name: "--accent-dim",   role: "Focus borders, outlines" },
                { name: "--accent-glow",  role: "Panel fills (rgba 15%)" },
              ]}
            />

            <SwatchGroup
              label="Status Colors"
              note="Green/red for success/error states. Dim variants for background fills. Blue for neutral info."
              cols={5}
              swatches={[
                { name: "--green",     role: "Success, approved" },
                { name: "--green-dim", role: "Success fill (rgba)" },
                { name: "--red",       role: "Error, rejected" },
                { name: "--red-dim",   role: "Error fill (rgba)" },
                { name: "--blue",      role: "Info, neutral" },
              ]}
            />

            {/* Active state recipe */}
            <div style={{ padding: "14px 16px", background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "6px" }}>
              <div className="section-label" style={{ marginBottom: "6px" }}>Active / Selected State Recipe</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--accent-bright)", lineHeight: 1.9 }}>
                background: var(--accent-glow)<br />
                border: 1px solid var(--accent-dim)<br />
                color: var(--accent-bright)
              </div>
              <div style={{ marginTop: "10px", display: "flex", gap: "8px" }}>
                <div style={{ padding: "8px 14px", background: "var(--accent-glow)", border: "1px solid var(--accent-dim)", borderRadius: "5px", fontFamily: "var(--font-display)", fontSize: "12px", color: "var(--accent-bright)", fontWeight: 600, letterSpacing: "0.04em" }}>
                  Selected Item
                </div>
                <div style={{ padding: "8px 14px", background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "5px", fontFamily: "var(--font-display)", fontSize: "12px", color: "var(--text-muted)", fontWeight: 600, letterSpacing: "0.04em" }}>
                  Unselected
                </div>
                <div style={{ padding: "8px 14px", background: "var(--bg-3)", border: "1px solid var(--border)", borderRadius: "5px", fontFamily: "var(--font-display)", fontSize: "12px", color: "var(--text-secondary)", fontWeight: 600, letterSpacing: "0.04em" }}>
                  Hover
                </div>
              </div>
            </div>
          </section>

          <Divider />

          {/* ─── Typography ─── */}
          <section>
            <SectionHeader>Typography</SectionHeader>

            {/* Font trio */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "28px" }}>
              {[
                {
                  var: "--font-display",
                  name: "Syne",
                  role: "Display",
                  uses: "Page titles, section labels, buttons, nav, headings",
                  sample: "The quick brown fox",
                  style: { fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "16px", letterSpacing: "-0.01em" },
                },
                {
                  var: "--font-mono",
                  name: "IBM Plex Mono",
                  role: "Monospace",
                  uses: "All inputs, paths, data values, metadata, status bar, tags",
                  sample: "/path/to/output",
                  style: { fontFamily: "var(--font-mono)", fontWeight: 400, fontSize: "13px" },
                },
                {
                  var: "--font-body",
                  name: "Newsreader",
                  role: "Body",
                  uses: "Paragraph copy, hints and descriptions, about text",
                  sample: "A hint explaining what the field above expects.",
                  style: { fontFamily: "var(--font-body)", fontStyle: "italic", fontWeight: 400, fontSize: "14px", lineHeight: 1.6 },
                },
              ].map((f) => (
                <div key={f.var} style={{ padding: "16px", background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "7px" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--accent-bright)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "4px" }}>{f.role}</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "2px" }}>{f.name}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--text-muted)", marginBottom: "12px" }}>{f.var}</div>
                  <div style={{ ...f.style, color: "var(--text-primary)", marginBottom: "12px" }}>{f.sample}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontStyle: "italic", fontSize: "11px", color: "var(--text-secondary)", lineHeight: 1.5 }}>{f.uses}</div>
                </div>
              ))}
            </div>

            {/* Type scale */}
            <div className="section-label" style={{ marginBottom: "12px" }}>Type Scale</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {TYPE_SCALE.map((t, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "baseline", gap: "16px",
                  padding: "10px 0",
                  borderBottom: "1px solid var(--border)",
                }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--text-muted)", width: "36px", flexShrink: 0, letterSpacing: "0.04em" }}>{t.size}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--accent-dim)", width: "200px", flexShrink: 0 }}>{t.label}</div>
                  <div style={{
                    fontFamily: t.font, fontSize: t.size, fontWeight: t.weight,
                    letterSpacing: t.tracking, textTransform: t.transform as any,
                    fontStyle: (t as any).italic ? "italic" : "normal",
                    color: "var(--text-primary)", flex: 1, minWidth: 0,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>{t.sample}</div>
                </div>
              ))}
            </div>
          </section>

          <Divider />

          {/* ─── Spacing ─── */}
          <section>
            <SectionHeader>Spacing Reference</SectionHeader>
            <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 20px", alignItems: "center" }}>
              {[
                ["28px", "Page content padding — scrollable area, all four sides"],
                ["20px 28px 16px", "PageHeader padding"],
                ["32px", "Section gap — between <section> blocks"],
                ["20px", "Field gap — margin-bottom between labeled fields"],
                ["8px", "Inline gap — siblings in a row (button + input, etc.)"],
                ["4–6px", "Tight gap — within a component (icon + text)"],
                ["2px", "Nav item gap — between sidebar items"],
                ["10–16px", "Card padding — interior of cards and panels"],
                ["220px", "--sidebar-width — fixed sidebar"],
                ["560–720px", "maxWidth — content area per-page"],
              ].map(([token, desc]) => (
                <div key={token} style={{ display: "contents" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--accent-bright)", whiteSpace: "nowrap" }}>{token}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--text-secondary)", paddingBottom: "4px", borderBottom: "1px solid var(--border)" }}>{desc}</div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
