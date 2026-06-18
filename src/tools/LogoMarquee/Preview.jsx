// tools/LogoMarquee/Preview.jsx
import { useState } from "react";
import { SPEED_MAP } from "../../shared/constants";

export default function LogoPreview({ logos, settings: s }) {
  const dur = s.speed === "Custom" ? s.customSpeed : SPEED_MAP[s.speed];
  const bg = s.bgColor || "#ffffff";
  const vPad = s.verticalPadding ?? 20;
  const [hovered, setHovered] = useState(false);
  const anim = s.direction === "left" ? "lp-left" : "lp-right";
  const [tFrom, tTo] = s.direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"];
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
          fontFamily: "'DM Sans',sans-serif",
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
          padding: `${vPad}px 0`,
          gap: s.logoSpacing,
          animation: `${anim} ${dur}s linear infinite`,
          animationPlayState: s.pauseOnHover && hovered ? "paused" : "running",
        }}
      >
        {[...logos, ...logos].map((l, i) => (
          <img
            key={`${l.id}-${i}`}
            src={l.dataUrl}
            alt={l.name}
            style={{
              height: s.logoHeight,
              width: "auto",
              objectFit: "contain",
              flexShrink: 0,
              filter: s.grayscale ? "grayscale(1)" : "none",
              opacity: s.grayscale ? 0.5 : 1,
            }}
          />
        ))}
      </div>
    </div>
  );
}
