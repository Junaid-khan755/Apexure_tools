// tools/Testimonials/Preview.jsx
import { useState, useEffect, useRef } from "react";

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
  if (t.avatarUrl)
    return (
      <img
        src={t.avatarUrl}
        alt={t.name}
        style={{
          width: size,
          height: size,
          borderRadius: `${radius}%`,
          objectFit: "cover",
          flexShrink: 0,
        }}
      />
    );
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: `${radius}%`,
        background: t.avatarBg || "#1a1a18",
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

export function TestiCard({ t, cfg, style = {} }) {
  return (
    <div
      style={{
        background: cfg.cardBg,
        border: `${cfg.cardBorderWidth}px solid ${cfg.cardBorderColor}`,
        borderRadius: cfg.cardRadius,
        padding: cfg.cardPadding,
        boxShadow: cfg.showShadow
          ? `${cfg.shadowX}px ${cfg.shadowY}px ${cfg.shadowBlur}px ${cfg.shadowSpread}px ${cfg.shadowColor}`
          : "none",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        boxSizing: "border-box",
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

function NavBtn({ dir, cfg, onClick, disabled }) {
  const icons = {
    arrow: { prev: "←", next: "→" },
    chevron: { prev: "‹", next: "›" },
    triangle: { prev: "◄", next: "►" },
  };
  const icon =
    cfg.navBtnIcon === "custom"
      ? dir === "prev"
        ? cfg.navBtnCustomPrev
        : cfg.navBtnCustomNext
      : icons[cfg.navBtnIcon]?.[dir] || (dir === "prev" ? "←" : "→");
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: cfg.navBtnSize,
        height: cfg.navBtnSize,
        borderRadius: `${cfg.navBtnRadius}%`,
        background: cfg.navBtnBg,
        border: `1px solid ${cfg.cardBorderColor}`,
        color: cfg.navBtnColor,
        fontSize: Math.round(cfg.navBtnSize * 0.45),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        fontWeight: 600,
        lineHeight: 1,
        opacity: disabled ? 0.3 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {icon}
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

function CarouselLayout({ items, cfg }) {
  const [idx, setIdx] = useState(0);
  const total = items.length;
  const prev = () => setIdx((i) => Math.max(0, i - 1));
  const next = () => setIdx((i) => Math.min(total - 1, i + 1));
  const dragStart = useRef(null);

  // Touch — mobile/tablet
  const onTouchStart = (e) => {
    dragStart.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (dragStart.current === null) return;
    const diff = dragStart.current - e.changedTouches[0].clientX;
    if (diff > 50) next();
    else if (diff < -50) prev();
    dragStart.current = null;
  };

  // Pointer — mouse drag desktop
  const onPointerDown = (e) => {
    dragStart.current = e.clientX;
  };
  const onPointerUp = (e) => {
    if (dragStart.current === null) return;
    const diff = dragStart.current - e.clientX;
    if (diff > 50) next();
    else if (diff < -50) prev();
    dragStart.current = null;
  };

  useEffect(() => {
    if (!cfg.autoPlay) return;
    const t = setInterval(next, cfg.autoPlaySpeed || 3000);
    return () => clearInterval(t);
  }, [cfg.autoPlay, cfg.autoPlaySpeed]);

  return (
    <div style={{ maxWidth: cfg.maxWidth, margin: "0 auto" }}>
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        {cfg.navStyle === "sides" && (
          <NavBtn dir="prev" cfg={cfg} onClick={prev} disabled={idx === 0} />
        )}
        <div
          style={{ flex: 1, overflow: "hidden", cursor: "grab" }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          <div
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
                  padding: "6px 1px",
                  boxSizing: "border-box",
                }}
              >
                <TestiCard t={t} cfg={cfg} />
              </div>
            ))}
          </div>
        </div>
        {cfg.navStyle === "sides" && (
          <NavBtn
            dir="next"
            cfg={cfg}
            onClick={next}
            disabled={idx === total - 1}
          />
        )}
      </div>
      {cfg.navStyle === "bottom" && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 10,
            marginTop: 14,
          }}
        >
          <NavBtn dir="prev" cfg={cfg} onClick={prev} disabled={idx === 0} />
          <NavBtn
            dir="next"
            cfg={cfg}
            onClick={next}
            disabled={idx === total - 1}
          />
        </div>
      )}
      <Dots total={total} active={idx} cfg={cfg} onSelect={setIdx} />
    </div>
  );
}

function CardGridLayout({ items, cfg }) {
  return (
    <div
      style={{
        maxWidth: cfg.maxWidth,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: `repeat(${cfg.columns || 3},1fr)`,
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

export default function TestiPreview({ items, count, cfg }) {
  const vis = items.slice(0, count);
  if (cfg.layout === "carousel")
    return <CarouselLayout items={vis} cfg={cfg} />;
  return <CardGridLayout items={vis} cfg={cfg} />;
}
