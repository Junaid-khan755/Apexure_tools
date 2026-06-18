// // tools/Testimonials/generator.js
// import { googleFontsImport } from "../../shared/FontManager";

// function navIcon(cfg, dir) {
//   if (cfg.navBtnIcon === "arrow") return dir === "prev" ? "←" : "→";
//   if (cfg.navBtnIcon === "chevron") return dir === "prev" ? "‹" : "›";
//   if (cfg.navBtnIcon === "triangle") return dir === "prev" ? "◄" : "►";
//   return dir === "prev" ? cfg.navBtnCustomPrev : cfg.navBtnCustomNext;
// }

// export function genTestiCode(items, count, dCfg, tCfg, mCfg, platform) {
//   const vis = items.slice(0, count);
//   const fonts = [
//     dCfg.quoteFont,
//     dCfg.nameFont,
//     dCfg.roleFont,
//     tCfg.quoteFont,
//     mCfg.quoteFont,
//   ];
//   const fontImport = googleFontsImport(fonts);

//   const baseCSS = `${fontImport}/* ── Testimonials (${dCfg.layout}) — ${platform} ── */
// .ub-testi-wrap { max-width:${dCfg.maxWidth}px; margin:0 auto; background:${dCfg.sectionBg}; padding:16px; border-radius:12px; }
// .ub-testi-card { background:${dCfg.cardBg}; border:${dCfg.cardBorderWidth}px solid ${dCfg.cardBorderColor}; border-radius:${dCfg.cardRadius}px; padding:${dCfg.cardPadding}px; box-shadow:${dCfg.shadow}; display:flex; flex-direction:column; gap:12px; box-sizing:border-box; }
// .ub-testi-quote { font-family:'${dCfg.quoteFont}',sans-serif; font-size:${dCfg.quoteSize}px; font-weight:${dCfg.quoteWeight}; color:${dCfg.quoteColor}; text-align:${dCfg.quoteAlign}; line-height:1.65; margin:0; }
// .ub-testi-name  { font-family:'${dCfg.nameFont}',sans-serif; font-size:${dCfg.nameSize}px; font-weight:${dCfg.nameWeight}; color:${dCfg.nameColor}; }
// .ub-testi-role  { font-family:'${dCfg.roleFont}',sans-serif; font-size:${dCfg.roleSize}px; color:${dCfg.roleColor}; }
// .ub-testi-avatar { width:${dCfg.avatarSize}px; height:${dCfg.avatarSize}px; border-radius:${dCfg.avatarRadius}%; display:flex; align-items:center; justify-content:center; font-weight:700; color:#fff; font-size:${Math.round(dCfg.avatarSize * 0.36)}px; flex-shrink:0; }
// .ub-testi-stars { display:flex; gap:2px; }
// .ub-testi-nav-btn { width:${dCfg.navBtnSize}px; height:${dCfg.navBtnSize}px; border-radius:${dCfg.navBtnRadius}%; background:${dCfg.navBtnBg}; border:1px solid ${dCfg.cardBorderColor}; color:${dCfg.navBtnColor}; font-size:${Math.round(dCfg.navBtnSize * 0.45)}px; cursor:pointer; display:${dCfg.navStyle === "hidden" ? "none" : "flex"}; align-items:center; justify-content:center; font-weight:600; line-height:1; }
// .ub-testi-dots { display:flex; gap:6px; justify-content:center; margin-top:14px; flex-wrap:wrap; }
// .ub-testi-dot { height:${dCfg.dotSize}px; width:${dCfg.dotSize}px; border-radius:${dCfg.dotSize}px; background:#d1d5db; cursor:pointer; transition:all .2s; }
// .ub-testi-dot.active { background:${dCfg.dotColor}; width:${dCfg.dotSize * 2.2}px; }
// .ub-testi-sides-row { display:${dCfg.navStyle === "sides" ? "flex" : "none"}; }
// .ub-testi-bottom-row { display:${dCfg.navStyle === "bottom" ? "block" : "none"}; }`;

