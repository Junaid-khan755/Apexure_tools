// tools/FAQ/index.jsx
import { useState, useEffect } from "react";
import {
  mkFaqDesktop,
  mkFaqTablet,
  mkFaqMobile,
  DEFAULT_FAQS,
} from "./settings";
import { genFaqCode } from "./generator";
import FaqPreview from "./Preview";
import { FaqStylePanel, FaqContentPanel } from "./Panels";
import { Segment, Label } from "../../shared/ui";
import { FontLoader, CustomFontManager } from "../../shared/FontManager";

// ─── Module-level store ───────────────────────────────────────────────────────
let _dCfg = mkFaqDesktop(),
  _tCfg = mkFaqTablet(),
  _mCfg = mkFaqMobile();
let _faqs = [...DEFAULT_FAQS],
  _count = 5,
  _vp = "desktop",
  _customFonts = [];
const _L = new Set();
const notify = () => _L.forEach((fn) => fn());

function useStore() {
  const [, r] = useState(0);
  useEffect(() => {
    const fn = () => r((n) => n + 1);
    _L.add(fn);
    return () => _L.delete(fn);
  }, []);
  return {
    dCfg: _dCfg,
    tCfg: _tCfg,
    mCfg: _mCfg,
    faqs: _faqs,
    count: _count,
    vp: _vp,
    customFonts: _customFonts,
  };
}

// function setCfg(vp, cfg) {
//   if (vp === "desktop") _dCfg = cfg;
//   else if (vp === "tablet") _tCfg = cfg;
//   else _mCfg = cfg;
//   notify();
// }

// These properties sync across all breakpoints when changed on desktop
const GLOBAL_PROPS = [
  "bgColor",
  "borderColor",
  "borderWidth",
  "borderRadius",
  "qFont",
  "aFont",
  "qColor",
  "aColor",
  "activeBg",
  "activeQColor",
  "activeBorderColor",
  "iconColor",
  "dividerColor",
];

function setCfg(vp, cfg) {
  if (vp === "desktop") {
    // Find what changed and sync global props to tablet/mobile
    GLOBAL_PROPS.forEach((k) => {
      if (cfg[k] !== _dCfg[k]) {
        _tCfg = { ..._tCfg, [k]: cfg[k] };
        _mCfg = { ..._mCfg, [k]: cfg[k] };
      }
    });
    _dCfg = cfg;
  } else if (vp === "tablet") {
    _tCfg = cfg;
  } else {
    _mCfg = cfg;
  }
  notify();
}

// function curCfg() {
//   return _vp === "desktop" ? _dCfg : _vp === "tablet" ? _tCfg : _mCfg;
// }

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ platform, sideTab, onCodeChange }) {
  const { dCfg, tCfg, mCfg, faqs, count, vp, customFonts } = useStore();
  const cfg = vp === "desktop" ? dCfg : vp === "tablet" ? tCfg : mCfg;

  useEffect(() => {
    onCodeChange(genFaqCode(_faqs, _count, _dCfg, _tCfg, _mCfg, platform));
  }, [dCfg, tCfg, mCfg, faqs, count, platform]);

  if (sideTab === "fonts")
    return (
      <CustomFontManager
        customFonts={customFonts}
        onAdd={(f) => {
          _customFonts = [..._customFonts, f];
          notify();
        }}
        onRemove={(f) => {
          _customFonts = _customFonts.filter((x) => x !== f);
          notify();
        }}
      />
    );

  if (sideTab === "content")
    return (
      <FaqContentPanel
        faqs={faqs}
        count={count}
        setFaqs={(v) => {
          _faqs = v;
          notify();
        }}
        setCount={(v) => {
          _count = typeof v === "function" ? v(_count) : v;
          notify();
        }}
      />
    );

  // Style tab
  return (
    <div>
      <div
        style={{
          padding: "10px 16px 0",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <Label>Editing viewport</Label>
        <Segment
          options={["desktop", "tablet", "mobile"]}
          value={vp}
          onChange={(v) => {
            _vp = v;
            notify();
          }}
        />
        <p
          style={{
            margin: 0,
            fontSize: 10,
            color: "#bbb",
            fontFamily: "'DM Sans',sans-serif",
          }}
        >
          Changes apply to {vp} only
        </p>
      </div>
      <FaqStylePanel
        cfg={cfg}
        onChange={(c) => setCfg(vp, c)}
        customFonts={customFonts}
      />
    </div>
  );
}

// ─── Preview ──────────────────────────────────────────────────────────────────
function Preview() {
  const { dCfg, tCfg, mCfg, faqs, count, vp, customFonts } = useStore();
  const cfg = vp === "desktop" ? dCfg : vp === "tablet" ? tCfg : mCfg;
  return (
    <>
      <FontLoader fonts={[cfg.qFont, cfg.aFont]} />
      <FaqPreview faqs={faqs} count={count} cfg={cfg} />
    </>
  );
}

export default { Sidebar, Preview };
