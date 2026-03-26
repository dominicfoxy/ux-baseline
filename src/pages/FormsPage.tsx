import { useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { FolderOpen, Save, Zap } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { useStore } from "../store";

// ─── Field wrapper ────────────────────────────────────────────────────────────
function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <div className="section-label">
        {label}
        {required && <span style={{ color: "var(--accent)", marginLeft: "4px", fontWeight: 400, letterSpacing: 0, textTransform: "none", fontSize: "12px" }}>*</span>}
      </div>
      {hint && (
        <div style={{ fontFamily: "var(--font-body)", fontStyle: "italic", fontSize: "14px", color: "var(--text-secondary)", marginBottom: "6px" }}>
          {hint}
        </div>
      )}
      {children}
    </div>
  );
}

// ─── DirField ─────────────────────────────────────────────────────────────────
function DirField({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  const pick = async () => {
    const selected = await open({ directory: true, multiple: false });
    if (selected) onChange(selected as string);
  };
  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <input style={{ flex: 1 }} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
      <button className="btn-ghost" onClick={pick} style={{ flexShrink: 0 }}>
        <FolderOpen size={13} style={{ display: "inline", marginRight: "5px", verticalAlign: "middle" }} />Browse
      </button>
    </div>
  );
}

// ─── SelectGrid ───────────────────────────────────────────────────────────────
function SelectGrid({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
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
  );
}

// ─── SliderField ──────────────────────────────────────────────────────────────
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

