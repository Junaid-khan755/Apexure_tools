import { useState, useRef, useCallback, useMemo, useEffect } from "react";
console.log("SUPABASE URL:", import.meta.env.VITE_SUPABASE_URL);
console.log("SUPABASE KEY:", import.meta.env.VITE_SUPABASE_ANON_KEY);
// ─── Constants ────────────────────────────────────────────────────────────────
const PRESETS = [
  "Unbounce",
  "Webflow",
  "Elementor",
  "Shopify",
  "Framer",
  "Generic HTML",
];
const PLATFORMS = {
  Unbounce: "unbounce",
  Webflow: "webflow",
  Elementor: "elementor",
  Shopify: "shopify",
  Framer: "framer",
  "Generic HTML": "generic",
};
const SPEED_MAP = { Slow: 60, Medium: 35, Fast: 18 };
const PLATFORM_COMMENT = {
  unbounce: "<!-- Unbounce: paste into Custom HTML widget -->",
  webflow: "<!-- Webflow: paste into Embed element -->",
  elementor: "<!-- Elementor: paste into HTML widget -->",
  shopify: "<!-- Shopify: paste into section HTML -->",
  framer: "<!-- Framer: paste into Code component -->",
  generic: "<!-- Paste into any HTML page -->",
};

const POPULAR_FONTS = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Poppins",
  "Raleway",
  "Nunito",
  "Playfair Display",
  "Merriweather",
  "Source Sans 3",
  "DM Sans",
  "Outfit",
  "Plus Jakarta Sans",
  "Sora",
  "Manrope",
  "Space Grotesk",
  "Urbanist",
  "Cormorant",
  "Libre Baskerville",
];

const DEFAULT_LOGO_SETTINGS = {
  direction: "left",
  speed: "Medium",
  customSpeed: 35,
  logoHeight: 48,
  logoSpacing: 40,
  pauseOnHover: true,
  grayscale: false,
  fadeEdges: true,
  bgColor: "#ffffff",
  verticalPadding: 20,
  platform: "Unbounce",
  breakpoint: "desktop",
  tablet: { logoHeight: 40, logoSpacing: 32, speed: "Medium" },
  mobile: { logoHeight: 32, logoSpacing: 24, speed: "Slow" },
};

const DEFAULT_TEXT_SETTINGS = {
  text: "We help brands grow · Trusted by 500+ companies · Award-winning design · ",
  direction: "left",
  speed: "Medium",
  customSpeed: 40,
  fontSize: 18,
  fontFamily: "Inter",
  fontWeight: "400",
  textColor: "#1a1a18",
  bgColor: "#ffffff",
  letterSpacing: 0,
  verticalPadding: 20,
  separator: "·",
  separatorColor: "#aaaaaa",
  fadeEdges: true,
  pauseOnHover: false,
  googleFont: true,
  customFontName: "",
  customFontData: "",
  customFontExt: "",
  platform: "Unbounce",
};

// ─── Logo Code Generator ──────────────────────────────────────────────────────

async function uploadToSupabase({ file, supabaseUrl, supabaseAnonKey }) {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  try {
    const ext = file.name.split(".").pop();
    const baseName = file.name.replace(/\.[^.]+$/, "");
    const fileName = `${baseName}-${Date.now()}.${ext}`;
    const uploadUrl = `${supabaseUrl}/storage/v1/object/logos/${fileName}`;
    const uploadRes = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        "Content-Type": file.type,
        "x-upsert": "false",
      },
      body: file,
    });
    if (!uploadRes.ok) {
      const errorText = await uploadRes.text();
      console.error("Supabase response:", errorText);
      throw new Error(`Upload failed: ${errorText}`);
    }
    return `${supabaseUrl}/storage/v1/object/public/logos/${fileName}`;
  } catch (e) {
    console.error("Supabase upload failed:", e);
    return null;
  }
}

function generateLogoCode(logos, s) {
  if (!logos.length) return "<!-- Upload logos to generate code -->";
  const dur = s.speed === "Custom" ? s.customSpeed : SPEED_MAP[s.speed];
  const bg = s.bgColor || "#ffffff";
  const vPad = s.verticalPadding ?? 20;
  const tabDur = s.tablet?.speed ? SPEED_MAP[s.tablet.speed] : dur;
  const mobDur = s.mobile?.speed ? SPEED_MAP[s.mobile.speed] : dur;
  const tabGap = s.tablet?.logoSpacing ?? Math.max(8, s.logoSpacing - 8);
  const mobGap = s.mobile?.logoSpacing ?? Math.max(8, s.logoSpacing - 16);
  const anim = s.direction === "left" ? "scrollLeft" : "scrollRight";
  const [tFrom, tTo] = s.direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"];
  const imgStyle = `height:${s.logoHeight}px;width:auto;object-fit:contain;flex-shrink:0;margin:0 ${s.logoSpacing}px;${s.grayscale ? "filter:grayscale(1);opacity:0.6;" : ""}`;
  const items = logos
    .map(
      (l) =>
        `    <img src="${l.publicUrl || l.dataUrl}" alt="${l.name}" style="${imgStyle}">`,
    )
    .join("\n");
  const fadeHTML = s.fadeEdges
    ? `\n  <div class="mq-fade-left"></div>\n  <div class="mq-fade-right"></div>`
    : "";
  const fadeCSS = s.fadeEdges
    ? `\n.mq-fade-left,.mq-fade-right{position:absolute;top:0;width:150px;height:100%;z-index:99;pointer-events:none;}\n.mq-fade-left{left:0;background:linear-gradient(to right,${bg} 0%,transparent 100%);}\n.mq-fade-right{right:0;background:linear-gradient(to left,${bg} 0%,transparent 100%);}`
    : "";
  const pauseCSS = s.pauseOnHover
    ? "\n.mq-track:hover{animation-play-state:paused;}"
    : "";
  return `${PLATFORM_COMMENT[PLATFORMS[s.platform]]}
<style>
.mq-wrap{position:relative;width:100%;background:${bg};padding:${vPad}px 0;overflow:hidden;}${fadeCSS}
.mq-track{display:flex;align-items:center;width:max-content;animation:${anim} ${dur}s linear infinite;}${pauseCSS}
@keyframes ${anim}{0%{transform:translateX(${tFrom});}100%{transform:translateX(${tTo});}}
@media(max-width:768px){.mq-track{animation-duration:${tabDur}s;}.mq-track img{margin:0 ${tabGap}px;}}
@media(max-width:480px){.mq-track{animation-duration:${mobDur}s;}.mq-track img{margin:0 ${mobGap}px;}}
</style>
<div class="mq-wrap">${fadeHTML}
  <div class="mq-track">
${items}
${items}
  </div>
</div>`;
}

