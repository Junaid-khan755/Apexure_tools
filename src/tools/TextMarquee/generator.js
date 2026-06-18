// tools/TextMarquee/generator.js
// Extracted from marquee.md — Google Fonts + custom font upload support

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

export function generateTextCode(s) {
  if (!s.text.trim()) return "<!-- Enter text to generate code -->";

  const dur = s.speed === "Custom" ? s.customSpeed : SPEED_MAP[s.speed];
  const tabDur =
    s.tablet?.speed === "Custom"
      ? s.tablet.customSpeed
      : (SPEED_MAP[s.tablet?.speed] ?? dur);
  const tabSize = s.tablet?.fontSize ?? s.fontSize;
  const tabPad = s.tablet?.verticalPadding ?? s.verticalPadding;
  const tabLS = s.tablet?.letterSpacing ?? s.letterSpacing;

  const mobDur =
    s.mobile?.speed === "Custom"
      ? s.mobile.customSpeed
      : (SPEED_MAP[s.mobile?.speed] ?? dur);
  const mobSize = s.mobile?.fontSize ?? s.fontSize;
  const mobPad = s.mobile?.verticalPadding ?? s.verticalPadding;
  const mobLS = s.mobile?.letterSpacing ?? s.letterSpacing;
  const bg = s.bgColor || "#ffffff";
  const anim = s.direction === "left" ? "txScrollLeft" : "txScrollRight";
  const [tFrom, tTo] = s.direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"];

  // Font setup — Google Fonts link tag or base64 @font-face
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

  const textStyle = `font-family:${fontStack};font-weight:${s.fontWeight || 400};color:${s.textColor};white-space:nowrap;`;
  const displayText = s.text.trim().endsWith(s.separator)
    ? s.text.trim()
    : `${s.text.trim()} ${s.separator} `;
  const singleItem = `<span style="${textStyle}">${displayText}</span>`;
  const items = `    ${singleItem}\n    ${singleItem}`;

  return `${PLATFORM_COMMENT[PLATFORMS[s.platform]]}
${fontImport}<style>${fontFaceCSS}
.tx-wrap{position:relative;width:100%;background:${bg};padding:${s.verticalPadding ?? 20}px 0;overflow:hidden;}${fadeCSS}
.tx-track{display:flex;align-items:center;width:max-content;animation:${anim} ${dur}s linear infinite;}
.tx-track span{font-size:${s.fontSize}px;letter-spacing:${s.letterSpacing}px;}
@keyframes ${anim}{0%{transform:translateX(${tFrom});}100%{transform:translateX(${tTo});}}

@media(max-width:768px){
  .tx-wrap{padding:${tabPad}px 0;}
  .tx-track{animation-duration:${tabDur}s;}
  .tx-track span{font-size:${tabSize}px;letter-spacing:${tabLS}px;}
}
@media(max-width:480px){
  .tx-wrap{padding:${mobPad}px 0;}
  .tx-track{animation-duration:${mobDur}s;}
  .tx-track span{font-size:${mobSize}px;letter-spacing:${mobLS}px;}
}
</style>

<div class="tx-wrap">${fadeHTML}
  <div class="tx-track">
${items}
  </div>
</div>`;
}