// ─── page ─────────────────────────────────────────────────────────────────────
export default function FormsPage() {
  const { settings } = useStore();
  const ezMode = settings.ezMode;

  // Form state — some pre-filled (smart defaults), some empty (require user input)
  const [name, setName] = useState("");
  const [outputDir, setOutputDir] = useState("");
  const [endpoint, setEndpoint] = useState("http://localhost:7860");   // smart default
  const [steps, setSteps] = useState(20);                              // smart default
  const [sampler, setSampler] = useState("DPM++ 2M");                  // smart default
  const [cfg, setCfg] = useState(7.0);                                 // smart default
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = name.trim().length > 0 && outputDir.length > 0;

  const handleNameChange = (v: string) => {
    setName(v);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
  };

  const advancedFieldsStyle = {
    opacity: ezMode ? 0.45 : 1,
    pointerEvents: ezMode ? "none" : "auto",
    transition: "opacity 0.25s",
  } as React.CSSProperties;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <PageHeader
        title="Form Patterns"
        subtitle="Smart defaults, Field wrappers, and EZ Mode — the three pillars of idiot-proof forms"
        actions={
          <button className="btn-primary" onClick={handleSubmit} disabled={!canSubmit}>
            <Save size={12} style={{ display: "inline", marginRight: "6px", verticalAlign: "middle" }} />
            Create Project
          </button>
        }
      />

      {/* EZ Mode banner */}
      {ezMode && (
        <div style={{
          padding: "10px 28px", flexShrink: 0,
          background: "var(--accent-glow)", borderBottom: "1px solid var(--accent-dim)",
          display: "flex", alignItems: "center", gap: "16px",
        }}>
          <Zap size={13} color="var(--accent-bright)" style={{ flexShrink: 0 }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--accent-bright)", flex: 1 }}>
            ⚡ EZ Mode active — optimal defaults applied. Advanced fields are locked. Disable EZ Mode in the sidebar to configure manually.
          </span>
        </div>
      )}

      {/* Success banner */}
      {submitted && (
        <div style={{
          padding: "10px 28px", flexShrink: 0,
          background: "var(--green-dim)", borderBottom: "1px solid var(--green)",
          display: "flex", alignItems: "center",
        }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--green)" }}>
            ✓ Project created successfully.
          </span>
        </div>
      )}

      <div style={{ flex: 1, overflow: "auto", padding: "28px" }}>
        <div style={{ maxWidth: "680px" }}>

          {/* Explanation */}
          <div style={{ padding: "14px 18px", background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "7px", marginBottom: "28px" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "12px", fontWeight: 700, letterSpacing: "0.05em", color: "var(--text-secondary)", textTransform: "uppercase", marginBottom: "6px" }}>Convention</div>
            <ul style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.9, paddingLeft: "16px", margin: 0 }}>
              <li><strong style={{ color: "var(--text-primary)" }}>Smart defaults:</strong> Pre-fill every field that has a reasonable "good enough" value.</li>
              <li><strong style={{ color: "var(--text-primary)" }}>Empty with hint:</strong> Fields that can't be guessed stay empty — the hint tells the user exactly what to do.</li>
              <li><strong style={{ color: "var(--text-primary)" }}>Disable, don't validate:</strong> The action button is disabled until required fields are filled. No error messages, no submit-time validation.</li>
              <li><strong style={{ color: "var(--text-primary)" }}>EZ Mode:</strong> Locks advanced fields and shows "Recommended settings applied" — toggle it in the sidebar.</li>
            </ul>
          </div>

          {/* Form */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 32px" }}>

            {/* Required — empty, user must fill */}
            <div style={{ gridColumn: "1 / -1" }}>
              <Field label="Project Name" hint="Give this project a unique, human-readable name." required>
                <input style={{ width: "100%" }}
                  placeholder="e.g. Sable Foxworth Character LoRA"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                />
              </Field>
            </div>

            {/* Required — empty, user must fill */}
            <div style={{ gridColumn: "1 / -1" }}>
              <Field label="Output Directory" hint="Where generated images and captions will be saved. Click Browse to open the native folder picker." required>
                <DirField value={outputDir} onChange={setOutputDir} placeholder="/home/user/datasets/my-project" />
              </Field>
            </div>

            {/* Smart default — pre-filled */}
            <div style={{ gridColumn: "1 / -1", ...advancedFieldsStyle }}>
              <Field label="API Endpoint" hint={ezMode ? "Locked in EZ Mode — change in Settings." : "URL of your local generation service. Default works for a standard Forge/A1111 install."}>
                <input style={{ width: "100%" }} value={endpoint} onChange={(e) => setEndpoint(e.target.value)} />
              </Field>
            </div>

            {/* Advanced — smart defaults, locked in EZ mode */}
            <div style={advancedFieldsStyle}>
              <Field label="Steps" hint={ezMode ? undefined : "20–30 is typical for DPM++ samplers."}>
                <SliderField label="Steps" value={steps} onChange={(v) => setSteps(Math.round(v))} min={1} max={150} step={1} />
              </Field>
            </div>

            <div style={advancedFieldsStyle}>
              <Field label="CFG Scale" hint={ezMode ? undefined : "5–9 for SDXL/Illustrious. 7 for SD1.5."}>
                <SliderField label="CFG Scale" value={cfg} onChange={setCfg} min={1} max={20} step={0.5} />
              </Field>
            </div>

            <div style={{ gridColumn: "1 / -1", ...advancedFieldsStyle }}>
              <Field label="Sampler" hint={ezMode ? undefined : "DPM++ 2M is a solid general-purpose default."}>
                <SelectGrid
                  options={["Euler", "DPM++ 2M", "DPM++ 2M SDE", "DPM++ 3M SDE", "DDIM", "UniPC"]}
                  value={sampler}
                  onChange={setSampler}
                />
              </Field>
            </div>

          </div>

          {/* EZ Mode summary card — replaces locked fields */}
          {ezMode && (
            <div style={{ padding: "14px 16px", background: "var(--accent-glow)", border: "1px solid var(--accent-dim)", borderRadius: "6px", marginTop: "4px" }}>
              <div className="section-label" style={{ color: "var(--accent-bright)", marginBottom: "6px" }}>Recommended Settings Applied</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--accent-bright)", lineHeight: 1.9 }}>
                {sampler} · {steps} steps · CFG {cfg}<br />
                API: {endpoint}
              </div>
            </div>
          )}

          {/* Disabled button explanation */}
          {!canSubmit && (
            <div style={{ marginTop: "20px", padding: "10px 14px", background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "5px", fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-muted)" }}>
              "Create Project" button is disabled until <strong style={{ color: "var(--text-secondary)" }}>Project Name</strong> and <strong style={{ color: "var(--text-secondary)" }}>Output Directory</strong> are filled.
              No validation messages — just disable the action.
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
