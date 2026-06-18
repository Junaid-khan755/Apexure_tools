// tools/TextMarquee/index.jsx
// Extracted from marquee.md — Google Fonts picker + custom font upload + preview + panel

import { useState, useRef, useCallback, useEffect } from "react";

const SPEED_MAP = { Slow: 60, Medium: 35, Fast: 18 };

const POPULAR_FONTS = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Poppins",
  "Raleway",
  "Nunito",
  "Playfair Display",
  "Merriweather",
  "Source Sans 3",
  "DM Sans",
  "Outfit",
  "Plus Jakarta Sans",
  "Sora",
  "Manrope",
  "Space Grotesk",
  "Urbanist",
  "Cormorant",
  "Libre Baskerville",
];

const PRESETS = [
  "Unbounce",
  "Webflow",
  "Elementor",
  "Shopify",
  "Framer",
  "Generic HTML",
];

// ─── UI Primitives (local copies — same as marquee.md) ───────────────────────
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

// ─── Font Picker ──────────────────────────────────────────────────────────────
// Extracted directly from marquee.md FontPicker component
function FontPicker({ settings, set }) {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const fontInputRef = useRef();

  const filtered = query.trim()
    ? POPULAR_FONTS.filter((f) => f.toLowerCase().includes(query.toLowerCase()))
    : POPULAR_FONTS;

  const handleCustomFont = useCallback(
    async (file) => {
      if (!file) return;
      const ext = file.name.split(".").pop().toLowerCase();
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target.result.split(",")[1];
        const name = file.name
          .replace(/\.[^.]+$/, "")
          .replace(/[-_]/g, " ")
          .trim();
        set("customFontData", base64);
        set("customFontName", name);
        set("customFontExt", ext);
        set("googleFont", false);
      };
      reader.readAsDataURL(file);
    },
    [set],
  );

  return (
    <div>
      <Label>Font</Label>
      <div style={{ marginBottom: 12 }}>
        <Segment
          options={["Google Fonts", "Upload Font"]}
          value={settings.googleFont ? "Google Fonts" : "Upload Font"}
          onChange={(v) => set("googleFont", v === "Google Fonts")}
        />
      </div>

      {settings.googleFont ? (
        <div style={{ position: "relative" }}>
          <div style={{ position: "relative", marginBottom: 8 }}>
            <input
              value={query || settings.fontFamily}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Search Google Fonts…"
              style={{
                width: "100%",
                padding: "7px 10px",
                borderRadius: 7,
                border: "1px solid #ddd",
                fontSize: 13,
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />
            {showDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  background: "#fff",
                  border: "1px solid #e0ddd8",
                  borderRadius: 8,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                  zIndex: 100,
                  maxHeight: 200,
                  overflowY: "auto",
                }}
              >
                {filtered.length === 0 && (
                  <div
                    style={{
                      padding: "10px 12px",
                      fontSize: 12,
                      color: "#aaa",
                    }}
                  >
                    No fonts found
                  </div>
                )}
                {filtered.map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      set("fontFamily", f);
                      setQuery("");
                      setShowDropdown(false);
                    }}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "8px 12px",
                      border: "none",
                      background:
                        settings.fontFamily === f ? "#f0ede8" : "#fff",
                      cursor: "pointer",
                      fontSize: 13,
                      fontFamily: `'${f}',sans-serif`,
                      color: "#333",
                      borderBottom: "1px solid #f5f4f0",
                    }}
                  >
                    {f}
                  </button>
                ))}
                <div
                  style={{
                    padding: "8px 12px",
                    fontSize: 11,
                    color: "#aaa",
                    borderTop: "1px solid #f0ede8",
                  }}
                >
                  Type any Google Font name not listed above
                </div>
              </div>
            )}
          </div>
          {showDropdown && (
            <div
              style={{ position: "fixed", inset: 0, zIndex: 99 }}
              onClick={() => setShowDropdown(false)}
            />
          )}
          <p style={{ margin: "0 0 8px", fontSize: 11, color: "#888" }}>
            Selected:{" "}
            <strong
              style={{ fontFamily: `'${settings.fontFamily}',sans-serif` }}
            >
              {settings.fontFamily}
            </strong>
          </p>
        </div>
      ) : (
        <div>
          <div
            onClick={() => fontInputRef.current.click()}
            style={{
              border: "2px dashed #ccc",
              borderRadius: 8,
              padding: "14px",
              textAlign: "center",
              cursor: "pointer",
              background: "#faf9f7",
              marginBottom: 8,
            }}
          >
            <input
              ref={fontInputRef}
              type="file"
              accept=".ttf,.otf,.woff,.woff2"
              style={{ display: "none" }}
              onChange={(e) => handleCustomFont(e.target.files[0])}
            />
            <p
              style={{
                margin: 0,
                fontSize: 13,
                fontWeight: 600,
                color: "#1a1a18",
              }}
            >
              ⬆ Upload font file
            </p>
            <p style={{ margin: "3px 0 0", fontSize: 11, color: "#aaa" }}>
              TTF · OTF · WOFF · WOFF2
            </p>
          </div>
          {settings.customFontName && (
            <p
              style={{
                margin: 0,
                fontSize: 12,
                color: "#16a34a",
                fontWeight: 500,
              }}
            >
              ✓ {settings.customFontName} loaded
            </p>
          )}
        </div>
      )}

      <div
        style={{
          padding: "8px 0",
          borderBottom: "1px solid #f0ede8",
          marginTop: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 5,
          }}
        >
          <span style={{ fontSize: 13, color: "#444" }}>Font weight</span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#1a1a18",
              fontFamily: "monospace",
            }}
          >
            {settings.fontWeight || 400}
          </span>
        </div>
        <Segment
          options={["300", "400", "500", "600", "700"]}
          value={String(settings.fontWeight || "400")}
          onChange={(v) => set("fontWeight", v)}
          small
        />
      </div>
    </div>
  );
}

