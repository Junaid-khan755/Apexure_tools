import { useState, useRef, useEffect, useCallback } from "react";

// ── Constants ────────────────────────────────────────────────────────────────
const FONTS = [
  "Inter",
  "Georgia",
  "Playfair Display",
  "Montserrat",
  "Raleway",
  "Lato",
  "Poppins",
  "Roboto",
  "Oswald",
  "Merriweather",
  "Nunito",
  "DM Sans",
  "Helvetica Neue",
  "Trebuchet MS",
  "Verdana",
  "Courier New",
  "system-ui",
];
const WEIGHTS = ["300", "400", "500", "600", "700", "800"];
const ALIGNS = ["left", "center", "right"];
const PLATFORMS = [
  "Unbounce",
  "Webflow",
  "Elementor",
  "Shopify",
  "Framer",
  "Generic HTML",
];
const NAV_ITEMS = [
  { id: "faq", label: "FAQ", icon: "❓" },
  { id: "testimonial", label: "Testimonials", icon: "💬" },
];

const NAV_W = 200;

// ── Default data ─────────────────────────────────────────────────────────────
const DEFAULT_FAQS = [
  {
    id: 1,
    q: "What is your refund policy?",
    a: "We offer a 30-day money-back guarantee. Contact support and we'll process within 3–5 business days.",
  },
  {
    id: 2,
    q: "How do I cancel my subscription?",
    a: "Cancel anytime from your account dashboard under Settings > Billing. Access continues until period ends.",
  },
  {
    id: 3,
    q: "Do you offer customer support?",
    a: "Yes! 24/7 live chat for all paid plans. Free plan users get help centre and community forums.",
  },
  {
    id: 4,
    q: "Is my data secure?",
    a: "We use AES-256 encryption and TLS 1.3. We are SOC 2 Type II certified.",
  },
  {
    id: 5,
    q: "Can I upgrade or downgrade my plan?",
    a: "Yes, anytime. Upgrades are immediate and prorated. Downgrades take effect next billing cycle.",
  },
];

const DEFAULT_TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "CEO",
    company: "NovaTech",
    quote:
      "This product completely transformed how our team works. The ROI was visible within the first month. Absolutely game-changing.",
    stars: 5,
    initials: "SC",
    avatarBg: "#6c47ff",
  },
  {
    id: 2,
    name: "Marcus Reid",
    role: "Product Lead",
    company: "Stride Labs",
    quote:
      "I've tried dozens of tools and nothing comes close. The attention to detail is remarkable and the support team is outstanding.",
    stars: 5,
    initials: "MR",
    avatarBg: "#0ea5e9",
  },
  {
    id: 3,
    name: "Priya Kapoor",
    role: "Founder",
    company: "Bloom Agency",
    quote:
      "Switched from a competitor and never looked back. Setup took under an hour and the results speak for themselves.",
    stars: 4,
    initials: "PK",
    avatarBg: "#f59e0b",
  },
  {
    id: 4,
    name: "James Okafor",
    role: "Marketing Dir",
    company: "Vanta Co",
    quote:
      "Our conversion rate jumped 40% after implementing this. The team was incredibly helpful throughout the onboarding process.",
    stars: 5,
    initials: "JO",
    avatarBg: "#10b981",
  },
  {
    id: 5,
    name: "Lena Fischer",
    role: "CTO",
    company: "Axle Systems",
    quote:
      "Rock-solid reliability and a developer experience that's truly a joy. We've built our entire pipeline around this platform.",
    stars: 5,
    initials: "LF",
    avatarBg: "#ec4899",
  },
  {
    id: 6,
    name: "Tom Nguyen",
    role: "Operations",
    company: "Scale HQ",
    quote:
      "The automation features alone saved us 20 hours a week. I recommend it to every founder I meet.",
    stars: 4,
    initials: "TN",
    avatarBg: "#8b5cf6",
  },
];

// ── Shared helpers ────────────────────────────────────────────────────────────
const mkFaqDesktop = () => ({
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
const mkFaqTablet = () => ({
  ...mkFaqDesktop(),
  qSize: 15,
  aSize: 13,
  padding: 16,
  maxWidth: 560,
});
const mkFaqMobile = () => ({
  ...mkFaqDesktop(),
  qSize: 14,
  aSize: 13,
  padding: 14,
  gap: 8,
  maxWidth: 360,
});

const mkTestDesktop = () => ({
  layout: "card-grid",
  columns: 3,
  sectionBg: "#f9fafb",
  cardBg: "#ffffff",
  cardBorderColor: "#e5e7eb",
  cardBorderWidth: 1,
  cardRadius: 14,
  cardPadding: 24,
  cardGap: 20,
  shadow: "0 2px 16px rgba(0,0,0,0.08)",
  maxWidth: 1100,
  quoteColor: "#1f2937",
  quoteSize: 15,
  quoteWeight: "400",
  quoteFont: "Inter",
  quoteAlign: "left",
  nameColor: "#111827",
  nameSize: 14,
  nameWeight: "600",
  nameFont: "Inter",
  roleColor: "#6b7280",
  roleSize: 12,
  roleWeight: "400",
  roleFont: "Inter",
  starColor: "#f59e0b",
  starSize: 16,
  showStars: true,
  avatarSize: 48,
  avatarRadius: 50,
  showAvatar: true,
  showCompany: true,
  companyColor: "#9ca3af",
  companySize: 11,
  quoteMarkColor: "#6c47ff",
  quoteMarkSize: 48,
  showQuoteMark: true,
  // carousel / scroll
  navStyle: "sides", // sides | bottom | hidden
  navBtnBg: "#ffffff",
  navBtnColor: "#111827",
  navBtnRadius: 50,
  navBtnSize: 36,
  navBtnIcon: "arrow", // arrow | chevron | triangle | custom
  navBtnCustomPrev: "←",
  navBtnCustomNext: "→",
  showDots: true,
  dotColor: "#6c47ff",
  dotSize: 8,
  autoPlay: false,
  autoPlaySpeed: 3000,
  dragScroll: true,
});
const mkTestTablet = () => ({
  ...mkTestDesktop(),
  columns: 2,
  cardPadding: 18,
  quoteSize: 14,
  maxWidth: 700,
});
const mkTestMobile = () => ({
  ...mkTestDesktop(),
  columns: 1,
  layout: "carousel",
  cardPadding: 16,
  quoteSize: 13,
  maxWidth: 400,
  navStyle: "bottom",
});

// ── Small UI atoms ────────────────────────────────────────────────────────────
const S = {
  // dark panel bg, border, text
  panel: { background: "#0d0d18" },
  border: "1px solid #1e1e30",
  text: "#e4e4f0",
  muted: "#5a5a78",
  accent: "#6c47ff",
};

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
        <span style={{ fontSize: 11, color: S.muted }}>{label}</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: S.text }}>
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
        style={{ width: "100%", accentColor: S.accent, cursor: "pointer" }}
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
      <span style={{ fontSize: 11, color: S.muted, flexShrink: 0 }}>
        {label}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: 4,
            background: val,
            border: "1px solid #2a2a3a",
          }}
        />
        <input
          type="color"
          value={val.startsWith("#") && val.length === 7 ? val : "#6c47ff"}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: 20,
            height: 20,
            border: "none",
            background: "none",
            cursor: "pointer",
            padding: 0,
          }}
        />
        <input
          type="text"
          value={val}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: 68,
            fontSize: 10,
            padding: "3px 5px",
            borderRadius: 4,
            border: "1px solid #2a2a3a",
            background: "#080810",
            color: S.text,
            fontFamily: "monospace",
          }}
        />
      </div>
    </div>
  );
}

