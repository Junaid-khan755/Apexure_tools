import { useState } from "react";

const DEFAULT_FAQS = [
  {
    id: 1,
    q: "What is your refund policy?",
    a: "We offer a 30-day money-back guarantee on all plans. If you're not satisfied, contact our support team and we'll process your refund within 3–5 business days.",
  },
  {
    id: 2,
    q: "How do I cancel my subscription?",
    a: "You can cancel anytime from your account dashboard under Settings > Billing. Your access continues until the end of the current billing period.",
  },
  {
    id: 3,
    q: "Do you offer customer support?",
    a: "Yes! We offer 24/7 live chat support for all paid plans. Free plan users have access to our help centre and community forums.",
  },
  {
    id: 4,
    q: "Is my data secure?",
    a: "Absolutely. We use AES-256 encryption for all stored data and TLS 1.3 for data in transit. We are SOC 2 Type II certified.",
  },
  {
    id: 5,
    q: "Can I upgrade or downgrade my plan?",
    a: "Yes, you can change your plan at any time. Upgrades take effect immediately. Downgrades take effect at the next billing cycle.",
  },
];

const FONTS = [
  "Inter",
  "Georgia",
  "Helvetica Neue",
  "Trebuchet MS",
  "Verdana",
  "Times New Roman",
  "Courier New",
  "system-ui",
];
const PLATFORMS = [
  "Unbounce",
  "Webflow",
  "Elementor",
  "Shopify",
  "Framer",
  "Generic HTML",
];
const WEIGHTS = ["300", "400", "500", "600", "700"];
const ALIGNS = ["left", "center", "right"];

const mkDefault = () => ({
  bgColor: "#ffffff",
  borderColor: "#e5e7eb",
  borderWidth: 1,
  borderRadius: 10,
  padding: 20,
  gap: 12,
  maxWidth: 720,
  qColor: "#111827",
  qSize: 16,
  qWeight: "600",
  qAlign: "left",
  qFont: "Inter",
  aColor: "#6b7280",
  aSize: 14,
  aWeight: "400",
  aAlign: "left",
  aFont: "Inter",
  iconColor: "#6c47ff",
  iconSize: 20,
  activeBg: "#f9fafb",
  activeQColor: "#6c47ff",
  dividerColor: "#e5e7eb",
});

// ── Reusable controls ──────────────────────────────
function Row({ label, children }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
        gap: 8,
      }}
    >
      <span
        style={{
          fontSize: 11,
          color: "#888",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

function Slider({ label, min, max, step = 1, val, unit = "", onChange }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 4,
        }}
      >
        <span style={{ fontSize: 11, color: "#888" }}>{label}</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: "#e4e4f0" }}>
          {val}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={val}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: "#6c47ff", cursor: "pointer" }}
      />
    </div>
  );
}

function ColorRow({ label, val, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
      }}
    >
      <span style={{ fontSize: 11, color: "#888" }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: 4,
            background: val,
            border: "1px solid #2a2a3a",
            flexShrink: 0,
          }}
        />
        <input
          type="color"
          value={val}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: 20,
            height: 20,
            border: "none",
            background: "none",
            cursor: "pointer",
            padding: 0,
            flexShrink: 0,
          }}
        />
        <input
          type="text"
          value={val}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: 70,
            fontSize: 10,
            padding: "3px 5px",
            borderRadius: 4,
            border: "1px solid #2a2a3a",
            background: "#0d0d18",
            color: "#e4e4f0",
            fontFamily: "monospace",
          }}
        />
      </div>
    </div>
  );
}

function Select({ label, val, options, onChange }) {
  return (
    <Row label={label}>
      <select
        value={val}
        onChange={(e) => onChange(e.target.value)}
        style={{
          fontSize: 11,
          padding: "3px 6px",
          borderRadius: 4,
          border: "1px solid #2a2a3a",
          background: "#0d0d18",
          color: "#e4e4f0",
          minWidth: 100,
        }}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </Row>
  );
}

function SectionHead({ title }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: "0.8px",
        textTransform: "uppercase",
        color: "#5a5a78",
        marginTop: 18,
        marginBottom: 10,
        paddingBottom: 5,
        borderBottom: "1px solid #1e1e30",
      }}
    >
      {title}
    </div>
  );
}

