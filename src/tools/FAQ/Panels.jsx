// tools/FAQ/Panels.jsx
// Style panel + Content panel for FAQ, using light marquee UI components.
import { useState } from "react";
import {
  Slider,
  // Toggle,
  ColorRow,
  SelectRow,
  // Label,
  SectionHead,
  iconBtnStyle,
  smallBtnStyle,
  taStyle,
} from "../../shared/ui";
import { DEFAULT_FONTS, WEIGHTS, ALIGNS } from "../../shared/constants";

export function FaqStylePanel({ cfg, onChange, customFonts = [] }) {
  const up = (k, v) => onChange({ ...cfg, [k]: v });
  const allFonts = [...DEFAULT_FONTS, ...customFonts];
  return (
    <div style={{ padding: 16 }}>
      <SectionHead title="Container" />
      <ColorRow
        label="Background"
        value={cfg.bgColor}
        onChange={(v) => up("bgColor", v)}
      />
      <ColorRow
        label="Border color"
        value={cfg.borderColor}
        onChange={(v) => up("borderColor", v)}
      />
      <Slider
        label="Border width"
        value={cfg.borderWidth}
        min={0}
        max={6}
        unit="px"
        onChange={(v) => up("borderWidth", v)}
      />
      <Slider
        label="Border radius"
        value={cfg.borderRadius}
        min={0}
        max={40}
        unit="px"
        onChange={(v) => up("borderRadius", v)}
      />
      <Slider
        label="Padding"
        value={cfg.padding}
        min={8}
        max={60}
        unit="px"
        onChange={(v) => up("padding", v)}
      />
      <Slider
        label="Gap"
        value={cfg.gap}
        min={0}
        max={40}
        unit="px"
        onChange={(v) => up("gap", v)}
      />
      <Slider
        label="Max width"
        value={cfg.maxWidth}
        min={300}
        max={1400}
        step={10}
        unit="px"
        onChange={(v) => up("maxWidth", v)}
      />

      <SectionHead title="Question" />
      <ColorRow
        label="Color"
        value={cfg.qColor}
        onChange={(v) => up("qColor", v)}
      />
      <Slider
        label="Font size"
        value={cfg.qSize}
        min={12}
        max={32}
        unit="px"
        onChange={(v) => up("qSize", v)}
      />
      <SelectRow
        label="Font family"
        value={cfg.qFont}
        options={allFonts}
        onChange={(v) => up("qFont", v)}
      />
      <SelectRow
        label="Font weight"
        value={cfg.qWeight}
        options={WEIGHTS}
        onChange={(v) => up("qWeight", v)}
      />
      <SelectRow
        label="Alignment"
        value={cfg.qAlign}
        options={ALIGNS}
        onChange={(v) => up("qAlign", v)}
      />

      <SectionHead title="Answer" />
      <ColorRow
        label="Color"
        value={cfg.aColor}
        onChange={(v) => up("aColor", v)}
      />
      <Slider
        label="Font size"
        value={cfg.aSize}
        min={11}
        max={28}
        unit="px"
        onChange={(v) => up("aSize", v)}
      />
      <SelectRow
        label="Font family"
        value={cfg.aFont}
        options={allFonts}
        onChange={(v) => up("aFont", v)}
      />
      <SelectRow
        label="Font weight"
        value={cfg.aWeight}
        options={WEIGHTS}
        onChange={(v) => up("aWeight", v)}
      />
      <SelectRow
        label="Alignment"
        value={cfg.aAlign}
        options={ALIGNS}
        onChange={(v) => up("aAlign", v)}
      />

      <SectionHead title="Active / Open state" />
      <ColorRow
        label="Active background"
        value={cfg.activeBg}
        onChange={(v) => up("activeBg", v)}
      />
      <ColorRow
        label="Active question color"
        value={cfg.activeQColor}
        onChange={(v) => up("activeQColor", v)}
      />
      <ColorRow
        label="Icon color"
        value={cfg.iconColor}
        onChange={(v) => up("iconColor", v)}
      />
      <Slider
        label="Icon size"
        value={cfg.iconSize}
        min={12}
        max={36}
        unit="px"
        onChange={(v) => up("iconSize", v)}
      />
      <ColorRow
        label="Divider color"
        value={cfg.dividerColor}
        onChange={(v) => up("dividerColor", v)}
      />
    </div>
  );
}