function SelectRow({ label, val, options, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
      }}
    >
      <span style={{ fontSize: 11, color: S.muted, flexShrink: 0 }}>
        {label}
      </span>
      <select
        value={val}
        onChange={(e) => onChange(e.target.value)}
        style={{
          fontSize: 11,
          padding: "3px 6px",
          borderRadius: 4,
          border: "1px solid #2a2a3a",
          background: "#080810",
          color: S.text,
          minWidth: 105,
          maxWidth: 130,
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

function Toggle({ label, val, onChange }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
      }}
    >
      <span style={{ fontSize: 11, color: S.muted }}>{label}</span>
      <div
        onClick={() => onChange(!val)}
        style={{
          width: 36,
          height: 20,
          borderRadius: 10,
          background: val ? "#6c47ff" : "#2a2a3a",
          position: "relative",
          cursor: "pointer",
          transition: "background .2s",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 3,
            left: val ? 18 : 3,
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "#fff",
            transition: "left .2s",
          }}
        />
      </div>
    </div>
  );
}

function SHead({ title }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: "0.8px",
        textTransform: "uppercase",
        color: "#3a3a55",
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

function TabBar({ tabs, active, onSelect, style = {} }) {
  return (
    <div style={{ display: "flex", gap: 4, ...style }}>
      {tabs.map((t) => (
        <button
          key={t.id || t}
          onClick={() => onSelect(t.id || t)}
          style={{
            padding: "4px 10px",
            fontSize: 11,
            borderRadius: 6,
            cursor: "pointer",
            border: `1px solid ${active === (t.id || t) ? "#6c47ff" : "#2a2a3a"}`,
            background:
              active === (t.id || t) ? "rgba(108,71,255,0.18)" : "transparent",
            color: active === (t.id || t) ? "#a58dff" : S.muted,
            fontWeight: active === (t.id || t) ? 600 : 400,
          }}
        >
          {t.label || t}
        </button>
      ))}
    </div>
  );
}

const VP_W = { desktop: "100%", tablet: 620, mobile: 375 };
const VP_LABELS = [
  { id: "desktop", label: "🖥 Desktop" },
  { id: "tablet", label: "📟 Tablet" },
  { id: "mobile", label: "📱 Mobile" },
];

const HOW_TO = {
  Unbounce:
    "CSS → Stylesheets · HTML → HTML widget · JS → Before Body End Tag. Test on published page only.",
  Webflow:
    "CSS → Site Settings > Head · JS → Before </body> · HTML in Embed block.",
  Elementor: "CSS → Custom CSS · JS → Theme > Functions · HTML in HTML widget.",
  Shopify: "CSS → theme.css · JS → theme.js · HTML in .liquid section.",
  Framer: "CSS+JS → Site Settings > Custom Code · HTML in Code component.",
  "Generic HTML": "CSS in <style> tag · HTML where needed · JS before </body>.",
};

// ════════════════════════════════════════════════════════════════════════════
// FAQ SECTION
// ════════════════════════════════════════════════════════════════════════════
function FaqStylePanel({ cfg, onChange }) {
  const up = (k, v) => onChange({ ...cfg, [k]: v });
  return (
    <div style={{ padding: "12px 14px" }}>
      <SHead title="Container" />
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
        label="Gap"
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

      <SHead title="Question" />
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
      <SelectRow
        label="Font family"
        val={cfg.qFont}
        options={FONTS}
        onChange={(v) => up("qFont", v)}
      />
      <SelectRow
        label="Font weight"
        val={cfg.qWeight}
        options={WEIGHTS}
        onChange={(v) => up("qWeight", v)}
      />
      <SelectRow
        label="Alignment"
        val={cfg.qAlign}
        options={ALIGNS}
        onChange={(v) => up("qAlign", v)}
      />

      <SHead title="Answer" />
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
      <SelectRow
        label="Font family"
        val={cfg.aFont}
        options={FONTS}
        onChange={(v) => up("aFont", v)}
      />
      <SelectRow
        label="Font weight"
        val={cfg.aWeight}
        options={WEIGHTS}
        onChange={(v) => up("aWeight", v)}
      />
      <SelectRow
        label="Alignment"
        val={cfg.aAlign}
        options={ALIGNS}
        onChange={(v) => up("aAlign", v)}
      />

      <SHead title="Active / Open state" />
      <ColorRow
        label="Active bg"
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

function FaqContentPanel({ faqs, setFaqs, count, setCount }) {
  const [editing, setEditing] = useState(null);
  function add() {
    const n = [
      ...faqs,
      { id: Date.now(), q: "New question", a: "Your answer here." },
    ];
    setFaqs(n);
    setCount((c) => Math.min(c + 1, n.length));
  }
  function remove(i) {
    const n = faqs.filter((_, x) => x !== i);
    setFaqs(n);
    setCount((c) => Math.max(1, Math.min(c, n.length)));
  }
  function upd(i, k, v) {
    setFaqs(faqs.map((f, x) => (x === i ? { ...f, [k]: v } : f)));
  }
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

function FaqPreview({ faqs, count, cfg }) {
  const [open, setOpen] = useState(null);
  return (
    <div
      style={{
        fontFamily: `'${cfg.qFont}',sans-serif`,
        maxWidth: cfg.maxWidth,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: cfg.gap,
      }}
    >
      {faqs.slice(0, count).map((faq, i) => {
        const isOpen = open === i;
        return (
          <div
            key={faq.id}
            style={{
              background: isOpen ? cfg.activeBg : cfg.bgColor,
              border: `${cfg.borderWidth}px solid ${isOpen ? cfg.iconColor : cfg.borderColor}`,
              borderRadius: cfg.borderRadius,
              overflow: "hidden",
              transition: "all .2s",
            }}
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
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
                  fontFamily: `'${cfg.qFont}',sans-serif`,
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
                  transition: "transform .2s",
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
                    fontFamily: `'${cfg.aFont}',sans-serif`,
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

// ════════════════════════════════════════════════════════════════════════════
// TESTIMONIAL SECTION
// ════════════════════════════════════════════════════════════════════════════
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
  { id: "arrow", label: "Arrow  ← →" },
  { id: "chevron", label: "Chevron  ‹ ›" },
  { id: "triangle", label: "Triangle  ◄ ►" },
  { id: "custom", label: "Custom" },
];

function navIcon(cfg, dir) {
  if (cfg.navBtnIcon === "arrow") return dir === "prev" ? "←" : "→";
  if (cfg.navBtnIcon === "chevron") return dir === "prev" ? "‹" : "›";
  if (cfg.navBtnIcon === "triangle") return dir === "prev" ? "◄" : "►";
  return dir === "prev" ? cfg.navBtnCustomPrev : cfg.navBtnCustomNext;
}

function Stars({ count, color, size }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          style={{
            color: i <= count ? color : "#d1d5db",
            fontSize: size,
            lineHeight: 1,
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function Avatar({ t, size, radius }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: `${radius}%`,
        background: t.avatarBg || "#6c47ff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        color: "#fff",
        fontWeight: 700,
        fontSize: size * 0.36,
        userSelect: "none",
      }}
    >
      {t.initials || t.name?.slice(0, 2).toUpperCase()}
    </div>
  );
}

function TestiCard({ t, cfg, style = {} }) {
  return (
    <div
      style={{
        background: cfg.cardBg,
        border: `${cfg.cardBorderWidth}px solid ${cfg.cardBorderColor}`,
        borderRadius: cfg.cardRadius,
        padding: cfg.cardPadding,
        boxShadow: cfg.shadow,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        flex: "0 0 auto",
        ...style,
      }}
    >
      {cfg.showQuoteMark && (
        <div
          style={{
            fontSize: cfg.quoteMarkSize,
            color: cfg.quoteMarkColor,
            lineHeight: 0.8,
            fontFamily: "Georgia,serif",
            marginBottom: -6,
          }}
        >
          "
        </div>
      )}
      <p
        style={{
          fontFamily: `'${cfg.quoteFont}',sans-serif`,
          fontSize: cfg.quoteSize,
          fontWeight: cfg.quoteWeight,
          color: cfg.quoteColor,
          textAlign: cfg.quoteAlign,
          margin: 0,
          lineHeight: 1.65,
          flex: 1,
        }}
      >
        {t.quote}
      </p>
      {cfg.showStars && (
        <Stars count={t.stars} color={cfg.starColor} size={cfg.starSize} />
      )}
      <div
        style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}
      >
        {cfg.showAvatar && (
          <Avatar t={t} size={cfg.avatarSize} radius={cfg.avatarRadius} />
        )}
        <div>
          <div
            style={{
              fontFamily: `'${cfg.nameFont}',sans-serif`,
              fontSize: cfg.nameSize,
              fontWeight: cfg.nameWeight,
              color: cfg.nameColor,
            }}
          >
            {t.name}
          </div>
          <div
            style={{
              fontFamily: `'${cfg.roleFont}',sans-serif`,
              fontSize: cfg.roleSize,
              fontWeight: cfg.roleWeight,
              color: cfg.roleColor,
            }}
          >
            {t.role}
            {cfg.showCompany && t.company ? (
              <span
                style={{ color: cfg.companyColor, fontSize: cfg.companySize }}
              >
                {" "}
                · {t.company}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

// Nav button
function NavBtn({ dir, cfg, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: cfg.navBtnSize,
        height: cfg.navBtnSize,
        borderRadius: `${cfg.navBtnRadius}%`,
        background: cfg.navBtnBg,
        border: `1px solid ${cfg.cardBorderColor}`,
        color: cfg.navBtnColor,
        fontSize: Math.round(cfg.navBtnSize * 0.45),
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        transition: "all .15s",
        fontWeight: 600,
        lineHeight: 1,
      }}
    >
      {navIcon(cfg, dir)}
    </button>
  );
}

// Dot indicator
function Dots({ total, active, cfg, onSelect }) {
  if (!cfg.showDots) return null;
  return (
    <div
      style={{
        display: "flex",
        gap: 6,
        justifyContent: "center",
        marginTop: 14,
        flexWrap: "wrap",
      }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          onClick={() => onSelect(i)}
          style={{
            width: i === active ? cfg.dotSize * 2.2 : cfg.dotSize,
            height: cfg.dotSize,
            borderRadius: cfg.dotSize,
            background: i === active ? cfg.dotColor : "#d1d5db",
            cursor: "pointer",
            transition: "all .2s",
          }}
        />
      ))}
    </div>
  );
}

// ── Layout renderers ──────────────────────────────────────────────────────────
function CarouselLayout({ items, cfg }) {
  const [idx, setIdx] = useState(0);
  const total = items.length;
  const prev = () => setIdx((i) => (i - 1 + total) % total);
  const next = () => setIdx((i) => (i + 1) % total);

  useEffect(() => {
    if (!cfg.autoPlay) return;
    const t = setInterval(next, cfg.autoPlaySpeed || 3000);
    return () => clearInterval(t);
  }, [cfg.autoPlay, cfg.autoPlaySpeed, total]);

  const navSides = cfg.navStyle === "sides";
  const navBottom = cfg.navStyle === "bottom";

  return (
    <div
      style={{
        maxWidth: cfg.maxWidth,
        margin: "0 auto",
        background: cfg.sectionBg,
        padding: 16,
        borderRadius: 12,
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        {navSides && <NavBtn dir="prev" cfg={cfg} onClick={prev} />}
        <div style={{ flex: 1, overflow: "hidden" }}>
          <div
            style={{
              display: "flex",
              transition: "transform .35s ease",
              transform: `translateX(-${idx * 100}%)`,
            }}
          >
            {items.map((t) => (
              <div
                key={t.id}
                style={{
                  minWidth: "100%",
                  padding: "0 4px",
                  boxSizing: "border-box",
                }}
              >
                <TestiCard t={t} cfg={cfg} />
              </div>
            ))}
          </div>
        </div>
        {navSides && <NavBtn dir="next" cfg={cfg} onClick={next} />}
      </div>
      {navBottom && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 10,
            marginTop: 14,
          }}
        >
          <NavBtn dir="prev" cfg={cfg} onClick={prev} />
          <NavBtn dir="next" cfg={cfg} onClick={next} />
        </div>
      )}
      <Dots total={total} active={idx} cfg={cfg} onSelect={setIdx} />
    </div>
  );
}

function HScrollLayout({ items, cfg }) {
  const ref = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const scroll = (dir) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir === "next" ? 320 : -320, behavior: "smooth" });
  };
  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };
  const navSides = cfg.navStyle === "sides";
  const navBottom = cfg.navStyle === "bottom";
  return (
    <div
      style={{
        maxWidth: cfg.maxWidth,
        margin: "0 auto",
        background: cfg.sectionBg,
        padding: 16,
        borderRadius: 12,
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        {navSides && canPrev && (
          <NavBtn dir="prev" cfg={cfg} onClick={() => scroll("prev")} />
        )}
        <div
          ref={ref}
          onScroll={onScroll}
          style={{
            flex: 1,
            display: "flex",
            gap: cfg.cardGap,
            overflowX: cfg.dragScroll ? "auto" : "scroll",
            scrollSnapType: "x mandatory",
            paddingBottom: 4,
            scrollbarWidth: "none",
            cursor: cfg.dragScroll ? "grab" : "default",
          }}
        >
          {items.map((t) => (
            <div
              key={t.id}
              style={{ scrollSnapAlign: "start", minWidth: 280, maxWidth: 320 }}
            >
              <TestiCard t={t} cfg={cfg} style={{ height: "100%" }} />
            </div>
          ))}
        </div>
        {navSides && canNext && (
          <NavBtn dir="next" cfg={cfg} onClick={() => scroll("next")} />
        )}
      </div>
      {navBottom && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 10,
            marginTop: 14,
          }}
        >
          <NavBtn dir="prev" cfg={cfg} onClick={() => scroll("prev")} />
          <NavBtn dir="next" cfg={cfg} onClick={() => scroll("next")} />
        </div>
      )}
    </div>
  );
}

function CardGridLayout({ items, cfg }) {
  const cols = cfg.columns || 3;
  return (
    <div
      style={{
        maxWidth: cfg.maxWidth,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: `repeat(${cols},1fr)`,
        gap: cfg.cardGap,
        background: cfg.sectionBg,
        padding: 16,
        borderRadius: 12,
      }}
    >
      {items.map((t) => (
        <TestiCard key={t.id} t={t} cfg={cfg} />
      ))}
    </div>
  );
}

function SingleQuoteLayout({ items, cfg }) {
  const [idx, setIdx] = useState(0);
  const total = items.length;
  const t = items[idx];
  return (
    <div
      style={{
        maxWidth: cfg.maxWidth,
        margin: "0 auto",
        background: cfg.sectionBg,
        padding: 32,
        borderRadius: 12,
        textAlign: "center",
      }}
    >
      {cfg.showQuoteMark && (
        <div
          style={{
            fontSize: cfg.quoteMarkSize * 1.5,
            color: cfg.quoteMarkColor,
            lineHeight: 0.8,
            fontFamily: "Georgia,serif",
            marginBottom: 16,
          }}
        >
          "
        </div>
      )}
      <p
        style={{
          fontFamily: `'${cfg.quoteFont}',sans-serif`,
          fontSize: cfg.quoteSize + 4,
          fontWeight: cfg.quoteWeight,
          color: cfg.quoteColor,
          lineHeight: 1.7,
          margin: "0 auto 20px",
          maxWidth: 640,
        }}
      >
        {t.quote}
      </p>
      {cfg.showStars && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <Stars count={t.stars} color={cfg.starColor} size={cfg.starSize} />
        </div>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
        }}
      >
        {cfg.showAvatar && (
          <Avatar t={t} size={cfg.avatarSize} radius={cfg.avatarRadius} />
        )}
        <div style={{ textAlign: "left" }}>
          <div
            style={{
              fontSize: cfg.nameSize,
              fontWeight: cfg.nameWeight,
              color: cfg.nameColor,
            }}
          >
            {t.name}
          </div>
          <div style={{ fontSize: cfg.roleSize, color: cfg.roleColor }}>
            {t.role}
            {cfg.showCompany && t.company ? ` · ${t.company}` : ""}
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 10,
          marginTop: 20,
        }}
      >
        <NavBtn
          dir="prev"
          cfg={cfg}
          onClick={() => setIdx((i) => (i - 1 + total) % total)}
        />
        <NavBtn
          dir="next"
          cfg={cfg}
          onClick={() => setIdx((i) => (i + 1) % total)}
        />
      </div>
      <Dots total={total} active={idx} cfg={cfg} onSelect={setIdx} />
    </div>
  );
}