function TabBtn({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "5px 12px",
        fontSize: 11,
        borderRadius: 6,
        cursor: "pointer",
        border: `1px solid ${active ? "#6c47ff" : "#2a2a3a"}`,
        background: active ? "rgba(108,71,255,0.15)" : "transparent",
        color: active ? "#a58dff" : "#5a5a78",
        fontWeight: active ? 600 : 400,
      }}
    >
      {label}
    </button>
  );
}

// ── Style panel ────────────────────────────────────
function StylePanel({ cfg, onChange }) {
  const up = (k, v) => onChange({ ...cfg, [k]: v });
  return (
    <div style={{ padding: "12px 14px" }}>
      <SectionHead title="Container" />
      <ColorRow
        label="Background"
        val={cfg.bgColor}
        onChange={(v) => up("bgColor", v)}
      />
      <ColorRow
        label="Border color"
        val={cfg.borderColor}
        onChange={(v) => up("borderColor", v)}
      />
      <Slider
        label="Border width"
        min={0}
        max={6}
        val={cfg.borderWidth}
        unit="px"
        onChange={(v) => up("borderWidth", v)}
      />
      <Slider
        label="Border radius"
        min={0}
        max={40}
        val={cfg.borderRadius}
        unit="px"
        onChange={(v) => up("borderRadius", v)}
      />
      <Slider
        label="Padding"
        min={8}
        max={60}
        val={cfg.padding}
        unit="px"
        onChange={(v) => up("padding", v)}
      />
      <Slider
        label="Gap between items"
        min={0}
        max={40}
        val={cfg.gap}
        unit="px"
        onChange={(v) => up("gap", v)}
      />
      <Slider
        label="Max width"
        min={300}
        max={1400}
        step={10}
        val={cfg.maxWidth}
        unit="px"
        onChange={(v) => up("maxWidth", v)}
      />

      <SectionHead title="Question" />
      <ColorRow
        label="Color"
        val={cfg.qColor}
        onChange={(v) => up("qColor", v)}
      />
      <Slider
        label="Font size"
        min={12}
        max={32}
        val={cfg.qSize}
        unit="px"
        onChange={(v) => up("qSize", v)}
      />
      <Select
        label="Font family"
        val={cfg.qFont}
        options={FONTS}
        onChange={(v) => up("qFont", v)}
      />
      <Select
        label="Font weight"
        val={cfg.qWeight}
        options={WEIGHTS}
        onChange={(v) => up("qWeight", v)}
      />
      <Select
        label="Alignment"
        val={cfg.qAlign}
        options={ALIGNS}
        onChange={(v) => up("qAlign", v)}
      />

      <SectionHead title="Answer" />
      <ColorRow
        label="Color"
        val={cfg.aColor}
        onChange={(v) => up("aColor", v)}
      />
      <Slider
        label="Font size"
        min={11}
        max={28}
        val={cfg.aSize}
        unit="px"
        onChange={(v) => up("aSize", v)}
      />
      <Select
        label="Font family"
        val={cfg.aFont}
        options={FONTS}
        onChange={(v) => up("aFont", v)}
      />
      <Select
        label="Font weight"
        val={cfg.aWeight}
        options={WEIGHTS}
        onChange={(v) => up("aWeight", v)}
      />
      <Select
        label="Alignment"
        val={cfg.aAlign}
        options={ALIGNS}
        onChange={(v) => up("aAlign", v)}
      />

      <SectionHead title="Active / Open state" />
      <ColorRow
        label="Active background"
        val={cfg.activeBg}
        onChange={(v) => up("activeBg", v)}
      />
      <ColorRow
        label="Active question color"
        val={cfg.activeQColor}
        onChange={(v) => up("activeQColor", v)}
      />
      <ColorRow
        label="Icon color"
        val={cfg.iconColor}
        onChange={(v) => up("iconColor", v)}
      />
      <Slider
        label="Icon size"
        min={12}
        max={36}
        val={cfg.iconSize}
        unit="px"
        onChange={(v) => up("iconSize", v)}
      />
      <ColorRow
        label="Divider color"
        val={cfg.dividerColor}
        onChange={(v) => up("dividerColor", v)}
      />
    </div>
  );
}

