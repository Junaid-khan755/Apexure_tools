// tools/LogoMarquee/index.jsx
// Extracted from marquee.md — contains everything for the Logo Marquee tool.
// Supabase env vars: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY

import { useState, useRef, useCallback, useMemo } from "react";
import { DEFAULT_LOGO_SETTINGS } from "./settings";
import { generateLogoCode } from "./generator";

const PRESETS = [
  "Unbounce",
  "Webflow",
  "Elementor",
  "Shopify",
  "Framer",
  "Generic HTML",
];

const SPEED_MAP = { Slow: 60, Medium: 35, Fast: 18 };

// ─── Supabase upload ──────────────────────────────────────────────────────────
async function uploadToSupabase({ file, supabaseUrl, supabaseAnonKey }) {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  try {
    const ext = file.name.split(".").pop();
    const baseName = file.name.replace(/\.[^.]+$/, "");
    const fileName = `${baseName}-${Date.now()}.${ext}`;
    const uploadUrl = `${supabaseUrl}/storage/v1/object/logos/${fileName}`;
    const uploadRes = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        "Content-Type": file.type,
        "x-upsert": "false",
      },
      body: file,
    });
    if (!uploadRes.ok) {
      const errorText = await uploadRes.text();
      console.error("Supabase response:", errorText);
      throw new Error(`Upload failed: ${errorText}`);
    }
    return `${supabaseUrl}/storage/v1/object/public/logos/${fileName}`;
  } catch (e) {
    console.error("Supabase upload failed:", e);
    return null;
  }
}

// ─── Image compressor ─────────────────────────────────────────────────────────
// Max 800px height, WebP 0.82 — same as marquee.md
function compressImage(file) {
  return new Promise((resolve) => {
    if (file.type === "image/svg+xml") {
      const r = new FileReader();
      r.onload = (e) =>
        resolve({
          dataUrl: e.target.result,
          sizeKb: Math.round(file.size / 1024),
        });
      r.readAsDataURL(file);
      return;
    }
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = img.height > 120 ? 800 / img.height : 1;
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      c.getContext("2d").drawImage(img, 0, 0, w, h);
      const dataUrl = c.toDataURL("image/webp", 0.82);
      resolve({ dataUrl, sizeKb: Math.round((dataUrl.length * 0.75) / 1024) });
    };
    img.src = url;
  });
}

// ─── UI Primitives ────────────────────────────────────────────────────────────
function Toggle({ value, onChange, label }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 0",
        borderBottom: "1px solid #f0ede8",
      }}
    >
      <span style={{ fontSize: 13, color: "#444" }}>{label}</span>
      <div
        onClick={() => onChange(!value)}
        style={{
          width: 38,
          height: 22,
          borderRadius: 11,
          background: value ? "#1a1a18" : "#ddd",
          cursor: "pointer",
          position: "relative",
          transition: "background 0.2s",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 16,
            height: 16,
            borderRadius: 8,
            background: "#fff",
            position: "absolute",
            top: 3,
            left: value ? 19 : 3,
            transition: "left 0.2s",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
          }}
        />
      </div>
    </div>
  );
}

function Slider({ label, value, min, max, unit, onChange }) {
  return (
    <div style={{ padding: "8px 0", borderBottom: "1px solid #f0ede8" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 5,
        }}
      >
        <span style={{ fontSize: 13, color: "#444" }}>{label}</span>
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#1a1a18",
            fontFamily: "monospace",
          }}
        >
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        style={{ width: "100%", accentColor: "#1a1a18" }}
      />
    </div>
  );
}