function ListLayout({ items, cfg }) {
  return (
    <div
      style={{
        maxWidth: cfg.maxWidth,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: cfg.cardGap,
        background: cfg.sectionBg,
        padding: 16,
        borderRadius: 12,
      }}
    >
      {items.map((t) => (
        <div
          key={t.id}
          style={{
            background: cfg.cardBg,
            border: `${cfg.cardBorderWidth}px solid ${cfg.cardBorderColor}`,
            borderRadius: cfg.cardRadius,
            padding: cfg.cardPadding,
            boxShadow: cfg.shadow,
            display: "flex",
            gap: 14,
            alignItems: "flex-start",
          }}
        >
          {cfg.showAvatar && (
            <Avatar t={t} size={cfg.avatarSize} radius={cfg.avatarRadius} />
          )}
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 6,
                flexWrap: "wrap",
                gap: 6,
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: cfg.nameSize,
                    fontWeight: cfg.nameWeight,
                    color: cfg.nameColor,
                  }}
                >
                  {t.name}
                </span>
                <span
                  style={{
                    fontSize: cfg.roleSize,
                    color: cfg.roleColor,
                    marginLeft: 8,
                  }}
                >
                  {t.role}
                  {cfg.showCompany && t.company ? ` · ${t.company}` : ""}
                </span>
              </div>
              {cfg.showStars && (
                <Stars
                  count={t.stars}
                  color={cfg.starColor}
                  size={cfg.starSize}
                />
              )}
            </div>
            <p
              style={{
                fontFamily: `'${cfg.quoteFont}',sans-serif`,
                fontSize: cfg.quoteSize,
                color: cfg.quoteColor,
                margin: 0,
                lineHeight: 1.65,
              }}
            >
              {t.quote}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function InlineAvatarLayout({ items, cfg }) {
  return (
    <div
      style={{
        maxWidth: cfg.maxWidth,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: `repeat(${Math.min(cfg.columns, 2)},1fr)`,
        gap: cfg.cardGap,
        background: cfg.sectionBg,
        padding: 16,
        borderRadius: 12,
      }}
    >
      {items.map((t) => (
        <div
          key={t.id}
          style={{
            background: cfg.cardBg,
            border: `${cfg.cardBorderWidth}px solid ${cfg.cardBorderColor}`,
            borderRadius: cfg.cardRadius,
            padding: cfg.cardPadding,
            boxShadow: cfg.shadow,
            display: "flex",
            gap: 14,
            alignItems: "center",
          }}
        >
          {cfg.showAvatar && (
            <Avatar
              t={t}
              size={cfg.avatarSize * 1.2}
              radius={cfg.avatarRadius}
            />
          )}
          <div style={{ flex: 1 }}>
            {cfg.showQuoteMark && (
              <span
                style={{
                  fontSize: cfg.quoteMarkSize * 0.7,
                  color: cfg.quoteMarkColor,
                  fontFamily: "Georgia,serif",
                }}
              >
                "
              </span>
            )}
            <p
              style={{
                fontFamily: `'${cfg.quoteFont}',sans-serif`,
                fontSize: cfg.quoteSize,
                color: cfg.quoteColor,
                margin: "4px 0 8px",
                lineHeight: 1.55,
              }}
            >
              {t.quote}
            </p>
            {cfg.showStars && (
              <Stars
                count={t.stars}
                color={cfg.starColor}
                size={cfg.starSize - 2}
              />
            )}
            <div
              style={{
                marginTop: 6,
                fontSize: cfg.nameSize - 1,
                fontWeight: cfg.nameWeight,
                color: cfg.nameColor,
              }}
            >
              {t.name}
              <span
                style={{
                  fontWeight: 400,
                  color: cfg.roleColor,
                  marginLeft: 6,
                  fontSize: cfg.roleSize,
                }}
              >
                {t.role}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TestiPreview({ items, count, cfg }) {
  const vis = items.slice(0, count);
  if (cfg.layout === "carousel")
    return <CarouselLayout items={vis} cfg={cfg} />;
  if (cfg.layout === "h-scroll") return <HScrollLayout items={vis} cfg={cfg} />;
  if (cfg.layout === "single-quote")
    return <SingleQuoteLayout items={vis} cfg={cfg} />;
  if (cfg.layout === "list") return <ListLayout items={vis} cfg={cfg} />;
  if (cfg.layout === "inline-avatar")
    return <InlineAvatarLayout items={vis} cfg={cfg} />;
  return <CardGridLayout items={vis} cfg={cfg} />;
}

// ── Testimonial style panel ───────────────────────────────────────────────────
function TestiStylePanel({ cfg, onChange }) {
  const up = (k, v) => onChange({ ...cfg, [k]: v });
  return (
    <div style={{ padding: "12px 14px" }}>
      <SHead title="Layout" />
      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: S.muted, marginBottom: 6 }}>
          Pattern
        </div>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}
        >
          {LAYOUTS.map((l) => (
            <button
              key={l.id}
              onClick={() => up("layout", l.id)}
              style={{
                padding: "5px 6px",
                fontSize: 10,
                borderRadius: 5,
                cursor: "pointer",
                border: `1px solid ${cfg.layout === l.id ? "#6c47ff" : "#2a2a3a"}`,
                background:
                  cfg.layout === l.id ? "rgba(108,71,255,0.18)" : "transparent",
                color: cfg.layout === l.id ? "#a58dff" : S.muted,
                textAlign: "center",
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
      {(cfg.layout === "card-grid" || cfg.layout === "inline-avatar") && (
        <Slider
          label="Columns"
          min={1}
          max={4}
          val={cfg.columns}
          onChange={(v) => up("columns", v)}
        />
      )}
      <Slider
        label="Max width"
        min={300}
        max={1400}
        step={10}
        val={cfg.maxWidth}
        unit="px"
        onChange={(v) => up("maxWidth", v)}
      />

      <SHead title="Section" />
      <ColorRow
        label="Section background"
        val={cfg.sectionBg}
        onChange={(v) => up("sectionBg", v)}
      />

      <SHead title="Card" />
      <ColorRow
        label="Card background"
        val={cfg.cardBg}
        onChange={(v) => up("cardBg", v)}
      />
      <ColorRow
        label="Card border color"
        val={cfg.cardBorderColor}
        onChange={(v) => up("cardBorderColor", v)}
      />
      <Slider
        label="Card border width"
        min={0}
        max={6}
        val={cfg.cardBorderWidth}
        unit="px"
        onChange={(v) => up("cardBorderWidth", v)}
      />
      <Slider
        label="Card radius"
        min={0}
        max={40}
        val={cfg.cardRadius}
        unit="px"
        onChange={(v) => up("cardRadius", v)}
      />
      <Slider
        label="Card padding"
        min={8}
        max={60}
        val={cfg.cardPadding}
        unit="px"
        onChange={(v) => up("cardPadding", v)}
      />
      <Slider
        label="Card gap"
        min={0}
        max={40}
        val={cfg.cardGap}
        unit="px"
        onChange={(v) => up("cardGap", v)}
      />

      <SHead title="Quote text" />
      <ColorRow
        label="Color"
        val={cfg.quoteColor}
        onChange={(v) => up("quoteColor", v)}
      />
      <Slider
        label="Font size"
        min={11}
        max={32}
        val={cfg.quoteSize}
        unit="px"
        onChange={(v) => up("quoteSize", v)}
      />
      <SelectRow
        label="Font family"
        val={cfg.quoteFont}
        options={FONTS}
        onChange={(v) => up("quoteFont", v)}
      />
      <SelectRow
        label="Font weight"
        val={cfg.quoteWeight}
        options={WEIGHTS}
        onChange={(v) => up("quoteWeight", v)}
      />
      <SelectRow
        label="Alignment"
        val={cfg.quoteAlign}
        options={ALIGNS}
        onChange={(v) => up("quoteAlign", v)}
      />

      <SHead title="Quote mark" />
      <Toggle
        label="Show quote mark"
        val={cfg.showQuoteMark}
        onChange={(v) => up("showQuoteMark", v)}
      />
      {cfg.showQuoteMark && (
        <>
          <ColorRow
            label="Color"
            val={cfg.quoteMarkColor}
            onChange={(v) => up("quoteMarkColor", v)}
          />
          <Slider
            label="Size"
            min={24}
            max={120}
            val={cfg.quoteMarkSize}
            unit="px"
            onChange={(v) => up("quoteMarkSize", v)}
          />
        </>
      )}

      <SHead title="Name" />
      <ColorRow
        label="Color"
        val={cfg.nameColor}
        onChange={(v) => up("nameColor", v)}
      />
      <Slider
        label="Font size"
        min={11}
        max={24}
        val={cfg.nameSize}
        unit="px"
        onChange={(v) => up("nameSize", v)}
      />
      <SelectRow
        label="Font family"
        val={cfg.nameFont}
        options={FONTS}
        onChange={(v) => up("nameFont", v)}
      />
      <SelectRow
        label="Font weight"
        val={cfg.nameWeight}
        options={WEIGHTS}
        onChange={(v) => up("nameWeight", v)}
      />

      <SHead title="Role / Company" />
      <ColorRow
        label="Role color"
        val={cfg.roleColor}
        onChange={(v) => up("roleColor", v)}
      />
      <Slider
        label="Role size"
        min={10}
        max={20}
        val={cfg.roleSize}
        unit="px"
        onChange={(v) => up("roleSize", v)}
      />
      <SelectRow
        label="Font family"
        val={cfg.roleFont}
        options={FONTS}
        onChange={(v) => up("roleFont", v)}
      />
      <Toggle
        label="Show company"
        val={cfg.showCompany}
        onChange={(v) => up("showCompany", v)}
      />
      {cfg.showCompany && (
        <ColorRow
          label="Company color"
          val={cfg.companyColor}
          onChange={(v) => up("companyColor", v)}
        />
      )}

      <SHead title="Stars" />
      <Toggle
        label="Show stars"
        val={cfg.showStars}
        onChange={(v) => up("showStars", v)}
      />
      {cfg.showStars && (
        <>
          <ColorRow
            label="Star color"
            val={cfg.starColor}
            onChange={(v) => up("starColor", v)}
          />
          <Slider
            label="Star size"
            min={10}
            max={32}
            val={cfg.starSize}
            unit="px"
            onChange={(v) => up("starSize", v)}
          />
        </>
      )}

      <SHead title="Avatar" />
      <Toggle
        label="Show avatar"
        val={cfg.showAvatar}
        onChange={(v) => up("showAvatar", v)}
      />
      {cfg.showAvatar && (
        <>
          <Slider
            label="Avatar size"
            min={24}
            max={80}
            val={cfg.avatarSize}
            unit="px"
            onChange={(v) => up("avatarSize", v)}
          />
          <Slider
            label="Avatar radius"
            min={0}
            max={50}
            val={cfg.avatarRadius}
            unit="%"
            onChange={(v) => up("avatarRadius", v)}
          />
        </>
      )}

      {(cfg.layout === "carousel" ||
        cfg.layout === "h-scroll" ||
        cfg.layout === "single-quote") && (
        <>
          <SHead title="Navigation" />
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: S.muted, marginBottom: 6 }}>
              Button position
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              {NAV_STYLES.map((n) => (
                <button
                  key={n.id}
                  onClick={() => up("navStyle", n.id)}
                  style={{
                    flex: 1,
                    padding: "4px 4px",
                    fontSize: 10,
                    borderRadius: 5,
                    cursor: "pointer",
                    border: `1px solid ${cfg.navStyle === n.id ? "#6c47ff" : "#2a2a3a"}`,
                    background:
                      cfg.navStyle === n.id
                        ? "rgba(108,71,255,0.18)"
                        : "transparent",
                    color: cfg.navStyle === n.id ? "#a58dff" : S.muted,
                  }}
                >
                  {n.label}
                </button>
              ))}
            </div>
          </div>
          {cfg.navStyle !== "hidden" && (
            <>
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: S.muted, marginBottom: 6 }}>
                  Button icon
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 4 }}
                >
                  {NAV_ICONS.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => up("navBtnIcon", n.id)}
                      style={{
                        padding: "4px 8px",
                        fontSize: 10,
                        borderRadius: 5,
                        cursor: "pointer",
                        textAlign: "left",
                        border: `1px solid ${cfg.navBtnIcon === n.id ? "#6c47ff" : "#2a2a3a"}`,
                        background:
                          cfg.navBtnIcon === n.id
                            ? "rgba(108,71,255,0.18)"
                            : "transparent",
                        color: cfg.navBtnIcon === n.id ? "#a58dff" : S.muted,
                      }}
                    >
                      {n.label}
                    </button>
                  ))}
                </div>
              </div>
              {cfg.navBtnIcon === "custom" && (
                <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{ fontSize: 10, color: S.muted, marginBottom: 3 }}
                    >
                      Prev
                    </div>
                    <input
                      value={cfg.navBtnCustomPrev}
                      onChange={(e) => up("navBtnCustomPrev", e.target.value)}
                      style={{
                        width: "100%",
                        fontSize: 12,
                        padding: "4px 6px",
                        borderRadius: 4,
                        border: "1px solid #2a2a3a",
                        background: "#080810",
                        color: S.text,
                      }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{ fontSize: 10, color: S.muted, marginBottom: 3 }}
                    >
                      Next
                    </div>
                    <input
                      value={cfg.navBtnCustomNext}
                      onChange={(e) => up("navBtnCustomNext", e.target.value)}
                      style={{
                        width: "100%",
                        fontSize: 12,
                        padding: "4px 6px",
                        borderRadius: 4,
                        border: "1px solid #2a2a3a",
                        background: "#080810",
                        color: S.text,
                      }}
                    />
                  </div>
                </div>
              )}
              <ColorRow
                label="Button background"
                val={cfg.navBtnBg}
                onChange={(v) => up("navBtnBg", v)}
              />
              <ColorRow
                label="Button icon color"
                val={cfg.navBtnColor}
                onChange={(v) => up("navBtnColor", v)}
              />
              <Slider
                label="Button size"
                min={24}
                max={64}
                val={cfg.navBtnSize}
                unit="px"
                onChange={(v) => up("navBtnSize", v)}
              />
              <Slider
                label="Button radius"
                min={0}
                max={50}
                val={cfg.navBtnRadius}
                unit="%"
                onChange={(v) => up("navBtnRadius", v)}
              />
            </>
          )}
          <Toggle
            label="Show dots"
            val={cfg.showDots}
            onChange={(v) => up("showDots", v)}
          />
          {cfg.showDots && (
            <>
              <ColorRow
                label="Dot color"
                val={cfg.dotColor}
                onChange={(v) => up("dotColor", v)}
              />
              <Slider
                label="Dot size"
                min={4}
                max={16}
                val={cfg.dotSize}
                unit="px"
                onChange={(v) => up("dotSize", v)}
              />
            </>
          )}
          <Toggle
            label="Auto-play"
            val={cfg.autoPlay}
            onChange={(v) => up("autoPlay", v)}
          />
          {cfg.autoPlay && (
            <Slider
              label="Speed"
              min={1000}
              max={8000}
              step={500}
              val={cfg.autoPlaySpeed}
              unit="ms"
              onChange={(v) => up("autoPlaySpeed", v)}
            />
          )}
          <Toggle
            label="Drag / swipe scroll"
            val={cfg.dragScroll}
            onChange={(v) => up("dragScroll", v)}
          />
        </>
      )}
    </div>
  );
}