// ── Content panel ──────────────────────────────────
function ContentPanel({ faqs, setFaqs, count, setCount }) {
  const [editing, setEditing] = useState(null);

  function addFaq() {
    const nf = [
      ...faqs,
      { id: Date.now(), q: "New question", a: "Your answer here." },
    ];
    setFaqs(nf);
    setCount((c) => Math.min(c + 1, nf.length));
  }
  function remove(i) {
    const nf = faqs.filter((_, idx) => idx !== i);
    setFaqs(nf);
    setCount((c) => Math.max(1, Math.min(c, nf.length)));
  }
  function update(i, field, val) {
    setFaqs(faqs.map((f, idx) => (idx === i ? { ...f, [field]: val } : f)));
  }

  return (
    <div style={{ padding: "12px 14px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <span style={{ fontSize: 11, color: "#888" }}>Show count</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button
            onClick={() => setCount((c) => Math.max(1, c - 1))}
            style={iconBtn}
          >
            −
          </button>
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#e4e4f0",
              minWidth: 20,
              textAlign: "center",
            }}
          >
            {count}
          </span>
          <button
            onClick={() => setCount((c) => Math.min(faqs.length, c + 1))}
            style={iconBtn}
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
              background: "#0d0d18",
              gap: 6,
            }}
          >
            <span style={{ fontSize: 10, color: "#5a5a78", flex: 1 }}>
              FAQ {i + 1}
              {i >= count ? " (hidden)" : ""}
            </span>
            <button
              onClick={() => setEditing(editing === i ? null : i)}
              style={smallBtn}
            >
              {editing === i ? "done" : "edit"}
            </button>
            {faqs.length > 1 && (
              <button
                onClick={() => remove(i)}
                style={{
                  ...smallBtn,
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
              <div style={{ fontSize: 10, color: "#5a5a78", marginBottom: 3 }}>
                Question
              </div>
              <textarea
                value={faq.q}
                onChange={(e) => update(i, "q", e.target.value)}
                style={{
                  width: "100%",
                  fontSize: 11,
                  padding: "5px 7px",
                  borderRadius: 4,
                  border: "1px solid #2a2a3a",
                  background: "#080810",
                  color: "#e4e4f0",
                  resize: "vertical",
                  minHeight: 48,
                  boxSizing: "border-box",
                }}
              />
              <div
                style={{
                  fontSize: 10,
                  color: "#5a5a78",
                  marginTop: 8,
                  marginBottom: 3,
                }}
              >
                Answer
              </div>
              <textarea
                value={faq.a}
                onChange={(e) => update(i, "a", e.target.value)}
                style={{
                  width: "100%",
                  fontSize: 11,
                  padding: "5px 7px",
                  borderRadius: 4,
                  border: "1px solid #2a2a3a",
                  background: "#080810",
                  color: "#e4e4f0",
                  resize: "vertical",
                  minHeight: 72,
                  boxSizing: "border-box",
                }}
              />
            </div>
          ) : (
            <div
              style={{
                padding: "7px 10px",
                fontSize: 11,
                color: "#5a5a78",
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
        onClick={addFaq}
        style={{
          width: "100%",
          padding: "8px",
          fontSize: 11,
          borderRadius: 7,
          border: "1px dashed #2a2a3a",
          background: "transparent",
          cursor: "pointer",
          color: "#5a5a78",
          marginTop: 4,
        }}
      >
        + Add FAQ
      </button>
    </div>
  );
}

const iconBtn = {
  width: 24,
  height: 24,
  borderRadius: 4,
  border: "1px solid #2a2a3a",
  background: "#0d0d18",
  color: "#e4e4f0",
  cursor: "pointer",
  fontSize: 14,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
};
const smallBtn = {
  fontSize: 10,
  padding: "2px 8px",
  borderRadius: 4,
  border: "1px solid #2a2a3a",
  background: "transparent",
  cursor: "pointer",
  color: "#5a5a78",
};

// ── FAQ Preview ────────────────────────────────────
function FAQPreview({ faqs, count, cfg }) {
  const [openIdx, setOpenIdx] = useState(null);
  const items = faqs.slice(0, count);

  return (
    <div
      style={{
        fontFamily: `'${cfg.qFont}', sans-serif`,
        maxWidth: cfg.maxWidth,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: cfg.gap,
      }}
    >
      {items.map((faq, i) => {
        const isOpen = openIdx === i;
        return (
          <div
            key={faq.id}
            style={{
              background: isOpen ? cfg.activeBg : cfg.bgColor,
              border: `${cfg.borderWidth}px solid ${isOpen ? cfg.iconColor : cfg.borderColor}`,
              borderRadius: cfg.borderRadius,
              overflow: "hidden",
              transition: "all 0.2s",
            }}
          >
            <button
              onClick={() => setOpenIdx(isOpen ? null : i)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                padding: cfg.padding,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  fontFamily: `'${cfg.qFont}', sans-serif`,
                  fontSize: cfg.qSize,
                  fontWeight: cfg.qWeight,
                  color: isOpen ? cfg.activeQColor : cfg.qColor,
                  textAlign: cfg.qAlign,
                  flex: 1,
                }}
              >
                {faq.q}
              </span>
              <span
                style={{
                  color: cfg.iconColor,
                  fontSize: cfg.iconSize,
                  fontWeight: 700,
                  flexShrink: 0,
                  transition: "transform 0.2s",
                  transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                  lineHeight: 1,
                }}
              >
                +
              </span>
            </button>
            {isOpen && (
              <div
                style={{
                  padding: `0 ${cfg.padding}px ${cfg.padding}px`,
                  borderTop: `1px solid ${cfg.dividerColor}`,
                }}
              >
                <p
                  style={{
                    fontFamily: `'${cfg.aFont}', sans-serif`,
                    fontSize: cfg.aSize,
                    fontWeight: cfg.aWeight,
                    color: cfg.aColor,
                    textAlign: cfg.aAlign,
                    margin: 0,
                    paddingTop: Math.round(cfg.padding * 0.6),
                    lineHeight: 1.65,
                  }}
                >
                  {faq.a}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Code Generator ─────────────────────────────────
function generateCode(faqs, count, dCfg, tCfg, mCfg, platform) {
  const items = faqs.slice(0, count);
  const isUnbounce = platform === "Unbounce";
  const loadWrap = isUnbounce
    ? "window.addEventListener('load', function() {"
    : "document.addEventListener('DOMContentLoaded', function() {";
  const tPrefix = isUnbounce ? ".lp-tablet" : "@media(max-width:768px)";
  const mPrefix = isUnbounce ? ".lp-mobile" : "@media(max-width:480px)";

  const css = `/* ── FAQ Component — ${platform} ──────────────────── */
/* Desktop styles */
.ub-faq { max-width:${dCfg.maxWidth}px; margin:0 auto; display:flex; flex-direction:column; gap:${dCfg.gap}px; }
.ub-faq-item { background:${dCfg.bgColor}; border:${dCfg.borderWidth}px solid ${dCfg.borderColor}; border-radius:${dCfg.borderRadius}px; overflow:hidden; transition:all .2s; }
.ub-faq-item.open { background:${dCfg.activeBg}; border-color:${dCfg.iconColor}; }
.ub-faq-btn { width:100%; display:flex; align-items:center; justify-content:space-between; gap:12px; padding:${dCfg.padding}px; background:none; border:none; cursor:pointer; }
.ub-faq-q { font-family:'${dCfg.qFont}',sans-serif; font-size:${dCfg.qSize}px; font-weight:${dCfg.qWeight}; color:${dCfg.qColor}; text-align:${dCfg.qAlign}; flex:1; transition:color .2s; }
.ub-faq-item.open .ub-faq-q { color:${dCfg.activeQColor}; }
.ub-faq-icon { color:${dCfg.iconColor}; font-size:${dCfg.iconSize}px; font-weight:700; flex-shrink:0; transition:transform .2s; line-height:1; }
.ub-faq-item.open .ub-faq-icon { transform:rotate(45deg); }
.ub-faq-body { display:none; padding:0 ${dCfg.padding}px ${dCfg.padding}px; border-top:1px solid ${dCfg.dividerColor}; }
.ub-faq-item.open .ub-faq-body { display:block; }
.ub-faq-a { font-family:'${dCfg.aFont}',sans-serif; font-size:${dCfg.aSize}px; font-weight:${dCfg.aWeight}; color:${dCfg.aColor}; text-align:${dCfg.aAlign}; margin:0; padding-top:${Math.round(dCfg.padding * 0.6)}px; line-height:1.65; }

/* Tablet */
${tPrefix} .ub-faq { max-width:${tCfg.maxWidth}px; gap:${tCfg.gap}px; }
${tPrefix} .ub-faq-btn { padding:${tCfg.padding}px; }
${tPrefix} .ub-faq-q { font-size:${tCfg.qSize}px; }
${tPrefix} .ub-faq-a { font-size:${tCfg.aSize}px; }

/* Mobile */
${mPrefix} .ub-faq { max-width:${mCfg.maxWidth}px; gap:${mCfg.gap}px; }
${mPrefix} .ub-faq-btn { padding:${mCfg.padding}px; }
${mPrefix} .ub-faq-q { font-size:${mCfg.qSize}px; }
${mPrefix} .ub-faq-a { font-size:${mCfg.aSize}px; }`;

  const html = `<!-- Paste this HTML where you want the FAQ to appear -->
<div class="ub-faq" id="ubFaq"></div>`;

  const js = `/* Paste in: ${isUnbounce ? "Javascripts > Before Body End Tag" : "before </body>"} */
${loadWrap}
  var faqs = [
${items.map((f) => `    { q: ${JSON.stringify(f.q)}, a: ${JSON.stringify(f.a)} }`).join(",\n")}
  ];

  var wrap = document.getElementById('ubFaq');
  if (!wrap) return;

  faqs.forEach(function(item, i) {
    var el = document.createElement('div');
    el.className = 'ub-faq-item';
    el.innerHTML =
      '<button class="ub-faq-btn" aria-expanded="false">' +
        '<span class="ub-faq-q">' + item.q + '</span>' +
        '<span class="ub-faq-icon">+</span>' +
      '</button>' +
      '<div class="ub-faq-body">' +
        '<p class="ub-faq-a">' + item.a + '</p>' +
      '</div>';

    el.querySelector('.ub-faq-btn').addEventListener('click', function() {
      var isOpen = el.classList.contains('open');
      document.querySelectorAll('.ub-faq-item').forEach(function(x) {
        x.classList.remove('open');
        x.querySelector('.ub-faq-btn').setAttribute('aria-expanded','false');
      });
      if (!isOpen) {
        el.classList.add('open');
        this.setAttribute('aria-expanded','true');
      }
    });

    wrap.appendChild(el);
  });
});`;

  return { css, html, js };
}

// ── Viewport preview widths ────────────────────────
const VP_WIDTHS = { desktop: "100%", tablet: 600, mobile: 375 };

// ── Main App ───────────────────────────────────────
export default function App() {
  const [faqs, setFaqs] = useState(DEFAULT_FAQS);
  const [count, setCount] = useState(5);
  const [platform, setPlatform] = useState("Unbounce");
  const [viewport, setViewport] = useState("desktop");
  const [leftTab, setLeftTab] = useState("style");
  const [dCfg, setDCfg] = useState(mkDefault());
  const [tCfg, setTCfg] = useState({
    ...mkDefault(),
    qSize: 15,
    aSize: 13,
    padding: 16,
    maxWidth: 560,
  });
  const [mCfg, setMCfg] = useState({
    ...mkDefault(),
    qSize: 14,
    aSize: 13,
    padding: 14,
    gap: 8,
    maxWidth: 360,
  });
  const [codeTab, setCodeTab] = useState("css");
  const [copied, setCopied] = useState(false);

  const cfgMap = {
    desktop: [dCfg, setDCfg],
    tablet: [tCfg, setTCfg],
    mobile: [mCfg, setMCfg],
  };
  const [curCfg, setCurCfg] = cfgMap[viewport];

  const { css, html, js } = generateCode(
    faqs,
    count,
    dCfg,
    tCfg,
    mCfg,
    platform,
  );
  const codeMap = { css, html, js };

  function copy() {
    const all = `/* CSS */\n${css}\n\n/* HTML */\n${html}\n\n/* JS */\n${js}`;
    navigator.clipboard.writeText(
      codeTab === "all" ? all : codeMap[codeTab] || "",
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const VP_LABELS = {
    desktop: "🖥 Desktop",
    tablet: "📟 Tablet",
    mobile: "📱 Mobile",
  };

  // platform how-to note
  const HOW_TO = {
    Unbounce:
      "CSS → Stylesheets · HTML → HTML widget · JS → Javascripts > Before Body End Tag. Test on published page only.",
    Webflow:
      "CSS → Site Settings > Custom Code > Head · JS → Before </body> · HTML in Embed block.",
    Elementor:
      "CSS → Elementor > Custom CSS · JS → Theme > Functions · HTML in HTML widget.",
    Shopify: "CSS → theme.css · JS → theme.js · HTML in section .liquid file.",
    Framer: "CSS + JS → Site Settings > Custom Code · HTML in Code component.",
    "Generic HTML":
      "CSS in <style> tag · HTML where needed · JS before </body>.",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "#080810",
        color: "#e4e4f0",
        fontFamily: "Inter, sans-serif",
        fontSize: 13,
        overflow: "hidden",
      }}
    >
      {/* ── Top bar ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 16px",
          borderBottom: "1px solid #1e1e30",
          flexShrink: 0,
          flexWrap: "wrap",
          background: "#0d0d18",
        }}
      >
        <span
          style={{
            fontWeight: 700,
            fontSize: 15,
            color: "#e4e4f0",
            letterSpacing: -0.5,
          }}
        >
          FAQ <span style={{ color: "#6c47ff" }}>Builder</span>
        </span>
        <div
          style={{
            width: 1,
            height: 16,
            background: "#2a2a3a",
            margin: "0 4px",
          }}
        />
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {PLATFORMS.map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              style={{
                padding: "4px 10px",
                fontSize: 11,
                borderRadius: 6,
                cursor: "pointer",
                border: `1px solid ${platform === p ? "#6c47ff" : "#2a2a3a"}`,
                background:
                  platform === p ? "rgba(108,71,255,0.2)" : "transparent",
                color: platform === p ? "#a58dff" : "#5a5a78",
                fontWeight: platform === p ? 600 : 400,
              }}
            >
              {p}
            </button>
          ))}
        </div>
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 11, color: "#5a5a78" }}>
            Showing {count} of {faqs.length}
          </span>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left panel */}
        <div
          style={{
            width: 250,
            borderRight: "1px solid #1e1e30",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
            background: "#0d0d18",
          }}
        >
          {/* Tab switcher */}
          <div style={{ display: "flex", borderBottom: "1px solid #1e1e30" }}>
            {["style", "content"].map((t) => (
              <button
                key={t}
                onClick={() => setLeftTab(t)}
                style={{
                  flex: 1,
                  padding: "9px 4px",
                  fontSize: 11,
                  border: "none",
                  cursor: "pointer",
                  background: leftTab === t ? "#13131f" : "transparent",
                  color: leftTab === t ? "#e4e4f0" : "#5a5a78",
                  fontWeight: leftTab === t ? 600 : 400,
                  textTransform: "capitalize",
                  borderBottom: `2px solid ${leftTab === t ? "#6c47ff" : "transparent"}`,
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Viewport switcher (only in style tab) */}
          {leftTab === "style" && (
            <div style={{ padding: "10px 14px 0", display: "flex", gap: 4 }}>
              {["desktop", "tablet", "mobile"].map((v) => (
                <button
                  key={v}
                  onClick={() => setViewport(v)}
                  style={{
                    flex: 1,
                    padding: "4px 2px",
                    fontSize: 10,
                    borderRadius: 5,
                    cursor: "pointer",
                    border: `1px solid ${viewport === v ? "#6c47ff" : "#2a2a3a"}`,
                    background:
                      viewport === v ? "rgba(108,71,255,0.15)" : "transparent",
                    color: viewport === v ? "#a58dff" : "#5a5a78",
                    textAlign: "center",
                  }}
                >
                  {v === "desktop" ? "🖥" : v === "tablet" ? "📟" : "📱"} {v}
                </button>
              ))}
            </div>
          )}
          {leftTab === "style" && (
            <div
              style={{
                margin: "8px 14px 0",
                padding: "5px 8px",
                background: "rgba(108,71,255,0.08)",
                borderRadius: 5,
                fontSize: 10,
                color: "#5a5a78",
              }}
            >
              Editing <strong style={{ color: "#a58dff" }}>{viewport}</strong> —
              other breakpoints unaffected
            </div>
          )}

          <div style={{ flex: 1, overflowY: "auto" }}>
            {leftTab === "style" ? (
              <StylePanel cfg={curCfg} onChange={setCurCfg} />
            ) : (
              <ContentPanel
                faqs={faqs}
                setFaqs={setFaqs}
                count={count}
                setCount={setCount}
              />
            )}
          </div>
        </div>

        {/* Center preview */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Preview toolbar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              borderBottom: "1px solid #1e1e30",
              flexShrink: 0,
              background: "#0d0d18",
            }}
          >
            <span style={{ fontSize: 11, color: "#5a5a78" }}>Preview</span>
            <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
              {["desktop", "tablet", "mobile"].map((v) => (
                <button
                  key={v}
                  onClick={() => setViewport(v)}
                  style={{
                    padding: "4px 10px",
                    fontSize: 11,
                    borderRadius: 6,
                    cursor: "pointer",
                    border: `1px solid ${viewport === v ? "#6c47ff" : "#2a2a3a"}`,
                    background:
                      viewport === v ? "rgba(108,71,255,0.15)" : "transparent",
                    color: viewport === v ? "#a58dff" : "#5a5a78",
                  }}
                >
                  {VP_LABELS[v]}
                </button>
              ))}
            </div>
          </div>

          {/* Stage */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: 24,
              background: "#0a0a14",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                width: VP_WIDTHS[viewport],
                maxWidth: VP_WIDTHS[viewport],
                background: "#fff",
                borderRadius: 10,
                padding: 28,
                boxShadow: "0 4px 40px rgba(0,0,0,0.5)",
                transition: "width 0.3s, max-width 0.3s",
                boxSizing: "border-box",
              }}
            >
              <FAQPreview faqs={faqs} count={count} cfg={curCfg} />
            </div>
          </div>
        </div>

        {/* Right code panel */}
        <div
          style={{
            width: 300,
            borderLeft: "1px solid #1e1e30",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
            background: "#0d0d18",
          }}
        >
          {/* Code tab bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "8px 10px",
              borderBottom: "1px solid #1e1e30",
              flexShrink: 0,
            }}
          >
            {["css", "html", "js"].map((t) => (
              <button
                key={t}
                onClick={() => setCodeTab(t)}
                style={{
                  padding: "4px 10px",
                  fontSize: 11,
                  borderRadius: 5,
                  cursor: "pointer",
                  border: `1px solid ${codeTab === t ? "#6c47ff" : "#2a2a3a"}`,
                  background:
                    codeTab === t ? "rgba(108,71,255,0.15)" : "transparent",
                  color: codeTab === t ? "#a58dff" : "#5a5a78",
                  textTransform: "uppercase",
                  fontWeight: codeTab === t ? 600 : 400,
                }}
              >
                {t}
              </button>
            ))}
            <button
              onClick={copy}
              style={{
                marginLeft: "auto",
                padding: "4px 12px",
                fontSize: 11,
                borderRadius: 5,
                cursor: "pointer",
                border: "none",
                background: copied ? "#16a34a" : "#6c47ff",
                color: "#fff",
                fontWeight: 600,
              }}
            >
              {copied ? "✓ Copied" : "Copy"}
            </button>
          </div>

          {/* Code output */}
          <pre
            style={{
              flex: 1,
              overflowY: "auto",
              overflowX: "auto",
              margin: 0,
              padding: "12px 14px",
              fontSize: 10,
              lineHeight: 1.75,
              fontFamily: "Courier New, monospace",
              color: "#abb2bf",
              whiteSpace: "pre",
              background: "#080810",
            }}
          >
            {codeMap[codeTab]}
          </pre>

          {/* How to use */}
          <div
            style={{
              padding: "10px 14px",
              borderTop: "1px solid #1e1e30",
              fontSize: 10,
              color: "#5a5a78",
              lineHeight: 1.6,
              background: "#0d0d18",
            }}
          >
            <span style={{ color: "#a58dff", fontWeight: 600 }}>
              How to use · {platform}
            </span>
            <br />
            {HOW_TO[platform]}
          </div>
        </div>
      </div>
    </div>
  );
}
/* fixes to be done. 
1. background color design everything same as marquee builder
2. Add smooth slide up and down
3. When the colors change in any one all it should show the effect in the mobile and tablet also.
4. currently giving html, cssa and js seprate, but I want it for custom html all code in one. so that i can   copy paste in a single click.
5.I want to add font-family that are not availble.
6. only few font-weights work
7. Add more Icons for open and close state
8. Add Padding setting for both x and y axies. so that I can have custom 


*/