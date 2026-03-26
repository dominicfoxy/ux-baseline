import { useState, useRef, useEffect } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { FolderOpen, RefreshCw, ChevronDown, X, Check, Zap, Trash2, Plus } from "lucide-react";
import PageHeader from "../components/PageHeader";

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

// ─── SelectGrid (used in sampler/scheduler pickers) ──────────────────────────
function SelectGrid({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <div className="section-label" style={{ marginBottom: "8px" }}>{label}</div>
      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
        {options.map((opt) => (
          <button key={opt} onClick={() => onChange(opt)} style={{
            padding: "4px 10px", fontSize: "11px", fontFamily: "var(--font-mono)",
            background: value === opt ? "var(--accent-glow)" : "var(--bg-3)",
            border: `1px solid ${value === opt ? "var(--accent-dim)" : "var(--border)"}`,
            color: value === opt ? "var(--accent-bright)" : "var(--text-muted)",
            borderRadius: "3px", cursor: "pointer",
            letterSpacing: 0, textTransform: "none", fontWeight: value === opt ? 600 : 400,
            transition: "all 0.1s",
          }}>{opt}</button>
        ))}
      </div>
    </div>
  );
}

// ─── SliderField ─────────────────────────────────────────────────────────────
function SliderField({ label, value, onChange, min, max, step, hint }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number; step: number; hint?: string }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px" }}>
        <div className="section-label">{label}</div>
        <input type="number" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || min)}
          style={{ width: "72px", textAlign: "right" }}
        />
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: "100%", accentColor: "var(--accent)" }}
      />
      {hint && <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--text-muted)", marginTop: "3px" }}>{hint}</div>}
    </div>
  );
}

// ─── Custom Dropdown ─────────────────────────────────────────────────────────
const MODEL_OPTIONS = [
  "illustriousXL_v01.safetensors",
  "ponyDiffusionV6XL_v6StartWithThisOne.safetensors",
  "noobaiXLNAIXL_epsilonPred10Version.safetensors",
  "animagineXL40_v40.safetensors",
  "sd_xl_base_1.0.safetensors",
  "v1-5-pruned-emaonly.safetensors",
];