function TestiContentPanel({ items, setItems, count, setCount }) {
  const [editing, setEditing] = useState(null);
  const STAR_COLORS = [
    "#6c47ff",
    "#0ea5e9",
    "#f59e0b",
    "#10b981",
    "#ec4899",
    "#8b5cf6",
    "#ef4444",
    "#14b8a6",
  ];
  function add() {
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
        avatarBg: STAR_COLORS[items.length % STAR_COLORS.length],
      },
    ];
    setItems(n);
    setCount((c) => Math.min(c + 1, n.length));
  }
  function remove(i) {
    const n = items.filter((_, x) => x !== i);
    setItems(n);
    setCount((c) => Math.max(1, Math.min(c, n.length)));
  }
  function upd(i, k, v) {
    setItems(items.map((t, x) => (x === i ? { ...t, [k]: v } : t)));
  }
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
            onClick={() => setCount((c) => Math.min(items.length, c + 1))}
            style={iconBtnStyle}
          >
            +
          </button>
        </div>
      </div>
      {items.map((t, i) => (
        <div
          key={t.id}
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
            <Avatar t={t} size={20} radius={50} />
            <span style={{ fontSize: 10, color: S.muted, flex: 1 }}>
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
                  color: "#ff5a5a",
                  borderColor: "#ff5a5a40",
                }}
              >
                ✕
              </button>
            )}
          </div>
          {editing === i && (
            <div style={{ padding: 10 }}>
              {[
                ["name", "Name"],
                ["role", "Role"],
                ["company", "Company"],
              ].map(([k, l]) => (
                <div key={k} style={{ marginBottom: 8 }}>
                  <div
                    style={{ fontSize: 10, color: S.muted, marginBottom: 3 }}
                  >
                    {l}
                  </div>
                  <input
                    value={t[k]}
                    onChange={(e) => upd(i, k, e.target.value)}
                    style={{
                      width: "100%",
                      fontSize: 11,
                      padding: "4px 6px",
                      borderRadius: 4,
                      border: "1px solid #2a2a3a",
                      background: "#080810",
                      color: S.text,
                      boxSizing: "border-box",
                    }}
                  />
                </div>
              ))}
              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 10, color: S.muted, marginBottom: 3 }}>
                  Quote
                </div>
                <textarea
                  value={t.quote}
                  onChange={(e) => upd(i, "quote", e.target.value)}
                  style={{ ...taStyle, minHeight: 72 }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <span style={{ fontSize: 10, color: S.muted }}>Stars</span>
                <div style={{ display: "flex", gap: 4 }}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => upd(i, "stars", n)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: 16,
                        color: n <= t.stars ? "#f59e0b" : "#2a2a3a",
                        padding: 0,
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 4 }}>
                <div style={{ fontSize: 10, color: S.muted, marginBottom: 5 }}>
                  Avatar color
                </div>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                  {STAR_COLORS.map((c) => (
                    <div
                      key={c}
                      onClick={() => upd(i, "avatarBg", c)}
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: c,
                        cursor: "pointer",
                        border:
                          t.avatarBg === c
                            ? "2px solid #fff"
                            : "2px solid transparent",
                      }}
                    />
                  ))}
                </div>
              </div>
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
        + Add Testimonial
      </button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// CODE GENERATORS
