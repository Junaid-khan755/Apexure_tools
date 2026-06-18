// tools/Testimonials/Panels.jsx
import { useState } from "react";
import {
  Slider,
  Toggle,
  ColorRow,
  SelectRow,
  // Label,
  SectionHead,
  iconBtnStyle,
  smallBtnStyle,
  taStyle,
} from "../../shared/ui";
import { DEFAULT_FONTS, WEIGHTS, ALIGNS } from "../../shared/constants";

const LAYOUTS = [
  { id: "card-grid", label: "Card Grid" },
  { id: "carousel", label: "Carousel" },
  { id: "h-scroll", label: "H-Scroll" },
  { id: "single-quote", label: "Single Quote" },
  { id: "list", label: "List Feed" },
  { id: "inline-avatar", label: "Inline Avatar" },
];
const NAV_STYLES = [
  { id: "sides", label: "Sides" },
  { id: "bottom", label: "Bottom" },
  { id: "hidden", label: "Hidden" },
];
const NAV_ICONS = [
  { id: "arrow", label: "Arrow ← →" },
  { id: "chevron", label: "Chevron ‹ ›" },
  { id: "triangle", label: "Triangle ◄ ►" },
  { id: "custom", label: "Custom" },
];
const AVATAR_COLORS = [
  "#1a1a18",
  "#0ea5e9",
  "#f59e0b",
  "#10b981",
  "#ec4899",
  "#8b5cf6",
  "#ef4444",
  "#14b8a6",
];

// ─── Supabase avatar upload ───────────────────────────────────────────────────
async function uploadAvatarToSupabase(file) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) return null;
  try {
    const ext = file.name.split(".").pop();
    const fileName = `avatar-${Date.now()}.${ext}`;
    const res = await fetch(
      `${supabaseUrl}/storage/v1/object/avatars/${fileName}`,
      {
        method: "POST",
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
          "Content-Type": file.type,
          "x-upsert": "false",
        },
        body: file,
      },
    );
    if (!res.ok) return null;
    return `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`;
  } catch (e) {
    console.error("Avatar upload failed:", e);
    return null;
  }
}

