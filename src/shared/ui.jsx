// shared/ui.jsx
// All primitives use the LIGHT marquee UI theme — no dark colors from the FAQ builder.

// ─── Toggle switch ────────────────────────────────────────────────────────────
export function Toggle({ label, value, onChange }) {
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
      <span
        style={{
          fontSize: 13,
          color: "#444",
          fontFamily: "'DM Sans',sans-serif",
        }}
      >
        {label}
      </span>
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

// ─── Range slider ─────────────────────────────────────────────────────────────
export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
}) {
  return (
    <div style={{ padding: "8px 0", borderBottom: "1px solid #f0ede8" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 5,
        }}
      >
        <span
          style={{
            fontSize: 13,
            color: "#444",
            fontFamily: "'DM Sans',sans-serif",
          }}
        >
          {label}
        </span>
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
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: "#1a1a18" }}
      />
    </div>
  );
}

// ─── Segment (pill group) ─────────────────────────────────────────────────────
export function Segment({ options, value, onChange, small }) {
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
            fontFamily: "'DM Sans',sans-serif",
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

// ─── Section label ────────────────────────────────────────────────────────────
export function Label({ children, badge }) {
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
          fontFamily: "'DM Sans',sans-serif",
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

// ─── Section divider heading ──────────────────────────────────────────────────
export function SectionHead({ title }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: "#bbb",
        marginTop: 16,
        marginBottom: 8,
        paddingBottom: 5,
        borderBottom: "1px solid #f0ede8",
        fontFamily: "'DM Sans',sans-serif",
      }}
    >
      {title}
    </div>
  );
}

// ─── Color picker row ─────────────────────────────────────────────────────────
export function ColorRow({ label, value, onChange, presets }) {
  const safe =
    value && value.startsWith("#") && value.length === 7 ? value : "#ffffff";
  const defaultPresets = [
    "#ffffff",
    "#f8f9fa",
    "#f1ede4",
    "#1a1a18",
    "#0f172a",
    "#eff6ff",
    "#fdf4ff",
    "#fff7ed",
  ];
  const colors = presets || defaultPresets;
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
        <span
          style={{
            fontSize: 13,
            color: "#444",
            fontFamily: "'DM Sans',sans-serif",
          }}
        >
          {label}
        </span>
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
            value={safe}
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
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{
              width: 72,
              fontSize: 11,
              padding: "3px 6px",
              borderRadius: 4,
              border: "1px solid #e0ddd8",
              background: "#faf9f7",
              color: "#333",
              fontFamily: "monospace",
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

// ─── Select dropdown row ──────────────────────────────────────────────────────
export function SelectRow({ label, value, options, onChange }) {
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
      <span
        style={{
          fontSize: 13,
          color: "#444",
          fontFamily: "'DM Sans',sans-serif",
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          fontSize: 12,
          padding: "4px 8px",
          borderRadius: 6,
          border: "1px solid #e0ddd8",
          background: "#faf9f7",
          color: "#333",
          minWidth: 110,
          maxWidth: 140,
          fontFamily: "'DM Sans',sans-serif",
        }}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── Small icon button ────────────────────────────────────────────────────────
export const iconBtnStyle = {
  width: 24,
  height: 24,
  borderRadius: 4,
  border: "1px solid #e0ddd8",
  background: "#faf9f7",
  color: "#444",
  cursor: "pointer",
  fontSize: 14,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
};

export const smallBtnStyle = {
  fontSize: 10,
  padding: "2px 8px",
  borderRadius: 4,
  border: "1px solid #e0ddd8",
  background: "transparent",
  cursor: "pointer",
  color: "#888",
};

export const taStyle = {
  width: "100%",
  fontSize: 12,
  padding: "6px 8px",
  borderRadius: 6,
  border: "1px solid #e0ddd8",
  background: "#faf9f7",
  color: "#333",
  resize: "vertical",
  minHeight: 52,
  boxSizing: "border-box",
  fontFamily: "'DM Sans',sans-serif",
  lineHeight: 1.5,
};
