// tools/Testimonials/generator.js
import { googleFontsImport } from "../../shared/FontManager";

function navIcon(cfg, dir) {
  if (cfg.navBtnIcon === "arrow") return dir === "prev" ? "←" : "→";
  if (cfg.navBtnIcon === "chevron") return dir === "prev" ? "‹" : "›";
  if (cfg.navBtnIcon === "triangle") return dir === "prev" ? "◄" : "►";
  return dir === "prev" ? cfg.navBtnCustomPrev : cfg.navBtnCustomNext;
}

export function genTestiCode(items, count, dCfg, tCfg, mCfg, platform) {
  const vis = items.slice(0, count);
  const fonts = [
    dCfg.quoteFont,
    dCfg.nameFont,
    dCfg.roleFont,
    tCfg.quoteFont,
    mCfg.quoteFont,
  ];
  const fontImport = googleFontsImport(fonts);

  const baseCSS = `${fontImport}/* ── Testimonials (${dCfg.layout}) — ${platform} ── */
.ub-testi-wrap { max-width:${dCfg.maxWidth}px; margin:0 auto; background:${dCfg.sectionBg}; padding:16px; border-radius:12px; }
.ub-testi-card { background:${dCfg.cardBg}; border:${dCfg.cardBorderWidth}px solid ${dCfg.cardBorderColor}; border-radius:${dCfg.cardRadius}px; padding:${dCfg.cardPadding}px; box-shadow:${dCfg.shadow}; display:flex; flex-direction:column; gap:12px; box-sizing:border-box; }
.ub-testi-quote { font-family:'${dCfg.quoteFont}',sans-serif; font-size:${dCfg.quoteSize}px; font-weight:${dCfg.quoteWeight}; color:${dCfg.quoteColor}; text-align:${dCfg.quoteAlign}; line-height:1.65; margin:0; }
.ub-testi-name  { font-family:'${dCfg.nameFont}',sans-serif; font-size:${dCfg.nameSize}px; font-weight:${dCfg.nameWeight}; color:${dCfg.nameColor}; }
.ub-testi-role  { font-family:'${dCfg.roleFont}',sans-serif; font-size:${dCfg.roleSize}px; color:${dCfg.roleColor}; }
.ub-testi-avatar { width:${dCfg.avatarSize}px; height:${dCfg.avatarSize}px; border-radius:${dCfg.avatarRadius}%; display:flex; align-items:center; justify-content:center; font-weight:700; color:#fff; font-size:${Math.round(dCfg.avatarSize * 0.36)}px; flex-shrink:0; }
.ub-testi-stars { display:flex; gap:2px; }
.ub-testi-nav-btn { width:${dCfg.navBtnSize}px; height:${dCfg.navBtnSize}px; border-radius:${dCfg.navBtnRadius}%; background:${dCfg.navBtnBg}; border:1px solid ${dCfg.cardBorderColor}; color:${dCfg.navBtnColor}; font-size:${Math.round(dCfg.navBtnSize * 0.45)}px; cursor:pointer; display:${dCfg.navStyle === "hidden" ? "none" : "flex"}; align-items:center; justify-content:center; font-weight:600; line-height:1; }
.ub-testi-dots { display:flex; gap:6px; justify-content:center; margin-top:14px; flex-wrap:wrap; }
.ub-testi-dot { height:${dCfg.dotSize}px; width:${dCfg.dotSize}px; border-radius:${dCfg.dotSize}px; background:#d1d5db; cursor:pointer; transition:all .2s; }
.ub-testi-dot.active { background:${dCfg.dotColor}; width:${dCfg.dotSize * 2.2}px; }`;

  // Always @media for Custom HTML
  const responsiveCSS = `
@media(max-width:768px){
  .ub-testi-wrap { max-width:${tCfg.maxWidth}px; background:${tCfg.sectionBg}; }
  .ub-testi-card { padding:${tCfg.cardPadding}px; border-radius:${tCfg.cardRadius}px; background:${tCfg.cardBg}; }
  .ub-testi-quote { font-size:${tCfg.quoteSize}px; color:${tCfg.quoteColor}; }
  .ub-testi-nav-btn { display:${tCfg.navStyle === "hidden" ? "none" : "flex"}; }
}
@media(max-width:480px){
  .ub-testi-wrap { max-width:${mCfg.maxWidth}px; background:${mCfg.sectionBg}; }
  .ub-testi-card { padding:${mCfg.cardPadding}px; background:${mCfg.cardBg}; }
  .ub-testi-quote { font-size:${mCfg.quoteSize}px; color:${mCfg.quoteColor}; }
  .ub-testi-nav-btn { display:${mCfg.navStyle === "hidden" ? "none" : "flex"}; }
}`;

  const css = baseCSS + responsiveCSS;
  const html = `<div class="ub-testi-wrap" id="ubTesti"></div>`;

  const pIcon = navIcon(dCfg, "prev");
  const nIcon = navIcon(dCfg, "next");

  const jsBody = `
  var testimonials = [
${vis.map((t) => `    { name:${JSON.stringify(t.name)}, role:${JSON.stringify(t.role)}, company:${JSON.stringify(t.company)}, quote:${JSON.stringify(t.quote)}, stars:${t.stars}, initials:${JSON.stringify(t.initials)}, avatarBg:${JSON.stringify(t.avatarBg)} }`).join(",\n")}
  ];
  var wrap = document.getElementById('ubTesti');
  if (!wrap) return;
  var current = 0;
  function buildCard(t) {
    var stars = '';
    for (var s = 1; s <= 5; s++) {
      stars += '<span style="color:' + (s <= t.stars ? '${dCfg.starColor}' : '#d1d5db') + ';font-size:${dCfg.starSize}px">★</span>';
    }
    return '<div class="ub-testi-card">'
      + (${dCfg.showQuoteMark} ? '<div style="font-size:${dCfg.quoteMarkSize}px;color:${dCfg.quoteMarkColor};font-family:Georgia,serif;line-height:.8">&#8220;</div>' : '')
      + '<p class="ub-testi-quote">' + t.quote + '</p>'
      + (${dCfg.showStars} ? '<div class="ub-testi-stars">' + stars + '</div>' : '')
      + '<div style="display:flex;align-items:center;gap:10px">'
      + (${dCfg.showAvatar} ? '<div class="ub-testi-avatar" style="background:' + t.avatarBg + '">' + t.initials + '</div>' : '')
      + '<div><div class="ub-testi-name">' + t.name + '</div>'
      + '<div class="ub-testi-role">' + t.role + (${dCfg.showCompany} ? ' &middot; ' + t.company : '') + '</div></div>'
      + '</div></div>';
  }
  var track = document.createElement('div');
  track.style.cssText = 'display:flex;transition:transform .35s ease;';
  testimonials.forEach(function(t) {
    var slide = document.createElement('div');
    slide.style.cssText = 'min-width:100%;padding:0 4px;box-sizing:border-box;';
    slide.innerHTML = buildCard(t);
    track.appendChild(slide);
  });
  var inner = document.createElement('div');
  inner.style.cssText = 'overflow:hidden;flex:1;';
  inner.appendChild(track);
  var row = document.createElement('div');
  row.style.cssText = 'display:flex;align-items:center;gap:12px;';
  var prevBtn = document.createElement('button');
  prevBtn.className = 'ub-testi-nav-btn ub-testi-nav-prev';
  prevBtn.textContent = '${pIcon}';
  var nextBtn = document.createElement('button');
  nextBtn.className = 'ub-testi-nav-btn ub-testi-nav-next';
  nextBtn.textContent = '${nIcon}';
  ${dCfg.navStyle === "sides" ? "row.appendChild(prevBtn); row.appendChild(inner); row.appendChild(nextBtn);" : "row.appendChild(inner);"}
  wrap.appendChild(row);
  ${
    dCfg.showDots
      ? `
  var dotsRow = document.createElement('div');
  dotsRow.className = 'ub-testi-dots';
  testimonials.forEach(function(_, i) {
    var d = document.createElement('div');
    d.className = 'ub-testi-dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', function() { goTo(i); });
    dotsRow.appendChild(d);
  });
  wrap.appendChild(dotsRow);`
      : ""
  }
  function goTo(i) {
    current = i;
    track.style.transform = 'translateX(-' + i * 100 + '%)';
    ${
      dCfg.showDots
        ? `
    document.querySelectorAll('.ub-testi-dot').forEach(function(d, j) {
      d.classList.toggle('active', j === i);
      d.style.width = j === i ? '${dCfg.dotSize * 2.2}px' : '${dCfg.dotSize}px';
    });`
        : ""
    }
  }
  prevBtn.addEventListener('click', function() { goTo((current - 1 + testimonials.length) % testimonials.length); });
  nextBtn.addEventListener('click', function() { goTo((current + 1) % testimonials.length); });
  ${dCfg.autoPlay ? `setInterval(function() { goTo((current + 1) % testimonials.length); }, ${dCfg.autoPlaySpeed});` : ""}`;

  const js = `window.addEventListener('load', function() {\n${jsBody}\n});`;

  const custom = `<!-- Unbounce: paste into Custom HTML widget -->
<style>
${css}
</style>

${html}

<script>
document.addEventListener('DOMContentLoaded', function() {
${jsBody}
});
</script>`;

  return { css, html, js, custom };
}
