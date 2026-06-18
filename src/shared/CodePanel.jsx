// shared/CodePanel.jsx
// The right-side code export panel. Light marquee theme throughout.
import { useState } from "react";
import { PRESETS } from "./constants";

const WHERE_TO_PASTE = {
  Unbounce: {
    css: "Stylesheets panel (Page > Stylesheets)",
    html: "Custom HTML widget on the page",
    js: "Javascripts > Before Body End Tag",
    note: "⚠ JS won't run in Unbounce Preview — always test on published page.",
  },
  Webflow: {
    css: "Site Settings > Custom Code > <head>",
    html: "Embed block on the page",
    js: "Site Settings > Custom Code > Before </body>",
    note: "⚠ Test in Published mode, not Designer preview.",
  },
  Elementor: {
    css: "Elementor > Custom CSS",
    html: "Elementor HTML widget",
    js: "Theme > Custom JS or before </body>",
    note: "⚠ Test after saving and previewing in browser.",
  },
  Shopify: {
    css: "theme.css or Custom CSS section",
    html: "Correct .liquid section file",
    js: "theme.js or before </body> in layout",
    note: "⚠ Paste in the correct .liquid section, not globally.",
  },
  Framer: {
    css: "Site Settings > Custom Code > <head>",
    html: "Code component",
    js: "Site Settings > Custom Code > End of <body>",
    note: "⚠ Test after publishing.",
  },
  "Generic HTML": {
    css: "<style> tag in <head>",
    html: "Where you want it in <body>",
    js: "Before </body>",
    note: "⚠ Ensure CSS loads before JS executes.",
  },
};

export default function CodePanel({ code, platform }) {
  const [tab, setTab] = useState("custom");
  const [copied, setCopied] = useState(false);

  const content = tab === "custom" ? code.custom : code[tab];
  const where = WHERE_TO_PASTE[platform] || WHERE_TO_PASTE["Generic HTML"];

  const copy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "#fff",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: "1px solid #e8e5de",
          flexShrink: 0,
        }}
      >
        <p
          style={{
            margin: 0,
            fontWeight: 700,
            fontSize: 13,
            color: "#1a1a18",
            fontFamily: "'DM Sans',sans-serif",
          }}
        >
          Export Code
        </p>
        <p
          style={{
            margin: "2px 0 0",
            fontSize: 11,
            color: "#aaa",
            fontFamily: "'DM Sans',sans-serif",
          }}
        >
          All changes reflect instantly
        </p>
      </div>

      {/* Tab bar + copy */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          padding: "8px 12px",
          borderBottom: "1px solid #e8e5de",
          flexShrink: 0,
        }}
      >
        {["custom", "css", "html", "js"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "4px 10px",
              fontSize: 11,
              borderRadius: 6,
              cursor: "pointer",
              border: `1px solid ${tab === t ? "#1a1a18" : "#e0ddd8"}`,
              background: tab === t ? "#1a1a18" : "#fff",
              color: tab === t ? "#fff" : "#666",
              fontWeight: tab === t ? 600 : 400,
              fontFamily: "'DM Sans',sans-serif",
              textTransform: "uppercase",
              transition: "all 0.15s",
            }}
          >
            {t === "custom" ? "Full HTML" : t}
          </button>
        ))}
        <button
          onClick={copy}
          style={{
            marginLeft: "auto",
            padding: "5px 14px",
            fontSize: 12,
            borderRadius: 7,
            border: "none",
            background: copied ? "#16a34a" : "#1a1a18",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'DM Sans',sans-serif",
            transition: "background 0.2s",
          }}
        >
          {copied ? "✓ Copied!" : "Copy"}
        </button>
      </div>

      {/* Code block */}
      <pre
        style={{
          flex: 1,
          overflowY: "auto",
          overflowX: "auto",
          margin: 0,
          padding: "12px 14px",
          fontSize: 10.5,
          lineHeight: 1.75,
          fontFamily: "'Fira Code','Courier New',monospace",
          color: "#444",
          whiteSpace: "pre",
          background: "#faf9f7",
        }}
      >
        {content || "<!-- Configure settings to generate code -->"}
      </pre>

      {/* Where to paste */}
      <div
        style={{
          padding: "12px 14px",
          borderTop: "1px solid #e8e5de",
          flexShrink: 0,
        }}
      >
        <p
          style={{
            margin: "0 0 8px",
            fontSize: 11,
            fontWeight: 700,
            color: "#1a1a18",
            fontFamily: "'DM Sans',sans-serif",
          }}
        >
          Where to paste · {platform}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
          {["css", "html", "js"].map((k) => (
            <div
              key={k}
              style={{ display: "flex", gap: 8, alignItems: "flex-start" }}
            >
              <span
                style={{
                  fontSize: 9,
                  fontFamily: "monospace",
                  background: "#f0ede8",
                  color: "#666",
                  padding: "2px 6px",
                  borderRadius: 3,
                  flexShrink: 0,
                  marginTop: 1,
                  textTransform: "uppercase",
                }}
              >
                {k}
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: "#888",
                  lineHeight: 1.5,
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                {where[k]}
              </span>
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 10,
            padding: "7px 10px",
            background: "#fff8e1",
            border: "1px solid #fde68a",
            borderRadius: 7,
            fontSize: 11,
            color: "#92400e",
            fontFamily: "'DM Sans',sans-serif",
            lineHeight: 1.5,
          }}
        >
          {where.note}
        </div>
      </div>
    </div>
  );
}