// ─── Text Code Generator ──────────────────────────────────────────────────────
function generateTextCode(s) {
  if (!s.text.trim()) return "<!-- Enter text to generate code -->";
  const dur = s.speed === "Custom" ? s.customSpeed : SPEED_MAP[s.speed];
  const bg = s.bgColor || "#ffffff";
  const anim = s.direction === "left" ? "txScrollLeft" : "txScrollRight";
  const [tFrom, tTo] = s.direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"];

  // Font setup
  let fontImport = "";
  let fontFaceCSS = "";
  const fontStack = `'${s.googleFont ? s.fontFamily : s.customFontName}', sans-serif`;
  if (s.googleFont && s.fontFamily) {
    const encoded = s.fontFamily.replace(/ /g, "+");
    const wt = s.fontWeight || "400";
    fontImport = `<link rel="preconnect" href="https://fonts.googleapis.com">\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=${encoded}:wght@${wt}&display=swap">\n`;
  } else if (!s.googleFont && s.customFontData && s.customFontName) {
    fontFaceCSS = `\n@font-face{font-family:'${s.customFontName}';src:url(data:font/${s.customFontExt};base64,${s.customFontData}) format('${s.customFontExt === "ttf" ? "truetype" : s.customFontExt}');font-weight:${s.fontWeight || "400"};font-style:normal;}`;
  }

  const fadeCSS = s.fadeEdges
    ? `\n.tx-fade-l,.tx-fade-r{position:absolute;top:0;width:150px;height:100%;z-index:99;pointer-events:none;}\n.tx-fade-l{left:0;background:linear-gradient(to right,${bg} 0%,transparent 100%);}\n.tx-fade-r{right:0;background:linear-gradient(to left,${bg} 0%,transparent 100%);}`
    : "";
  const fadeHTML = s.fadeEdges
    ? `\n  <div class="tx-fade-l"></div>\n  <div class="tx-fade-r"></div>`
    : "";
  const pauseCSS = s.pauseOnHover
    ? "\n.tx-track:hover{animation-play-state:paused;}"
    : "";

  const textStyle = `font-family:${fontStack};font-size:${s.fontSize}px;font-weight:${s.fontWeight || 400};color:${s.textColor};letter-spacing:${s.letterSpacing}px;white-space:nowrap;`;
  const displayText = s.text.trim().endsWith(s.separator)
    ? s.text.trim()
    : `${s.text.trim()} ${s.separator} `;
  const singleItem = `<span style="${textStyle}">${displayText}</span>`;
  const items = `    ${singleItem}\n    ${singleItem}`;

  return `${PLATFORM_COMMENT[PLATFORMS[s.platform]]}
${fontImport}<style>${fontFaceCSS}
.tx-wrap{position:relative;width:100%;background:${bg};padding:${s.verticalPadding ?? 20}px 0;overflow:hidden;}${fadeCSS}
.tx-track{display:flex;align-items:center;width:max-content;animation:${anim} ${dur}s linear infinite;}${pauseCSS}
@keyframes ${anim}{0%{transform:translateX(${tFrom});}100%{transform:translateX(${tTo});}}
</style>
<div class="tx-wrap">${fadeHTML}
  <div class="tx-track">
${items}
  </div>
</div>`;
}

// ─── Image Compressor ─────────────────────────────────────────────────────────
function compressImage(file) {
  return new Promise((resolve) => {
    if (file.type === "image/svg+xml") {
      const r = new FileReader();
      r.onload = (e) =>
        resolve({
          dataUrl: e.target.result,
          sizeKb: Math.round(file.size / 1024),
        });
      r.readAsDataURL(file);
      return;
    }
    const img = new Image(),
      url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = img.height > 120 ? 800 / img.height : 1;
      const w = Math.round(img.width * scale),
        h = Math.round(img.height * scale);
      const c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      c.getContext("2d").drawImage(img, 0, 0, w, h);
      const dataUrl = c.toDataURL("image/webp", 0.82);
      resolve({ dataUrl, sizeKb: Math.round((dataUrl.length * 0.75) / 1024) });
    };
    img.src = url;
  });
}