// ════════════════════════════════════════════════════════════════════════════
function genFaqCode(faqs, count, dCfg, tCfg, mCfg, platform) {
  const items = faqs.slice(0, count);
  const isUnbounce = platform === "Unbounce";
  const tPfx = isUnbounce ? ".lp-tablet" : "@media(max-width:768px)";
  const mPfx = isUnbounce ? ".lp-mobile" : "@media(max-width:480px)";
  const css = `/* ── FAQ — ${platform} ── */
.ub-faq{max-width:${dCfg.maxWidth}px;margin:0 auto;display:flex;flex-direction:column;gap:${dCfg.gap}px}
.ub-faq-item{background:${dCfg.bgColor};border:${dCfg.borderWidth}px solid ${dCfg.borderColor};border-radius:${dCfg.borderRadius}px;overflow:hidden;transition:all .2s}
.ub-faq-item.open{background:${dCfg.activeBg};border-color:${dCfg.iconColor}}
.ub-faq-btn{width:100%;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:${dCfg.padding}px;background:none;border:none;cursor:pointer}
.ub-faq-q{font-family:'${dCfg.qFont}',sans-serif;font-size:${dCfg.qSize}px;font-weight:${dCfg.qWeight};color:${dCfg.qColor};text-align:${dCfg.qAlign};flex:1;transition:color .2s}
.ub-faq-item.open .ub-faq-q{color:${dCfg.activeQColor}}
.ub-faq-icon{color:${dCfg.iconColor};font-size:${dCfg.iconSize}px;font-weight:700;flex-shrink:0;transition:transform .2s;line-height:1}
.ub-faq-item.open .ub-faq-icon{transform:rotate(45deg)}
.ub-faq-body{display:none;padding:0 ${dCfg.padding}px ${dCfg.padding}px;border-top:1px solid ${dCfg.dividerColor}}
.ub-faq-item.open .ub-faq-body{display:block}
.ub-faq-a{font-family:'${dCfg.aFont}',sans-serif;font-size:${dCfg.aSize}px;font-weight:${dCfg.aWeight};color:${dCfg.aColor};text-align:${dCfg.aAlign};margin:0;padding-top:${Math.round(dCfg.padding * 0.6)}px;line-height:1.65}
/* Tablet */
${tPfx} .ub-faq{max-width:${tCfg.maxWidth}px;gap:${tCfg.gap}px}
${tPfx} .ub-faq-btn{padding:${tCfg.padding}px}
${tPfx} .ub-faq-q{font-size:${tCfg.qSize}px}
${tPfx} .ub-faq-a{font-size:${tCfg.aSize}px}
/* Mobile */
${mPfx} .ub-faq{max-width:${mCfg.maxWidth}px;gap:${mCfg.gap}px}
${mPfx} .ub-faq-btn{padding:${mCfg.padding}px}
${mPfx} .ub-faq-q{font-size:${mCfg.qSize}px}
${mPfx} .ub-faq-a{font-size:${mCfg.aSize}px}`;
  const html = `<div class="ub-faq" id="ubFaq"></div>`;
  const js = `${isUnbounce ? "window.addEventListener('load',function(){" : 'document.addEventListener("DOMContentLoaded",function(){'}
  var faqs=[
${items.map((f) => `    {q:${JSON.stringify(f.q)},a:${JSON.stringify(f.a)}}`).join(",\n")}
  ];
  var wrap=document.getElementById('ubFaq');
  if(!wrap)return;
  faqs.forEach(function(item,i){
    var el=document.createElement('div');
    el.className='ub-faq-item';
    el.innerHTML='<button class="ub-faq-btn" aria-expanded="false"><span class="ub-faq-q">'+item.q+'</span><span class="ub-faq-icon">+</span></button><div class="ub-faq-body"><p class="ub-faq-a">'+item.a+'</p></div>';
    el.querySelector('.ub-faq-btn').addEventListener('click',function(){
      var isOpen=el.classList.contains('open');
      document.querySelectorAll('.ub-faq-item').forEach(function(x){x.classList.remove('open');x.querySelector('.ub-faq-btn').setAttribute('aria-expanded','false');});
      if(!isOpen){el.classList.add('open');this.setAttribute('aria-expanded','true');}
    });
    wrap.appendChild(el);
  });
});`;
  return { css, html, js };
}