//   // Always @media for Custom HTML
//   const responsiveCSS = `
// @media(max-width:768px){
//   .ub-testi-wrap { max-width:${tCfg.maxWidth}px; background:${tCfg.sectionBg}; }
//   .ub-testi-card { padding:${tCfg.cardPadding}px; border-radius:${tCfg.cardRadius}px; background:${tCfg.cardBg}; }
//   .ub-testi-quote { font-size:${tCfg.quoteSize}px; color:${tCfg.quoteColor}; }
//   .ub-testi-nav-btn { display:${tCfg.navStyle === "hidden" ? "none" : "flex"}; }
//   .ub-testi-sides-row { display:${tCfg.navStyle === "sides" ? "flex" : "none"}; }
//   .ub-testi-bottom-row { display:${tCfg.navStyle === "bottom" ? "block" : "none"}; }
// }
// @media(max-width:480px){
//   .ub-testi-wrap { max-width:${mCfg.maxWidth}px; background:${mCfg.sectionBg}; }
//   .ub-testi-card { padding:${mCfg.cardPadding}px; background:${mCfg.cardBg}; }
//   .ub-testi-quote { font-size:${mCfg.quoteSize}px; color:${mCfg.quoteColor}; }
//   .ub-testi-nav-btn { display:${mCfg.navStyle === "hidden" ? "none" : "flex"}; }
//   .ub-testi-sides-row { display:${mCfg.navStyle === "sides" ? "flex" : "none"}; }
//   .ub-testi-bottom-row { display:${mCfg.navStyle === "bottom" ? "block" : "none"}; }
// }`;

//   const css = baseCSS + responsiveCSS;
//   const html = `<div class="ub-testi-wrap" id="ubTesti"></div>`;

//   const pIcon = navIcon(dCfg, "prev");
//   const nIcon = navIcon(dCfg, "next");

//   const jsBody = `
//   var testimonials = [
// ${vis.map((t) => `    { name:${JSON.stringify(t.name)}, role:${JSON.stringify(t.role)}, company:${JSON.stringify(t.company)}, quote:${JSON.stringify(t.quote)}, stars:${t.stars}, initials:${JSON.stringify(t.initials)}, avatarBg:${JSON.stringify(t.avatarBg)}, avatarUrl:${JSON.stringify(t.avatarUrl || null)} }`).join(",\n")}
//   ];
//   var wrap = document.getElementById('ubTesti');
//   if (!wrap) return;
//   var current = 0;
//   function buildCard(t) {
//     var stars = '';
//     for (var s = 1; s <= 5; s++) {
//       stars += '<span style="color:' + (s <= t.stars ? '${dCfg.starColor}' : '#d1d5db') + ';font-size:${dCfg.starSize}px">★</span>';
//     }
//     return '<div class="ub-testi-card">'
//       + (${dCfg.showQuoteMark} ? '<div style="font-size:${dCfg.quoteMarkSize}px;color:${dCfg.quoteMarkColor};font-family:Georgia,serif;line-height:.8">&#8220;</div>' : '')
//       + '<p class="ub-testi-quote">' + t.quote + '</p>'
//       + (${dCfg.showStars} ? '<div class="ub-testi-stars">' + stars + '</div>' : '')
//       + '<div style="display:flex;align-items:center;gap:10px">'
//       + (${dCfg.showAvatar} ? (t.avatarUrl ? '<img src="' + t.avatarUrl + '" style="width:${dCfg.avatarSize}px;height:${dCfg.avatarSize}px;border-radius:${dCfg.avatarRadius}%;object-fit:cover;flex-shrink:0;" />' : '<div class="ub-testi-avatar" style="background:' + t.avatarBg + '">' + t.initials + '</div>') : '')
//       + '<div><div class="ub-testi-name">' + t.name + '</div>'
//       + '<div class="ub-testi-role">' + t.role + (${dCfg.showCompany} ? ' &middot; ' + t.company : '') + '</div></div>'
//       + '</div></div>';
//   }
//   var track = document.createElement('div');
//   track.style.cssText = 'display:flex;transition:transform .35s ease;';
//   testimonials.forEach(function(t) {
//     var slide = document.createElement('div');
//     slide.style.cssText = 'min-width:100%;padding:0 4px;box-sizing:border-box;';
//     slide.innerHTML = buildCard(t);
//     track.appendChild(slide);
//   });
//   var inner = document.createElement('div');
//   inner.style.cssText = 'overflow:hidden;flex:1;';
//   inner.appendChild(track);
//  var prevBtn = document.createElement('button');
//   prevBtn.className = 'ub-testi-nav-btn ub-testi-nav-prev';
//   prevBtn.textContent = '${pIcon}';
//   var nextBtn = document.createElement('button');
//   nextBtn.className = 'ub-testi-nav-btn ub-testi-nav-next';
//   nextBtn.textContent = '${nIcon}';

