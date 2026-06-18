// tools/FAQ/generator.js
import { googleFontsImport } from "../../shared/FontManager";

export function genFaqCode(faqs, count, dCfg, tCfg, mCfg, platform) {
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
  const fontImport = googleFontsImport(fonts);

  // Base desktop CSS
  const baseCSS = `${fontImport}/* ── FAQ Accordion — ${platform} ── */
.ub-faq {
  max-width: ${dCfg.maxWidth}px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${dCfg.gap}px;
}
.ub-faq-item {
  background: ${dCfg.bgColor};
  border: ${dCfg.borderWidth}px solid ${dCfg.borderColor};
  border-radius: ${dCfg.borderRadius}px;
  overflow: hidden;
  transition: all .2s;
}
.ub-faq-item.open { background: ${dCfg.activeBg}; border-color: ${dCfg.iconColor}; }
.ub-faq-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: ${dCfg.padding}px;
  background: none;
  border: none;
  cursor: pointer;
  box-sizing: border-box;
}
.ub-faq-q {
  font-family: '${dCfg.qFont}', sans-serif;
  font-size: ${dCfg.qSize}px;
  font-weight: ${dCfg.qWeight};
  color: ${dCfg.qColor};
  text-align: ${dCfg.qAlign};
  flex: 1;
  transition: color .2s;
  margin: 0;
}
.ub-faq-item.open .ub-faq-q { color: ${dCfg.activeQColor}; }
.ub-faq-icon {
  color: ${dCfg.iconColor};
  font-size: ${dCfg.iconSize}px;
  font-weight: 700;
  flex-shrink: 0;
  transition: transform .3s cubic-bezier(.4,0,.2,1);
  line-height: 1;
  display: inline-block;
}
.ub-faq-item.open .ub-faq-icon { transform: rotate(45deg); }
.ub-faq-body { height: 0; overflow: hidden; transition: height .35s cubic-bezier(.4,0,.2,1); }
.ub-faq-a {
  font-family: '${dCfg.aFont}', sans-serif;
  font-size: ${dCfg.aSize}px;
  font-weight: ${dCfg.aWeight};
  color: ${dCfg.aColor};
  text-align: ${dCfg.aAlign};
  margin: 0;
  padding: ${Math.round(dCfg.padding * 0.6)}px ${dCfg.padding}px ${dCfg.padding}px;
  line-height: 1.65;
  border-top: 1px solid ${dCfg.dividerColor};
  box-sizing: border-box;
}`;

  // Responsive overrides — always @media for Custom HTML
  const responsiveCSS = `
@media(max-width:768px){
  .ub-faq { max-width:${tCfg.maxWidth}px; gap:${tCfg.gap}px; }
  .ub-faq-item { background:${tCfg.bgColor}; border:${tCfg.borderWidth}px solid ${tCfg.borderColor}; border-radius:${tCfg.borderRadius}px; }
  .ub-faq-btn { padding:${tCfg.padding}px; }
  .ub-faq-q { font-family:'${tCfg.qFont}',sans-serif; font-size:${tCfg.qSize}px; font-weight:${tCfg.qWeight}; color:${tCfg.qColor}; }
  .ub-faq-a { font-family:'${tCfg.aFont}',sans-serif; font-size:${tCfg.aSize}px; color:${tCfg.aColor}; padding:${Math.round(tCfg.padding * 0.6)}px ${tCfg.padding}px ${tCfg.padding}px; }
}
@media(max-width:480px){
  .ub-faq { max-width:${mCfg.maxWidth}px; gap:${mCfg.gap}px; }
  .ub-faq-btn { padding:${mCfg.padding}px; }
  .ub-faq-q { font-family:'${mCfg.qFont}',sans-serif; font-size:${mCfg.qSize}px; font-weight:${mCfg.qWeight}; color:${mCfg.qColor}; }
  .ub-faq-a { font-family:'${mCfg.aFont}',sans-serif; font-size:${mCfg.aSize}px; color:${mCfg.aColor}; padding:${Math.round(mCfg.padding * 0.6)}px ${mCfg.padding}px ${mCfg.padding}px; }
}`;

  // CSS tab: for Unbounce stylesheet panel uses lp- prefixes
  const cssSheet = isUnbounce
    ? baseCSS +
      responsiveCSS
        .replace(/@media\(max-width:768px\)\{/g, ".lp-tablet ")
        .replace(/@media\(max-width:480px\)\{/g, ".lp-mobile ")
        .replace(/\}/g, "")
    : baseCSS + responsiveCSS;

  // Custom HTML always uses @media
  const cssCustom = baseCSS + responsiveCSS;

  const html = `<div class="ub-faq" id="ubFaq"></div>`;

  const jsBody = `  var faqs = [
${items.map((f) => `    { q: ${JSON.stringify(f.q)}, a: ${JSON.stringify(f.a)} }`).join(",\n")}
  ];
  var wrap = document.getElementById('ubFaq');
  if (!wrap) return;
  faqs.forEach(function(item) {
    var el = document.createElement('div');
    el.className = 'ub-faq-item';
    el.innerHTML =
      '<button class="ub-faq-btn" aria-expanded="false">' +
        '<span class="ub-faq-q">' + item.q + '</span>' +
        '<span class="ub-faq-icon">+</span>' +
      '</button>' +
      '<div class="ub-faq-body"><p class="ub-faq-a">' + item.a + '</p></div>';
    var btn   = el.querySelector('.ub-faq-btn');
    var body  = el.querySelector('.ub-faq-body');
    var inner = el.querySelector('.ub-faq-a');
    btn.addEventListener('click', function() {
      var isOpen = el.classList.contains('open');
      document.querySelectorAll('.ub-faq-item').forEach(function(x) {
        x.classList.remove('open');
        x.querySelector('.ub-faq-btn').setAttribute('aria-expanded','false');
        x.querySelector('.ub-faq-body').style.height = '0';
      });
      if (!isOpen) {
        el.classList.add('open');
        btn.setAttribute('aria-expanded','true');
        body.style.height = inner.scrollHeight + 'px';
      }
    });
    wrap.appendChild(el);
  });`;

  const js = isUnbounce
    ? `window.addEventListener('load', function() {\n${jsBody}\n});`
    : `document.addEventListener('DOMContentLoaded', function() {\n${jsBody}\n});`;

  const custom = `<!-- Unbounce: paste into Custom HTML widget -->
<style>
${cssCustom}
</style>

${html}

<script>
document.addEventListener('DOMContentLoaded', function() {
${jsBody}
});
</script>`;

  return { css: cssSheet, html, js, custom };
}
