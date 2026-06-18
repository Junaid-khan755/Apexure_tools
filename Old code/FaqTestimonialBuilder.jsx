import { useState, useRef, useEffect, useCallback } from "react";

// ── Constants ────────────────────────────────────────────────────────────────
const DEFAULT_FONTS = [
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
const VP_W = { desktop: "100%", tablet: 620, mobile: 375 };

// ── Default configs ───────────────────────────────────────────────────────────
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
  activeBg: "#ffffff",
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
  sectionBg: "#ffffff",
  cardBg: "#ffffff", // FIX: always white by default
  cardBorderColor: "#e5e7eb",
  cardBorderWidth: 1,
  cardRadius: 14,
  cardPadding: 24,
  cardGap: 20,
  showShadow: true,
  shadowX: 0,
  shadowY: 2,
  shadowBlur: 16,
  shadowSpread: 0,
  shadowColor: "rgba(0,0,0,0.08)",
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
  navStyle: "sides",
  navBtnBg: "#ffffff",
  navBtnColor: "#111827",
  navBtnRadius: 50,
  navBtnSize: 36,
  navBtnIcon: "arrow",
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
    avatarBg: "#1a1a18",
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

// ── Style constants ───────────────────────────────────────────────────────────
const S = {
  panel: { background: "#0d0d18" },
  border: "1px solid #1e1e30",
  text: "#e4e4f0",
  muted: "#5a5a78",
  accent: "#6c47ff",
};
const iconBtnStyle = {
  width: 24,
  height: 24,
  borderRadius: 4,
  border: "1px solid #2a2a3a",
  background: "#0d0d18",
  color: "#e4e4f0",
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
  color: "#5a5a78",
};
const taStyle = {
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
  fontFamily: "inherit",
};

// ── Helper: build CSS box-shadow string ───────────────────────────────────────
function shadowCss(cfg) {
  if (!cfg.showShadow) return "none";
  return `${cfg.shadowX ?? 0}px ${cfg.shadowY ?? 2}px ${cfg.shadowBlur ?? 16}px ${cfg.shadowSpread ?? 0}px ${cfg.shadowColor || "rgba(0,0,0,0.08)"}`;
}

// ── UI Primitives ─────────────────────────────────────────────────────────────
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

// FIX: ColorRow now handles rgba() colors safely — don't crash when val isn't a 7-char hex
function isValidHex(v) {
  return v && /^#[0-9a-fA-F]{6}$/.test(v);
}
function ColorRow({ label, val, onChange }) {
  const safeHex = isValidHex(val) ? val : "#6c47ff";
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
          value={safeHex}
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
            width: 80,
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

function FontSelect({ label, val, onChange, customFonts }) {
  const allFonts = [...DEFAULT_FONTS, ...customFonts.map((f) => f.name)];
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
          background: "#1a1a18",
          color: S.text,
          minWidth: 105,
          maxWidth: 130,
        }}
      >
        {allFonts.map((f) => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </select>
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
          background: "#1a1a18",
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
          background: val ? "#1a1a18" : "#555555",
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

// ── Custom Font Manager ───────────────────────────────────────────────────────
function fontFormatFromFilename(name) {
  const ext = name.split(".").pop().toLowerCase();
  if (ext === "woff2") return "woff2";
  if (ext === "woff") return "woff";
  if (ext === "otf") return "opentype";
  return "truetype";
}

function CustomFontManager({ customFonts, onAdd, onAddFile, onRemove }) {
  const [input, setInput] = useState("");
  const fileInputRef = useRef(null);

  const add = () => {
    const name = input.trim();
    if (!name || customFonts.some((f) => f.name === name)) return;
    onAdd(name);
    setInput("");
  };

  const handleFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base = file.name.replace(/\.[^/.]+$/, "");
      let name = base.replace(/[_-]+/g, " ").trim() || "Custom Font";
      let finalName = name,
        i = 2;
      while (customFonts.some((f) => f.name === finalName)) {
        finalName = `${name} ${i}`;
        i++;
      }
      onAddFile({
        name: finalName,
        dataUrl: reader.result,
        format: fontFormatFromFilename(file.name),
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div style={{ padding: "12px 14px" }}>
      <SHead title="Upload Font File" />
      <p
        style={{
          fontSize: 11,
          color: S.muted,
          marginBottom: 10,
          lineHeight: 1.5,
        }}
      >
        Upload a .woff2, .woff, .ttf, or .otf file. It will be embedded directly
        (base64 @font-face) in the preview and exported code.
      </p>
      <input
        ref={fileInputRef}
        type="file"
        accept=".woff,.woff2,.ttf,.otf"
        onChange={handleFile}
        style={{ display: "none" }}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        style={{
          width: "100%",
          padding: "8px 12px",
          fontSize: 11,
          borderRadius: 6,
          border: "1px dashed #2a2a3a",
          background: "transparent",
          cursor: "pointer",
          color: S.text,
          marginBottom: 16,
          fontWeight: 600,
        }}
      >
        ⬆ Upload font file
      </button>
      <SHead title="Add Font by Name" />
      <p
        style={{
          fontSize: 11,
          color: S.muted,
          marginBottom: 10,
          lineHeight: 1.5,
        }}
      >
        Type any font name exactly as it appears in Google Fonts or your CSS.
      </p>
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="e.g. Space Grotesk"
          style={{
            flex: 1,
            fontSize: 11,
            padding: "5px 8px",
            borderRadius: 5,
            border: "1px solid #2a2a3a",
            background: "#080810",
            color: S.text,
          }}
        />
        <button
          onClick={add}
          style={{
            padding: "5px 12px",
            fontSize: 11,
            borderRadius: 5,
            border: "none",
            background: "#6c47ff",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Add
        </button>
      </div>
      <SHead title="Your Fonts" />
      {customFonts.length === 0 && (
        <p
          style={{
            fontSize: 11,
            color: S.muted,
            textAlign: "center",
            marginTop: 8,
          }}
        >
          No custom fonts added yet
        </p>
      )}
      {customFonts.map((f) => (
        <div
          key={f.name}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "6px 10px",
            background: "#080810",
            borderRadius: 6,
            marginBottom: 5,
            border: "1px solid #1e1e30",
          }}
        >
          <span
            style={{
              fontSize: 12,
              color: S.text,
              fontFamily: `'${f.name}',sans-serif`,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {f.name}
            {f.dataUrl && (
              <span
                style={{
                  fontSize: 9,
                  color: "#a58dff",
                  background: "rgba(108,71,255,0.15)",
                  padding: "1px 5px",
                  borderRadius: 3,
                }}
              >
                uploaded
              </span>
            )}
          </span>
          <button
            onClick={() => onRemove(f.name)}
            style={{
              ...smallBtnStyle,
              color: "#ff5a5a",
              borderColor: "#ff5a5a40",
            }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Google Font injector ──────────────────────────────────────────────────────
// FIX: hooks can't be called inside forEach — use individual useEffect calls
// via a dedicated component instead.
const SYSTEM_FONTS = new Set([
  "system-ui",
  "Georgia",
  "Helvetica Neue",
  "Trebuchet MS",
  "Verdana",
  "Courier New",
]);

function GoogleFontLink({ fontName }) {
  useEffect(() => {
    if (!fontName || SYSTEM_FONTS.has(fontName)) return;
    const id = `gf-${fontName.replace(/ /g, "-")}`;
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, "+")}:wght@300;400;500;600;700;800&display=swap`;
    document.head.appendChild(link);
  }, [fontName]);
  return null;
}

function UploadedFontFace({ font }) {
  useEffect(() => {
    if (!font?.dataUrl) return;
    const id = `uf-${font.name.replace(/ /g, "-")}`;
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `@font-face{font-family:'${font.name}';src:url(${font.dataUrl}) format('${font.format}');font-weight:300 800;font-style:normal;font-display:swap;}`;
    document.head.appendChild(style);
  }, [font]);
  return null;
}

// FIX: FontLoader renders one component per font — no hooks in loops
function FontLoader({ cfg, type, customFonts }) {
  const fonts =
    type === "faq"
      ? [cfg.qFont, cfg.aFont]
      : [cfg.quoteFont, cfg.nameFont, cfg.roleFont];
  const unique = [...new Set(fonts.filter(Boolean))];
  return (
    <>
      {unique.map((f) => {
        const uploaded = customFonts.find((c) => c.name === f && c.dataUrl);
        return uploaded ? (
          <UploadedFontFace key={f} font={uploaded} />
        ) : (
          <GoogleFontLink key={f} fontName={f} />
        );
      })}
    </>
  );
}

// ── Google Fonts @import for code output ─────────────────────────────────────
function googleFontsImport(fonts, customFonts = []) {
  const unique = [...new Set(fonts.filter((f) => f && !SYSTEM_FONTS.has(f)))];
  if (!unique.length) return "";
  const uploaded = unique.filter((f) =>
    customFonts.some((c) => c.name === f && c.dataUrl),
  );
  const googleable = unique.filter((f) => !uploaded.includes(f));
  let out = "";
  if (googleable.length) {
    const families = googleable
      .map((f) => `family=${f.replace(/ /g, "+")}:wght@300;400;500;600;700;800`)
      .join("&");
    out += `@import url('https://fonts.googleapis.com/css2?${families}&display=swap');\n\n`;
  }
  uploaded.forEach((f) => {
    const font = customFonts.find((c) => c.name === f);
    out += `@font-face{font-family:'${font.name}';src:url(${font.dataUrl}) format('${font.format}');font-weight:300 800;font-style:normal;font-display:swap;}\n`;
  });
  if (uploaded.length) out += "\n";
  return out;
}

// ════════════════════════════════════════════════════════════════════════════
// CODE GENERATORS
// ════════════════════════════════════════════════════════════════════════════
function genFaqCode(faqs, count, dCfg, tCfg, mCfg, platform, customFonts) {
  const items = faqs.slice(0, count);
  const isUnbounce = platform === "Unbounce";
  const fonts = [
    dCfg.qFont,
    dCfg.aFont,
    tCfg.qFont,
    tCfg.aFont,
    mCfg.qFont,
    mCfg.aFont,
  ];
  const fontImport = googleFontsImport(fonts, customFonts);

  const buildResponsive = (tPfx, mPfx, useMedia) => {
    const tO = useMedia ? "@media(max-width:768px){" : "";
    const tC = useMedia ? "}" : "";
    const mO = useMedia ? "@media(max-width:480px){" : "";
    const mC = useMedia ? "}" : "";
    const t = useMedia ? "" : `${tPfx} `;
    const m = useMedia ? "" : `${mPfx} `;
    return `
${tO}
${t}.ub-faq{max-width:${tCfg.maxWidth}px;gap:${tCfg.gap}px;}
${t}.ub-faq-item{background:${tCfg.bgColor};border:${tCfg.borderWidth}px solid ${tCfg.borderColor};border-radius:${tCfg.borderRadius}px;}
${t}.ub-faq-btn{padding:${tCfg.padding}px;}
${t}.ub-faq-q{font-family:'${tCfg.qFont}',sans-serif;font-size:${tCfg.qSize}px;font-weight:${tCfg.qWeight};color:${tCfg.qColor};}
${t}.ub-faq-a{font-family:'${tCfg.aFont}',sans-serif;font-size:${tCfg.aSize}px;font-weight:${tCfg.aWeight};color:${tCfg.aColor};padding:${Math.round(tCfg.padding * 0.6)}px ${tCfg.padding}px ${tCfg.padding}px;}
${tC}
${mO}
${m}.ub-faq{max-width:${mCfg.maxWidth}px;gap:${mCfg.gap}px;}
${m}.ub-faq-btn{padding:${mCfg.padding}px;}
${m}.ub-faq-q{font-family:'${mCfg.qFont}',sans-serif;font-size:${mCfg.qSize}px;font-weight:${mCfg.qWeight};color:${mCfg.qColor};}
${m}.ub-faq-a{font-family:'${mCfg.aFont}',sans-serif;font-size:${mCfg.aSize}px;font-weight:${mCfg.aWeight};color:${mCfg.aColor};padding:${Math.round(mCfg.padding * 0.6)}px ${mCfg.padding}px ${mCfg.padding}px;}
${mC}`;
  };

  const baseCSS = `${fontImport}/* FAQ Accordion — ${platform} */
.ub-faq{max-width:${dCfg.maxWidth}px;margin:0 auto;display:flex;flex-direction:column;gap:${dCfg.gap}px;}
.ub-faq-item{background:${dCfg.bgColor};border:${dCfg.borderWidth}px solid ${dCfg.borderColor};border-radius:${dCfg.borderRadius}px;overflow:hidden;transition:all .2s;}
.ub-faq-item.open{background:${dCfg.activeBg};border-color:${dCfg.iconColor};}
.ub-faq-btn{width:100%;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:${dCfg.padding}px;background:none;border:none;cursor:pointer;box-sizing:border-box;}
.ub-faq-q{font-family:'${dCfg.qFont}',sans-serif;font-size:${dCfg.qSize}px;font-weight:${dCfg.qWeight};color:${dCfg.qColor};text-align:${dCfg.qAlign};flex:1;transition:color .2s;margin:0;}
.ub-faq-item.open .ub-faq-q{color:${dCfg.activeQColor};}
.ub-faq-icon{color:${dCfg.iconColor};font-size:${dCfg.iconSize}px;font-weight:700;flex-shrink:0;transition:transform .3s cubic-bezier(.4,0,.2,1);line-height:1;display:inline-block;}
.ub-faq-item.open .ub-faq-icon{transform:rotate(45deg);}
.ub-faq-body{height:0;overflow:hidden;transition:height .35s cubic-bezier(.4,0,.2,1);}
.ub-faq-a{font-family:'${dCfg.aFont}',sans-serif;font-size:${dCfg.aSize}px;font-weight:${dCfg.aWeight};color:${dCfg.aColor};text-align:${dCfg.aAlign};margin:0;padding:${Math.round(dCfg.padding * 0.6)}px ${dCfg.padding}px ${dCfg.padding}px;line-height:1.65;border-top:1px solid ${dCfg.dividerColor};box-sizing:border-box;}`;

  const tPfxSheet = isUnbounce ? ".lp-tablet" : "";
  const mPfxSheet = isUnbounce ? ".lp-mobile" : "";
  const css = baseCSS + buildResponsive(tPfxSheet, mPfxSheet, !isUnbounce);
  const cssHTML = baseCSS + buildResponsive("", "", true);

  const html = `<div class="ub-faq" id="ubFaq"></div>`;
  const jsListener = isUnbounce
    ? "window.addEventListener('load',function(){"
    : "document.addEventListener('DOMContentLoaded',function(){";

  const js = `${jsListener}
  var faqs=[
${items.map((f) => `    {q:${JSON.stringify(f.q)},a:${JSON.stringify(f.a)}}`).join(",\n")}
  ];
  var wrap=document.getElementById('ubFaq');
  if(!wrap)return;
  faqs.forEach(function(item){
    var el=document.createElement('div');
    el.className='ub-faq-item';
    el.innerHTML='<button class="ub-faq-btn" aria-expanded="false"><span class="ub-faq-q">'+item.q+'</span><span class="ub-faq-icon">+</span></button><div class="ub-faq-body"><p class="ub-faq-a">'+item.a+'</p></div>';
    var btn=el.querySelector('.ub-faq-btn');
    var body=el.querySelector('.ub-faq-body');
    var inner=el.querySelector('.ub-faq-a');
    btn.addEventListener('click',function(){
      var isOpen=el.classList.contains('open');
      document.querySelectorAll('.ub-faq-item').forEach(function(x){
        x.classList.remove('open');
        x.querySelector('.ub-faq-btn').setAttribute('aria-expanded','false');
        x.querySelector('.ub-faq-body').style.height='0';
      });
      if(!isOpen){
        el.classList.add('open');
        btn.setAttribute('aria-expanded','true');
        body.style.height=inner.scrollHeight+'px';
      }
    });
    wrap.appendChild(el);
  });
});`;

  const custom = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>FAQ Component</title>
<style>
${cssHTML}
</style>
</head>
<body style="margin:0;padding:24px;font-family:Inter,sans-serif;">
${html}
<script>
document.addEventListener('DOMContentLoaded',function(){
  var faqs=[
${items.map((f) => `    {q:${JSON.stringify(f.q)},a:${JSON.stringify(f.a)}}`).join(",\n")}
  ];
  var wrap=document.getElementById('ubFaq');
  if(!wrap)return;
  faqs.forEach(function(item){
    var el=document.createElement('div');
    el.className='ub-faq-item';
    el.innerHTML='<button class="ub-faq-btn" aria-expanded="false"><span class="ub-faq-q">'+item.q+'</span><span class="ub-faq-icon">+</span></button><div class="ub-faq-body"><p class="ub-faq-a">'+item.a+'</p></div>';
    var btn=el.querySelector('.ub-faq-btn');
    var body=el.querySelector('.ub-faq-body');
    var inner=el.querySelector('.ub-faq-a');
    btn.addEventListener('click',function(){
      var isOpen=el.classList.contains('open');
      document.querySelectorAll('.ub-faq-item').forEach(function(x){
        x.classList.remove('open');
        x.querySelector('.ub-faq-btn').setAttribute('aria-expanded','false');
        x.querySelector('.ub-faq-body').style.height='0';
      });
      if(!isOpen){
        el.classList.add('open');
        btn.setAttribute('aria-expanded','true');
        body.style.height=inner.scrollHeight+'px';
      }
    });
    wrap.appendChild(el);
  });
});
</script>
</body>
</html>`;

  return { css, html, js, custom };
}

function navIcon(cfg, dir) {
  if (cfg.navBtnIcon === "arrow") return dir === "prev" ? "←" : "→";
  if (cfg.navBtnIcon === "chevron") return dir === "prev" ? "‹" : "›";
  if (cfg.navBtnIcon === "triangle") return dir === "prev" ? "◄" : "►";
  return dir === "prev" ? cfg.navBtnCustomPrev : cfg.navBtnCustomNext;
}

function genTestiCode(items, count, dCfg, tCfg, mCfg, platform, customFonts) {
  const vis = items.slice(0, count);
  const isUnbounce = platform === "Unbounce";
  const fonts = [
    dCfg.quoteFont,
    dCfg.nameFont,
    dCfg.roleFont,
    tCfg.quoteFont,
    mCfg.quoteFont,
  ];
  const fontImport = googleFontsImport(fonts, customFonts);
  const dShadow = shadowCss(dCfg);
  const tShadow = shadowCss(tCfg);
  const mShadow = shadowCss(mCfg);
  const pIcon = navIcon(dCfg, "prev");
  const nIcon = navIcon(dCfg, "next");

  const baseCSS = `${fontImport}/* Testimonials (${dCfg.layout}) — ${platform} */
.ub-testi-wrap{max-width:${dCfg.maxWidth}px;margin:0 auto;background:${dCfg.sectionBg};padding:16px;border-radius:12px;box-sizing:border-box;}
.ub-testi-card{background:${dCfg.cardBg};border:${dCfg.cardBorderWidth}px solid ${dCfg.cardBorderColor};border-radius:${dCfg.cardRadius}px;padding:${dCfg.cardPadding}px;box-shadow:${dShadow};display:flex;flex-direction:column;gap:12px;box-sizing:border-box;}
.ub-testi-quote{font-family:'${dCfg.quoteFont}',sans-serif;font-size:${dCfg.quoteSize}px;font-weight:${dCfg.quoteWeight};color:${dCfg.quoteColor};text-align:${dCfg.quoteAlign};line-height:1.65;margin:0;flex:1;}
.ub-testi-name{font-family:'${dCfg.nameFont}',sans-serif;font-size:${dCfg.nameSize}px;font-weight:${dCfg.nameWeight};color:${dCfg.nameColor};}
.ub-testi-role{font-family:'${dCfg.roleFont}',sans-serif;font-size:${dCfg.roleSize}px;color:${dCfg.roleColor};}
.ub-testi-avatar{width:${dCfg.avatarSize}px;height:${dCfg.avatarSize}px;border-radius:${dCfg.avatarRadius}%;display:flex;align-items:center;justify-content:center;font-weight:700;color:#fff;font-size:${Math.round(dCfg.avatarSize * 0.36)}px;flex-shrink:0;}
.ub-testi-stars{display:flex;gap:2px;}
.ub-testi-nav-btn{width:${dCfg.navBtnSize}px;height:${dCfg.navBtnSize}px;border-radius:${dCfg.navBtnRadius}%;background:${dCfg.navBtnBg};border:1px solid ${dCfg.cardBorderColor};color:${dCfg.navBtnColor};font-size:${Math.round(dCfg.navBtnSize * 0.45)}px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-weight:600;line-height:1;transition:all .15s;}
.ub-testi-nav-btn:disabled{opacity:0.4;cursor:not-allowed;background:#f3f4f6;color:#d1d5db;border-color:#e5e7eb;}
.ub-testi-dots{display:flex;gap:6px;justify-content:center;margin-top:14px;flex-wrap:wrap;}
.ub-testi-dot{height:${dCfg.dotSize}px;width:${dCfg.dotSize}px;border-radius:${dCfg.dotSize}px;background:#d1d5db;cursor:pointer;transition:all .2s;}
.ub-testi-dot.active{background:${dCfg.dotColor};width:${dCfg.dotSize * 2.2}px;}
/* card-grid */
.ub-testi-grid{display:grid;grid-template-columns:repeat(${dCfg.columns || 3},1fr);gap:${dCfg.cardGap}px;}
/* carousel */
.ub-testi-carousel-track-wrap{overflow:hidden;flex:1;}
.ub-testi-carousel-track{display:flex;transition:transform .35s ease;}
.ub-testi-carousel-track .ub-testi-card{min-width:100%;box-sizing:border-box;}
.ub-testi-carousel-row{display:flex;align-items:center;gap:12px;}
/* h-scroll */
.ub-testi-hscroll{display:flex;gap:${dCfg.cardGap}px;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;padding-bottom:6px;}
.ub-testi-hscroll .ub-testi-card{scroll-snap-align:start;flex:0 0 auto;width:${Math.round(dCfg.maxWidth / (dCfg.columns || 3) - dCfg.cardGap)}px;}
/* single-quote */
.ub-testi-single-wrap{text-align:center;}
.ub-testi-single-wrap .ub-testi-card{align-items:center;text-align:center;max-width:640px;margin:0 auto;}
.ub-testi-single-wrap .ub-testi-quote{font-size:${Math.round(dCfg.quoteSize * 1.3)}px;}
/* list */
.ub-testi-list{display:flex;flex-direction:column;gap:${dCfg.cardGap}px;}
.ub-testi-list .ub-testi-card{flex-direction:row;align-items:flex-start;gap:12px;}
.ub-testi-list .ub-testi-body{flex:1;display:flex;flex-direction:column;gap:8px;}
/* inline-avatar */
.ub-testi-inline-grid{display:grid;grid-template-columns:repeat(${dCfg.columns || 3},1fr);gap:${dCfg.cardGap}px;}
.ub-testi-inline-grid .ub-testi-card{flex-direction:row;align-items:flex-start;gap:10px;}
.ub-testi-inline-grid .ub-testi-body{flex:1;display:flex;flex-direction:column;gap:6px;}
/* nav row */
.ub-testi-nav-row{display:flex;justify-content:center;gap:10px;margin-top:14px;}`;

  const buildResponsive = (tPfx, mPfx, useMedia) => {
    const tO = useMedia ? "@media(max-width:768px){" : "";
    const tC = useMedia ? "}" : "";
    const mO = useMedia ? "@media(max-width:480px){" : "";
    const mC = useMedia ? "}" : "";
    const t = useMedia ? "" : `${tPfx} `;
    const m = useMedia ? "" : `${mPfx} `;
    return `
${tO}
${t}.ub-testi-wrap{max-width:${tCfg.maxWidth}px;background:${tCfg.sectionBg};}
${t}.ub-testi-card{padding:${tCfg.cardPadding}px;border-radius:${tCfg.cardRadius}px;background:${tCfg.cardBg};box-shadow:${tShadow};}
${t}.ub-testi-quote{font-size:${tCfg.quoteSize}px;color:${tCfg.quoteColor};}
${t}.ub-testi-grid{grid-template-columns:repeat(${tCfg.columns || 2},1fr);}
${t}.ub-testi-inline-grid{grid-template-columns:repeat(${tCfg.columns || 2},1fr);}
${t}.ub-testi-hscroll .ub-testi-card{width:${Math.round(tCfg.maxWidth / (tCfg.columns || 2) - tCfg.cardGap)}px;}
${tC}
${mO}
${m}.ub-testi-wrap{max-width:${mCfg.maxWidth}px;background:${mCfg.sectionBg};}
${m}.ub-testi-card{padding:${mCfg.cardPadding}px;background:${mCfg.cardBg};box-shadow:${mShadow};}
${m}.ub-testi-quote{font-size:${mCfg.quoteSize}px;color:${mCfg.quoteColor};}
${m}.ub-testi-grid{grid-template-columns:1fr;}
${m}.ub-testi-inline-grid{grid-template-columns:1fr;}
${m}.ub-testi-hscroll .ub-testi-card{width:${Math.round(mCfg.maxWidth * 0.85)}px;}
${mC}`;
  };

  const tPfxSheet = isUnbounce ? ".lp-tablet" : "";
  const mPfxSheet = isUnbounce ? ".lp-mobile" : "";
  const css = baseCSS + buildResponsive(tPfxSheet, mPfxSheet, !isUnbounce);
  const cssHTML = baseCSS + buildResponsive("", "", true);

  const html = `<div class="ub-testi-wrap" id="ubTesti"></div>`;
  const jsListener = isUnbounce
    ? "window.addEventListener('load',function(){"
    : "document.addEventListener('DOMContentLoaded',function(){";

  // FIX: buildCard no longer duplicates quote text; cleaner single template per layout
  const dataJs = `  var items=[
${vis.map((t) => `    {name:${JSON.stringify(t.name)},role:${JSON.stringify(t.role)},company:${JSON.stringify(t.company)},quote:${JSON.stringify(t.quote)},stars:${t.stars},initials:${JSON.stringify(t.initials)},avatarBg:${JSON.stringify(t.avatarBg)}}`).join(",\n")}
  ];`;

  // FIX: unified buildCard — no duplicate quote, handles all variants
  const buildCardFn = `  function stars(t){
    var s='';for(var i=1;i<=5;i++)s+='<span style="color:'+(i<=t.stars?'${dCfg.starColor}':'#d1d5db')+';font-size:${dCfg.starSize}px">★</span>';
    return s;
  }
  function avatar(t){
    return ${dCfg.showAvatar}?'<div class="ub-testi-avatar" style="background:'+t.avatarBg+'">'+t.initials+'</div>':'';
  }
  function quoteMark(){
    return ${dCfg.showQuoteMark}?'<div style="font-size:${dCfg.quoteMarkSize}px;color:${dCfg.quoteMarkColor};font-family:Georgia,serif;line-height:.8">&#8220;</div>':'';
  }
  function buildCard(t,isRow){
    var starsHtml=${dCfg.showStars}?'<div class="ub-testi-stars">'+stars(t)+'</div>':'';
    var company=${dCfg.showCompany}?' &middot; '+t.company:'';
    var nameRole='<div><div class="ub-testi-name">'+t.name+'</div><div class="ub-testi-role">'+t.role+company+'</div></div>';
    var quoteHtml='<p class="ub-testi-quote">'+t.quote+'</p>';
    if(isRow){
      return '<div class="ub-testi-card">'+avatar(t)+'<div class="ub-testi-body">'+quoteMark()+quoteHtml+starsHtml+nameRole+'</div></div>';
    }
    return '<div class="ub-testi-card">'+quoteMark()+quoteHtml+starsHtml+'<div style="display:flex;align-items:center;gap:10px">'+avatar(t)+'<div>'+nameRole+'</div></div></div>';
  }`;

  // FIX: carousel JS now has proper disabled state on buttons + touch swipe
  const carouselJs = `
  var current=0,total=items.length;
  var track=document.createElement('div');track.className='ub-testi-carousel-track';
  items.forEach(function(t){
    var slide=document.createElement('div');
    slide.style.cssText='min-width:100%;box-sizing:border-box;padding:0 2px;';
    slide.innerHTML=buildCard(t,false);
    track.appendChild(slide);
  });
  var trackWrap=document.createElement('div');trackWrap.className='ub-testi-carousel-track-wrap';
  trackWrap.appendChild(track);
  var prevBtn=document.createElement('button');prevBtn.className='ub-testi-nav-btn';prevBtn.textContent='${pIcon}';prevBtn.disabled=true;
  var nextBtn=document.createElement('button');nextBtn.className='ub-testi-nav-btn';nextBtn.textContent='${nIcon}';nextBtn.disabled=(total<=1);
  function goTo(i){
    current=Math.max(0,Math.min(total-1,i));
    track.style.transform='translateX(-'+current*100+'%)';
    prevBtn.disabled=(current===0);
    nextBtn.disabled=(current===total-1);
    if(dotsRow){
      dotsRow.querySelectorAll('.ub-testi-dot').forEach(function(d,j){
        d.classList.toggle('active',j===current);
        d.style.width=j===current?'${dCfg.dotSize * 2.2}px':'${dCfg.dotSize}px';
      });
    }
  }
  prevBtn.addEventListener('click',function(){goTo(current-1);});
  nextBtn.addEventListener('click',function(){goTo(current+1);});
  /* touch swipe */
  var touchStartX=0;
  trackWrap.addEventListener('touchstart',function(e){touchStartX=e.touches[0].clientX;},{passive:true});
  trackWrap.addEventListener('touchend',function(e){
    var diff=touchStartX-e.changedTouches[0].clientX;
    if(Math.abs(diff)>40){diff>0?goTo(current+1):goTo(current-1);}
  },{passive:true});
  var navRow=document.createElement('div');navRow.className='ub-testi-carousel-row';
  ${dCfg.navStyle === "sides" ? `navRow.appendChild(prevBtn);navRow.appendChild(trackWrap);navRow.appendChild(nextBtn);` : `navRow.appendChild(trackWrap);`}
  wrap.appendChild(navRow);
  var dotsRow=null;
  ${
    dCfg.showDots
      ? `dotsRow=document.createElement('div');dotsRow.className='ub-testi-dots';
  items.forEach(function(_,i){var d=document.createElement('div');d.className='ub-testi-dot'+(i===0?' active':'');d.addEventListener('click',function(){goTo(i);});dotsRow.appendChild(d);});
  wrap.appendChild(dotsRow);`
      : `dotsRow=null;`
  }
  ${dCfg.navStyle === "bottom" ? `var navRow2=document.createElement('div');navRow2.className='ub-testi-nav-row';navRow2.appendChild(prevBtn);navRow2.appendChild(nextBtn);wrap.appendChild(navRow2);` : ""}
  ${dCfg.autoPlay ? `setInterval(function(){if(current<total-1)goTo(current+1);else goTo(0);},${dCfg.autoPlaySpeed});` : ""}`;

  // FIX: single-quote JS — separate slot from controls; render() only touches the card slot
  const singleQuoteJs = `
  var current=0,total=items.length;
  wrap.className+=' ub-testi-single-wrap';
  var slot=document.createElement('div');wrap.appendChild(slot);
  function render(){slot.innerHTML=buildCard(items[current],false);}
  var dotsRow=null;
  ${
    dCfg.showDots
      ? `dotsRow=document.createElement('div');dotsRow.className='ub-testi-dots';
  items.forEach(function(_,i){
    var d=document.createElement('div');d.className='ub-testi-dot'+(i===0?' active':'');
    d.addEventListener('click',function(){current=i;render();updateDots();});
    dotsRow.appendChild(d);
  });
  wrap.appendChild(dotsRow);`
      : "dotsRow=null;"
  }
  function updateDots(){
    if(!dotsRow)return;
    dotsRow.querySelectorAll('.ub-testi-dot').forEach(function(d,j){
      d.classList.toggle('active',j===current);
      d.style.width=j===current?'${dCfg.dotSize * 2.2}px':'${dCfg.dotSize}px';
    });
  }
  ${
    dCfg.navStyle !== "hidden"
      ? `
  var prevBtn=document.createElement('button');prevBtn.className='ub-testi-nav-btn';prevBtn.textContent='${pIcon}';
  var nextBtn=document.createElement('button');nextBtn.className='ub-testi-nav-btn';nextBtn.textContent='${nIcon}';
  prevBtn.addEventListener('click',function(){current=(current-1+total)%total;render();updateDots();});
  nextBtn.addEventListener('click',function(){current=(current+1)%total;render();updateDots();});
  var navRow=document.createElement('div');navRow.className='ub-testi-nav-row';
  navRow.appendChild(prevBtn);navRow.appendChild(nextBtn);
  wrap.appendChild(navRow);`
      : ""
  }
  render();
  ${dCfg.autoPlay ? `setInterval(function(){current=(current+1)%total;render();updateDots();},${dCfg.autoPlaySpeed});` : ""}`;

  let jsBody;
  if (dCfg.layout === "card-grid") {
    jsBody = `  var wrap=document.getElementById('ubTesti');if(!wrap)return;
  wrap.className+=' ub-testi-grid';
  items.forEach(function(t){wrap.insertAdjacentHTML('beforeend',buildCard(t,false));});`;
  } else if (dCfg.layout === "carousel") {
    jsBody = `  var wrap=document.getElementById('ubTesti');if(!wrap)return;\n${carouselJs}`;
  } else if (dCfg.layout === "h-scroll") {
    jsBody = `  var wrap=document.getElementById('ubTesti');if(!wrap)return;
  var track=document.createElement('div');track.className='ub-testi-hscroll';
  items.forEach(function(t){track.insertAdjacentHTML('beforeend',buildCard(t,false));});
  wrap.appendChild(track);`;
  } else if (dCfg.layout === "single-quote") {
    jsBody = `  var wrap=document.getElementById('ubTesti');if(!wrap)return;\n${singleQuoteJs}`;
  } else if (dCfg.layout === "list") {
    jsBody = `  var wrap=document.getElementById('ubTesti');if(!wrap)return;
  wrap.className+=' ub-testi-list';
  items.forEach(function(t){wrap.insertAdjacentHTML('beforeend',buildCard(t,true));});`;
  } else if (dCfg.layout === "inline-avatar") {
    jsBody = `  var wrap=document.getElementById('ubTesti');if(!wrap)return;
  wrap.className+=' ub-testi-inline-grid';
  items.forEach(function(t){wrap.insertAdjacentHTML('beforeend',buildCard(t,true));});`;
  } else {
    jsBody = `  var wrap=document.getElementById('ubTesti');if(!wrap)return;
  wrap.className+=' ub-testi-grid';
  items.forEach(function(t){wrap.insertAdjacentHTML('beforeend',buildCard(t,false));});`;
  }

  const js = `${jsListener}
${dataJs}
${buildCardFn}
${jsBody}
});`;

  const custom = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Testimonials Component</title>
<style>
${cssHTML}
</style>
</head>
<body style="margin:0;padding:24px;font-family:Inter,sans-serif;">
${html}
<script>
${js.replace("window.addEventListener('load',function(){", "document.addEventListener('DOMContentLoaded',function(){")}
</script>
</body>
</html>`;

  return { css, html, js, custom };
}

// ════════════════════════════════════════════════════════════════════════════
// PREVIEW COMPONENTS
// ════════════════════════════════════════════════════════════════════════════
function AnimatedFaqItem({ faq, index, isOpen, onToggle, cfg }) {
  const bodyRef = useRef(null);
  const [height, setHeight] = useState(0);
  useEffect(() => {
    if (!bodyRef.current) return;
    setHeight(isOpen ? bodyRef.current.scrollHeight : 0);
  }, [isOpen]);
  return (
    <div
      style={{
        background: isOpen ? cfg.activeBg : cfg.bgColor,
        border: `${cfg.borderWidth}px solid ${isOpen ? cfg.iconColor : cfg.borderColor}`,
        borderRadius: cfg.borderRadius,
        overflow: "hidden",
        transition: "background .25s, border-color .25s",
      }}
    >
      <button
        onClick={() => onToggle(index)}
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
            transition: "color .25s",
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
            lineHeight: 1,
            transition: "transform .3s cubic-bezier(.4,0,.2,1)",
            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
            display: "inline-block",
          }}
        >
          +
        </span>
      </button>
      <div
        style={{
          height,
          overflow: "hidden",
          transition: "height .35s cubic-bezier(.4,0,.2,1)",
        }}
      >
        <div
          ref={bodyRef}
          style={{ borderTop: `1px solid ${cfg.dividerColor}` }}
        >
          <p
            style={{
              fontFamily: `'${cfg.aFont}',sans-serif`,
              fontSize: cfg.aSize,
              fontWeight: cfg.aWeight,
              color: cfg.aColor,
              textAlign: cfg.aAlign,
              margin: 0,
              padding: `${Math.round(cfg.padding * 0.6)}px ${cfg.padding}px ${cfg.padding}px`,
              lineHeight: 1.65,
            }}
          >
            {faq.a}
          </p>
        </div>
      </div>
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
      {faqs.slice(0, count).map((faq, i) => (
        <AnimatedFaqItem
          key={faq.id}
          faq={faq}
          index={i}
          isOpen={open === i}
          onToggle={(i) => setOpen((p) => (p === i ? null : i))}
          cfg={cfg}
        />
      ))}
    </div>
  );
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

function NameRole({ t, cfg }) {
  return (
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
          <span style={{ color: cfg.companyColor, fontSize: cfg.companySize }}>
            {" "}
            · {t.company}
          </span>
        ) : null}
      </div>
    </div>
  );
}

// FIX: TestiCard — clean, no duplicate quote; supports stack and row variants
function TestiCard({ t, cfg, style = {}, variant = "stack" }) {
  const isRow = variant === "row";
  return (
    <div
      style={{
        background: cfg.cardBg,
        border: `${cfg.cardBorderWidth}px solid ${cfg.cardBorderColor}`,
        borderRadius: cfg.cardRadius,
        padding: cfg.cardPadding,
        boxShadow: shadowCss(cfg),
        display: "flex",
        flexDirection: isRow ? "row" : "column",
        alignItems: isRow ? "flex-start" : "stretch",
        gap: 12,
        boxSizing: "border-box",
        ...style,
      }}
    >
      {isRow && cfg.showAvatar && (
        <Avatar t={t} size={cfg.avatarSize} radius={cfg.avatarRadius} />
      )}
      <div
        style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}
      >
        {cfg.showQuoteMark && (
          <div
            style={{
              fontSize: cfg.quoteMarkSize,
              color: cfg.quoteMarkColor,
              lineHeight: 0.8,
              fontFamily: "Georgia,serif",
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
        {!isRow ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {cfg.showAvatar && (
              <Avatar t={t} size={cfg.avatarSize} radius={cfg.avatarRadius} />
            )}
            <NameRole t={t} cfg={cfg} />
          </div>
        ) : (
          <NameRole t={t} cfg={cfg} />
        )}
      </div>
    </div>
  );
}

function NavBtn({ dir, cfg, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: cfg.navBtnSize,
        height: cfg.navBtnSize,
        borderRadius: `${cfg.navBtnRadius}%`,
        background: disabled ? "#f3f4f6" : cfg.navBtnBg,
        border: `1px solid ${disabled ? "#e5e7eb" : cfg.cardBorderColor}`,
        color: disabled ? "#d1d5db" : cfg.navBtnColor,
        fontSize: Math.round(cfg.navBtnSize * 0.45),
        cursor: disabled ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        fontWeight: 600,
        lineHeight: 1,
        opacity: disabled ? 0.4 : 1,
        transition: "all .15s",
      }}
    >
      {navIcon(cfg, dir)}
    </button>
  );
}

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

function SectionWrap({ cfg, children, style = {} }) {
  return (
    <div
      style={{
        maxWidth: cfg.maxWidth,
        margin: "0 auto",
        background: cfg.sectionBg,
        padding: 16,
        borderRadius: 12,
        boxSizing: "border-box",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// FIX: CarouselLayout — touch swipe + disabled prev/next + correct autoplay + sectionBg wrapper
function CarouselLayout({ items, cfg }) {
  const [idx, setIdx] = useState(0);
  const total = items.length;
  const trackRef = useRef(null);
  const touchStartX = useRef(0);

  // FIX: useCallback to avoid stale closures in autoplay
  const goTo = useCallback(
    (i) => {
      setIdx(Math.max(0, Math.min(total - 1, i)));
    },
    [total],
  );

  useEffect(() => {
    if (!cfg.autoPlay) return;
    const t = setInterval(
      () => setIdx((i) => (i >= total - 1 ? 0 : i + 1)),
      cfg.autoPlaySpeed || 3000,
    );
    return () => clearInterval(t);
  }, [cfg.autoPlay, cfg.autoPlaySpeed, total]);

  // FIX: touch handlers for swipe on mobile
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? goTo(idx + 1) : goTo(idx - 1);
  };

  const navSides = cfg.navStyle === "sides";
  const navBottom = cfg.navStyle === "bottom";
  const isFirst = idx === 0;
  const isLast = idx === total - 1;

  return (
    <SectionWrap cfg={cfg}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {navSides && (
          <NavBtn
            dir="prev"
            cfg={cfg}
            onClick={() => goTo(idx - 1)}
            disabled={isFirst}
          />
        )}
        <div
          style={{ flex: 1, overflow: "hidden" }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div
            ref={trackRef}
            style={{
              display: "flex",
              transition: "transform .35s cubic-bezier(.4,0,.2,1)",
              transform: `translateX(-${idx * 100}%)`,
            }}
          >
            {items.map((t) => (
              <div
                key={t.id}
                style={{
                  minWidth: "100%",
                  padding: "4px 2px",
                  boxSizing: "border-box",
                }}
              >
                <TestiCard t={t} cfg={cfg} />
              </div>
            ))}
          </div>
        </div>
        {navSides && (
          <NavBtn
            dir="next"
            cfg={cfg}
            onClick={() => goTo(idx + 1)}
            disabled={isLast}
          />
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
          <NavBtn
            dir="prev"
            cfg={cfg}
            onClick={() => goTo(idx - 1)}
            disabled={isFirst}
          />
          <NavBtn
            dir="next"
            cfg={cfg}
            onClick={() => goTo(idx + 1)}
            disabled={isLast}
          />
        </div>
      )}
      <Dots total={total} active={idx} cfg={cfg} onSelect={goTo} />
    </SectionWrap>
  );
}

function CardGridLayout({ items, cfg }) {
  return (
    <SectionWrap
      cfg={cfg}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cfg.columns || 3},1fr)`,
        gap: cfg.cardGap,
      }}
    >
      {items.map((t) => (
        <TestiCard key={t.id} t={t} cfg={cfg} />
      ))}
    </SectionWrap>
  );
}

function HScrollLayout({ items, cfg }) {
  const cardWidth = `calc((100% - ${(cfg.columns - 1) * cfg.cardGap}px) / ${cfg.columns})`;
  return (
    <SectionWrap cfg={cfg}>
      <div
        style={{
          display: "flex",
          gap: cfg.cardGap,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          paddingBottom: 6,
        }}
      >
        {items.map((t) => (
          <div
            key={t.id}
            style={{
              flex: `0 0 ${cardWidth}`,
              minWidth: 200,
              scrollSnapAlign: "start",
            }}
          >
            <TestiCard t={t} cfg={cfg} />
          </div>
        ))}
      </div>
    </SectionWrap>
  );
}

// FIX: SingleQuoteLayout — slot, dots, and nav are separate DOM areas;
// render() only replaces the card slot so dots/nav never get wiped.
function SingleQuoteLayout({ items, cfg }) {
  const [idx, setIdx] = useState(0);
  const total = items.length;

  const goTo = useCallback(
    (i) => {
      setIdx(((i % total) + total) % total);
    },
    [total],
  );

  useEffect(() => {
    if (!cfg.autoPlay) return;
    const t = setInterval(
      () => setIdx((i) => (i + 1) % total),
      cfg.autoPlaySpeed || 3000,
    );
    return () => clearInterval(t);
  }, [cfg.autoPlay, cfg.autoPlaySpeed, total]);

  const bigCfg = {
    ...cfg,
    quoteSize: Math.round(cfg.quoteSize * 1.3),
    quoteAlign: "center",
  };

  return (
    <SectionWrap cfg={cfg}>
      {/* Card slot */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 640 }}>
          <TestiCard
            t={items[idx]}
            cfg={bigCfg}
            style={{ alignItems: "center", textAlign: "center" }}
          />
        </div>
      </div>
      {/* Nav */}
      {cfg.navStyle !== "hidden" && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 10,
            marginTop: 14,
          }}
        >
          <NavBtn dir="prev" cfg={cfg} onClick={() => goTo(idx - 1)} />
          <NavBtn dir="next" cfg={cfg} onClick={() => goTo(idx + 1)} />
        </div>
      )}
      {/* Dots */}
      <Dots total={total} active={idx} cfg={cfg} onSelect={goTo} />
    </SectionWrap>
  );
}

function ListFeedLayout({ items, cfg }) {
  return (
    <SectionWrap
      cfg={cfg}
      style={{ display: "flex", flexDirection: "column", gap: cfg.cardGap }}
    >
      {items.map((t) => (
        <TestiCard key={t.id} t={t} cfg={cfg} variant="row" />
      ))}
    </SectionWrap>
  );
}

function InlineAvatarLayout({ items, cfg }) {
  return (
    <SectionWrap
      cfg={cfg}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cfg.columns || 3},1fr)`,
        gap: cfg.cardGap,
      }}
    >
      {items.map((t) => (
        <TestiCard key={t.id} t={t} cfg={cfg} variant="row" />
      ))}
    </SectionWrap>
  );
}

function TestiPreview({ items, count, cfg }) {
  const vis = items.slice(0, count);
  switch (cfg.layout) {
    case "carousel":
      return <CarouselLayout items={vis} cfg={cfg} />;
    case "h-scroll":
      return <HScrollLayout items={vis} cfg={cfg} />;
    case "single-quote":
      return <SingleQuoteLayout items={vis} cfg={cfg} />;
    case "list":
      return <ListFeedLayout items={vis} cfg={cfg} />;
    case "inline-avatar":
      return <InlineAvatarLayout items={vis} cfg={cfg} />;
    default:
      return <CardGridLayout items={vis} cfg={cfg} />;
  }
}

// ════════════════════════════════════════════════════════════════════════════
// STYLE PANELS
// ════════════════════════════════════════════════════════════════════════════
function FaqStylePanel({ cfg, onChange, customFonts }) {
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
      <FontSelect
        label="Font family"
        val={cfg.qFont}
        onChange={(v) => up("qFont", v)}
        customFonts={customFonts}
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
      <FontSelect
        label="Font family"
        val={cfg.aFont}
        onChange={(v) => up("aFont", v)}
        customFonts={customFonts}
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

function TestiStylePanel({ cfg, onChange, customFonts }) {
  const up = (k, v) => onChange({ ...cfg, [k]: v });
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
  const showNavSection =
    cfg.layout === "carousel" || cfg.layout === "single-quote";

  return (
    <div style={{ padding: "12px 14px" }}>
      <SHead title="Layout" />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 4,
          marginBottom: 12,
        }}
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
              border: `1px solid ${cfg.layout === l.id ? "#1a1a18" : null}`,
              background: cfg.layout === l.id ? "#1a1a18" : "#555555",
              color: cfg.layout === l.id ? "#ffff" : S.muted,
              textAlign: "center",
            }}
          >
            {l.label}
          </button>
        ))}
      </div>
      {(cfg.layout === "card-grid" ||
        cfg.layout === "inline-avatar" ||
        cfg.layout === "h-scroll") && (
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
        label="Border color"
        val={cfg.cardBorderColor}
        onChange={(v) => up("cardBorderColor", v)}
      />
      <Slider
        label="Border width"
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
      <Toggle
        label="Card shadow"
        val={cfg.showShadow}
        onChange={(v) => up("showShadow", v)}
      />
      {cfg.showShadow && (
        <>
          <Slider
            label="Shadow X"
            min={-40}
            max={40}
            val={cfg.shadowX}
            unit="px"
            onChange={(v) => up("shadowX", v)}
          />
          <Slider
            label="Shadow Y"
            min={-40}
            max={40}
            val={cfg.shadowY}
            unit="px"
            onChange={(v) => up("shadowY", v)}
          />
          <Slider
            label="Shadow blur"
            min={0}
            max={80}
            val={cfg.shadowBlur}
            unit="px"
            onChange={(v) => up("shadowBlur", v)}
          />
          <Slider
            label="Shadow spread"
            min={-20}
            max={40}
            val={cfg.shadowSpread}
            unit="px"
            onChange={(v) => up("shadowSpread", v)}
          />
          <ColorRow
            label="Shadow color"
            val={cfg.shadowColor}
            onChange={(v) => up("shadowColor", v)}
          />
        </>
      )}
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
      <FontSelect
        label="Font family"
        val={cfg.quoteFont}
        onChange={(v) => up("quoteFont", v)}
        customFonts={customFonts}
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
      <FontSelect
        label="Font family"
        val={cfg.nameFont}
        onChange={(v) => up("nameFont", v)}
        customFonts={customFonts}
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
      <FontSelect
        label="Font family"
        val={cfg.roleFont}
        onChange={(v) => up("roleFont", v)}
        customFonts={customFonts}
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
      {showNavSection && (
        <>
          <SHead title="Navigation" />
          <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
            {NAV_STYLES.map((n) => (
              <button
                key={n.id}
                onClick={() => up("navStyle", n.id)}
                style={{
                  flex: 1,
                  padding: "4px",
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
              {cfg.navBtnIcon === "custom" && (
                <>
                  {[
                    ["navBtnCustomPrev", "Prev symbol"],
                    ["navBtnCustomNext", "Next symbol"],
                  ].map(([k, lbl]) => (
                    <div
                      key={k}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 8,
                      }}
                    >
                      <span style={{ fontSize: 11, color: S.muted }}>
                        {lbl}
                      </span>
                      <input
                        value={cfg[k]}
                        onChange={(e) => up(k, e.target.value)}
                        style={{
                          width: 50,
                          fontSize: 11,
                          padding: "3px 6px",
                          borderRadius: 4,
                          border: "1px solid #2a2a3a",
                          background: "#080810",
                          color: S.text,
                          textAlign: "center",
                        }}
                      />
                    </div>
                  ))}
                </>
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
        </>
      )}
    </div>
  );
}

// ── Content Panels ────────────────────────────────────────────────────────────
function FaqContentPanel({ faqs, setFaqs, count, setCount }) {
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

function TestiContentPanel({ items, setItems, count, setCount }) {
  const [editing, setEditing] = useState(null);
  const COLORS = [
    "#6c47ff",
    "#0ea5e9",
    "#f59e0b",
    "#10b981",
    "#ec4899",
    "#8b5cf6",
    "#ef4444",
    "#14b8a6",
  ];
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
        avatarBg: COLORS[items.length % COLORS.length],
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
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: t.avatarBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 8,
                fontWeight: 700,
              }}
            >
              {t.initials}
            </div>
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
              <div style={{ fontSize: 10, color: S.muted, marginBottom: 5 }}>
                Avatar color
              </div>
              <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                {COLORS.map((c) => (
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
// MAIN APP
// ════════════════════════════════════════════════════════════════════════════
export default function FaqTestimonialBuilder() {
  const [activeNav, setActiveNav] = useState("faq");
  const [platform, setPlatform] = useState("Unbounce");
  const [viewport, setViewport] = useState("desktop");
  const [leftTab, setLeftTab] = useState("style");
  const [codeTab, setCodeTab] = useState("custom");
  const [copied, setCopied] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [platOpen, setPlatOpen] = useState(false);

  const [customFonts, setCustomFonts] = useState([]);
  const addCustomFont = (name) => setCustomFonts((p) => [...p, { name }]);
  const addCustomFontFile = (font) => setCustomFonts((p) => [...p, font]);
  const removeCustomFont = (name) =>
    setCustomFonts((p) => p.filter((x) => x.name !== name));

  const [faqs, setFaqs] = useState(DEFAULT_FAQS);
  const [faqCount, setFaqCount] = useState(5);
  const [faqDCfg, setFaqDCfg] = useState(mkFaqDesktop());
  const [faqTCfg, setFaqTCfg] = useState(mkFaqTablet());
  const [faqMCfg, setFaqMCfg] = useState(mkFaqMobile());

  const [testis, setTestis] = useState(DEFAULT_TESTIMONIALS);
  const [testiCount, setTestiCount] = useState(6);
  const [testiDCfg, setTestiDCfg] = useState(mkTestDesktop());
  const [testiTCfg, setTestiTCfg] = useState(mkTestTablet());
  const [testiMCfg, setTestiMCfg] = useState(mkTestMobile());

  const isFaq = activeNav === "faq";

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

  const faqCode = genFaqCode(
    faqs,
    faqCount,
    faqDCfg,
    faqTCfg,
    faqMCfg,
    platform,
    customFonts,
  );
  const testiCode = genTestiCode(
    testis,
    testiCount,
    testiDCfg,
    testiTCfg,
    testiMCfg,
    platform,
    customFonts,
  );
  const code = isFaq ? faqCode : testiCode;

  function copy() {
    navigator.clipboard.writeText(
      codeTab === "custom" ? code.custom : code[codeTab],
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const vpBtn = (v) => ({
    padding: "4px 12px",
    fontSize: 11,
    borderRadius: 6,
    cursor: "pointer",
    border: `1px solid ${viewport === v ? "#6c47ff" : "#2a2a3a"}`,
    background: viewport === v ? "rgba(108,71,255,0.15)" : "transparent",
    color: viewport === v ? "#a58dff" : S.muted,
  });

  const LEFT_TABS = [
    { id: "style", label: "Style" },
    { id: "content", label: "Content" },
    { id: "fonts", label: "+ Fonts" },
  ];

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
      {/* ── Left sidebar ── */}
      <div
        style={{
          width: 256,
          flexShrink: 0,
          borderRight: "1px solid #1e1e30",
          background: "#0d0d18",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "12px 14px",
            borderBottom: "1px solid #1e1e30",
            flexShrink: 0,
          }}
        >
          <div style={{ fontWeight: 800, fontSize: 13, letterSpacing: -0.5 }}>
            Component <span style={{ color: "#6c47ff" }}>Builder</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #1e1e30",
            flexShrink: 0,
          }}
        >
          {LEFT_TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setLeftTab(t.id)}
              style={{
                flex: 1,
                padding: "8px 4px",
                fontSize: 11,
                border: "none",
                cursor: "pointer",
                background: leftTab === t.id ? "#13131f" : "transparent",
                color: leftTab === t.id ? S.text : S.muted,
                fontWeight: leftTab === t.id ? 600 : 400,
                borderBottom: `2px solid ${leftTab === t.id ? "#6c47ff" : "transparent"}`,
                whiteSpace: "nowrap",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {leftTab === "style" && (
          <div
            style={{
              padding: "8px 12px 0",
              display: "flex",
              gap: 4,
              flexShrink: 0,
            }}
          >
            {[
              { id: "desktop", label: "🖥" },
              { id: "tablet", label: "📟" },
              { id: "mobile", label: "📱" },
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => setViewport(v.id)}
                style={{
                  flex: 1,
                  padding: "3px 2px",
                  fontSize: 11,
                  borderRadius: 5,
                  cursor: "pointer",
                  border: `1px solid ${viewport === v.id ? "#6c47ff" : "#2a2a3a"}`,
                  background:
                    viewport === v.id ? "rgba(108,71,255,0.15)" : "transparent",
                  color: viewport === v.id ? "#a58dff" : S.muted,
                }}
              >
                {v.label} {v.id}
              </button>
            ))}
          </div>
        )}
        {leftTab === "style" && (
          <div
            style={{
              margin: "5px 12px 0",
              padding: "3px 7px",
              background: "rgba(108,71,255,0.07)",
              borderRadius: 4,
              fontSize: 9,
              color: "#5a5a78",
              flexShrink: 0,
            }}
          >
            Editing <strong style={{ color: "#a58dff" }}>{viewport}</strong>{" "}
            only
          </div>
        )}

        <div style={{ flex: 1, overflowY: "auto" }}>
          {leftTab === "fonts" ? (
            <CustomFontManager
              customFonts={customFonts}
              onAdd={addCustomFont}
              onAddFile={addCustomFontFile}
              onRemove={removeCustomFont}
            />
          ) : leftTab === "style" ? (
            isFaq ? (
              <FaqStylePanel
                cfg={curFaqCfg}
                onChange={setCurFaqCfg}
                customFonts={customFonts}
              />
            ) : (
              <TestiStylePanel
                cfg={curTestiCfg}
                onChange={setCurTestiCfg}
                customFonts={customFonts}
              />
            )
          ) : isFaq ? (
            <FaqContentPanel
              faqs={faqs}
              setFaqs={setFaqs}
              count={faqCount}
              setCount={setFaqCount}
            />
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

      {/* ── Center ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 20px",
            background: "rgba(13,13,24,0.9)",
            borderBottom: "1px solid #1e1e30",
            flexShrink: 0,
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              background: "#13131f",
              borderRadius: 8,
              padding: 3,
              gap: 2,
            }}
          >
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveNav(item.id);
                  setLeftTab("style");
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "5px 14px",
                  borderRadius: 6,
                  fontSize: 12,
                  border: "none",
                  cursor: "pointer",
                  background: activeNav === item.id ? "#6c47ff" : "transparent",
                  color: activeNav === item.id ? "#fff" : S.muted,
                  fontWeight: activeNav === item.id ? 600 : 400,
                  transition: "all .2s",
                }}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 4, marginLeft: 12 }}>
            {[
              { id: "desktop", label: "🖥 Desktop" },
              { id: "tablet", label: "📟 Tablet" },
              { id: "mobile", label: "📱 Mobile" },
            ].map((v) => (
              <button
                key={v.id}
                onClick={() => setViewport(v.id)}
                style={vpBtn(v.id)}
              >
                {v.label}
              </button>
            ))}
          </div>

          <div style={{ position: "relative", marginLeft: "auto" }}>
            <button
              onClick={() => setPlatOpen((o) => !o)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "5px 12px",
                borderRadius: 7,
                fontSize: 11,
                cursor: "pointer",
                border: "1px solid #2a2a3a",
                background: "#13131f",
                color: S.text,
              }}
            >
              🖥 {platform}{" "}
              <span style={{ fontSize: 9, color: S.muted }}>▾</span>
            </button>
            {platOpen && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 6px)",
                  background: "#0d0d18",
                  border: "1px solid #2a2a3a",
                  borderRadius: 8,
                  padding: 4,
                  zIndex: 100,
                  minWidth: 140,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                }}
              >
                {PLATFORMS.map((p) => (
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
                      fontSize: 11,
                      borderRadius: 5,
                      border: "none",
                      cursor: "pointer",
                      background:
                        platform === p
                          ? "rgba(108,71,255,0.15)"
                          : "transparent",
                      color: platform === p ? "#a58dff" : S.muted,
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={copy}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 14px",
              borderRadius: 7,
              fontSize: 12,
              cursor: "pointer",
              border: "none",
              background: copied ? "#16a34a" : "#6c47ff",
              color: "#fff",
              fontWeight: 600,
              transition: "background .2s",
            }}
          >
            {copied ? "✓ Copied!" : "Copy Code"}
          </button>
          <button
            onClick={() => setShowCode((o) => !o)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 12px",
              borderRadius: 7,
              fontSize: 12,
              cursor: "pointer",
              border: `1px solid ${showCode ? "#6c47ff" : "#2a2a3a"}`,
              background: showCode ? "rgba(108,71,255,0.15)" : "transparent",
              color: showCode ? "#a58dff" : S.muted,
            }}
          >
            {"</>"} {showCode ? "Hide Code" : "Show Code"}
          </button>
        </div>

        {/* Preview area */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "28px 20px",
            background: "#0a0a14",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          {isFaq ? (
            <FontLoader cfg={curFaqCfg} type="faq" customFonts={customFonts} />
          ) : (
            <FontLoader
              cfg={curTestiCfg}
              type="testi"
              customFonts={customFonts}
            />
          )}
          <div
            style={{
              width: VP_W[viewport],
              maxWidth: VP_W[viewport],
              background: "#fff",
              borderRadius: 12,
              padding: 28,
              boxShadow: "0 8px 60px rgba(0,0,0,0.6)",
              transition:
                "width .35s cubic-bezier(.4,0,.2,1), max-width .35s cubic-bezier(.4,0,.2,1)",
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

      {/* ── Right code panel ── */}
      <div
        style={{
          width: showCode ? 320 : 0,
          flexShrink: 0,
          transition: "width .3s cubic-bezier(.4,0,.2,1)",
          overflow: "hidden",
          borderLeft: showCode ? "1px solid #1e1e30" : "none",
          background: "#0d0d18",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            width: 320,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <div
            style={{
              padding: "10px 14px",
              borderBottom: "1px solid #1e1e30",
              flexShrink: 0,
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 12, color: S.text }}>
              Export & Handoff
            </div>
            <div style={{ fontSize: 10, color: S.muted, marginTop: 2 }}>
              All style changes reflect instantly in code
            </div>
          </div>
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
            {["custom", "css", "html", "js"].map((t) => (
              <button
                key={t}
                onClick={() => setCodeTab(t)}
                style={{
                  padding: "4px 8px",
                  fontSize: 10,
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
                {t === "custom" ? "Full HTML" : t}
              </button>
            ))}
            <button
              onClick={copy}
              style={{
                marginLeft: "auto",
                padding: "4px 10px",
                fontSize: 11,
                borderRadius: 5,
                cursor: "pointer",
                border: "none",
                background: copied ? "#16a34a" : "#6c47ff",
                color: "#fff",
                fontWeight: 600,
              }}
            >
              {copied ? "✓" : "Copy"}
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
            {codeTab === "custom" ? code.custom : code[codeTab]}
          </pre>
          <div
            style={{
              padding: "10px 14px",
              borderTop: "1px solid #1e1e30",
              flexShrink: 0,
              background: "#0d0d18",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: "#a58dff",
                marginBottom: 6,
              }}
            >
              Where to paste · {platform}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {[
                {
                  label: "CSS",
                  where:
                    platform === "Unbounce"
                      ? "Stylesheets panel"
                      : platform === "Webflow"
                        ? "Site Settings > Custom Code > Head"
                        : "<style> tag in <head>",
                },
                {
                  label: "HTML",
                  where:
                    platform === "Unbounce"
                      ? "HTML widget on page"
                      : platform === "Webflow"
                        ? "Embed block"
                        : "Where you want it in <body>",
                },
                {
                  label: "JS",
                  where:
                    platform === "Unbounce"
                      ? "Javascripts > Before Body End Tag"
                      : platform === "Webflow"
                        ? "Site Settings > Before </body>"
                        : "Before </body>",
                },
              ].map((row) => (
                <div
                  key={row.label}
                  style={{ display: "flex", gap: 8, alignItems: "flex-start" }}
                >
                  <span
                    style={{
                      fontSize: 9,
                      fontFamily: "monospace",
                      background: "rgba(108,71,255,0.2)",
                      color: "#a58dff",
                      padding: "1px 5px",
                      borderRadius: 3,
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    {row.label}
                  </span>
                  <span
                    style={{ fontSize: 10, color: S.muted, lineHeight: 1.5 }}
                  >
                    {row.where}
                  </span>
                </div>
              ))}
            </div>
            <div
              style={{
                marginTop: 8,
                padding: "6px 8px",
                background: "rgba(255,90,90,0.07)",
                border: "1px solid rgba(255,90,90,0.15)",
                borderRadius: 5,
                fontSize: 10,
                color: "#ff8080",
                lineHeight: 1.5,
              }}
            >
              {platform === "Unbounce"
                ? "⚠ JS won't run in Unbounce Preview — test on published page."
                : "⚠ Test after pasting — order of CSS/JS matters."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
