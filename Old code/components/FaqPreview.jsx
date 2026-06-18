import AnimatedFaqItem from "./../src/FaqTestimonialBuilder";
import { useState } from "react";

export default function FaqPreview({ faqs, count, cfg }) {
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