function Dropdown({ label }: { label: string }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [filter, setFilter] = useState("");
  const [focusedIdx, setFocusedIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = MODEL_OPTIONS.filter((m) => m.toLowerCase().includes(filter.toLowerCase()));

  // Reset focus to top whenever filter changes
  useEffect(() => { setFocusedIdx(0); }, [filter]);

  // Scroll focused item into view
  useEffect(() => {
    if (!listRef.current || !open) return;
    const item = listRef.current.children[focusedIdx] as HTMLElement | undefined;
    item?.scrollIntoView({ block: "nearest" });
  }, [focusedIdx, open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { setOpen(false); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setFocusedIdx((i) => Math.min(i + 1, filtered.length - 1)); return; }
    if (e.key === "ArrowUp")   { e.preventDefault(); setFocusedIdx((i) => Math.max(i - 1, 0)); return; }
    if (e.key === "Enter" && filtered[focusedIdx]) {
      setValue(filtered[focusedIdx]);
      setOpen(false);
      setFilter("");
    }
  };

  const select = (m: string) => { setValue(m); setOpen(false); setFilter(""); };

  return (
    <div>
      <div className="section-label" style={{ marginBottom: "6px" }}>{label}</div>
      <div ref={containerRef} style={{ position: "relative", maxWidth: "360px" }}>
        <div onClick={() => { setOpen(!open); setFocusedIdx(0); }} style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "6px 10px", background: "var(--bg-1)",
          border: `1px solid ${open ? "var(--accent-dim)" : "var(--border)"}`,
          borderRadius: "4px", cursor: "pointer",
          fontFamily: "var(--font-mono)", fontSize: "14px",
          color: value ? "var(--text-primary)" : "var(--text-muted)", userSelect: "none",
          transition: "border-color 0.15s",
        }}>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {value || "— select checkpoint —"}
          </span>
          <ChevronDown size={13} color="var(--text-muted)" style={{ flexShrink: 0, marginLeft: "8px" }} />
        </div>
        {open && (
          <div style={{
            position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 200,
            background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "6px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}>
            <div style={{ padding: "6px 6px 4px" }}>
              <input autoFocus style={{ width: "100%", fontSize: "11px" }} placeholder="filter…"
                value={filter} onChange={(e) => setFilter(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div ref={listRef} style={{ maxHeight: "200px", overflowY: "auto" }}>
              {filtered.length === 0
                ? <div style={{ padding: "8px 12px", fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-muted)" }}>No matches</div>
                : filtered.map((m, i) => (
                  <div key={m} onClick={() => select(m)}
                    onMouseEnter={() => setFocusedIdx(i)}
                    style={{
                      padding: "7px 12px", fontFamily: "var(--font-mono)", fontSize: "11px",
                      color: m === value ? "var(--accent-bright)" : "var(--text-secondary)",
                      background: m === value ? "var(--accent-glow)" : i === focusedIdx ? "var(--bg-3)" : "transparent",
                      borderBottom: "1px solid var(--border)", cursor: "pointer",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      transition: "background 0.1s",
                    }}
                  >{m}</div>
                ))
              }
            </div>
          </div>
        )}
      </div>
      {value && (
        <div style={{ marginTop: "6px", display: "flex", gap: "6px", alignItems: "center" }}>
          <span className="tag" style={{ background: "var(--accent-glow)", border: "1px solid var(--accent-dim)", color: "var(--accent-bright)" }}>{value}</span>
          <button onClick={() => setValue("")} style={{ background: "none", border: "none", padding: "2px", cursor: "pointer", color: "var(--text-muted)", display: "flex", alignItems: "center" }}>
            <X size={11} />
          </button>
        </div>
      )}
    </div>
  );
}

// ─── page ────────────────────────────────────────────────────────────────────
export default function ComponentsPage() {
  const [sampler, setSampler] = useState("DPM++ 2M");
  const [steps, setSteps] = useState(20);
  const [cfg, setCfg] = useState(7.0);
  const [dirFieldValue, setDirFieldValue] = useState("");
  const [_loadingState, _setLoadingState] = useState<"idle" | "loading">("idle");

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <PageHeader title="Components" subtitle="Every reusable UI element — interactive demos, all driven by CSS variables" />

      <div style={{ flex: 1, overflow: "auto", padding: "28px" }}>
        <div style={{ maxWidth: "720px", display: "flex", flexDirection: "column", gap: "36px" }}>

          {/* ─── Buttons ─── */}
          <section>
            <SectionHeader>Buttons</SectionHeader>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

              <div>
                <div className="section-label">Variants</div>
                <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                  <button className="btn-primary">Primary Action</button>
                  <button className="btn-ghost">Ghost Button</button>
                  <button className="btn-danger">Danger Action</button>
                </div>
              </div>

              <div>
                <div className="section-label">With Icons</div>
                <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                  <button className="btn-primary">
                    <Zap size={12} style={{ display: "inline", marginRight: "6px", verticalAlign: "middle" }} />
                    Generate
                  </button>
                  <button className="btn-ghost">
                    <FolderOpen size={12} style={{ display: "inline", marginRight: "6px", verticalAlign: "middle" }} />
                    Browse
                  </button>
                  <button className="btn-ghost">
                    <RefreshCw size={12} style={{ display: "inline", marginRight: "6px", verticalAlign: "middle" }} />
                    Fetch
                  </button>
                  <button className="btn-danger">
                    <Trash2 size={12} style={{ display: "inline", marginRight: "6px", verticalAlign: "middle" }} />
                    Delete
                  </button>
                </div>
              </div>

              <div>
                <div className="section-label">Small Inline (reduced padding)</div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <button className="btn-primary" style={{ padding: "5px 12px", fontSize: "11px" }}>Save</button>
                  <button className="btn-ghost" style={{ padding: "5px 12px", fontSize: "11px" }}>Cancel</button>
                  <button className="btn-danger" style={{ padding: "5px 12px", fontSize: "11px" }}>Remove</button>
                  <button className="btn-ghost" style={{ padding: "4px 8px", fontSize: "11px", color: "var(--text-muted)", display: "flex", alignItems: "center" }}>
                    <Plus size={11} />
                  </button>
                </div>
              </div>

              <div>
                <div className="section-label">Disabled State</div>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <button className="btn-primary" disabled>Primary Disabled</button>
                  <button className="btn-ghost" disabled>Ghost Disabled</button>
                  <button className="btn-danger" disabled>Danger Disabled</button>
                </div>
                <div style={{ fontFamily: "var(--font-body)", fontStyle: "italic", fontSize: "11px", color: "var(--text-secondary)", marginTop: "6px" }}>
                  Buttons disabled via <code style={{ fontFamily: "var(--font-mono)", fontSize: "10px", background: "var(--bg-3)", padding: "1px 5px", borderRadius: "3px" }}>disabled</code> prop — always prefer this over removing buttons entirely.
                </div>
              </div>

              <div>
                <div className="section-label">Icon-Only (clear semantic role)</div>
                <div style={{ display: "flex", gap: "8px" }}>
                  {[
                    { icon: <X size={13} />, title: "Remove" },
                    { icon: <Check size={13} />, title: "Approve" },
                    { icon: <Plus size={13} />, title: "Add" },
                    { icon: <RefreshCw size={13} />, title: "Refresh" },
                    { icon: <Trash2 size={13} />, title: "Delete" },
                  ].map(({ icon, title }) => (
                    <button key={title} title={title} style={{
                      background: "none", border: "1px solid var(--border)",
                      borderRadius: "4px", padding: "6px", cursor: "pointer",
                      color: "var(--text-muted)", display: "flex", alignItems: "center",
                      transition: "all 0.15s",
                    }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent-dim)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--accent-bright)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)"; }}
                    >{icon}</button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <Divider />

          {/* ─── Inputs ─── */}
          <section>
            <SectionHeader>Inputs & Controls</SectionHeader>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <div className="section-label">Text Input</div>
                  <input style={{ width: "100%" }} placeholder="placeholder text in --text-muted" />
                  <div style={{ fontFamily: "var(--font-body)", fontStyle: "italic", fontSize: "11px", color: "var(--text-secondary)", marginTop: "4px" }}>bg-1 background, border → accent-dim on focus</div>
                </div>
                <div>
                  <div className="section-label">Disabled Input</div>
                  <input style={{ width: "100%" }} value="disabled value — not editable" disabled />
                </div>
              </div>

              <div>
                <div className="section-label">With Browse Button (DirField pattern)</div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input style={{ flex: 1 }} placeholder="/home/user/output/directory" value={dirFieldValue} onChange={(e) => setDirFieldValue(e.target.value)} />
                  <button className="btn-ghost" style={{ flexShrink: 0 }} onClick={async () => {
                    const selected = await open({ directory: true, multiple: false });
                    if (selected) setDirFieldValue(selected as string);
                  }}>
                    <FolderOpen size={13} style={{ display: "inline", marginRight: "5px", verticalAlign: "middle" }} />Browse
                  </button>
                </div>
                <div style={{ fontFamily: "var(--font-body)", fontStyle: "italic", fontSize: "11px", color: "var(--text-secondary)", marginTop: "4px" }}>
                  Browse opens the native folder picker via <code style={{ fontFamily: "var(--font-mono)", fontSize: "10px", background: "var(--bg-3)", padding: "1px 5px", borderRadius: "3px" }}>@tauri-apps/plugin-dialog</code> — never a file input
                </div>
              </div>

              <div>
                <div className="section-label">Textarea</div>
                <textarea style={{ width: "100%", minHeight: "80px", resize: "vertical" }}
                  placeholder="anthro, red fox, female, orange fur, white chest, amber eyes, fluffy tail, pointed ears"
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <div className="section-label">Password Field</div>
                  <input type="password" style={{ width: "100%" }} placeholder="rp_xxxxxxxxxxxx" />
                </div>
                <div>
                  <div className="section-label">Number Field</div>
                  <input type="number" style={{ width: "100%" }} defaultValue={1500} min={100} max={5000} step={100} />
                </div>
              </div>
            </div>
          </section>

          <Divider />

          {/* ─── SelectGrid + Slider ─── */}
          <section>
            <SectionHeader>Select Grid & Slider</SectionHeader>
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <SelectGrid
                label="Sampler (SelectGrid)"
                options={["Euler", "Euler a", "DPM++ 2M", "DPM++ 2M SDE", "DPM++ 3M SDE", "DDIM", "UniPC"]}
                value={sampler}
                onChange={setSampler}
              />
              <div style={{ fontFamily: "var(--font-body)", fontStyle: "italic", fontSize: "11px", color: "var(--text-secondary)", marginTop: "-16px" }}>
                Replaces <code style={{ fontFamily: "var(--font-mono)", fontSize: "10px", background: "var(--bg-3)", padding: "1px 5px", borderRadius: "3px" }}>&lt;select&gt;</code> for finite option sets. Mono font, no uppercase, no letter-spacing — data values, not actions.
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                <SliderField label="Steps" value={steps} onChange={(v) => setSteps(Math.round(v))} min={1} max={150} step={1}
                  hint="20–30 is typical. Euler a / DDIM may need 50+." />
                <SliderField label="CFG Scale" value={cfg} onChange={setCfg} min={1} max={20} step={0.5}
                  hint="5–9 for SDXL/Illustrious, 7 for SD1.5." />
              </div>

              <div style={{ padding: "10px 14px", background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "5px", fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-secondary)" }}>
                <span style={{ color: "var(--text-muted)" }}>Active: </span>
                {sampler} · {steps} steps · CFG {cfg}
              </div>
            </div>
          </section>

          <Divider />

          {/* ─── Dropdown ─── */}
          <section>
            <SectionHeader>Custom Dropdown (Combobox)</SectionHeader>
            <Dropdown label="Base Checkpoint" />
            <div style={{ fontFamily: "var(--font-body)", fontStyle: "italic", fontSize: "11px", color: "var(--text-secondary)", marginTop: "8px" }}>
              Built from scratch — trigger div + absolute panel with filter input. Autofocus on open, Escape closes, hover uses bg-3, selected uses accent-glow.
            </div>
          </section>

          <Divider />

          {/* ─── Tags & Labels ─── */}
          <section>
            <SectionHeader>Tags & Labels</SectionHeader>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

              <div>
                <div className="section-label">Tags (.tag class)</div>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "4px" }}>
                  {["trigger_word", "safetensors", "SDXL", "LoRA", "fp16", "kohya", "768px"].map((t) => (
                    <span key={t} className="tag">{t}</span>
                  ))}
                  <span className="tag" style={{ background: "var(--accent-glow)", border: "1px solid var(--accent-dim)", color: "var(--accent-bright)" }}>active tag</span>
                  <span className="tag" style={{ background: "var(--green-dim)", border: "1px solid var(--green)", color: "var(--green)" }}>approved</span>
                  <span className="tag" style={{ background: "var(--red-dim)", border: "1px solid var(--red)", color: "#d47070" }}>rejected</span>
                </div>
              </div>

              <div>
                <div className="section-label">Section Labels (.section-label class)</div>
                <div style={{ padding: "12px 14px", background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "5px" }}>
                  <div className="section-label">This is a section label</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "var(--text-secondary)" }}>Content beneath the label.</div>
                </div>
                <div style={{ fontFamily: "var(--font-body)", fontStyle: "italic", fontSize: "11px", color: "var(--text-secondary)", marginTop: "6px" }}>
                  Display 700, 13px, uppercase, 0.06em tracking, text-secondary color.
                </div>
              </div>

              <div>
                <div className="section-label">Cards</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {[
                    { title: "Unselected Card", path: "/home/user/projects/example", active: false },
                    { title: "Active / Selected Card", path: "/home/user/projects/active", active: true },
                  ].map((card) => (
                    <div key={card.title} style={{
                      display: "flex", alignItems: "center", gap: "12px",
                      padding: "10px 14px",
                      background: card.active ? "var(--accent-glow)" : "var(--bg-2)",
                      border: `1px solid ${card.active ? "var(--accent-dim)" : "var(--border)"}`,
                      borderRadius: "6px",
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: "var(--font-display)", fontSize: "13px", fontWeight: 700, color: card.active ? "var(--accent-bright)" : "var(--text-primary)" }}>{card.title}</div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-muted)", marginTop: "2px" }}>{card.path}</div>
                      </div>
                      {card.active && <span className="tag" style={{ background: "var(--accent-glow)", border: "1px solid var(--accent-dim)", color: "var(--accent-bright)", flexShrink: 0 }}>active</span>}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