// ─── Style Panel ──────────────────────────────────────────────────────────────
export function TestiStylePanel({ cfg, onChange, customFonts = [] }) {
  const up = (k, v) => onChange({ ...cfg, [k]: v });
  const allFonts = [...DEFAULT_FONTS, ...customFonts];
  const isNav =
    cfg.layout === "carousel" ||
    cfg.layout === "h-scroll" ||
    cfg.layout === "single-quote";

  return (
    <div style={{ padding: 16 }}>
      {/* Layout */}
      <SectionHead title="Layout" />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 4,
          marginBottom: 14,
        }}
      >
        {LAYOUTS.map((l) => (
          <button
            key={l.id}
            onClick={() => up("layout", l.id)}
            style={{
              padding: "6px 4px",
              fontSize: 11,
              borderRadius: 6,
              cursor: "pointer",
              textAlign: "center",
              fontFamily: "'DM Sans',sans-serif",
              border: `1px solid ${cfg.layout === l.id ? "#1a1a18" : "#e0ddd8"}`,
              background: cfg.layout === l.id ? "#1a1a18" : "#fff",
              color: cfg.layout === l.id ? "#fff" : "#555",
            }}
          >
            {l.label}
          </button>
        ))}
      </div>
      {(cfg.layout === "card-grid" || cfg.layout === "inline-avatar") && (
        <Slider
          label="Columns"
          min={1}
          max={4}
          value={cfg.columns}
          onChange={(v) => up("columns", v)}
        />
      )}
      <Slider
        label="Max width"
        value={cfg.maxWidth}
        min={300}
        max={1400}
        step={10}
        unit="px"
        onChange={(v) => up("maxWidth", v)}
      />

      {/* Section */}
      <SectionHead title="Section" />
      <ColorRow
        label="Section background"
        value={cfg.sectionBg}
        onChange={(v) => up("sectionBg", v)}
      />

      {/* Card */}
      <SectionHead title="Card" />
      <ColorRow
        label="Card background"
        value={cfg.cardBg}
        onChange={(v) => up("cardBg", v)}
      />
      <ColorRow
        label="Border color"
        value={cfg.cardBorderColor}
        onChange={(v) => up("cardBorderColor", v)}
      />
      <Slider
        label="Border width"
        value={cfg.cardBorderWidth}
        min={0}
        max={6}
        unit="px"
        onChange={(v) => up("cardBorderWidth", v)}
      />
      <Slider
        label="Card radius"
        value={cfg.cardRadius}
        min={0}
        max={40}
        unit="px"
        onChange={(v) => up("cardRadius", v)}
      />
      <Slider
        label="Card padding"
        value={cfg.cardPadding}
        min={8}
        max={60}
        unit="px"
        onChange={(v) => up("cardPadding", v)}
      />
      <Slider
        label="Card gap"
        value={cfg.cardGap}
        min={0}
        max={40}
        unit="px"
        onChange={(v) => up("cardGap", v)}
      />

      {/* Shadow */}
      <SectionHead title="Shadow" />
      <Toggle
        label="Show shadow"
        value={cfg.showShadow}
        onChange={(v) => up("showShadow", v)}
      />
      {cfg.showShadow && (
        <>
          <Slider
            label="X offset"
            value={cfg.shadowX}
            min={-20}
            max={20}
            unit="px"
            onChange={(v) => up("shadowX", v)}
          />
          <Slider
            label="Y offset"
            value={cfg.shadowY}
            min={-20}
            max={40}
            unit="px"
            onChange={(v) => up("shadowY", v)}
          />
          <Slider
            label="Blur"
            value={cfg.shadowBlur}
            min={0}
            max={60}
            unit="px"
            onChange={(v) => up("shadowBlur", v)}
          />
          <Slider
            label="Spread"
            value={cfg.shadowSpread}
            min={-10}
            max={20}
            unit="px"
            onChange={(v) => up("shadowSpread", v)}
          />
          <ColorRow
            label="Color"
            value={cfg.shadowColor}
            onChange={(v) => up("shadowColor", v)}
          />
        </>
      )}

      {/* Quote text */}
      <SectionHead title="Quote text" />
      <ColorRow
        label="Color"
        value={cfg.quoteColor}
        onChange={(v) => up("quoteColor", v)}
      />
      <Slider
        label="Font size"
        value={cfg.quoteSize}
        min={11}
        max={32}
        unit="px"
        onChange={(v) => up("quoteSize", v)}
      />
      <SelectRow
        label="Font family"
        value={cfg.quoteFont}
        options={allFonts}
        onChange={(v) => up("quoteFont", v)}
      />
      <SelectRow
        label="Font weight"
        value={cfg.quoteWeight}
        options={WEIGHTS}
        onChange={(v) => up("quoteWeight", v)}
      />
      <SelectRow
        label="Alignment"
        value={cfg.quoteAlign}
        options={ALIGNS}
        onChange={(v) => up("quoteAlign", v)}
      />

      {/* Quote mark */}
      <SectionHead title="Quote mark" />
      <Toggle
        label="Show quote mark"
        value={cfg.showQuoteMark}
        onChange={(v) => up("showQuoteMark", v)}
      />
      {cfg.showQuoteMark && (
        <>
          <ColorRow
            label="Color"
            value={cfg.quoteMarkColor}
            onChange={(v) => up("quoteMarkColor", v)}
          />
          <Slider
            label="Size"
            value={cfg.quoteMarkSize}
            min={24}
            max={120}
            unit="px"
            onChange={(v) => up("quoteMarkSize", v)}
          />
        </>
      )}

      {/* Name */}
      <SectionHead title="Name" />
      <ColorRow
        label="Color"
        value={cfg.nameColor}
        onChange={(v) => up("nameColor", v)}
      />
      <Slider
        label="Font size"
        value={cfg.nameSize}
        min={11}
        max={24}
        unit="px"
        onChange={(v) => up("nameSize", v)}
      />
      <SelectRow
        label="Font family"
        value={cfg.nameFont}
        options={allFonts}
        onChange={(v) => up("nameFont", v)}
      />
      <SelectRow
        label="Font weight"
        value={cfg.nameWeight}
        options={WEIGHTS}
        onChange={(v) => up("nameWeight", v)}
      />

      {/* Role / Company */}
      <SectionHead title="Role / Company" />
      <ColorRow
        label="Role color"
        value={cfg.roleColor}
        onChange={(v) => up("roleColor", v)}
      />
      <Slider
        label="Role size"
        value={cfg.roleSize}
        min={10}
        max={20}
        unit="px"
        onChange={(v) => up("roleSize", v)}
      />
      <SelectRow
        label="Font family"
        value={cfg.roleFont}
        options={allFonts}
        onChange={(v) => up("roleFont", v)}
      />
      <Toggle
        label="Show company"
        value={cfg.showCompany}
        onChange={(v) => up("showCompany", v)}
      />
      {cfg.showCompany && (
        <ColorRow
          label="Company color"
          value={cfg.companyColor}
          onChange={(v) => up("companyColor", v)}
        />
      )}

      {/* Stars */}
      <SectionHead title="Stars" />
      <Toggle
        label="Show stars"
        value={cfg.showStars}
        onChange={(v) => up("showStars", v)}
      />
      {cfg.showStars && (
        <>
          <ColorRow
            label="Star color"
            value={cfg.starColor}
            onChange={(v) => up("starColor", v)}
          />
          <Slider
            label="Star size"
            value={cfg.starSize}
            min={10}
            max={32}
            unit="px"
            onChange={(v) => up("starSize", v)}
          />
        </>
      )}

      {/* Avatar */}
      <SectionHead title="Avatar" />
      <Toggle
        label="Show avatar"
        value={cfg.showAvatar}
        onChange={(v) => up("showAvatar", v)}
      />
      {cfg.showAvatar && (
        <>
          <Slider
            label="Avatar size"
            value={cfg.avatarSize}
            min={24}
            max={80}
            unit="px"
            onChange={(v) => up("avatarSize", v)}
          />
          <Slider
            label="Avatar radius"
            value={cfg.avatarRadius}
            min={0}
            max={50}
            unit="%"
            onChange={(v) => up("avatarRadius", v)}
          />
        </>
      )}

      {/* Navigation — only for carousel layouts */}
      {isNav && (
        <>
          <SectionHead title="Navigation" />
          <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
            {NAV_STYLES.map((n) => (
              <button
                key={n.id}
                onClick={() => up("navStyle", n.id)}
                style={{
                  flex: 1,
                  padding: "5px 4px",
                  fontSize: 11,
                  borderRadius: 6,
                  cursor: "pointer",
                  fontFamily: "'DM Sans',sans-serif",
                  border: `1px solid ${cfg.navStyle === n.id ? "#1a1a18" : "#e0ddd8"}`,
                  background: cfg.navStyle === n.id ? "#1a1a18" : "#fff",
                  color: cfg.navStyle === n.id ? "#fff" : "#555",
                }}
              >
                {n.label}
              </button>
            ))}
          </div>
          {cfg.navStyle !== "hidden" && (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  marginBottom: 10,
                }}
              >
                {NAV_ICONS.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => up("navBtnIcon", n.id)}
                    style={{
                      padding: "5px 8px",
                      fontSize: 11,
                      borderRadius: 6,
                      cursor: "pointer",
                      textAlign: "left",
                      fontFamily: "'DM Sans',sans-serif",
                      border: `1px solid ${cfg.navBtnIcon === n.id ? "#1a1a18" : "#e0ddd8"}`,
                      background: cfg.navBtnIcon === n.id ? "#1a1a18" : "#fff",
                      color: cfg.navBtnIcon === n.id ? "#fff" : "#555",
                    }}
                  >
                    {n.label}
                  </button>
                ))}
              </div>
              <ColorRow
                label="Button background"
                value={cfg.navBtnBg}
                onChange={(v) => up("navBtnBg", v)}
              />
              <ColorRow
                label="Button icon color"
                value={cfg.navBtnColor}
                onChange={(v) => up("navBtnColor", v)}
              />
              <Slider
                label="Button size"
                value={cfg.navBtnSize}
                min={24}
                max={64}
                unit="px"
                onChange={(v) => up("navBtnSize", v)}
              />
              <Slider
                label="Button radius"
                value={cfg.navBtnRadius}
                min={0}
                max={50}
                unit="%"
                onChange={(v) => up("navBtnRadius", v)}
              />
            </>
          )}
          <Toggle
            label="Show dots"
            value={cfg.showDots}
            onChange={(v) => up("showDots", v)}
          />
          {cfg.showDots && (
            <>
              <ColorRow
                label="Dot color"
                value={cfg.dotColor}
                onChange={(v) => up("dotColor", v)}
              />
              <Slider
                label="Dot size"
                value={cfg.dotSize}
                min={4}
                max={16}
                unit="px"
                onChange={(v) => up("dotSize", v)}
              />
            </>
          )}
          <Toggle
            label="Auto-play"
            value={cfg.autoPlay}
            onChange={(v) => up("autoPlay", v)}
          />
          {cfg.autoPlay && (
            <Slider
              label="Speed"
              value={cfg.autoPlaySpeed}
              min={1000}
              max={8000}
              step={500}
              unit="ms"
              onChange={(v) => up("autoPlaySpeed", v)}
            />
          )}
        </>
      )}
    </div>
  );
}

