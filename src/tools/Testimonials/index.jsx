// tools/Testimonials/index.jsx
import { useState, useEffect } from "react";
import {
  mkTestDesktop,
  mkTestTablet,
  mkTestMobile,
  DEFAULT_TESTIMONIALS,
} from "./settings";
import { genTestiCode } from "./generator";
import TestiPreview from "./Preview";
import { TestiStylePanel, TestiContentPanel } from "./Panels";
import { Segment, Label } from "../../shared/ui";
import { FontLoader, CustomFontManager } from "../../shared/FontManager";

// ─── Module-level store ───────────────────────────────────────────────────────
let _dCfg = mkTestDesktop(),
  _tCfg = mkTestTablet(),
  _mCfg = mkTestMobile();
let _items = [...DEFAULT_TESTIMONIALS],
  _count = 6,
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
    items: _items,
    count: _count,
    vp: _vp,
    customFonts: _customFonts,
  };
}

function setCfg(vp, cfg) {
  if (vp === "desktop") _dCfg = cfg;
  else if (vp === "tablet") _tCfg = cfg;
  else _mCfg = cfg;
  notify();
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ platform, sideTab, onCodeChange }) {
  const { dCfg, tCfg, mCfg, items, count, vp, customFonts } = useStore();
  const cfg = vp === "desktop" ? dCfg : vp === "tablet" ? tCfg : mCfg;

  useEffect(() => {
    onCodeChange(genTestiCode(_items, _count, _dCfg, _tCfg, _mCfg, platform));
  }, [dCfg, tCfg, mCfg, items, count, platform]);

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
      <TestiContentPanel
        items={items}
        count={count}
        setItems={(v) => {
          _items = v;
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
      <TestiStylePanel
        cfg={cfg}
        onChange={(c) => setCfg(vp, c)}
        customFonts={customFonts}
      />
    </div>
  );
}

// ─── Preview ──────────────────────────────────────────────────────────────────
function Preview() {
  const { dCfg, tCfg, mCfg, items, count, vp } = useStore();
  const cfg = vp === "desktop" ? dCfg : vp === "tablet" ? tCfg : mCfg;
  return (
    <>
      <FontLoader fonts={[cfg.quoteFont, cfg.nameFont, cfg.roleFont]} />
      <TestiPreview items={items} count={count} cfg={cfg} />
    </>
  );
}

export default { Sidebar, Preview };
