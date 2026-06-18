// tools/FAQ/Preview.jsx
import { useState } from "react";

function AnimatedFaqItem({ faq, index, isOpen, onToggle, cfg }) {
  // const bodyRef = useRef(null);
  // const [height, setHeight] = useState(0);

  // useEffect(() => {
  //   if (!bodyRef.current) return;
  //   setHeight(isOpen ? bodyRef.current.scrollHeight : 0);
  // }, [isOpen]);
  // useEffect(() => {
  //   if (!bodyRef.current) return;
  //   const h = bodyRef.current.scrollHeight;
  //   requestAnimationFrame(() => {
  //     setHeight(isOpen ? h : 0);
  //   });
  // }, [isOpen]);

  return (
    <div
      style={{
        background: isOpen ? cfg.activeBg : cfg.bgColor,
        border: `${cfg.borderWidth}px solid ${cfg.borderColor}`,
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
          maxHeight: isOpen ? "600px" : "0px",
          overflow: "hidden",
          transition: "max-height .4s ease",
          borderTop: isOpen ? `1px solid ${cfg.dividerColor}` : "none",
        }}
      >
        <div>
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

export default function FaqPreview({ faqs, count, cfg }) {
  const [open, setOpen] = useState(null);
  return (
    <div
      style={{
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
