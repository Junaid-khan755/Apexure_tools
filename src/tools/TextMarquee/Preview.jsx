// tools/TextMarquee/Preview.jsx
import { useState, useEffect } from "react";
import { SPEED_MAP } from "../../shared/constants";

export default function TextPreview({ settings: s }) {
  const dur = s.speed === "Custom" ? s.customSpeed : SPEED_MAP[s.speed];
  const bg = s.bgColor || "#ffffff";
  const [hovered, setHovered] = useState(false);
  const anim = s.direction === "left" ? "tp-left" : "tp-right";
  const [tFrom, tTo] = s.direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"];
  const kf = `@keyframes ${anim}{from{transform:translateX(${tFrom})}to{transform:translateX(${tTo})}}`;
  const fontFamily = s.googleFont
    ? s.fontFamily
    : s.customFontName || "inherit";

  // Load Google Font for live preview
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
          fontFamily: "'DM Sans',sans-serif",
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