function Segment({ options, value, onChange, small }) {
  return (
    <div
      style={{
        display: "flex",
        background: "#f0ede8",
        borderRadius: 8,
        padding: 3,
        gap: 2,
      }}
    >
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          style={{
            flex: 1,
            padding: small ? "4px 0" : "5px 0",
            fontSize: small ? 11 : 12,
            fontWeight: 500,
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            background: value === opt ? "#1a1a18" : "transparent",
            color: value === opt ? "#fff" : "#555",
            transition: "all 0.15s",
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function Label({ children, badge }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 10,
      }}
    >
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#999",
        }}
      >
        {children}
      </span>
      {badge && (
        <span
          style={{
            fontSize: 10,
            background: "#f0ede8",
            color: "#888",
            borderRadius: 4,
            padding: "2px 7px",
            fontWeight: 600,
          }}
        >
          {badge}
        </span>
      )}
    </div>
  );
}

function ColorRow({ label, value, onChange, presets }) {
  const colors = presets || [
    "#ffffff",
    "#f8f9fa",
    "#f1ede4",
    "#1a1a18",
    "#0f172a",
    "#eff6ff",
    "#fdf4ff",
    "#fff7ed",
  ];
  return (
    <div style={{ padding: "8px 0", borderBottom: "1px solid #f0ede8" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 7,
        }}
      >
        <span style={{ fontSize: 13, color: "#444" }}>{label}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 5,
              background: value,
              border: "1px solid #ddd",
            }}
          />
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{
              width: 30,
              height: 22,
              padding: 0,
              border: "1px solid #ddd",
              borderRadius: 5,
              cursor: "pointer",
            }}
          />
        </div>
      </div>
      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
        {colors.map((c) => (
          <button
            key={c}
            onClick={() => onChange(c)}
            title={c}
            style={{
              width: 22,
              height: 22,
              borderRadius: 5,
              background: c,
              border: `2px solid ${value === c ? "#1a1a18" : "#e0ddd8"}`,
              cursor: "pointer",
              padding: 0,
              transition: "border 0.15s",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Logo Card ────────────────────────────────────────────────────────────────
function LogoCard({ logo, onRemove, onRename, grayscale }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(logo.name);
  const commit = () => {
    onRename(logo.id, draft.trim() || logo.name);
    setEditing(false);
  };
  return (
    <div
      style={{
        borderRadius: 10,
        border: "1px solid #e8e6e0",
        background: "#fff",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
      }}
    >
      <img
        src={logo.dataUrl}
        alt={logo.name}
        style={{
          height: 36,
          maxWidth: 72,
          objectFit: "contain",
          filter: grayscale ? "grayscale(1)" : "none",
          opacity: grayscale ? 0.5 : 1,
          flexShrink: 0,
        }}
      />
      {logo.publicUrl && (
        <span
          title="Uploaded to Supabase"
          style={{
            color: "#16a34a",
            fontSize: 14,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          ✓
        </span>
      )}
      {editing ? (
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") setEditing(false);
          }}
          style={{
            flex: 1,
            fontSize: 12,
            padding: "3px 6px",
            borderRadius: 5,
            border: "1px solid #ccc",
            fontFamily: "inherit",
            minWidth: 0,
          }}
        />
      ) : (
        <span
          onClick={() => setEditing(true)}
          title="Click to rename"
          style={{
            fontSize: 12,
            color: "#555",
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            cursor: "text",
          }}
        >
          {logo.name}
        </span>
      )}
      {logo.sizeKb && (
        <span
          style={{
            fontSize: 10,
            fontFamily: "monospace",
            color: "#bbb",
            flexShrink: 0,
          }}
        >
          {logo.sizeKb}kb
        </span>
      )}
      <button
        onClick={() => onRemove(logo.id)}
        style={{
          background: "#f0ede8",
          border: "none",
          borderRadius: 5,
          width: 22,
          height: 22,
          cursor: "pointer",
          fontSize: 11,
          color: "#888",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
        }}
      >
        ✕
      </button>
    </div>
  );
}

// ─── Dropzone ─────────────────────────────────────────────────────────────────
function Dropzone({ onUpload, supabaseUrl, supabaseAnonKey }) {
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef();

  const handle = useCallback(
    async (files) => {
      setBusy(true);
      for (const f of Array.from(files).filter((f) =>
        /image\/(svg\+xml|png|jpeg|webp)/.test(f.type),
      )) {
        const { dataUrl, sizeKb } = await compressImage(f);
        let publicUrl = null;
        if (supabaseUrl && supabaseAnonKey) {
          publicUrl = await uploadToSupabase({
            file: f,
            supabaseUrl,
            supabaseAnonKey,
          });
        }
        const cleanName = f.name
          .replace(/\.[^.]+$/, "")
          .replace(/[-_]/g, " ")
          .replace(/\s+/g, " ")
          .trim();
        onUpload({
          id: `${Date.now()}-${Math.random()}`,
          name: cleanName,
          dataUrl,
          sizeKb,
          publicUrl,
        });
      }
      setBusy(false);
    },
    [onUpload, supabaseUrl, supabaseAnonKey],
  );

  return (
    <div
      onClick={() => !busy && inputRef.current.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handle(e.dataTransfer.files);
      }}
      style={{
        border: `2px dashed ${dragging ? "#1a1a18" : "#ccc"}`,
        borderRadius: 10,
        padding: "20px",
        textAlign: "center",
        cursor: busy ? "wait" : "pointer",
        background: dragging ? "#f5f4f0" : "#faf9f7",
        transition: "all 0.15s",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".svg,.png,.jpg,.jpeg,.webp"
        multiple
        style={{ display: "none" }}
        onChange={(e) => handle(e.target.files)}
      />
      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#1a1a18" }}>
        {busy ? "Compressing…" : "⬆ Drop logos here"}
      </p>
      <p style={{ margin: "3px 0 0", fontSize: 11, color: "#aaa" }}>
        SVG · PNG · JPG · WEBP — auto-compressed
      </p>
    </div>
  );
}

// ─── Logo Live Preview ────────────────────────────────────────────────────────
export function LogoPreview({ logos, settings }) {
  const {
    direction,
    speed,
    customSpeed,
    logoHeight,
    logoSpacing,
    pauseOnHover,
    grayscale,
    fadeEdges,
    bgColor,
    verticalPadding,
  } = settings;
  const dur = speed === "Custom" ? customSpeed : SPEED_MAP[speed];
  const bg = bgColor || "#ffffff";
  const vPad = verticalPadding ?? 20;
  const [hovered, setHovered] = useState(false);
  const anim = direction === "left" ? "lp-left" : "lp-right";
  const [tFrom, tTo] = direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"];
  const kf = `@keyframes ${anim}{from{transform:translateX(${tFrom})}to{transform:translateX(${tTo})}}`;

  if (!logos.length)
    return (
      <div
        style={{
          height: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#bbb",
          fontSize: 13,
          background: bg,
          borderRadius: 10,
          border: "1px solid #ece9e2",
        }}
      >
        Upload logos to see preview
      </div>
    );

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 10,
        background: bg,
        border: "1px solid #ece9e2",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <style>{kf}</style>
      {fadeEdges && (
        <>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 150,
              height: "100%",
              zIndex: 99,
              pointerEvents: "none",
              background: `linear-gradient(to right,${bg} 0%,transparent 100%)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 150,
              height: "100%",
              zIndex: 99,
              pointerEvents: "none",
              background: `linear-gradient(to left,${bg} 0%,transparent 100%)`,
            }}
          />
        </>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "max-content",
          padding: `${vPad}px 0`,
          animation: `${anim} ${dur}s linear infinite`,
          animationPlayState: pauseOnHover && hovered ? "paused" : "running",
        }}
      >
        {[...logos, ...logos].map((l, i) => (
          <img
            key={`${l.id}-${i}`}
            src={l.dataUrl}
            alt={l.name}
            style={{
              height: logoHeight,
              width: "auto",
              objectFit: "contain",
              flexShrink: 0,
              margin: `0 ${logoSpacing}px`,
              filter: grayscale ? "grayscale(1)" : "none",
              opacity: grayscale ? 0.5 : 1,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Code Panel ───────────────────────────────────────────────────────────────
export function LogoCodePanel({ code, logos, settings }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };
  const sizeKb = Math.round(code.length / 1024);
  const previewLines = code.split("\n").filter((l) => {
    const t = l.trim();
    return !t.startsWith("data:") && !t.includes("base64,") && t.length > 0;
  });
  const pills = [
    {
      icon: "🖼",
      label: `${logos.length} logo${logos.length !== 1 ? "s" : ""}`,
    },
    {
      icon: "↔",
      label: settings.direction === "left" ? "Scrolls left" : "Scrolls right",
    },
    {
      icon: "⚡",
      label:
        settings.speed === "Custom"
          ? `${settings.customSpeed}s`
          : settings.speed,
    },
    settings.fadeEdges && { icon: "◑", label: "Fade edges" },
    settings.pauseOnHover && { icon: "⏸", label: "Pause on hover" },
    settings.grayscale && { icon: "◐", label: "Grayscale" },
  ].filter(Boolean);

  return (
    <div>
      <button
        onClick={copy}
        style={{
          width: "100%",
          padding: "13px",
          borderRadius: 10,
          border: "none",
          cursor: "pointer",
          background: copied ? "#16a34a" : "#1a1a18",
          color: "#fff",
          fontSize: 14,
          fontWeight: 700,
          transition: "background 0.25s",
          marginBottom: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        {copied ? "✓ Copied! Now paste into Unbounce" : "Copy Code"}
        {!copied && (
          <span style={{ fontSize: 11, opacity: 0.5, fontWeight: 400 }}>
            {sizeKb}kb
          </span>
        )}
      </button>
      <div
        style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}
      >
        {pills.map(({ icon, label }) => (
          <span
            key={label}
            style={{
              fontSize: 11,
              padding: "4px 9px",
              borderRadius: 20,
              background: "#f0ede8",
              color: "#555",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span style={{ fontSize: 10 }}>{icon}</span>
            {label}
          </span>
        ))}
      </div>
      <div
        style={{
          background: "#faf9f7",
          border: "1px solid #e8e5de",
          borderRadius: 10,
          padding: "12px 14px",
        }}
      >
        <p
          style={{
            margin: "0 0 8px",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#bbb",
          }}
        >
          Code preview
        </p>
        <pre
          style={{
            margin: 0,
            fontSize: 11,
            lineHeight: 1.7,
            color: "#555",
            fontFamily: "'Fira Code','Courier New',monospace",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          <code>{previewLines.join("\n")}</code>
        </pre>
      </div>
      <p
        style={{
          margin: "10px 0 0",
          fontSize: 11,
          color: "#bbb",
          textAlign: "center",
        }}
      >
        Images are embedded — paste into Unbounce Custom HTML and it works
        immediately.
      </p>
    </div>
  );
}

// ─── Logo Sidebar Panel ───────────────────────────────────────────────────────
export function LogoPanel({
  logos,
  settings,
  set,
  addLogo,
  removeLogo,
  renameLogo,
  code,
  tab,
  supabaseUrl,
  supabaseAnonKey,
}) {
  const bp = settings.breakpoint;
  const bpVal = (k) =>
    bp === "desktop" ? settings[k] : (settings[bp]?.[k] ?? settings[k]);
  const setBp = (k, v) =>
    bp === "desktop" ? set(k, v) : set(bp, { ...(settings[bp] || {}), [k]: v });

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
      {tab === "configure" && (
        <>
          <div style={{ marginBottom: 16 }}>
            <Label>Supabase Storage</Label>
            {supabaseUrl ? (
              <p
                style={{
                  margin: 0,
                  fontSize: 11,
                  color: "#16a34a",
                  fontWeight: 500,
                }}
              >
                ✓ Connected via environment variables
              </p>
            ) : (
              <p style={{ margin: 0, fontSize: 11, color: "#f59e0b" }}>
                ⚠ VITE_SUPABASE_URL not set — using base64 fallback
              </p>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <Label badge={logos.length ? `${logos.length} uploaded` : null}>
                Logos
              </Label>
              <Dropzone
                onUpload={addLogo}
                supabaseUrl={supabaseUrl}
                supabaseAnonKey={supabaseAnonKey}
              />
              {logos.length > 0 && (
                <div
                  style={{
                    marginTop: 10,
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  {logos.map((l) => (
                    <LogoCard
                      key={l.id}
                      logo={l}
                      onRemove={removeLogo}
                      onRename={renameLogo}
                      grayscale={settings.grayscale}
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label>Direction</Label>
              <Segment
                options={["left", "right"]}
                value={settings.direction}
                onChange={(v) => set("direction", v)}
              />
            </div>

            <div>
              <Label>Speed</Label>
              <Segment
                options={["Slow", "Medium", "Fast", "Custom"]}
                value={settings.speed}
                onChange={(v) => set("speed", v)}
              />
              {settings.speed === "Custom" && (
                <div style={{ marginTop: 8 }}>
                  <Slider
                    label="Duration"
                    value={settings.customSpeed}
                    min={5}
                    max={120}
                    unit="s"
                    onChange={(v) => set("customSpeed", v)}
                  />
                </div>
              )}
            </div>

            <div>
              <Label>Responsive</Label>
              <Segment
                options={["desktop", "tablet", "mobile"]}
                value={bp}
                onChange={(v) => set("breakpoint", v)}
              />
              <div style={{ marginTop: 10 }}>
                <Slider
                  label="Logo Height"
                  value={bpVal("logoHeight")}
                  min={20}
                  max={800}
                  unit="px"
                  onChange={(v) => setBp("logoHeight", v)}
                />
                <Slider
                  label="Logo Spacing"
                  value={bpVal("logoSpacing")}
                  min={8}
                  max={120}
                  unit="px"
                  onChange={(v) => setBp("logoSpacing", v)}
                />
                {bp !== "desktop" && (
                  <div style={{ marginTop: 8 }}>
                    <Label>{bp} speed</Label>
                    <Segment
                      options={["Slow", "Medium", "Fast"]}
                      value={bpVal("speed")}
                      onChange={(v) => setBp("speed", v)}
                      small
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label>Background & Padding</Label>
              <ColorRow
                label="Background color"
                value={settings.bgColor || "#ffffff"}
                onChange={(v) => set("bgColor", v)}
              />
              <Slider
                label="Vertical padding"
                value={settings.verticalPadding ?? 20}
                min={0}
                max={80}
                unit="px"
                onChange={(v) => set("verticalPadding", v)}
              />
            </div>

            <div>
              <Label>Effects</Label>
              <Toggle
                label="Pause on hover"
                value={settings.pauseOnHover}
                onChange={(v) => set("pauseOnHover", v)}
              />
              <Toggle
                label="Grayscale logos"
                value={settings.grayscale}
                onChange={(v) => set("grayscale", v)}
              />
              <Toggle
                label="Fade edges"
                value={settings.fadeEdges}
                onChange={(v) => set("fadeEdges", v)}
              />
            </div>

            <div>
              <Label>Platform</Label>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    onClick={() => set("platform", p)}
                    style={{
                      textAlign: "left",
                      padding: "7px 12px",
                      borderRadius: 8,
                      border: `1px solid ${settings.platform === p ? "#1a1a18" : "#e8e5de"}`,
                      background: settings.platform === p ? "#1a1a18" : "#fff",
                      color: settings.platform === p ? "#fff" : "#444",
                      fontSize: 13,
                      cursor: "pointer",
                      fontWeight: settings.platform === p ? 600 : 400,
                      transition: "all 0.15s",
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {tab === "code" && (
        <div>
          <Label badge={settings.platform}>Generated Code</Label>
          <LogoCodePanel code={code} logos={logos} settings={settings} />
        </div>
      )}
    </div>
  );
}