// ─── UI Primitives ────────────────────────────────────────────────────────────
function Toggle({ value, onChange, label }) {
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
      <span style={{ fontSize: 13, color: "#444" }}>{label}</span>
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

function Slider({ label, value, min, max, unit, onChange }) {
  return (
    <div style={{ padding: "8px 0", borderBottom: "1px solid #f0ede8" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 5,
        }}
      >
        <span style={{ fontSize: 13, color: "#444" }}>{label}</span>
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
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        style={{ width: "100%", accentColor: "#1a1a18" }}
      />
    </div>
  );
}

function Segment({ options, value, onChange, small }) {
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

function Label({ children, badge }) {
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

function ColorRow({ label, value, onChange, presets }) {
  const colors = presets || [
    "#ffffff",
    "#f8f9fa",
    "#f1ede4",
    "#1a1a18",
    "#0f172a",
    "#eff6ff",
    "#fdf4ff",
    "#fff7ed",
  ];
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
        <span style={{ fontSize: 13, color: "#444" }}>{label}</span>
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
            value={value}
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

// ─── Logo Card ────────────────────────────────────────────────────────────────
function LogoCard({ logo, onRemove, onRename, grayscale }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(logo.name);
  const commit = () => {
    onRename(logo.id, draft.trim() || logo.name);
    setEditing(false);
  };
  return (
    <div
      style={{
        borderRadius: 10,
        border: "1px solid #e8e6e0",
        background: "#fff",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
      }}
    >
      <img
        src={logo.dataUrl}
        alt={logo.name}
        style={{
          height: 36,
          maxWidth: 72,
          objectFit: "contain",
          filter: grayscale ? "grayscale(1)" : "none",
          opacity: grayscale ? 0.5 : 1,
          flexShrink: 0,
        }}
      />
      {logo.publicUrl && (
        <span
          title="Uploaded to Supabase"
          style={{
            color: "#16a34a",
            fontSize: 14,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          ✓
        </span>
      )}
      {editing ? (
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") setEditing(false);
          }}
          style={{
            flex: 1,
            fontSize: 12,
            padding: "3px 6px",
            borderRadius: 5,
            border: "1px solid #ccc",
            fontFamily: "inherit",
            minWidth: 0,
          }}
        />
      ) : (
        <span
          onClick={() => setEditing(true)}
          title="Click to rename"
          style={{
            fontSize: 12,
            color: "#555",
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            cursor: "text",
          }}
        >
          {logo.name}
        </span>
      )}
      {logo.sizeKb && (
        <span
          style={{
            fontSize: 10,
            fontFamily: "monospace",
            color: "#bbb",
            flexShrink: 0,
          }}
        >
          {logo.sizeKb}kb
        </span>
      )}
      <button
        onClick={() => onRemove(logo.id)}
        style={{
          background: "#f0ede8",
          border: "none",
          borderRadius: 5,
          width: 22,
          height: 22,
          cursor: "pointer",
          fontSize: 11,
          color: "#888",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
        }}
      >
        ✕
      </button>
    </div>
  );
}

// ─── Dropzone ─────────────────────────────────────────────────────────────────
function Dropzone({ onUpload, supabaseUrl, supabaseAnonKey }) {
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef();
  const handle = useCallback(
    async (files) => {
      setBusy(true);
      for (const f of Array.from(files).filter((f) =>
        /image\/(svg\+xml|png|jpeg|webp)/.test(f.type),
      )) {
        const { dataUrl, sizeKb } = await compressImage(f);
        let publicUrl = null;
        if (supabaseUrl && supabaseAnonKey) {
          publicUrl = await uploadToSupabase({
            file: f,
            supabaseUrl,
            supabaseAnonKey,
          });
        }
        const cleanName = f.name
          .replace(/\.[^.]+$/, "")
          .replace(/[-_]/g, " ")
          .replace(/\s+/g, " ")
          .trim();
        onUpload({
          id: `${Date.now()}-${Math.random()}`,
          name: cleanName,
          dataUrl,
          sizeKb,
          publicUrl,
        });
      }
      setBusy(false);
    },
    [onUpload, supabaseUrl, supabaseAnonKey],
  );
  return (
    <div
      onClick={() => !busy && inputRef.current.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handle(e.dataTransfer.files);
      }}
      style={{
        border: `2px dashed ${dragging ? "#1a1a18" : "#ccc"}`,
        borderRadius: 10,
        padding: "20px",
        textAlign: "center",
        cursor: busy ? "wait" : "pointer",
        background: dragging ? "#f5f4f0" : "#faf9f7",
        transition: "all 0.15s",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".svg,.png,.jpg,.jpeg,.webp"
        multiple
        style={{ display: "none" }}
        onChange={(e) => handle(e.target.files)}
      />
      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#1a1a18" }}>
        {busy ? "Compressing…" : "⬆ Drop logos here"}
      </p>
      <p style={{ margin: "3px 0 0", fontSize: 11, color: "#aaa" }}>
        SVG · PNG · JPG · WEBP — auto-compressed
      </p>
    </div>
  );
}

// ─── Logo Live Preview ────────────────────────────────────────────────────────
function LogoPreview({ logos, settings }) {
  const {
    direction,
    speed,
    customSpeed,
    logoHeight,
    logoSpacing,
    pauseOnHover,
    grayscale,
    fadeEdges,
    bgColor,
    verticalPadding,
  } = settings;
  const dur = speed === "Custom" ? customSpeed : SPEED_MAP[speed];
  const bg = bgColor || "#ffffff";
  const vPad = verticalPadding ?? 20;
  const [hovered, setHovered] = useState(false);
  const anim = direction === "left" ? "lp-left" : "lp-right";
  const [tFrom, tTo] = direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"];
  const kf = `@keyframes ${anim}{from{transform:translateX(${tFrom})}to{transform:translateX(${tTo})}}`;
  if (!logos.length)
    return (
      <div
        style={{
          height: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#bbb",
          fontSize: 13,
          background: bg,
          borderRadius: 10,
          border: "1px solid #ece9e2",
        }}
      >
        Upload logos to see preview
      </div>
    );
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 10,
        background: bg,
        border: "1px solid #ece9e2",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <style>{kf}</style>
      {fadeEdges && (
        <>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 150,
              height: "100%",
              zIndex: 99,
              pointerEvents: "none",
              background: `linear-gradient(to right,${bg} 0%,transparent 100%)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 150,
              height: "100%",
              zIndex: 99,
              pointerEvents: "none",
              background: `linear-gradient(to left,${bg} 0%,transparent 100%)`,
            }}
          />
        </>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "max-content",
          padding: `${vPad}px 0`,
          animation: `${anim} ${dur}s linear infinite`,
          animationPlayState: pauseOnHover && hovered ? "paused" : "running",
        }}
      >
        {[...logos, ...logos].map((l, i) => (
          <img
            key={`${l.id}-${i}`}
            src={l.dataUrl}
            alt={l.name}
            style={{
              height: logoHeight,
              width: "auto",
              objectFit: "contain",
              flexShrink: 0,
              margin: `0 ${logoSpacing}px`,
              filter: grayscale ? "grayscale(1)" : "none",
              opacity: grayscale ? 0.5 : 1,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Text Live Preview ────────────────────────────────────────────────────────
function TextPreview({ settings: s }) {
  const dur = s.speed === "Custom" ? s.customSpeed : SPEED_MAP[s.speed];
  const bg = s.bgColor || "#ffffff";
  const [hovered, setHovered] = useState(false);
  const anim = s.direction === "left" ? "tp-left" : "tp-right";
  const [tFrom, tTo] = s.direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"];
  const kf = `@keyframes ${anim}{from{transform:translateX(${tFrom})}to{transform:translateX(${tTo})}}`;
  const fontFamily = s.googleFont
    ? s.fontFamily
    : s.customFontName || "inherit";

  // Load Google Font in preview
  useEffect(() => {
    if (!s.googleFont || !s.fontFamily) return;
    const id = `gf-${s.fontFamily.replace(/ /g, "-")}`;
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${s.fontFamily.replace(/ /g, "+")}:wght@${s.fontWeight || 400}&display=swap`;
    document.head.appendChild(link);
  }, [s.googleFont, s.fontFamily, s.fontWeight]);

  if (!s.text.trim())
    return (
      <div
        style={{
          height: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#bbb",
          fontSize: 13,
          background: bg,
          borderRadius: 10,
          border: "1px solid #ece9e2",
        }}
      >
        Enter text to see preview
      </div>
    );
  const displayText = s.text.trim().endsWith(s.separator)
    ? s.text.trim()
    : `${s.text.trim()} ${s.separator} `;
  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 10,
        background: bg,
        border: "1px solid #ece9e2",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <style>{kf}</style>
      {s.fadeEdges && (
        <>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 150,
              height: "100%",
              zIndex: 99,
              pointerEvents: "none",
              background: `linear-gradient(to right,${bg} 0%,transparent 100%)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 150,
              height: "100%",
              zIndex: 99,
              pointerEvents: "none",
              background: `linear-gradient(to left,${bg} 0%,transparent 100%)`,
            }}
          />
        </>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "max-content",
          padding: `${s.verticalPadding ?? 20}px 0`,
          animation: `${anim} ${dur}s linear infinite`,
          animationPlayState: s.pauseOnHover && hovered ? "paused" : "running",
        }}
      >
        {[displayText, displayText].map((t, i) => (
          <span
            key={i}
            style={{
              fontFamily: `'${fontFamily}',sans-serif`,
              fontSize: s.fontSize,
              fontWeight: s.fontWeight || 400,
              color: s.textColor,
              letterSpacing: `${s.letterSpacing}px`,
              whiteSpace: "nowrap",
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Code Panel ───────────────────────────────────────────────────────────────
function CodePanel({ code, logos, settings, mode }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };
  const sizeKb = Math.round(code.length / 1024);

  const previewLines = code.split("\n").filter((l) => {
    const t = l.trim();
    return !t.startsWith("data:") && !t.includes("base64,") && t.length > 0;
  });

  const pills =
    mode === "logo"
      ? [
          {
            icon: "🖼",
            label: `${logos.length} logo${logos.length !== 1 ? "s" : ""}`,
          },
          {
            icon: "↔",
            label:
              settings.direction === "left" ? "Scrolls left" : "Scrolls right",
          },
          {
            icon: "⚡",
            label:
              settings.speed === "Custom"
                ? `${settings.customSpeed}s`
                : settings.speed,
          },
          settings.fadeEdges && { icon: "◑", label: "Fade edges" },
          settings.pauseOnHover && { icon: "⏸", label: "Pause on hover" },
          settings.grayscale && { icon: "◐", label: "Grayscale" },
        ].filter(Boolean)
      : [
          { icon: "T", label: `${settings.fontSize}px` },
          {
            icon: "↔",
            label:
              settings.direction === "left" ? "Scrolls left" : "Scrolls right",
          },
          {
            icon: "⚡",
            label:
              settings.speed === "Custom"
                ? `${settings.customSpeed}s`
                : settings.speed,
          },
          {
            icon: "✦",
            label: settings.googleFont
              ? `Google: ${settings.fontFamily}`
              : `Custom: ${settings.customFontName || "No font"}`,
          },
          settings.fadeEdges && { icon: "◑", label: "Fade edges" },
        ].filter(Boolean);

  return (
    <div>
      <button
        onClick={copy}
        style={{
          width: "100%",
          padding: "13px",
          borderRadius: 10,
          border: "none",
          cursor: "pointer",
          background: copied ? "#16a34a" : "#1a1a18",
          color: "#fff",
          fontSize: 14,
          fontWeight: 700,
          transition: "background 0.25s",
          marginBottom: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        {copied ? "✓ Copied! Now paste into Unbounce" : "Copy Code"}
        {!copied && (
          <span style={{ fontSize: 11, opacity: 0.5, fontWeight: 400 }}>
            {sizeKb}kb
          </span>
        )}
      </button>
      <div
        style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}
      >
        {pills.map(({ icon, label }) => (
          <span
            key={label}
            style={{
              fontSize: 11,
              padding: "4px 9px",
              borderRadius: 20,
              background: "#f0ede8",
              color: "#555",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span style={{ fontSize: 10 }}>{icon}</span>
            {label}
          </span>
        ))}
      </div>
      <div
        style={{
          background: "#faf9f7",
          border: "1px solid #e8e5de",
          borderRadius: 10,
          padding: "12px 14px",
        }}
      >
        <p
          style={{
            margin: "0 0 8px",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#bbb",
          }}
        >
          Code preview
        </p>
        <pre
          style={{
            margin: 0,
            fontSize: 11,
            lineHeight: 1.7,
            color: "#555",
            fontFamily: "'Fira Code','Courier New',monospace",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          <code>{previewLines.join("\n")}</code>
        </pre>
      </div>
      <p
        style={{
          margin: "10px 0 0",
          fontSize: 11,
          color: "#bbb",
          textAlign: "center",
        }}
      >
        {mode === "logo"
          ? "Images are embedded — paste into Unbounce Custom HTML and it works immediately."
          : "Paste into Unbounce Custom HTML. Font loads from Google Fonts CDN automatically."}
      </p>
    </div>
  );
}

// ─── Font Picker ──────────────────────────────────────────────────────────────
function FontPicker({ settings, set }) {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const fontInputRef = useRef();

  const filtered = query.trim()
    ? POPULAR_FONTS.filter((f) => f.toLowerCase().includes(query.toLowerCase()))
    : POPULAR_FONTS;

  const handleCustomFont = useCallback(
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
        set("customFontData", base64);
        set("customFontName", name);
        set("customFontExt", ext);
        set("googleFont", false);
      };
      reader.readAsDataURL(file);
    },
    [set],
  );

  return (
    <div>
      <Label>Font</Label>
      {/* Source toggle */}
      <div style={{ marginBottom: 12 }}>
        <Segment
          options={["Google Fonts", "Upload Font"]}
          value={settings.googleFont ? "Google Fonts" : "Upload Font"}
          onChange={(v) => set("googleFont", v === "Google Fonts")}
        />
      </div>

      {settings.googleFont ? (
        <div style={{ position: "relative" }}>
          <div style={{ position: "relative", marginBottom: 8 }}>
            <input
              value={query || settings.fontFamily}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Search Google Fonts…"
              style={{
                width: "100%",
                padding: "7px 10px",
                borderRadius: 7,
                border: "1px solid #ddd",
                fontSize: 13,
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />
            {showDropdown && (
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
                  zIndex: 100,
                  maxHeight: 200,
                  overflowY: "auto",
                }}
              >
                {filtered.length === 0 && (
                  <div
                    style={{
                      padding: "10px 12px",
                      fontSize: 12,
                      color: "#aaa",
                    }}
                  >
                    No fonts found
                  </div>
                )}
                {filtered.map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      set("fontFamily", f);
                      setQuery("");
                      setShowDropdown(false);
                    }}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "8px 12px",
                      border: "none",
                      background:
                        settings.fontFamily === f ? "#f0ede8" : "#fff",
                      cursor: "pointer",
                      fontSize: 13,
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
                    padding: "8px 12px",
                    fontSize: 11,
                    color: "#aaa",
                    borderTop: "1px solid #f0ede8",
                  }}
                >
                  Type any Google Font name not listed above
                </div>
              </div>
            )}
          </div>
          {showDropdown && (
            <div
              style={{ position: "fixed", inset: 0, zIndex: 99 }}
              onClick={() => setShowDropdown(false)}
            />
          )}
          <p style={{ margin: "0 0 8px", fontSize: 11, color: "#888" }}>
            Selected:{" "}
            <strong
              style={{ fontFamily: `'${settings.fontFamily}',sans-serif` }}
            >
              {settings.fontFamily}
            </strong>
          </p>
        </div>
      ) : (
        <div>
          <div
            onClick={() => fontInputRef.current.click()}
            style={{
              border: "2px dashed #ccc",
              borderRadius: 8,
              padding: "14px",
              textAlign: "center",
              cursor: "pointer",
              background: "#faf9f7",
              marginBottom: 8,
            }}
          >
            <input
              ref={fontInputRef}
              type="file"
              accept=".ttf,.otf,.woff,.woff2"
              style={{ display: "none" }}
              onChange={(e) => handleCustomFont(e.target.files[0])}
            />
            <p
              style={{
                margin: 0,
                fontSize: 13,
                fontWeight: 600,
                color: "#1a1a18",
              }}
            >
              ⬆ Upload font file
            </p>
            <p style={{ margin: "3px 0 0", fontSize: 11, color: "#aaa" }}>
              TTF · OTF · WOFF · WOFF2
            </p>
          </div>
          {settings.customFontName && (
            <p
              style={{
                margin: 0,
                fontSize: 12,
                color: "#16a34a",
                fontWeight: 500,
              }}
            >
              ✓ {settings.customFontName} loaded
            </p>
          )}
        </div>
      )}

      {/* Font weight */}
      <div
        style={{
          padding: "8px 0",
          borderBottom: "1px solid #f0ede8",
          marginTop: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 5,
          }}
        >
          <span style={{ fontSize: 13, color: "#444" }}>Font weight</span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#1a1a18",
              fontFamily: "monospace",
            }}
          >
            {settings.fontWeight || 400}
          </span>
        </div>
        <Segment
          options={["300", "400", "500", "600", "700"]}
          value={String(settings.fontWeight || "400")}
          onChange={(v) => set("fontWeight", v)}
          small
        />
      </div>
    </div>
  );
}

// ─── Logo Sidebar Panel ───────────────────────────────────────────────────────
function LogoPanel({
  logos,
  settings,
  set,
  addLogo,
  removeLogo,
  renameLogo,
  code,
  tab,
  supabaseUrl,
  supabaseAnonKey,
  //setSupabaseUrl,
  //setSupabaseAnonKey,
}) {
  const bp = settings.breakpoint;
  const bpVal = (k) =>
    bp === "desktop" ? settings[k] : (settings[bp]?.[k] ?? settings[k]);
  const setBp = (k, v) =>
    bp === "desktop" ? set(k, v) : set(bp, { ...(settings[bp] || {}), [k]: v });

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
      {tab === "configure" && (
        <>
          <div style={{ marginBottom: 16 }}>
            <Label>Supabase Storage</Label>
            {/*<input
              placeholder="Supabase URL"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 8,
                border: "1px solid #ddd",
                fontSize: 12,
                marginBottom: 8,
                boxSizing: "border-box",
              }}
            />*/}
            {/* <input
              placeholder="Anon Public API Key"
              value={supabaseAnonKey}
              onChange={(e) => setSupabaseAnonKey(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: 8,
                border: "1px solid #ddd",
                fontSize: 12,
                boxSizing: "border-box",
              }}
            />*/}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <Label badge={logos.length ? `${logos.length} uploaded` : null}>
                Logos
              </Label>
              <Dropzone
                onUpload={addLogo}
                supabaseUrl={supabaseUrl}
                supabaseAnonKey={supabaseAnonKey}
              />
              {logos.length > 0 && (
                <div
                  style={{
                    marginTop: 10,
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  {logos.map((l) => (
                    <LogoCard
                      key={l.id}
                      logo={l}
                      onRemove={removeLogo}
                      onRename={renameLogo}
                      grayscale={settings.grayscale}
                    />
                  ))}
                </div>
              )}
            </div>
            <div>
              <Label>Direction</Label>
              <Segment
                options={["left", "right"]}
                value={settings.direction}
                onChange={(v) => set("direction", v)}
              />
            </div>
            <div>
              <Label>Speed</Label>
              <Segment
                options={["Slow", "Medium", "Fast", "Custom"]}
                value={settings.speed}
                onChange={(v) => set("speed", v)}
              />
              {settings.speed === "Custom" && (
                <div style={{ marginTop: 8 }}>
                  <Slider
                    label="Duration"
                    value={settings.customSpeed}
                    min={5}
                    max={120}
                    unit="s"
                    onChange={(v) => set("customSpeed", v)}
                  />
                </div>
              )}
            </div>
            <div>
              <Label>Responsive</Label>
              <Segment
                options={["desktop", "tablet", "mobile"]}
                value={bp}
                onChange={(v) => set("breakpoint", v)}
              />
              <div style={{ marginTop: 10 }}>
                <Slider
                  label="Logo Height"
                  value={bpVal("logoHeight")}
                  min={20}
                  max={800}
                  unit="px"
                  onChange={(v) => setBp("logoHeight", v)}
                />
                <Slider
                  label="Logo Spacing"
                  value={bpVal("logoSpacing")}
                  min={8}
                  max={120}
                  unit="px"
                  onChange={(v) => setBp("logoSpacing", v)}
                />
                {bp !== "desktop" && (
                  <div style={{ marginTop: 8 }}>
                    <Label>{bp} speed</Label>
                    <Segment
                      options={["Slow", "Medium", "Fast"]}
                      value={bpVal("speed")}
                      onChange={(v) => setBp("speed", v)}
                      small
                    />
                  </div>
                )}
              </div>
            </div>
            <div>
              <Label>Background & Padding</Label>
              <ColorRow
                label="Background color"
                value={settings.bgColor || "#ffffff"}
                onChange={(v) => set("bgColor", v)}
              />
              <Slider
                label="Vertical padding"
                value={settings.verticalPadding ?? 20}
                min={0}
                max={80}
                unit="px"
                onChange={(v) => set("verticalPadding", v)}
              />
            </div>
            <div>
              <Label>Effects</Label>
              <Toggle
                label="Pause on hover"
                value={settings.pauseOnHover}
                onChange={(v) => set("pauseOnHover", v)}
              />
              <Toggle
                label="Grayscale logos"
                value={settings.grayscale}
                onChange={(v) => set("grayscale", v)}
              />
              <Toggle
                label="Fade edges"
                value={settings.fadeEdges}
                onChange={(v) => set("fadeEdges", v)}
              />
            </div>
            <div>
              <Label>Platform</Label>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    onClick={() => set("platform", p)}
                    style={{
                      textAlign: "left",
                      padding: "7px 12px",
                      borderRadius: 8,
                      border: `1px solid ${settings.platform === p ? "#1a1a18" : "#e8e5de"}`,
                      background: settings.platform === p ? "#1a1a18" : "#fff",
                      color: settings.platform === p ? "#fff" : "#444",
                      fontSize: 13,
                      cursor: "pointer",
                      fontWeight: settings.platform === p ? 600 : 400,
                      transition: "all 0.15s",
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
      {tab === "code" && (
        <div>
          <Label badge={settings.platform}>Generated Code</Label>
          <CodePanel
            code={code}
            logos={logos}
            settings={settings}
            mode="logo"
          />
        </div>
      )}
    </div>
  );
}

// ─── Text Sidebar Panel ───────────────────────────────────────────────────────
function TextPanel({ settings, set, code, tab }) {
  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
      {tab === "configure" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <Label>Text Content</Label>
            <textarea
              value={settings.text}
              onChange={(e) => set("text", e.target.value)}
              placeholder="Enter scrolling text…"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: 8,
                border: "1px solid #ddd",
                fontSize: 13,
                fontFamily: "inherit",
                resize: "vertical",
                minHeight: 80,
                boxSizing: "border-box",
                lineHeight: 1.5,
              }}
            />
            <p style={{ margin: "4px 0 0", fontSize: 11, color: "#aaa" }}>
              Text repeats automatically to fill the loop.
            </p>
          </div>

          <FontPicker settings={settings} set={set} />

          <div>
            <Label>Typography</Label>
            <Slider
              label="Font size"
              value={settings.fontSize}
              min={10}
              max={80}
              unit="px"
              onChange={(v) => set("fontSize", v)}
            />
            <Slider
              label="Letter spacing"
              value={settings.letterSpacing}
              min={-2}
              max={20}
              unit="px"
              onChange={(v) => set("letterSpacing", v)}
            />
            <ColorRow
              label="Text color"
              value={settings.textColor}
              onChange={(v) => set("textColor", v)}
              presets={[
                "#1a1a18",
                "#ffffff",
                "#555555",
                "#888888",
                "#0f172a",
                "#1d4ed8",
                "#dc2626",
                "#16a34a",
              ]}
            />
          </div>

          <div>
            <Label>Direction</Label>
            <Segment
              options={["left", "right"]}
              value={settings.direction}
              onChange={(v) => set("direction", v)}
            />
          </div>
          <div>
            <Label>Speed</Label>
            <Segment
              options={["Slow", "Medium", "Fast", "Custom"]}
              value={settings.speed}
              onChange={(v) => set("speed", v)}
            />
            {settings.speed === "Custom" && (
              <div style={{ marginTop: 8 }}>
                <Slider
                  label="Duration"
                  value={settings.customSpeed}
                  min={5}
                  max={120}
                  unit="s"
                  onChange={(v) => set("customSpeed", v)}
                />
              </div>
            )}
          </div>

          <div>
            <Label>Background & Padding</Label>
            <ColorRow
              label="Background color"
              value={settings.bgColor || "#ffffff"}
              onChange={(v) => set("bgColor", v)}
            />
            <Slider
              label="Vertical padding"
              value={settings.verticalPadding ?? 20}
              min={0}
              max={80}
              unit="px"
              onChange={(v) => set("verticalPadding", v)}
            />
          </div>

          <div>
            <Label>Effects</Label>
            <Toggle
              label="Pause on hover"
              value={settings.pauseOnHover}
              onChange={(v) => set("pauseOnHover", v)}
            />
            <Toggle
              label="Fade edges"
              value={settings.fadeEdges}
              onChange={(v) => set("fadeEdges", v)}
            />
          </div>

          <div>
            <Label>Platform</Label>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {PRESETS.map((p) => (
                <button
                  key={p}
                  onClick={() => set("platform", p)}
                  style={{
                    textAlign: "left",
                    padding: "7px 12px",
                    borderRadius: 8,
                    border: `1px solid ${settings.platform === p ? "#1a1a18" : "#e8e5de"}`,
                    background: settings.platform === p ? "#1a1a18" : "#fff",
                    color: settings.platform === p ? "#fff" : "#444",
                    fontSize: 13,
                    cursor: "pointer",
                    fontWeight: settings.platform === p ? 600 : 400,
                    transition: "all 0.15s",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {tab === "code" && (
        <div>
          <Label badge={settings.platform}>Generated Code</Label>
          <CodePanel code={code} logos={[]} settings={settings} mode="text" />
        </div>
      )}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [mode, setMode] = useState("logo"); // "logo" | "text"
  const [sideTab, setSideTab] = useState("configure"); // "configure" | "code"

  // Logo state
  const [logos, setLogos] = useState([]);
  const [logoSettings, setLogoSettings] = useState(DEFAULT_LOGO_SETTINGS);
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  /*const [supabaseUrl, setSupabaseUrl] = useState(
    () => localStorage.getItem("sb_url") || "",
  );*/

  useEffect(() => {
    localStorage.setItem("sb_url", supabaseUrl);
  }, [supabaseUrl]);

  useEffect(() => {
    localStorage.setItem("sb_key", supabaseAnonKey);
  }, [supabaseAnonKey]);
  // Text state
  const [textSettings, setTextSettings] = useState(DEFAULT_TEXT_SETTINGS);

  const setL = useCallback(
    (k, v) => setLogoSettings((s) => ({ ...s, [k]: v })),
    [],
  );
  const setT = useCallback(
    (k, v) => setTextSettings((s) => ({ ...s, [k]: v })),
    [],
  );
  const addLogo = useCallback((l) => setLogos((p) => [...p, l]), []);
  const removeLogo = useCallback(
    (id) => setLogos((p) => p.filter((l) => l.id !== id)),
    [],
  );
  const renameLogo = useCallback(
    (id, name) =>
      setLogos((p) => p.map((l) => (l.id === id ? { ...l, name } : l))),
    [],
  );

  const logoCode = useMemo(
    () => generateLogoCode(logos, logoSettings),
    [logos, logoSettings],
  );
  const textCode = useMemo(
    () => generateTextCode(textSettings),
    [textSettings],
  );

  const activeCode = mode === "logo" ? logoCode : textCode;
  const activeSettings = mode === "logo" ? logoSettings : textSettings;

  const bpVal = (k) => {
    const bp = logoSettings.breakpoint;
    return bp === "desktop"
      ? logoSettings[k]
      : (logoSettings[bp]?.[k] ?? logoSettings[k]);
  };

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

      {/* Top bar */}
      <div
        style={{
          height: 52,
          borderBottom: "1px solid #e8e5de",
          background: "#fff",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          gap: 10,
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
          style={{ fontWeight: 700, fontSize: 14, letterSpacing: "-0.02em" }}
        >
          Scroll Builder
        </span>
        <span
          style={{
            fontSize: 11,
            background: "#f0ede8",
            color: "#888",
            borderRadius: 4,
            padding: "2px 8px",
            fontWeight: 600,
          }}
        >
          for Unbounce
        </span>
        <div style={{ flex: 1 }} />
        {/* Mode switcher */}
        <div
          style={{
            display: "flex",
            background: "#f0ede8",
            borderRadius: 8,
            padding: 3,
            gap: 2,
          }}
        >
          {[
            { key: "logo", label: "🖼 Logo Marquee" },
            { key: "text", label: "T Text Marquee" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => {
                setMode(key);
                setSideTab("configure");
              }}
              style={{
                padding: "5px 14px",
                fontSize: 12,
                fontWeight: 600,
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
                background: mode === key ? "#1a1a18" : "transparent",
                color: mode === key ? "#fff" : "#555",
                transition: "all 0.15s",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "340px 1fr",
          height: "calc(100vh - 52px)",
          overflow: "hidden",
        }}
      >
        {/* ── Sidebar ── */}
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
          {/* Tab bar */}
          <div
            style={{
              display: "flex",
              padding: "0 16px",
              borderBottom: "1px solid #e8e5de",
              flexShrink: 0,
            }}
          >
            {["configure", "code"].map((t) => (
              <button
                key={t}
                onClick={() => setSideTab(t)}
                style={{
                  padding: "11px 12px",
                  fontSize: 12,
                  fontWeight: 600,
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  color: sideTab === t ? "#1a1a18" : "#aaa",
                  borderBottom:
                    sideTab === t
                      ? "2px solid #1a1a18"
                      : "2px solid transparent",
                  transition: "color 0.15s",
                  textTransform: "capitalize",
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {mode === "logo" ? (
            <LogoPanel
              logos={logos}
              settings={logoSettings}
              set={setL}
              addLogo={addLogo}
              removeLogo={removeLogo}
              renameLogo={renameLogo}
              code={logoCode}
              tab={sideTab}
              supabaseUrl={supabaseUrl}
              supabaseAnonKey={supabaseAnonKey}
              // setSupabaseUrl={setSupabaseUrl}
              // setSupabaseAnonKey={setSupabaseAnonKey}
            />
          ) : (
            <TextPanel
              settings={textSettings}
              set={setT}
              code={textCode}
              tab={sideTab}
            />
          )}
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
                  color: "#999",
                }}
              >
                Live Preview
              </span>
              {mode === "logo" && (
                <div style={{ display: "flex", gap: 5 }}>
                  {["desktop", "tablet", "mobile"].map((v) => (
                    <button
                      key={v}
                      onClick={() => setL("breakpoint", v)}
                      style={{
                        padding: "3px 10px",
                        borderRadius: 5,
                        border: `1px solid ${logoSettings.breakpoint === v ? "#1a1a18" : "#e0ddd8"}`,
                        background:
                          logoSettings.breakpoint === v ? "#1a1a18" : "#fff",
                        color: logoSettings.breakpoint === v ? "#fff" : "#888",
                        fontSize: 11,
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    >
                      {v === "desktop" ? "⬜" : v === "tablet" ? "▬" : "▪"} {v}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div style={{ padding: 16 }}>
              {mode === "logo" ? (
                <LogoPreview
                  logos={logos}
                  settings={{
                    ...logoSettings,
                    logoHeight: bpVal("logoHeight"),
                    logoSpacing: bpVal("logoSpacing"),
                    speed: bpVal("speed"),
                  }}
                />
              ) : (
                <TextPreview settings={textSettings} />
              )}
            </div>
          </div>

          {/* Code card */}
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
                  color: "#999",
                }}
              >
                Generated Code
              </span>
              <span
                style={{
                  fontSize: 11,
                  background: "#f8f6f2",
                  border: "1px solid #ede9e0",
                  color: "#666",
                  borderRadius: 5,
                  padding: "3px 9px",
                  fontFamily: "monospace",
                }}
              >
                {activeSettings.platform}
              </span>
            </div>
            <div style={{ padding: 20 }}>
              <CodePanel
                code={activeCode}
                logos={logos}
                settings={activeSettings}
                mode={mode}
              />
            </div>
          </div>

          {/* Empty state */}
          {mode === "logo" && !logos.length && (
            <div
              style={{
                background: "#fff",
                borderRadius: 14,
                border: "1px dashed #d8d4cc",
                padding: 40,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 10 }}>🖼</div>
              <h2
                style={{
                  margin: "0 0 8px",
                  fontWeight: 700,
                  fontSize: 18,
                  letterSpacing: "-0.02em",
                }}
              >
                Upload logos to get started
              </h2>
              <p style={{ margin: "0 0 24px", color: "#888", fontSize: 13 }}>
                Upload logo files, configure the marquee, then click Copy Code.
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 24,
                  flexWrap: "wrap",
                }}
              >
                {[
                  "Upload logos",
                  "Configure settings",
                  "Copy Code",
                  "Paste into Unbounce",
                ].map((s, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        background: "#f0ede8",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 13,
                      }}
                    >
                      {i + 1}
                    </div>
                    <span
                      style={{ fontSize: 12, color: "#666", fontWeight: 500 }}
                    >
                      {s}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          {mode === "logo" && logos.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: 12,
              }}
            >
              {[
                { label: "Logos", value: logos.length },
                {
                  label: "Direction",
                  value:
                    logoSettings.direction === "left" ? "→ Left" : "← Right",
                },
                {
                  label: "Code size",
                  value: `${Math.round(logoCode.length / 1024)}kb`,
                },
                { label: "Platform", value: logoSettings.platform },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  style={{
                    background: "#fff",
                    border: "1px solid #e8e5de",
                    borderRadius: 10,
                    padding: "12px 16px",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 3px",
                      fontSize: 11,
                      color: "#bbb",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {label}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 16,
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>
          )}
          {mode === "text" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: 12,
              }}
            >
              {[
                {
                  label: "Font",
                  value: textSettings.googleFont
                    ? textSettings.fontFamily
                    : textSettings.customFontName || "None",
                },
                { label: "Size", value: `${textSettings.fontSize}px` },
                {
                  label: "Direction",
                  value:
                    textSettings.direction === "left" ? "→ Left" : "← Right",
                },
                { label: "Platform", value: textSettings.platform },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  style={{
                    background: "#fff",
                    border: "1px solid #e8e5de",
                    borderRadius: 10,
                    padding: "12px 16px",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 3px",
                      fontSize: 11,
                      color: "#bbb",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {label}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 14,
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
