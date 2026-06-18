// tools/LogoMarquee/generator.js
// Extracted from marquee.md — uses publicUrl || dataUrl (Supabase first, base64 fallback)

const SPEED_MAP = { Slow: 60, Medium: 35, Fast: 18 };

const PLATFORMS = {
  Unbounce: "unbounce",
  Webflow: "webflow",
  Elementor: "elementor",
  Shopify: "shopify",
  Framer: "framer",
  "Generic HTML": "generic",
};

const PLATFORM_COMMENT = {
  unbounce: "<!-- Unbounce: paste into Custom HTML widget -->",
  webflow: "<!-- Webflow: paste into Embed element -->",
  elementor: "<!-- Elementor: paste into HTML widget -->",
  shopify: "<!-- Shopify: paste into section HTML -->",
  framer: "<!-- Framer: paste into Code component -->",
  generic: "<!-- Paste into any HTML page -->",
};

export function generateLogoCode(logos, s) {
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

  // Uses publicUrl (Supabase) when available, falls back to base64 dataUrl
  const imgStyle = `height:${s.logoHeight}px;width:auto;object-fit:contain;flex-shrink:0;${s.grayscale ? "filter:grayscale(1);opacity:0.6;" : ""}`;
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
.mq-track{display:flex;align-items:center;width:max-content;animation:${anim} ${dur}s linear infinite;gap:${s.logoSpacing}px;}${pauseCSS}
@keyframes ${anim}{0%{transform:translateX(${tFrom});}100%{transform:translateX(${tTo});}}
@media(max-width:768px){.mq-track{animation-duration:${tabDur}s;gap:${tabGap}px;}}
@media(max-width:480px){.mq-track{animation-duration:${mobDur}s;gap:${mobGap}px;}}
</style>
<div class="mq-wrap">${fadeHTML}
  <div class="mq-track">
${items}
${items}
  </div>
</div>`;
}