//   // Sides row — prev | track | next
//   var sidesRow = document.createElement('div');
//   sidesRow.className = 'ub-testi-sides-row';
//   sidesRow.style.cssText = 'display:flex;align-items:center;gap:12px;';
//   sidesRow.appendChild(prevBtn.cloneNode(true));
//   sidesRow.appendChild(inner);
//   sidesRow.appendChild(nextBtn.cloneNode(true));

//   // Bottom row — track above, buttons below centered
//   var bottomTrackRow = document.createElement('div');
//   bottomTrackRow.className = 'ub-testi-bottom-track';
//   bottomTrackRow.style.cssText = 'overflow:hidden;';
//   bottomTrackRow.appendChild(track);

//   var bottomBtnRow = document.createElement('div');
//   bottomBtnRow.className = 'ub-testi-bottom-btns';
//   bottomBtnRow.style.cssText = 'display:flex;justify-content:center;gap:10px;margin-top:14px;';
//   bottomBtnRow.appendChild(prevBtn);
//   bottomBtnRow.appendChild(nextBtn);

//   var bottomRow = document.createElement('div');
//   bottomRow.className = 'ub-testi-bottom-row';
//   bottomRow.appendChild(bottomTrackRow);
//   bottomRow.appendChild(bottomBtnRow);

//   wrap.appendChild(sidesRow);
//   wrap.appendChild(bottomRow);
//   ${
//     dCfg.showDots
//       ? `
//   var dotsRow = document.createElement('div');
//   dotsRow.className = 'ub-testi-dots';
//   testimonials.forEach(function(_, i) {
//     var d = document.createElement('div');
//     d.className = 'ub-testi-dot' + (i === 0 ? ' active' : '');
//     d.addEventListener('click', function() { goTo(i); });
//     dotsRow.appendChild(d);
//   });
//   wrap.appendChild(dotsRow);`
//       : ""
//   }
//   function goTo(i) {
//     current = i;
//     track.style.transform = 'translateX(-' + i * 100 + '%)';
//     prevBtn.disabled = i === 0;
//     nextBtn.disabled = i === testimonials.length - 1;
//     prevBtn.style.opacity = i === 0 ? '0.3' : '1';
//     nextBtn.style.opacity = i === testimonials.length - 1 ? '0.3' : '1';
//     prevBtn.style.cursor = i === 0 ? 'not-allowed' : 'pointer';
//     nextBtn.style.cursor = i === testimonials.length - 1 ? 'not-allowed' : 'pointer';
//     ${
//       dCfg.showDots
//         ? `
//     document.querySelectorAll('.ub-testi-dot').forEach(function(d, j) {
//       d.classList.toggle('active', j === i);
//       d.style.width = j === i ? '${dCfg.dotSize * 2.2}px' : '${dCfg.dotSize}px';
//     });`
//         : ""
//     }
//   }
//     goTo(0);
//     prevBtn = sidesRow.querySelector('.ub-testi-nav-prev');
//   nextBtn = bottomBtnRow.querySelector('.ub-testi-nav-next');
//   prevBtn.addEventListener('click', function() { goTo((current - 1 + testimonials.length) % testimonials.length); });
//   nextBtn.addEventListener('click', function() { goTo((current + 1) % testimonials.length); });