export function FaqContentPanel({ faqs, setFaqs, count, setCount }) {
  const [editing, setEditing] = useState(null);
  const add = () => {
    const n = [
      ...faqs,
      { id: Date.now(), q: "New question", a: "Your answer here." },
    ];
    setFaqs(n);
    setCount((c) => Math.min(c + 1, n.length));
  };
  const remove = (i) => {
    const n = faqs.filter((_, x) => x !== i);
    setFaqs(n);
    setCount((c) => Math.max(1, Math.min(c, n.length)));
  };
  const upd = (i, k, v) =>
    setFaqs(faqs.map((f, x) => (x === i ? { ...f, [k]: v } : f)));

  return (
    <div style={{ padding: 16 }}>
      {/* Count control */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
          padding: "8px 0",
          borderBottom: "1px solid #f0ede8",
        }}
      >
        <span
          style={{
            fontSize: 13,
            color: "#444",
            fontFamily: "'DM Sans',sans-serif",
          }}
        >
          Show count
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={() => setCount((c) => Math.max(1, c - 1))}
            style={iconBtnStyle}
          >
            −
          </button>
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#1a1a18",
              minWidth: 20,
              textAlign: "center",
            }}
          >
            {count}
          </span>
          <button
            onClick={() => setCount((c) => Math.min(faqs.length, c + 1))}
            style={iconBtnStyle}
          >
            +
          </button>
        </div>
      </div>

      {faqs.map((faq, i) => (
        <div
          key={faq.id}
          style={{
            marginBottom: 8,
            border: "1px solid #e8e5de",
            borderRadius: 8,
            overflow: "hidden",
            opacity: i >= count ? 0.45 : 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "7px 10px",
              background: "#faf9f7",
              gap: 6,
            }}
          >
            <span
              style={{
                fontSize: 11,
                color: "#888",
                flex: 1,
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              FAQ {i + 1}
              {i >= count ? " (hidden)" : ""}
            </span>
            <button
              onClick={() => setEditing(editing === i ? null : i)}
              style={smallBtnStyle}
            >
              {editing === i ? "done" : "edit"}
            </button>
            {faqs.length > 1 && (
              <button
                onClick={() => remove(i)}
                style={{
                  ...smallBtnStyle,
                  color: "#e05",
                  borderColor: "#fca5a5",
                }}
              >
                ✕
              </button>
            )}
          </div>
          {editing === i ? (
            <div style={{ padding: 10 }}>
              <p style={{ margin: "0 0 4px", fontSize: 11, color: "#888" }}>
                Question
              </p>
              <textarea
                value={faq.q}
                onChange={(e) => upd(i, "q", e.target.value)}
                style={taStyle}
              />
              <p style={{ margin: "8px 0 4px", fontSize: 11, color: "#888" }}>
                Answer
              </p>
              <textarea
                value={faq.a}
                onChange={(e) => upd(i, "a", e.target.value)}
                style={{ ...taStyle, minHeight: 64 }}
              />
            </div>
          ) : (
            <div
              style={{
                padding: "7px 10px",
                fontSize: 12,
                color: "#888",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              {faq.q}
            </div>
          )}
        </div>
      ))}

      <button
        onClick={add}
        style={{
          width: "100%",
          padding: 9,
          fontSize: 12,
          borderRadius: 8,
          border: "1px dashed #ddd",
          background: "transparent",
          cursor: "pointer",
          color: "#aaa",
          marginTop: 4,
          fontFamily: "'DM Sans',sans-serif",
        }}
      >
        + Add FAQ
      </button>
    </div>
  );
}