// ─── Text Live Preview ────────────────────────────────────────────────────────
export function TextPreview({ settings: s }) {
  const bp = s.breakpoint || "desktop";
  const bpVal = (k) => (bp === "desktop" ? s[k] : (s[bp]?.[k] ?? s[k]));
  const dur =
    bpVal("speed") === "Custom"
      ? bpVal("customSpeed")
      : SPEED_MAP[bpVal("speed")];
  const bg = s.bgColor || "#ffffff";
  const [hovered, setHovered] = useState(false);
  const anim = s.direction === "left" ? "tp-left" : "tp-right";
  const [tFrom, tTo] = s.direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"];
  const kf = `@keyframes ${anim}{from{transform:translateX(${tFrom})}to{transform:translateX(${tTo})}}`;
  const fontFamily = s.googleFont
    ? s.fontFamily
    : s.customFontName || "inherit";

  // Load Google Font into page for live preview
  useEffect(() => {
    if (!s.googleFont || !s.fontFamily) return;
    const id = `gf-${s.fontFamily.replace(/ /g, "-")}`;
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${s.fontFamily.replace(/ /g, "+")}:wght@${s.fontWeight || 400}&display=swap`;
    document.head.appendChild(link);
  }, [s.googleFont, s.fontFamily, s.fontWeight]);

  if (!s.text.trim())
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
        Enter text to see preview
      </div>
    );

  const displayText = s.text.trim().endsWith(s.separator)
    ? s.text.trim()
    : `${s.text.trim()} ${s.separator} `;

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
      {s.fadeEdges && (
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
          padding: `${bpVal("verticalPadding") ?? 20}px 0`,
          animation: `${anim} ${dur}s linear infinite`,
          animationPlayState: s.pauseOnHover && hovered ? "paused" : "running",
        }}
      >
        {[displayText, displayText].map((t, i) => (
          <span
            key={i}
            style={{
              fontFamily: `'${fontFamily}',sans-serif`,
              fontSize: bpVal("fontSize"),
              fontWeight: s.fontWeight || 400,
              color: s.textColor,
              letterSpacing: `${bpVal("letterSpacing")}px`,
              whiteSpace: "nowrap",
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Text Code Panel ──────────────────────────────────────────────────────────
export function TextCodePanel({ code, settings }) {
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
    { icon: "T", label: `${settings.fontSize}px` },
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
    {
      icon: "✦",
      label: settings.googleFont
        ? `Google: ${settings.fontFamily}`
        : `Custom: ${settings.customFontName || "No font"}`,
    },
    settings.fadeEdges && { icon: "◑", label: "Fade edges" },
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
        Paste into Unbounce Custom HTML. Font loads from Google Fonts CDN
        automatically.
      </p>
    </div>
  );
}

// ─── Text Sidebar Panel ───────────────────────────────────────────────────────
export function TextPanel({ settings, set, setBp, code, tab }) {
  const bp = settings.breakpoint || "desktop";
  const bpVal = (k) =>
    bp === "desktop" ? settings[k] : (settings[bp]?.[k] ?? settings[k]);
  const bpSet = (k, v) => (bp === "desktop" ? set(k, v) : setBp(bp, k, v));

  // Speed value for current breakpoint
  const bpSpeed = bpVal("speed");
  const bpCustomSpeed = bpVal("customSpeed");

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
      {tab === "configure" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Global settings — not per breakpoint */}
          <div>
            <Label>Text Content</Label>
            <textarea
              value={settings.text}
              onChange={(e) => set("text", e.target.value)}
              placeholder="Enter scrolling text…"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: 8,
                border: "1px solid #ddd",
                fontSize: 13,
                fontFamily: "inherit",
                resize: "vertical",
                minHeight: 80,
                boxSizing: "border-box",
                lineHeight: 1.5,
              }}
            />
            <p style={{ margin: "4px 0 0", fontSize: 11, color: "#aaa" }}>
              Text repeats automatically to fill the loop.
            </p>
          </div>

          <FontPicker settings={settings} set={set} />

          {/* Global typography — color stays global */}
          <div>
            <Label>Text Color</Label>
            <ColorRow
              label="Text color"
              value={settings.textColor}
              onChange={(v) => set("textColor", v)}
              presets={[
                "#1a1a18",
                "#ffffff",
                "#555555",
                "#888888",
                "#0f172a",
                "#1d4ed8",
                "#dc2626",
                "#16a34a",
              ]}
            />
          </div>

          <div>
            <Label>Direction</Label>
            <Segment
              options={["left", "right"]}
              value={settings.direction}
              onChange={(v) => set("direction", v)}
            />
          </div>

          {/* Background — global */}
          <div>
            <Label>Background</Label>
            <ColorRow
              label="Background color"
              value={settings.bgColor || "#ffffff"}
              onChange={(v) => set("bgColor", v)}
            />
          </div>

          {/* Effects — global */}
          <div>
            <Label>Effects</Label>
            <Toggle
              label="Pause on hover"
              value={settings.pauseOnHover}
              onChange={(v) => set("pauseOnHover", v)}
            />
            <Toggle
              label="Fade edges"
              value={settings.fadeEdges}
              onChange={(v) => set("fadeEdges", v)}
            />
          </div>

          {/* ── Responsive — per breakpoint ── */}
          <div>
            <Label>Responsive</Label>
            <Segment
              options={["desktop", "tablet", "mobile"]}
              value={bp}
              onChange={(v) => set("breakpoint", v)}
            />
            <p style={{ margin: "6px 0 0", fontSize: 10, color: "#bbb" }}>
              Changes below apply to <strong>{bp}</strong> only
            </p>
          </div>

          <div>
            <Label>Font Size</Label>
            <Slider
              label="Font size"
              value={bpVal("fontSize")}
              min={10}
              max={80}
              unit="px"
              onChange={(v) => bpSet("fontSize", v)}
            />
            <Slider
              label="Letter spacing"
              value={bpVal("letterSpacing")}
              min={-2}
              max={20}
              unit="px"
              onChange={(v) => bpSet("letterSpacing", v)}
            />
            <Slider
              label="Vertical padding"
              value={bpVal("verticalPadding") ?? 20}
              min={0}
              max={80}
              unit="px"
              onChange={(v) => bpSet("verticalPadding", v)}
            />
          </div>

          <div>
            <Label>Speed</Label>
            <Segment
              options={["Slow", "Medium", "Fast", "Custom"]}
              value={bpVal("speed")}
              onChange={(v) => bpSet("speed", v)}
            />
            {bpSpeed === "Custom" && (
              <div style={{ marginTop: 8 }}>
                <Slider
                  label="Duration"
                  value={bpCustomSpeed}
                  min={5}
                  max={120}
                  unit="s"
                  onChange={(v) => bpSet("customSpeed", v)}
                />
              </div>
            )}
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
      )}

      {tab === "code" && (
        <div>
          <Label badge={settings.platform}>Generated Code</Label>
          <TextCodePanel code={code} settings={settings} />
        </div>
      )}
    </div>
  );
}

// ─── Hook for parent App to use ───────────────────────────────────────────────
// export function useTextMarquee() {
//   const [textSettings, setTextSettings] = useState(DEFAULT_TEXT_SETTINGS);
//   const set = useCallback((k, v) => setTextSettings((s) => ({ ...s, [k]: v })), []);
//   const textCode = useMemo(() => generateTextCode(textSettings), [textSettings]);
//   return { textSettings, textCode, set };
// }