//   // Touch swipe
//   var touchStartX = 0;
//   inner.addEventListener('touchstart', function(e) { touchStartX = e.touches[0].clientX; }, { passive: true });
//   inner.addEventListener('touchend', function(e) {
//     var diff = touchStartX - e.changedTouches[0].clientX;
//     if (diff > 50 && current < testimonials.length - 1) goTo(current + 1);
//     else if (diff < -50 && current > 0) goTo(current - 1);
//   });

//   // Mouse drag
//   var mouseStartX = 0, isDragging = false;
//   inner.addEventListener('mousedown', function(e) { mouseStartX = e.clientX; isDragging = true; });
//   inner.addEventListener('mouseup', function(e) {
//     if (!isDragging) return;
//     isDragging = false;
//     var diff = mouseStartX - e.clientX;
//     if (diff > 50 && current < testimonials.length - 1) goTo(current + 1);
//     else if (diff < -50 && current > 0) goTo(current - 1);
//   });
//   inner.addEventListener('mouseleave', function() { isDragging = false; });
//   ${dCfg.autoPlay ? `setInterval(function() { goTo((current + 1) % testimonials.length); }, ${dCfg.autoPlaySpeed});` : ""}`;

//   const js = `window.addEventListener('load', function() {\n${jsBody}\n});`;

//   const custom = `<!-- Unbounce: paste into Custom HTML widget -->
// <style>
// ${css}
// </style>

// ${html}

// <script>
// document.addEventListener('DOMContentLoaded', function() {
// ${jsBody}
// });
// </script>`;

