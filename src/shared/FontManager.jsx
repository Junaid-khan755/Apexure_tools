// shared/FontManager.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import { POPULAR_FONTS } from "./constants";
import { Label, smallBtnStyle } from "./ui";

// ─── Load a single Google Font into the page (safe to call in useEffect) ─────
function loadGoogleFont(fontName) {
  const systemFonts = [
    "system-ui",
    "Georgia",
    "Helvetica Neue",
    "Trebuchet MS",
    "Verdana",
    "Courier New",
  ];
  if (!fontName || systemFonts.includes(fontName)) return;
  const id = `gf-${fontName.replace(/ /g, "-")}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, "+")}:wght@300;400;500;600;700;800&display=swap`;
  document.head.appendChild(link);
}

// ─── FontLoader component — renders nothing, loads fonts as side effect ───────
// Safe: uses a single useEffect, not hooks in a loop
export function FontLoader({ fonts = [] }) {
  useEffect(() => {
    fonts.forEach((f) => loadGoogleFont(f));
  }, [fonts.join(",")]);
  return null;
}

// ─── Generate @import string for generated CSS output ────────────────────────
export function googleFontsImport(fonts) {
  const systemFonts = [
    "system-ui",
    "Georgia",
    "Helvetica Neue",
    "Trebuchet MS",
    "Verdana",
    "Courier New",
  ];
  const unique = [
    ...new Set(fonts.filter((f) => f && !systemFonts.includes(f))),
  ];
  if (!unique.length) return "";
  const families = unique
    .map((f) => `family=${f.replace(/ /g, "+")}:wght@300;400;500;600;700;800`)
    .join("&");
  return `@import url('https://fonts.googleapis.com/css2?${families}&display=swap');\n\n`;
}

// ─── Google Font picker dropdown ──────────────────────────────────────────────
export function FontPicker({ value, onChange, customFonts = [] }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const allFonts = [...POPULAR_FONTS, ...customFonts];
  const filtered = query.trim()
    ? allFonts.filter((f) => f.toLowerCase().includes(query.toLowerCase()))
    : allFonts;

  // Load font when selected for preview
  useEffect(() => {
    loadGoogleFont(value);
  }, [value]);

  return (
    <div style={{ position: "relative", marginBottom: 0 }}>
      <input
        value={query || value}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search Google Fonts…"
        style={{
          width: "100%",
          fontSize: 12,
          padding: "6px 10px",
          borderRadius: 7,
          border: "1px solid #e0ddd8",
          background: "#faf9f7",
          color: "#333",
          boxSizing: "border-box",
          fontFamily: "'DM Sans',sans-serif",
        }}
      />
      {open && (
        <>
          <div
            style={{ position: "fixed", inset: 0, zIndex: 199 }}
            onClick={() => {
              setOpen(false);
              setQuery("");
            }}
          />
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
              zIndex: 200,
              maxHeight: 180,
              overflowY: "auto",
            }}
          >
            {filtered.length === 0 && (
              <div
                style={{ padding: "10px 12px", fontSize: 12, color: "#aaa" }}
              >
                No fonts found
              </div>
            )}
            {filtered.map((f) => (
              <button
                key={f}
                onClick={() => {
                  onChange(f);
                  setQuery("");
                  setOpen(false);
                }}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "7px 12px",
                  border: "none",
                  background: value === f ? "#f0ede8" : "#fff",
                  cursor: "pointer",
                  fontSize: 12,
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
                padding: "7px 12px",
                fontSize: 10,
                color: "#bbb",
                borderTop: "1px solid #f0ede8",
              }}
            >
              Type any Google Font name not listed
            </div>
          </div>
        </>
      )}
      <p
        style={{
          margin: "4px 0 0",
          fontSize: 11,
          color: "#888",
          fontFamily: "'DM Sans',sans-serif",
        }}
      >
        Selected:{" "}
        <strong style={{ fontFamily: `'${value}',sans-serif` }}>{value}</strong>
      </p>
    </div>
  );
}

// ─── Custom font file upload ──────────────────────────────────────────────────
export function CustomFontUpload({ onLoaded }) {
  const inputRef = useRef();
  const handle = useCallback(
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
        onLoaded({ name, data: base64, ext });
      };
      reader.readAsDataURL(file);
    },
    [onLoaded],
  );

  return (
    <div
      onClick={() => inputRef.current.click()}
      style={{
        border: "2px dashed #e0ddd8",
        borderRadius: 8,
        padding: "14px",
        textAlign: "center",
        cursor: "pointer",
        background: "#faf9f7",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".ttf,.otf,.woff,.woff2"
        style={{ display: "none" }}
        onChange={(e) => handle(e.target.files[0])}
      />
      <p
        style={{
          margin: 0,
          fontSize: 13,
          fontWeight: 600,
          color: "#1a1a18",
          fontFamily: "'DM Sans',sans-serif",
        }}
      >
        ⬆ Upload font file
      </p>
      <p
        style={{
          margin: "3px 0 0",
          fontSize: 11,
          color: "#aaa",
          fontFamily: "'DM Sans',sans-serif",
        }}
      >
        TTF · OTF · WOFF · WOFF2
      </p>
    </div>
  );
}

// ─── Custom font name manager (type name to add to font dropdowns) ────────────
export function CustomFontManager({ customFonts, onAdd, onRemove }) {
  const [input, setInput] = useState("");
  const add = () => {
    const name = input.trim();
    if (!name || customFonts.includes(name)) return;
    loadGoogleFont(name);
    onAdd(name);
    setInput("");
  };
  return (
    <div style={{ padding: "16px" }}>
      <Label>Add Custom Font</Label>
      <p
        style={{
          fontSize: 12,
          color: "#888",
          marginBottom: 10,
          lineHeight: 1.5,
          fontFamily: "'DM Sans',sans-serif",
        }}
      >
        Type any font name as it appears in Google Fonts. Make sure it is loaded
        on your page.
      </p>
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="e.g. Space Grotesk"
          style={{
            flex: 1,
            fontSize: 12,
            padding: "6px 10px",
            borderRadius: 7,
            border: "1px solid #e0ddd8",
            background: "#faf9f7",
            color: "#333",
            fontFamily: "'DM Sans',sans-serif",
          }}
        />
        <button
          onClick={add}
          style={{
            padding: "6px 14px",
            fontSize: 12,
            borderRadius: 7,
            border: "none",
            background: "#1a1a18",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 600,
            fontFamily: "'DM Sans',sans-serif",
          }}
        >
          Add
        </button>
      </div>
      {customFonts.length === 0 && (
        <p
          style={{
            fontSize: 12,
            color: "#bbb",
            textAlign: "center",
            marginTop: 12,
            fontFamily: "'DM Sans',sans-serif",
          }}
        >
          No custom fonts added yet
        </p>
      )}
      {customFonts.map((f) => (
        <div
          key={f}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "7px 10px",
            background: "#faf9f7",
            borderRadius: 7,
            marginBottom: 5,
            border: "1px solid #e0ddd8",
          }}
        >
          <span
            style={{
              fontSize: 13,
              color: "#333",
              fontFamily: `'${f}',sans-serif`,
            }}
          >
            {f}
          </span>
          <button
            onClick={() => onRemove(f)}
            style={{ ...smallBtnStyle, color: "#e05", borderColor: "#fca5a5" }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
