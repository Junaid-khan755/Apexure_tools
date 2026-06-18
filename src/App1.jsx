// App.jsx — Marquee UI shell, wires all 4 tools together
// Tools are proper React components. App uses refs/context to get their code output.
import { useState, useCallback } from "react";
import { PRESETS } from "./shared/constants";
import CodePanel from "./shared/CodePanel";

// ── Tool components ───────────────────────────────────────────────────────────
import { UseLogoMarquee } from "./tools/LogoMarquee/useLogoMarquee";
import { UseTextMarquee } from "./tools/TextMarquee/useTextMarquee";
import { LogoPanel, LogoPreview, LogoCodePanel } from "./tools/LogoMarquee/index";
import { TextPanel, TextPreview, TextCodePanel } from "./tools/TextMarquee/index";
import FAQ from "./tools/FAQ/index";
import Testimonials from "./tools/Testimonials/index";

const MODES = [
  { id: "logo", label: "🖼 Logo Marquee" },
  { id: "text", label: "T  Text Marquee" },
  { id: "faq", label: "❓ FAQ" },
  { id: "testimonial", label: "💬 Testimonials" },
];

// Sidebar tabs per mode
const SIDE_TABS = {
  logo: [{ id: "configure", label: "Configure" }],
  text: [{ id: "configure", label: "Configure" }],
  faq: [
    { id: "style", label: "Style" },
    { id: "content", label: "Content" },
    { id: "fonts", label: "+ Fonts" },
  ],
  testimonial: [
    { id: "style", label: "Style" },
    { id: "content", label: "Content" },
    { id: "fonts", label: "+ Fonts" },
  ],
};