function genTestiCode(items, count, dCfg, tCfg, mCfg, platform) {
  const vis = items.slice(0, count);
  const isUnbounce = platform === "Unbounce";
  const tPfx = isUnbounce ? ".lp-tablet" : "@media(max-width:768px)";
  const mPfx = isUnbounce ? ".lp-mobile" : "@media(max-width:480px)";
  const pIcon = (dir) => navIcon(dCfg, dir);

  const css = `/* ── Testimonials (${dCfg.layout}) — ${platform} ── */
.ub-testi-wrap{max-width:${dCfg.maxWidth}px;margin:0 auto;background:${dCfg.sectionBg};padding:16px;border-radius:12px}
.ub-testi-card{background:${dCfg.cardBg};border:${dCfg.cardBorderWidth}px solid ${dCfg.cardBorderColor};border-radius:${dCfg.cardRadius}px;padding:${dCfg.cardPadding}px;box-shadow:${dCfg.shadow}}
.ub-testi-quote{font-family:'${dCfg.quoteFont}',sans-serif;font-size:${dCfg.quoteSize}px;font-weight:${dCfg.quoteWeight};color:${dCfg.quoteColor};text-align:${dCfg.quoteAlign};line-height:1.65;margin:0}
.ub-testi-name{font-family:'${dCfg.nameFont}',sans-serif;font-size:${dCfg.nameSize}px;font-weight:${dCfg.nameWeight};color:${dCfg.nameColor}}
.ub-testi-role{font-size:${dCfg.roleSize}px;color:${dCfg.roleColor}}
.ub-testi-avatar{width:${dCfg.avatarSize}px;height:${dCfg.avatarSize}px;border-radius:${dCfg.avatarRadius}%;display:flex;align-items:center;justify-content:center;font-weight:700;color:#fff;font-size:${Math.round(dCfg.avatarSize * 0.36)}px;flex-shrink:0}
.ub-testi-stars{display:flex;gap:2px}
.ub-testi-nav-btn{width:${dCfg.navBtnSize}px;height:${dCfg.navBtnSize}px;border-radius:${dCfg.navBtnRadius}%;background:${dCfg.navBtnBg};border:1px solid ${dCfg.cardBorderColor};color:${dCfg.navBtnColor};font-size:${Math.round(dCfg.navBtnSize * 0.45)}px;cursor:pointer;display:flex;align-items:center;justify-content:center}
.ub-testi-dots{display:flex;gap:6px;justify-content:center;margin-top:14px}
.ub-testi-dot{height:${dCfg.dotSize}px;border-radius:${dCfg.dotSize}px;background:#d1d5db;cursor:pointer;transition:all .2s}
.ub-testi-dot.active{background:${dCfg.dotColor};width:${dCfg.dotSize * 2.2}px}
/* Tablet */
${tPfx} .ub-testi-wrap{max-width:${tCfg.maxWidth}px}
${tPfx} .ub-testi-quote{font-size:${tCfg.quoteSize}px}
/* Mobile */
${mPfx} .ub-testi-wrap{max-width:${mCfg.maxWidth}px}
${mPfx} .ub-testi-quote{font-size:${mCfg.quoteSize}px}`;

  const html = `<div class="ub-testi-wrap" id="ubTesti"></div>`;

  const js = `${isUnbounce ? "window.addEventListener('load',function(){" : 'document.addEventListener("DOMContentLoaded",function(){'}
  var testimonials=[
${vis.map((t) => `    {name:${JSON.stringify(t.name)},role:${JSON.stringify(t.role)},company:${JSON.stringify(t.company)},quote:${JSON.stringify(t.quote)},stars:${t.stars},initials:${JSON.stringify(t.initials)},avatarBg:${JSON.stringify(t.avatarBg)}}`).join(",\n")}
  ];
  var wrap=document.getElementById('ubTesti');
  if(!wrap)return;
  var current=0;
  /* Build cards */
  function buildCard(t){
    var stars='';
    for(var s=1;s<=5;s++)stars+='<span style="color:'+(s<=t.stars?'${dCfg.starColor}':'#d1d5db')+';font-size:${dCfg.starSize}px">★</span>';
    return '<div class="ub-testi-card" style="display:flex;flex-direction:column;gap:12px">'
      +(${dCfg.showQuoteMark}?'<div style="font-size:${dCfg.quoteMarkSize}px;color:${dCfg.quoteMarkColor};font-family:Georgia,serif;line-height:.8">&#8220;</div>':'')
      +'<p class="ub-testi-quote">'+t.quote+'</p>'
      +(${dCfg.showStars}?'<div class="ub-testi-stars">'+stars+'</div>':'')
      +'<div style="display:flex;align-items:center;gap:10px">'
      +(${dCfg.showAvatar}?'<div class="ub-testi-avatar" style="background:'+t.avatarBg+'">'+t.initials+'</div>':'')
      +'<div><div class="ub-testi-name">'+t.name+'</div>'
      +'<div class="ub-testi-role">'+t.role+(${dCfg.showCompany}?' &middot; '+t.company:'')+'</div></div>'
      +'</div></div>';
  }
  /* Carousel */
  var track=document.createElement('div');
  track.style.cssText='display:flex;transition:transform .35s ease;';
  testimonials.forEach(function(t){var s=document.createElement('div');s.style.cssText='min-width:100%;padding:0 4px;box-sizing:border-box;';s.innerHTML=buildCard(t);track.appendChild(s);});
  var inner=document.createElement('div');
  inner.style.cssText='overflow:hidden;flex:1;';
  inner.appendChild(track);
  var row=document.createElement('div');
  row.style.cssText='display:flex;align-items:center;gap:12px;';
  ${
    dCfg.navStyle === "sides"
      ? `var p=document.createElement('button');p.className='ub-testi-nav-btn';p.textContent='${pIcon("prev")}';
  var n=document.createElement('button');n.className='ub-testi-nav-btn';n.textContent='${pIcon("next")}';
  row.appendChild(p);row.appendChild(inner);row.appendChild(n);`
      : `row.appendChild(inner);`
  }
  wrap.appendChild(row);
  ${
    dCfg.showDots
      ? `var dotsRow=document.createElement('div');dotsRow.className='ub-testi-dots';
  testimonials.forEach(function(_,i){var d=document.createElement('div');d.className='ub-testi-dot'+(i===0?' active':'');d.style.width='${dCfg.dotSize}px';d.addEventListener('click',function(){goTo(i);});dotsRow.appendChild(d);});
  wrap.appendChild(dotsRow);`
      : ""
  }
  function goTo(i){current=i;track.style.transform='translateX(-'+i*100+'%)';${dCfg.showDots ? `document.querySelectorAll('.ub-testi-dot').forEach(function(d,j){d.classList.toggle('active',j===i);d.style.width=j===i?'${dCfg.dotSize * 2.2}px':'${dCfg.dotSize}px';});` : ""}}
  ${
    dCfg.navStyle === "sides"
      ? `p.addEventListener('click',function(){goTo((current-1+testimonials.length)%testimonials.length);});
  n.addEventListener('click',function(){goTo((current+1)%testimonials.length);});`
      : ""
  }
  ${dCfg.autoPlay ? `setInterval(function(){goTo((current+1)%testimonials.length);},${dCfg.autoPlaySpeed});` : ""}
});`;
  return { css, html, js };
}