// ─── Content Panel ────────────────────────────────────────────────────────────
export function TestiContentPanel({ items, setItems, count, setCount }) {
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(null); // index of item being uploaded

  const add = () => {
    const n = [
      ...items,
      {
        id: Date.now(),
        name: "New Person",
        role: "Role",
        company: "Company",
        quote: "Their testimonial goes here.",
        stars: 5,
        initials: "NP",
        avatarBg: AVATAR_COLORS[items.length % AVATAR_COLORS.length],
        avatarUrl: null,
      },
    ];
    setItems(n);
    setCount((c) => Math.min(c + 1, n.length));
  };

  const remove = (i) => {
    const n = items.filter((_, x) => x !== i);
    setItems(n);
    setCount((c) => Math.max(1, Math.min(c, n.length)));
  };

  const upd = (i, k, v) =>
    setItems(items.map((t, x) => (x === i ? { ...t, [k]: v } : t)));

  const handleAvatarUpload = async (i, file) => {
    if (!file) return;
    setUploading(i);
    const url = await uploadAvatarToSupabase(file);
    if (url) upd(i, "avatarUrl", url);
    setUploading(null);
  };

  return (
    <div style={{ padding: 16 }}>
      {/* Show count */}
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
            onClick={() => setCount((c) => Math.min(items.length, c + 1))}
            style={iconBtnStyle}
          >
            +
          </button>
        </div>
      </div>

      {/* Testimonial items */}
      {items.map((t, i) => (
        <div
          key={t.id}
          style={{
            marginBottom: 8,
            border: "1px solid #e8e5de",
            borderRadius: 8,
            overflow: "hidden",
            opacity: i >= count ? 0.45 : 1,
          }}
        >
          {/* Item header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "7px 10px",
              background: "#faf9f7",
              gap: 6,
            }}
          >
            {t.avatarUrl ? (
              <img
                src={t.avatarUrl}
                alt={t.name}
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />
            ) : (
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: t.avatarBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 8,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {t.initials}
              </div>
            )}
            <span
              style={{
                fontSize: 11,
                color: "#888",
                flex: 1,
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              {t.name}
              {i >= count ? " (hidden)" : ""}
            </span>
            <button
              onClick={() => setEditing(editing === i ? null : i)}
              style={smallBtnStyle}
            >
              {editing === i ? "done" : "edit"}
            </button>
            {items.length > 1 && (
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

          {/* Edit form */}
          {editing === i && (
            <div style={{ padding: 10 }}>
              {/* Name / Role / Company */}
              {[
                ["name", "Name"],
                ["role", "Role"],
                ["company", "Company"],
              ].map(([k, l]) => (
                <div key={k} style={{ marginBottom: 8 }}>
                  <p style={{ margin: "0 0 3px", fontSize: 11, color: "#888" }}>
                    {l}
                  </p>
                  <input
                    value={t[k]}
                    onChange={(e) => upd(i, k, e.target.value)}
                    style={{
                      width: "100%",
                      fontSize: 12,
                      padding: "5px 8px",
                      borderRadius: 6,
                      border: "1px solid #e0ddd8",
                      background: "#faf9f7",
                      color: "#333",
                      boxSizing: "border-box",
                      fontFamily: "'DM Sans',sans-serif",
                    }}
                  />
                </div>
              ))}

              {/* Quote */}
              <p style={{ margin: "0 0 3px", fontSize: 11, color: "#888" }}>
                Quote
              </p>
              <textarea
                value={t.quote}
                onChange={(e) => upd(i, "quote", e.target.value)}
                style={{ ...taStyle, minHeight: 72 }}
              />

              {/* Stars */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  margin: "8px 0",
                }}
              >
                <span style={{ fontSize: 11, color: "#888" }}>Stars</span>
                <div style={{ display: "flex", gap: 3 }}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => upd(i, "stars", n)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 18,
                        color: n <= t.stars ? "#f59e0b" : "#ddd",
                        padding: 0,
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Avatar image upload */}
              <p style={{ margin: "8px 0 4px", fontSize: 11, color: "#888" }}>
                Avatar image
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  id={`avatar-upload-${i}`}
                  onChange={(e) => handleAvatarUpload(i, e.target.files[0])}
                />
                <label
                  htmlFor={`avatar-upload-${i}`}
                  style={{
                    padding: "5px 12px",
                    fontSize: 11,
                    borderRadius: 6,
                    border: "1px solid #e0ddd8",
                    background: "#faf9f7",
                    cursor: "pointer",
                    fontFamily: "'DM Sans',sans-serif",
                  }}
                >
                  {uploading === i ? "Uploading…" : "⬆ Upload image"}
                </label>
                {t.avatarUrl && (
                  <>
                    <span style={{ fontSize: 11, color: "#16a34a" }}>
                      ✓ Uploaded
                    </span>
                    <button
                      onClick={() => upd(i, "avatarUrl", null)}
                      style={{
                        fontSize: 11,
                        color: "#e05",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Remove
                    </button>
                  </>
                )}
              </div>

              {/* Avatar color — only shown when no image uploaded */}
              {!t.avatarUrl && (
                <>
                  <p style={{ margin: "0 0 6px", fontSize: 11, color: "#888" }}>
                    Avatar color
                  </p>
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                    {AVATAR_COLORS.map((c) => (
                      <div
                        key={c}
                        onClick={() => upd(i, "avatarBg", c)}
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: "50%",
                          background: c,
                          cursor: "pointer",
                          border:
                            t.avatarBg === c
                              ? "2px solid #1a1a18"
                              : "2px solid transparent",
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
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
        + Add Testimonial
      </button>
    </div>
  );
}