//   return { css, html, js, custom };
// }

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
.ub-testi-card { background:${dCfg.cardBg}; border:${dCfg.cardBorderWidth}px solid ${dCfg.cardBorderColor}; border-radius:${dCfg.cardRadius}px; padding:${dCfg.cardPadding}px; box-shadow:${dCfg.showShadow ? `${dCfg.shadowX}px ${dCfg.shadowY}px ${dCfg.shadowBlur}px ${dCfg.shadowSpread}px ${dCfg.shadowColor}` : "none"}; display:flex; flex-direction:column; gap:12px; box-sizing:border-box; }
.ub-testi-quote { font-family:'${dCfg.quoteFont}',sans-serif; font-size:${dCfg.quoteSize}px; font-weight:${dCfg.quoteWeight}; color:${dCfg.quoteColor}; text-align:${dCfg.quoteAlign}; line-height:1.65; margin:0; }
.ub-testi-name  { font-family:'${dCfg.nameFont}',sans-serif; font-size:${dCfg.nameSize}px; font-weight:${dCfg.nameWeight}; color:${dCfg.nameColor}; }
.ub-testi-role  { font-family:'${dCfg.roleFont}',sans-serif; font-size:${dCfg.roleSize}px; color:${dCfg.roleColor}; }
.ub-testi-avatar { width:${dCfg.avatarSize}px; height:${dCfg.avatarSize}px; border-radius:${dCfg.avatarRadius}%; display:flex; align-items:center; justify-content:center; font-weight:700; color:#fff; font-size:${Math.round(dCfg.avatarSize * 0.36)}px; flex-shrink:0; }
.ub-testi-stars { display:flex; gap:2px; }
.ub-testi-nav-btn { width:${dCfg.navBtnSize}px; height:${dCfg.navBtnSize}px; border-radius:${dCfg.navBtnRadius}%; background:${dCfg.navBtnBg}; border:1px solid ${dCfg.cardBorderColor}; color:${dCfg.navBtnColor}; font-size:${Math.round(dCfg.navBtnSize * 0.45)}px; cursor:pointer; display:flex; align-items:center; justify-content:center; font-weight:600; line-height:1; flex-shrink:0; }
.ub-testi-dots { display:flex; gap:6px; justify-content:center; margin-top:14px; flex-wrap:wrap; }
.ub-testi-dot { height:${dCfg.dotSize}px; width:${dCfg.dotSize}px; border-radius:${dCfg.dotSize}px; background:#d1d5db; cursor:pointer; transition:all .2s; }
.ub-testi-dot.active { background:${dCfg.dotColor}; width:${dCfg.dotSize * 2.2}px; }
/* Nav layout — desktop */
.ub-testi-sides-row { display:${dCfg.navStyle === "hidden" ? "none" : dCfg.navStyle === "sides" ? "flex" : "none"}; align-items:center; gap:12px; }
.ub-testi-bottom-row { display:${dCfg.navStyle === "bottom" ? "block" : dCfg.navStyle === "hidden" ? "block" : "none"}; }
.ub-testi-bottom-btns { display:${dCfg.navStyle === "hidden" ? "none" : "flex"}; justify-content:center; gap:10px; margin-top:14px; }
.ub-testi-inner { overflow:hidden; flex:1; }`;

  const responsiveCSS = `
@media(max-width:768px){
  .ub-testi-wrap { max-width:${tCfg.maxWidth}px; background:${tCfg.sectionBg}; }
  .ub-testi-card { padding:${tCfg.cardPadding}px; border-radius:${tCfg.cardRadius}px; background:${tCfg.cardBg}; }
  .ub-testi-quote { font-size:${tCfg.quoteSize}px; color:${tCfg.quoteColor}; }
  .ub-testi-sides-row { display:${tCfg.navStyle === "sides" ? "flex" : "none"}; }
  .ub-testi-bottom-row { display:${tCfg.navStyle === "bottom" || tCfg.navStyle === "hidden" ? "block" : "none"}; }
  .ub-testi-bottom-btns { display:${tCfg.navStyle === "hidden" ? "none" : "flex"}; }
  .ub-testi-nav-btn { display:${tCfg.navStyle === "hidden" ? "none" : "flex"}; }
}
@media(max-width:480px){
  .ub-testi-wrap { max-width:${mCfg.maxWidth}px; background:${mCfg.sectionBg}; }
  .ub-testi-card { padding:${mCfg.cardPadding}px; background:${mCfg.cardBg}; }
  .ub-testi-quote { font-size:${mCfg.quoteSize}px; color:${mCfg.quoteColor}; }
  .ub-testi-sides-row { display:${mCfg.navStyle === "sides" ? "flex" : "none"}; }
  .ub-testi-bottom-row { display:${mCfg.navStyle === "bottom" || mCfg.navStyle === "hidden" ? "block" : "none"}; }
  .ub-testi-bottom-btns { display:${mCfg.navStyle === "hidden" ? "none" : "flex"}; }
  .ub-testi-nav-btn { display:${mCfg.navStyle === "hidden" ? "none" : "flex"}; }
}`;

  const css = baseCSS + responsiveCSS;
  const html = `<div class="ub-testi-wrap" id="ubTesti"></div>`;

  const pIcon = navIcon(dCfg, "prev");
  const nIcon = navIcon(dCfg, "next");

  const jsBody = `
  var testimonials = [
${vis.map((t) => `    { name:${JSON.stringify(t.name)}, role:${JSON.stringify(t.role)}, company:${JSON.stringify(t.company)}, quote:${JSON.stringify(t.quote)}, stars:${t.stars}, initials:${JSON.stringify(t.initials)}, avatarBg:${JSON.stringify(t.avatarBg)}, avatarUrl:${JSON.stringify(t.avatarUrl || null)} }`).join(",\n")}
  ];
  var wrap = document.getElementById('ubTesti');
  if (!wrap) return;
  var current = 0;

  function buildCard(t) {
    var stars = '';
    for (var s = 1; s <= 5; s++) {
      stars += '<span style="color:' + (s <= t.stars ? '${dCfg.starColor}' : '#d1d5db') + ';font-size:${dCfg.starSize}px">★</span>';
    }
    var avatarHtml = '';
    if (${dCfg.showAvatar}) {
      if (t.avatarUrl) {
        avatarHtml = '<img src="' + t.avatarUrl + '" style="width:${dCfg.avatarSize}px;height:${dCfg.avatarSize}px;border-radius:${dCfg.avatarRadius}%;object-fit:cover;flex-shrink:0;" />';
      } else {
        avatarHtml = '<div class="ub-testi-avatar" style="background:' + t.avatarBg + '">' + t.initials + '</div>';
      }
    }
    return '<div class="ub-testi-card">'
      + (${dCfg.showQuoteMark} ? '<div style="font-size:${dCfg.quoteMarkSize}px;color:${dCfg.quoteMarkColor};font-family:Georgia,serif;line-height:.8">&#8220;</div>' : '')
      + '<p class="ub-testi-quote">' + t.quote + '</p>'
      + (${dCfg.showStars} ? '<div class="ub-testi-stars">' + stars + '</div>' : '')
      + '<div style="display:flex;align-items:center;gap:10px">'
      + avatarHtml
      + '<div><div class="ub-testi-name">' + t.name + '</div>'
      + '<div class="ub-testi-role">' + t.role + (${dCfg.showCompany} ? ' &middot; ' + t.company : '') + '</div></div>'
      + '</div></div>';
  }

  /* ── Build track ── */
  var track = document.createElement('div');
  track.style.cssText = 'display:flex;transition:transform .35s ease;will-change:transform;';
  testimonials.forEach(function(t) {
    var slide = document.createElement('div');
    slide.style.cssText = 'min-width:100%;padding:0 4px;box-sizing:border-box;';
    slide.innerHTML = buildCard(t);
    track.appendChild(slide);
  });

  /* ── Sides layout: [prevBtn] [track] [nextBtn] ── */
  var sidesRow = document.createElement('div');
  sidesRow.className = 'ub-testi-sides-row';
  var prevBtnSides = document.createElement('button');
  prevBtnSides.className = 'ub-testi-nav-btn';
  prevBtnSides.textContent = '${pIcon}';
  var nextBtnSides = document.createElement('button');
  nextBtnSides.className = 'ub-testi-nav-btn';
  nextBtnSides.textContent = '${nIcon}';
  var innerSides = document.createElement('div');
  innerSides.className = 'ub-testi-inner';
  innerSides.appendChild(track);
  sidesRow.appendChild(prevBtnSides);
  sidesRow.appendChild(innerSides);
  sidesRow.appendChild(nextBtnSides);
  wrap.appendChild(sidesRow);

  /* ── Bottom layout: [track] then [prevBtn] [nextBtn] below ── */
  var bottomRow = document.createElement('div');
  bottomRow.className = 'ub-testi-bottom-row';
  var innerBottom = document.createElement('div');
  innerBottom.className = 'ub-testi-inner';
  innerBottom.style.overflow = 'hidden';
  /* track lives in sidesRow.inner — clone for bottom so both layouts share same data but only one is visible at a time */
  /* We use one single track and move it based on active layout via CSS display */
  /* bottomRow just needs the inner container — track is already in sidesRow */
  /* Instead: duplicate slides (lightweight HTML, not the track element) */
  var trackBottom = document.createElement('div');
  trackBottom.style.cssText = 'display:flex;transition:transform .35s ease;will-change:transform;';
  testimonials.forEach(function(t) {
    var slide = document.createElement('div');
    slide.style.cssText = 'min-width:100%;padding:0 4px;box-sizing:border-box;';
    slide.innerHTML = buildCard(t);
    trackBottom.appendChild(slide);
  });
  innerBottom.appendChild(trackBottom);
  var prevBtnBottom = document.createElement('button');
  prevBtnBottom.className = 'ub-testi-nav-btn';
  prevBtnBottom.textContent = '${pIcon}';
  var nextBtnBottom = document.createElement('button');
  nextBtnBottom.className = 'ub-testi-nav-btn';
  nextBtnBottom.textContent = '${nIcon}';
  var bottomBtns = document.createElement('div');
  bottomBtns.className = 'ub-testi-bottom-btns';
  bottomBtns.appendChild(prevBtnBottom);
  bottomBtns.appendChild(nextBtnBottom);
  bottomRow.appendChild(innerBottom);
  bottomRow.appendChild(bottomBtns);
  wrap.appendChild(bottomRow);

  /* ── Dots ── */
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

  /* ── goTo — syncs both tracks and both button pairs ── */
  function updateBtn(btn, disabled) {
    btn.disabled = disabled;
    btn.style.opacity = disabled ? '0.3' : '1';
    btn.style.cursor = disabled ? 'not-allowed' : 'pointer';
  }
  function goTo(i) {
    current = i;
    track.style.transform = 'translateX(-' + i * 100 + '%)';
    trackBottom.style.transform = 'translateX(-' + i * 100 + '%)';
    updateBtn(prevBtnSides, i === 0);
    updateBtn(nextBtnSides, i === testimonials.length - 1);
    updateBtn(prevBtnBottom, i === 0);
    updateBtn(nextBtnBottom, i === testimonials.length - 1);
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
  goTo(0);

  /* ── Button click handlers ── */
  prevBtnSides.addEventListener('click', function() { if (current > 0) goTo(current - 1); });
  nextBtnSides.addEventListener('click', function() { if (current < testimonials.length - 1) goTo(current + 1); });
  prevBtnBottom.addEventListener('click', function() { if (current > 0) goTo(current - 1); });
  nextBtnBottom.addEventListener('click', function() { if (current < testimonials.length - 1) goTo(current + 1); });

  /* ── Touch swipe (works on both layouts' inner containers) ── */
  var touchStartX = 0;
  function onTouchStart(e) { touchStartX = e.touches[0].clientX; }
  function onTouchEnd(e) {
    var diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 50 && current < testimonials.length - 1) goTo(current + 1);
    else if (diff < -50 && current > 0) goTo(current - 1);
  }
  innerSides.addEventListener('touchstart', onTouchStart, { passive: true });
  innerSides.addEventListener('touchend', onTouchEnd);
  innerBottom.addEventListener('touchstart', onTouchStart, { passive: true });
  innerBottom.addEventListener('touchend', onTouchEnd);

  /* ── Mouse drag ── */
  var mouseStartX = 0, isDragging = false;
  function onMouseDown(e) { mouseStartX = e.clientX; isDragging = true; }
  function onMouseUp(e) {
    if (!isDragging) return;
    isDragging = false;
    var diff = mouseStartX - e.clientX;
    if (diff > 50 && current < testimonials.length - 1) goTo(current + 1);
    else if (diff < -50 && current > 0) goTo(current - 1);
  }
  function onMouseLeave() { isDragging = false; }
  innerSides.addEventListener('mousedown', onMouseDown);
  innerSides.addEventListener('mouseup', onMouseUp);
  innerSides.addEventListener('mouseleave', onMouseLeave);
  innerBottom.addEventListener('mousedown', onMouseDown);
  innerBottom.addEventListener('mouseup', onMouseUp);
  innerBottom.addEventListener('mouseleave', onMouseLeave);

  ${dCfg.autoPlay ? `setInterval(function() { if (current < testimonials.length - 1) goTo(current + 1); else goTo(0); }, ${dCfg.autoPlaySpeed});` : ""}`;

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
