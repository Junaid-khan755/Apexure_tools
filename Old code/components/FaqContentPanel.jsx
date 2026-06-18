import { useState } from "react";
export default function FaqContentPanel({ faqs, setFaqs, count, setCount }) {
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
    <div style={{ padding: "12px 14px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <span style={{ fontSize: 11, color: S.muted }}>Show count</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button
            onClick={() => setCount((c) => Math.max(1, c - 1))}
            style={iconBtnStyle}
          >
            −
          </button>
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: S.text,
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
            border: "1px solid #1e1e30",
            borderRadius: 7,
            overflow: "hidden",
            opacity: i >= count ? 0.4 : 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "7px 10px",
              background: "#080810",
              gap: 6,
            }}
          >
            <span style={{ fontSize: 10, color: S.muted, flex: 1 }}>
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
                  color: "#ff5a5a",
                  borderColor: "#ff5a5a40",
                }}
              >
                ✕
              </button>
            )}
          </div>
          {editing === i ? (
            <div style={{ padding: 10 }}>
              <div style={{ fontSize: 10, color: S.muted, marginBottom: 3 }}>
                Question
              </div>
              <textarea
                value={faq.q}
                onChange={(e) => upd(i, "q", e.target.value)}
                style={taStyle}
              />
              <div
                style={{
                  fontSize: 10,
                  color: S.muted,
                  marginTop: 8,
                  marginBottom: 3,
                }}
              >
                Answer
              </div>
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
                fontSize: 11,
                color: S.muted,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
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
          padding: 8,
          fontSize: 11,
          borderRadius: 7,
          border: "1px dashed #2a2a3a",
          background: "transparent",
          cursor: "pointer",
          color: S.muted,
          marginTop: 4,
        }}
      >
        + Add FAQ
      </button>
    </div>
  );
}