export default function App() {
  const [mode, setMode] = useState("logo");
  const [sideTab, setSideTab] = useState("configure");
  const [platform, setPlatform] = useState("Unbounce");
  const [platOpen, setPlatOpen] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  // Code is lifted up from whichever tool is active
  const [code, setCode] = useState({ custom: "", css: "", html: "", js: "" });

  const switchMode = (m) => {
    setMode(m);
    setSideTab(SIDE_TABS[m][0].id);
    setCode({ custom: "", css: "", html: "", js: "" });
  };

  const copyCode = useCallback(() => {
    const content = code?.custom || "";
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }, [code]);

  const tabs = SIDE_TABS[mode];

  // Shared props every tool receives
  const toolProps = { platform, sideTab, onCodeChange: setCode };

  return (
    <div
      style={{
        fontFamily: "'DM Sans',sans-serif",
        minHeight: "100vh",
        background: "#faf9f7",
        color: "#1a1a18",
        fontSize: 14,
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* ── Top bar ── */}
      <div
        style={{
          height: 52,
          borderBottom: "1px solid #e8e5de",
          background: "#fff",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          gap: 8,
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            width: 26,
            height: 26,
            background: "#1a1a18",
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          S
        </div>
        <span
          style={{
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: "-0.02em",
            marginRight: 8,
          }}
        >
          Scroll Builder
        </span>

        {/* Mode switcher */}
        <div
          style={{
            display: "flex",
            background: "#f0ede8",
            borderRadius: 9,
            padding: 3,
            gap: 2,
          }}
        >
          {MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => switchMode(m.id)}
              style={{
                padding: "5px 13px",
                fontSize: 12,
                fontWeight: 600,
                borderRadius: 7,
                border: "none",
                cursor: "pointer",
                fontFamily: "'DM Sans',sans-serif",
                background: mode === m.id ? "#1a1a18" : "transparent",
                color: mode === m.id ? "#fff" : "#666",
                transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div style={{ flex: 1 }} />

        {/* Platform picker */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setPlatOpen((o) => !o)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 12px",
              borderRadius: 7,
              fontSize: 12,
              cursor: "pointer",
              border: "1px solid #e0ddd8",
              background: "#fff",
              color: "#444",
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            {platform} <span style={{ fontSize: 9, color: "#aaa" }}>▾</span>
          </button>
          {platOpen && (
            <>
              <div
                style={{ position: "fixed", inset: 0, zIndex: 99 }}
                onClick={() => setPlatOpen(false)}
              />
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 6px)",
                  background: "#fff",
                  border: "1px solid #e0ddd8",
                  borderRadius: 9,
                  padding: 4,
                  zIndex: 200,
                  minWidth: 150,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                }}
              >
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setPlatform(p);
                      setPlatOpen(false);
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "7px 12px",
                      fontSize: 12,
                      borderRadius: 6,
                      border: "none",
                      cursor: "pointer",
                      background: platform === p ? "#f0ede8" : "transparent",
                      color: platform === p ? "#1a1a18" : "#555",
                      fontFamily: "'DM Sans',sans-serif",
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <button
          onClick={copyCode}
          style={{
            padding: "6px 16px",
            borderRadius: 7,
            border: "none",
            background: copied ? "#16a34a" : "#1a1a18",
            color: "#fff",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'DM Sans',sans-serif",
            transition: "background 0.2s",
          }}
        >
          {copied ? "✓ Copied!" : "Copy Code"}
        </button>

        <button
          onClick={() => setShowCode((o) => !o)}
          style={{
            padding: "6px 12px",
            borderRadius: 7,
            fontSize: 12,
            cursor: "pointer",
            border: `1px solid ${showCode ? "#1a1a18" : "#e0ddd8"}`,
            background: showCode ? "#1a1a18" : "#fff",
            color: showCode ? "#fff" : "#666",
            fontFamily: "'DM Sans',sans-serif",
            fontWeight: 500,
            transition: "all 0.15s",
          }}
        >
          {showCode ? "Hide Code" : "</> Code"}
        </button>
      </div>

      {/* ── Body ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `300px 1fr${showCode ? " 300px" : ""}`,
          height: "calc(100vh - 52px)",
          overflow: "hidden",
        }}
      >
        {/* ── Left sidebar ── */}
        <div
          style={{
            borderRight: "1px solid #e8e5de",
            background: "#fff",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            minHeight: 0,
          }}
        >
          {tabs.length > 1 && (
            <div
              style={{
                display: "flex",
                borderBottom: "1px solid #e8e5de",
                flexShrink: 0,
              }}
            >
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSideTab(t.id)}
                  style={{
                    flex: 1,
                    padding: "10px 4px",
                    fontSize: 12,
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    background: "#fff",
                    color: sideTab === t.id ? "#1a1a18" : "#bbb",
                    borderBottom: `2px solid ${sideTab === t.id ? "#1a1a18" : "transparent"}`,
                    fontFamily: "'DM Sans',sans-serif",
                    transition: "color 0.15s",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}
          {/* Tool sidebar panels rendered here via the active tool's SidebarSlot */}
          <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
            {mode === "logo" && <LogoMarquee.Sidebar {...toolProps} />}
            {mode === "text" && <TextMarquee.Sidebar {...toolProps} />}
            {mode === "faq" && <FAQ.Sidebar {...toolProps} />}
            {mode === "testimonial" && <Testimonials.Sidebar {...toolProps} />}
          </div>
        </div>

        {/* ── Main canvas ── */}
        <div
          style={{
            overflowY: "auto",
            overflowX: "hidden",
            padding: 28,
            display: "flex",
            flexDirection: "column",
            gap: 20,
            minHeight: 0,
            background: "#faf9f7",
          }}
        >
          {/* Preview card */}
          <div
            style={{
              background: "#fff",
              borderRadius: 14,
              border: "1px solid #e8e5de",
            }}
          >
            <div
              style={{
                padding: "13px 20px",
                borderBottom: "1px solid #f0ede8",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  color: "#bbb",
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                Live Preview
              </span>
              <span
                style={{
                  fontSize: 11,
                  background: "#f0ede8",
                  color: "#888",
                  borderRadius: 5,
                  padding: "3px 9px",
                  fontFamily: "monospace",
                }}
              >
                {platform}
              </span>
            </div>
            <div style={{ padding: 24 }}>
              {mode === "logo" && <LogoMarquee.Preview {...toolProps} />}
              {mode === "text" && <TextMarquee.Preview {...toolProps} />}
              {mode === "faq" && <FAQ.Preview {...toolProps} />}
              {mode === "testimonial" && (
                <Testimonials.Preview {...toolProps} />
              )}
            </div>
          </div>

          {/* Inline code card (when right panel is hidden) */}
          {!showCode && (
            <div
              style={{
                background: "#fff",
                borderRadius: 14,
                border: "1px solid #e8e5de",
              }}
            >
              <div
                style={{
                  padding: "13px 20px",
                  borderBottom: "1px solid #f0ede8",
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                    color: "#bbb",
                    fontFamily: "'DM Sans',sans-serif",
                  }}
                >
                  Generated Code
                </span>
              </div>
              <div style={{ padding: "16px 20px 20px" }}>
                <button
                  onClick={copyCode}
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: 9,
                    border: "none",
                    cursor: "pointer",
                    background: copied ? "#16a34a" : "#1a1a18",
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 700,
                    fontFamily: "'DM Sans',sans-serif",
                    transition: "background 0.25s",
                    marginBottom: 12,
                  }}
                >
                  {copied ? "✓ Copied! Paste into Unbounce" : "Copy Code"}
                </button>
                <div
                  style={{
                    background: "#faf9f7",
                    border: "1px solid #e8e5de",
                    borderRadius: 9,
                    padding: "12px 14px",
                    maxHeight: 200,
                    overflowY: "auto",
                  }}
                >
                  <pre
                    style={{
                      margin: 0,
                      fontSize: 11,
                      lineHeight: 1.7,
                      color: "#666",
                      fontFamily: "'Fira Code','Courier New',monospace",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {(
                      code?.custom ||
                      "<!-- Configure settings to generate code -->"
                    )
                      .split("\n")
                      .filter(
                        (l) =>
                          !l.trim().startsWith("data:") &&
                          !l.includes("base64,"),
                      )
                      .join("\n")}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Right code panel ── */}
        {showCode && (
          <div
            style={{
              borderLeft: "1px solid #e8e5de",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
            }}
          >
            <CodePanel code={code} platform={platform} />
          </div>
        )}
      </div>
    </div>
  );
}