// ════════════════════════════════════════════════════════════════════════════
// SHARED BUTTON STYLES
// ════════════════════════════════════════════════════════════════════════════
const iconBtnStyle = {
  width: 24,
  height: 24,
  borderRadius: 4,
  border: "1px solid #2a2a3a",
  background: "#0d0d18",
  color: S.text,
  cursor: "pointer",
  fontSize: 14,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
};
const smallBtnStyle = {
  fontSize: 10,
  padding: "2px 8px",
  borderRadius: 4,
  border: "1px solid #2a2a3a",
  background: "transparent",
  cursor: "pointer",
  color: S.muted,
};
const taStyle = {
  width: "100%",
  fontSize: 11,
  padding: "5px 7px",
  borderRadius: 4,
  border: "1px solid #2a2a3a",
  background: "#080810",
  color: S.text,
  resize: "vertical",
  minHeight: 48,
  boxSizing: "border-box",
  fontFamily: "inherit",
};

// ════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [activeNav, setActiveNav] = useState("faq");
  const [platform, setPlatform] = useState("Unbounce");
  const [viewport, setViewport] = useState("desktop");
  const [leftTab, setLeftTab] = useState("style");
  const [codeTab, setCodeTab] = useState("css");
  const [copied, setCopied] = useState(false);

  // FAQ state
  const [faqs, setFaqs] = useState(DEFAULT_FAQS);
  const [faqCount, setFaqCount] = useState(5);
  const [faqDCfg, setFaqDCfg] = useState(mkFaqDesktop());
  const [faqTCfg, setFaqTCfg] = useState(mkFaqTablet());
  const [faqMCfg, setFaqMCfg] = useState(mkFaqMobile());

  // Testimonial state
  const [testis, setTestis] = useState(DEFAULT_TESTIMONIALS);
  const [testiCount, setTestiCount] = useState(6);
  const [testiDCfg, setTestiDCfg] = useState(mkTestDesktop());
  const [testiTCfg, setTestiTCfg] = useState(mkTestTablet());
  const [testiMCfg, setTestiMCfg] = useState(mkTestMobile());

  const isFaq = activeNav === "faq";

  // Current cfg for active viewport
  const faqCfgMap = {
    desktop: [faqDCfg, setFaqDCfg],
    tablet: [faqTCfg, setFaqTCfg],
    mobile: [faqMCfg, setFaqMCfg],
  };
  const testiCfgMap = {
    desktop: [testiDCfg, setTestiDCfg],
    tablet: [testiTCfg, setTestiTCfg],
    mobile: [testiMCfg, setTestiMCfg],
  };
  const [curFaqCfg, setCurFaqCfg] = faqCfgMap[viewport];
  const [curTestiCfg, setCurTestiCfg] = testiCfgMap[viewport];

  // Code
  const faqCode = genFaqCode(
    faqs,
    faqCount,
    faqDCfg,
    faqTCfg,
    faqMCfg,
    platform,
  );
  const testiCode = genTestiCode(
    testis,
    testiCount,
    testiDCfg,
    testiTCfg,
    testiMCfg,
    platform,
  );
  const code = isFaq ? faqCode : testiCode;

  function copy() {
    navigator.clipboard.writeText(code[codeTab] || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#080810",
        color: S.text,
        fontFamily: "Inter,system-ui,sans-serif",
        fontSize: 13,
        overflow: "hidden",
      }}
    >
      {/* ── Sidebar nav ── */}
      <div
        style={{
          width: NAV_W,
          borderRight: "1px solid #1e1e30",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
          background: "#0a0a14",
        }}
      >
        <div
          style={{ padding: "14px 16px", borderBottom: "1px solid #1e1e30" }}
        >
          <div style={{ fontWeight: 800, fontSize: 14, letterSpacing: -0.5 }}>
            Component <span style={{ color: "#6c47ff" }}>Builder</span>
          </div>
          <div style={{ fontSize: 10, color: S.muted, marginTop: 2 }}>
            FAQ · Testimonials
          </div>
        </div>
        <div style={{ padding: "12px 10px", flex: 1 }}>
          <div
            style={{
              fontSize: 10,
              color: "#3a3a55",
              letterSpacing: "0.8px",
              textTransform: "uppercase",
              marginBottom: 8,
              paddingLeft: 6,
            }}
          >
            Components
          </div>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveNav(item.id);
                setLeftTab("style");
              }}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 10px",
                borderRadius: 8,
                border: `1px solid ${activeNav === item.id ? "#6c47ff" : "transparent"}`,
                background:
                  activeNav === item.id
                    ? "rgba(108,71,255,0.15)"
                    : "transparent",
                color: activeNav === item.id ? S.text : S.muted,
                cursor: "pointer",
                fontWeight: activeNav === item.id ? 600 : 400,
                fontSize: 13,
                textAlign: "left",
                marginBottom: 2,
              }}
            >
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.label}
            </button>
          ))}

          <div
            style={{
              fontSize: 10,
              color: "#3a3a55",
              letterSpacing: "0.8px",
              textTransform: "uppercase",
              margin: "20px 0 8px",
              paddingLeft: 6,
            }}
          >
            Platform
          </div>
          {PLATFORMS.map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "6px 10px",
                borderRadius: 6,
                marginBottom: 2,
                border: `1px solid ${platform === p ? "#6c47ff" : "transparent"}`,
                background:
                  platform === p ? "rgba(108,71,255,0.12)" : "transparent",
                color: platform === p ? "#a58dff" : S.muted,
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* ── Controls panel ── */}
      <div
        style={{
          width: 246,
          borderRight: "1px solid #1e1e30",
          display: "flex",
          flexDirection: "column",
          background: "#0d0d18",
          flexShrink: 0,
        }}
      >
        {/* Tab switcher */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #1e1e30",
            flexShrink: 0,
          }}
        >
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
                color: leftTab === t ? S.text : S.muted,
                fontWeight: leftTab === t ? 600 : 400,
                textTransform: "capitalize",
                borderBottom: `2px solid ${leftTab === t ? "#6c47ff" : "transparent"}`,
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Viewport selector (style tab only) */}
        {leftTab === "style" && (
          <div
            style={{
              padding: "10px 14px 0",
              display: "flex",
              gap: 4,
              flexShrink: 0,
            }}
          >
            {VP_LABELS.map((v) => (
              <button
                key={v.id}
                onClick={() => setViewport(v.id)}
                style={{
                  flex: 1,
                  padding: "4px 2px",
                  fontSize: 9,
                  borderRadius: 5,
                  cursor: "pointer",
                  border: `1px solid ${viewport === v.id ? "#6c47ff" : "#2a2a3a"}`,
                  background:
                    viewport === v.id ? "rgba(108,71,255,0.15)" : "transparent",
                  color: viewport === v.id ? "#a58dff" : S.muted,
                }}
              >
                {v.label}
              </button>
            ))}
          </div>
        )}
        {leftTab === "style" && (
          <div
            style={{
              margin: "6px 14px 0",
              padding: "4px 8px",
              background: "rgba(108,71,255,0.07)",
              borderRadius: 5,
              fontSize: 10,
              color: "#5a5a78",
              flexShrink: 0,
            }}
          >
            Editing <strong style={{ color: "#a58dff" }}>{viewport}</strong>{" "}
            only
          </div>
        )}

        <div style={{ flex: 1, overflowY: "auto" }}>
          {isFaq ? (
            leftTab === "style" ? (
              <FaqStylePanel cfg={curFaqCfg} onChange={setCurFaqCfg} />
            ) : (
              <FaqContentPanel
                faqs={faqs}
                setFaqs={setFaqs}
                count={faqCount}
                setCount={setFaqCount}
              />
            )
          ) : leftTab === "style" ? (
            <TestiStylePanel cfg={curTestiCfg} onChange={setCurTestiCfg} />
          ) : (
            <TestiContentPanel
              items={testis}
              setItems={setTestis}
              count={testiCount}
              setCount={setTestiCount}
            />
          )}
        </div>
      </div>

      {/* ── Preview ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
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
          <span style={{ fontSize: 11, color: S.muted }}>
            Preview ·{" "}
            <strong style={{ color: "#a58dff" }}>
              {isFaq ? "FAQ" : "Testimonials"}
            </strong>
          </span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
            {VP_LABELS.map((v) => (
              <button
                key={v.id}
                onClick={() => setViewport(v.id)}
                style={{
                  padding: "4px 10px",
                  fontSize: 11,
                  borderRadius: 6,
                  cursor: "pointer",
                  border: `1px solid ${viewport === v.id ? "#6c47ff" : "#2a2a3a"}`,
                  background:
                    viewport === v.id ? "rgba(108,71,255,0.15)" : "transparent",
                  color: viewport === v.id ? "#a58dff" : S.muted,
                }}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>
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
              width: VP_W[viewport],
              maxWidth: VP_W[viewport],
              background: "#fff",
              borderRadius: 10,
              padding: 24,
              boxShadow: "0 4px 40px rgba(0,0,0,0.5)",
              transition: "width .3s, max-width .3s",
              boxSizing: "border-box",
              minHeight: 200,
            }}
          >
            {isFaq ? (
              <FaqPreview faqs={faqs} count={faqCount} cfg={curFaqCfg} />
            ) : (
              <TestiPreview
                items={testis}
                count={testiCount}
                cfg={curTestiCfg}
              />
            )}
          </div>
        </div>
      </div>

      {/* ── Code panel ── */}
      <div
        style={{
          width: 290,
          borderLeft: "1px solid #1e1e30",
          display: "flex",
          flexDirection: "column",
          background: "#0d0d18",
          flexShrink: 0,
        }}
      >
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
                color: codeTab === t ? "#a58dff" : S.muted,
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
        <pre
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "auto",
            margin: 0,
            padding: "12px 14px",
            fontSize: 10,
            lineHeight: 1.75,
            fontFamily: "Courier New,monospace",
            color: "#abb2bf",
            whiteSpace: "pre",
            background: "#080810",
          }}
        >
          {code[codeTab]}
        </pre>
        <div
          style={{
            padding: "10px 14px",
            borderTop: "1px solid #1e1e30",
            fontSize: 10,
            color: S.muted,
            lineHeight: 1.6,
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
  );
}
